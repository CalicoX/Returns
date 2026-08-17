/**
 * ROI 背景 — shaders.com「Point Waves 1」(569774bc) 自研复刻，不走 npm `shaders` 包。
 *
 * 原预设图层（payload 实锤）：
 *   SolidColor(#080808)
 *     ← Surface3D( DotGrid( dotSize ← LinearGradient 亮度 map ) )
 *
 * 复刻管线（与原引擎 compute→fragment 架构一致）：
 *   Pass 1 (MRT, ≤1024 长边):  分形高度场 raymarch → uvMask(32F) + lit + UV 雅可比
 *   Pass 2 (全分辨率):         mirror 边缘 + 渐变亮度驱动 DotGrid + 光照合成 + sRGB
 *   （鼠标涟漪交互已按 Park 要求移除，见下方波场纹理注释）
 *
 * 预设参数（Point Waves 1；guide 给区间的取中值）：
 *   Surface3D: amp .3 · freq 1.5 · octaves 2(fractal+域扭曲) · speed .5
 *              tilt 70° · roll 0 · zoom 1.05 · farCutoff .105 · edges mirror
 *              lighting 30→1.05 · highlights 减半 · light(.4,-.6,.7)
 *   DotGrid:   density 57 · dotSize = 渐变亮度×0.14 · 白点（屏幕空间正圆判定）
 *   底色:      面板同色 #141414（原 #080808）；点透明度 ×0.38 —— Park 调淡两轮
 *
 * 兼容：需要 WebGL2 + EXT_color_buffer_float（整数位运算哈希 + 16F MRT）。
 * 不满足 / 弱 GPU / 减动效 / 窄屏 → 不挂载，保留现有静态背景与 CSS 光晕。
 *
 * @returns {() => void}
 */
export function mount() {
  let teardown = null;

  try {
    const section = document.getElementById("returns-roi");
    if (!section) return () => {};

    if (
      window.__reduceFx ||
      window.__isMobileLayout ||
      (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
    ) {
      return () => {};
    }

    let canvas = section.querySelector(".rt-roi-waves");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "rt-roi-waves";
      canvas.setAttribute("aria-hidden", "true");
      section.insertBefore(canvas, section.firstChild);
    }

    const gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    });

    function bail() {
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      canvas = null;
    }

    if (!gl || gl.isContextLost() || !gl.getExtension("EXT_color_buffer_float")) {
      bail();
      return () => {};
    }

    // 与 hero-wash 同一套弱 GPU 启发：弱 GPU 不跑 raymarch，直接静态背景
    try {
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const raw = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || "")
        : String(gl.getParameter(gl.RENDERER) || "");
      if (
        /swiftshader|llvmpipe|softpipe|microsoft basic render|gdi generic|mali-4|mali-t6|mali-t7|adreno 3[0-9]{2}([^0-9]|$)|adreno 4[0-1][0-9]([^0-9]|$)|powervr sgx/.test(
          raw.toLowerCase()
        )
      ) {
        bail();
        return () => {};
      }
    } catch {
      /* keep going */
    }

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    // ═══ 预设常量（对齐 payload / dist 默认值；标注 Park 调整项） ═══
    const AMP = 0.3;
    const FREQ = 1.5;
    const SEED = 0;
    const OCTAVES = 2;
    const SURF_SPEED = 0.5;
    const TILT = 70; // guide 66–73°
    const ROLL = 0;
    const ZOOM = 1.05; // guide 1.0–1.1
    const CAM_HEIGHT = 0;
    const NEAR_CUTOFF = 0;
    const FAR_CUTOFF = 0.105; // guide 0.09–0.12
    const LIGHTING = 30 * 0.035;
    const GLOSS = 0;
    const HIGHLIGHTS = 15 * 0.02; // 原 ×0.04；Park：太亮 → 高光减半
    const LIGHT_DIR = [0.4, -0.6, 0.7];
    const FOCAL = 1.5;
    const MARCH_STEPS = 16;
    const MARCH_REFINE = 6;
    const MARCH_FAR = 15;
    const HEIGHT_SLAB_PAD = 0.02;

    const DENSITY = 57;
    const DOT_OUT_MAX = 0.14; // 原预设 0.21；Park：圆点太大 → 缩小
    const DOT_FADE = 0.3; // Park 三轮：0.62 → 0.38 → 还是亮 → 0.30
    // Park：近景大点会被波面畸变拉歪（不规则团块）→ 屏幕半径封顶，CSS px
    const DOT_MAX_RADIUS_CSS = 2.6;

    // 波场（涟漪交互已禁用，仅保留 shader 采样路径所需常量）
    const WAVE_GRID = 256;
    const WAVE_HALFEXTENT = 3;
    const CURSOR_INTENSITY = 1;

    // 原 COMPUTE_MAX 桌面 1600（WebGPU compute）。WebGL fragment 跑同样的
    // raymarch 数学更贵：M2 Pro 实测 1600@60fps 只有 ~12fps。降到 1024 +
    // 30fps 节流后稳定 30fps；UV 场平滑、点阵在 Pass 2 全分辨率绘制，观感无损。
    const COMPUTE_MAX = 1024;
    const DPR_CAP = 2;
    const OUT_MAX_SIDE = 2880;
    const FRAME_MS = 1000 / 30 - 2; // 30fps 上限（地形 speed .5 很慢，感知不到）

    // sRGB→linear（对齐 transformColor）
    const s2l = (c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const lin = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      return [
        s2l(((n >> 16) & 255) / 255),
        s2l(((n >> 8) & 255) / 255),
        s2l((n & 255) / 255),
      ];
    };
    const BG = lin("#141414"); // 面板同色，替换原 #080808（淡一点）
    const DOT = lin("#ffffff");

    // ═══ 相机（writeParams verbatim，参数固定 → CPU 预计算一次） ═══
    const DEG = Math.PI / 180;
    const tilt = TILT * DEG;
    const roll = ROLL * DEG;
    const camDist = 0.85 / Math.max(1e-4, ZOOM);
    const camY = -Math.sin(tilt) * camDist;
    const orbitZ = Math.cos(tilt) * camDist;
    const camPos = [0, camY, orbitZ + CAM_HEIGHT];
    const norm3 = (a) => {
      const l = Math.max(1e-6, Math.hypot(a[0], a[1], a[2]));
      return [a[0] / l, a[1] / l, a[2] / l];
    };
    const cross3 = (a, b) => [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
    const fwd = norm3([0, -camY, -orbitZ]);
    const right0 = [1, 0, 0];
    const up0 = norm3(cross3(right0, fwd));
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);
    const camRight = [
      right0[0] * cr + up0[0] * sr,
      right0[1] * cr + up0[1] * sr,
      right0[2] * cr + up0[2] * sr,
    ];
    const camUp = [
      up0[0] * cr - right0[0] * sr,
      up0[1] * cr - right0[1] * sr,
      up0[2] * cr - right0[2] * sr,
    ];

    const octWeights = [];
    for (let i = 0; i < OCTAVES; i++) {
      octWeights.push({
        scale: Math.pow(2, i),
        weight: Math.pow(2, -i),
        driftX: Math.cos(i * 2.39996),
        driftY: Math.sin(i * 2.39996),
      });
    }
    const INV_TOTAL_W = 1 / (2 - Math.pow(0.5, Math.max(OCTAVES, 1) - 1));

    const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

    // MaterialX 整数哈希 Perlin —— mxHashInt1/mxBjfinal/mxGradientFloat2 逐行照抄
    const NOISE_GLSL = `
uint mxRotl32(uint x, uint k){ return (x << k) | (x >> (32u - k)); }
uint mxBjfinal(uint a, uint b, uint c){
  c ^= b; c -= mxRotl32(b, 14u);
  a ^= c; a -= mxRotl32(c, 11u);
  b ^= a; b -= mxRotl32(a, 25u);
  c ^= b; c -= mxRotl32(b, 16u);
  a ^= c; a -= mxRotl32(c, 4u);
  b ^= a; b -= mxRotl32(a, 14u);
  c ^= b; c -= mxRotl32(b, 24u);
  return c;
}
uint mxHashInt1(int x, int y){
  uint seed = 0xdeadbeefu + (2u << 2u) + 13u;
  return mxBjfinal(seed + uint(x), seed + uint(y), seed);
}
float mxFade(float t){ return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float mxGradientFloat2(uint hash, float x, float y){
  uint h = hash & 7u;
  float u = h < 4u ? x : y;
  float v = 2.0 * (h < 4u ? y : x);
  float uu = ((h & 1u) != 0u) ? -u : u;
  float vv = ((h & 2u) != 0u) ? -v : v;
  return uu + vv;
}
float mxBilerp(float v0, float v1, float v2, float v3, float s, float t){
  float s1 = 1.0 - s;
  return (1.0 - t) * (v0 * s1 + v1 * s) + t * (v2 * s1 + v3 * s);
}
float mxPerlin2(vec2 p){
  int X = int(floor(p.x));
  int Y = int(floor(p.y));
  float fx = p.x - float(X);
  float fy = p.y - float(Y);
  float u = mxFade(fx);
  float v = mxFade(fy);
  return 0.6616 * mxBilerp(
    mxGradientFloat2(mxHashInt1(X, Y), fx, fy),
    mxGradientFloat2(mxHashInt1(X + 1, Y), fx - 1.0, fy),
    mxGradientFloat2(mxHashInt1(X, Y + 1), fx, fy - 1.0),
    mxGradientFloat2(mxHashInt1(X + 1, Y + 1), fx - 1.0, fy - 1.0),
    u, v);
}`;

    // 分形高度场（waveType fractal：域扭曲 + octave 循环，JS 端展开常量）
    const octaveLines = octWeights
      .map(
        (o) => `
  acc += mxPerlin2(vec2(
    wu * ${(FREQ * o.scale).toFixed(6)} + uT * ${(o.driftX * 0.3).toFixed(6)} + ${SEED.toFixed(1)},
    wv * ${(FREQ * o.scale).toFixed(6)} + uT * ${(o.driftY * 0.3).toFixed(6)} + ${(SEED * 0.7).toFixed(1)}
  )) * ${o.weight.toFixed(6)};`
      )
      .join("");

    const HEIGHT_GLSL = `
uniform sampler2D uWave;
uniform float uCursorActive;
float heightFn(vec2 uv){
  float u = uv.x;
  float v = uv.y;
  float warpFreq = ${(FREQ * 0.5).toFixed(6)};
  float wx = mxPerlin2(vec2(u * warpFreq + uT * 0.1 + ${SEED.toFixed(1)}, v * warpFreq + ${(SEED * 1.3).toFixed(1)}));
  float wy = mxPerlin2(vec2(u * warpFreq + ${SEED.toFixed(1)} + 17.3, v * warpFreq + uT * 0.07 + ${SEED.toFixed(1)} + 31.1));
  float wu = u + wx * 0.4;
  float wv = v + wy * 0.4;
  float acc = 0.0;${octaveLines}
  float waveVal = acc * ${INV_TOTAL_W.toFixed(6)};
  float baseHeight = waveVal * ${AMP.toFixed(4)};
  float ripple = 0.0;
  if (uCursorActive > 0.5) {
    vec2 wuv = (uv - 0.5) / ${WAVE_HALFEXTENT.toFixed(1)} + 0.5;
    float ws = textureLod(uWave, clamp(wuv, 0.0, 1.0), 0.0).r;
    ripple = ws * ${(CURSOR_INTENSITY * 0.05).toFixed(4)};
  }
  return baseHeight + ripple;
}`;

    // Pass 1 — raymarch（surface3dRaymarch verbatim），MRT: uvMask + lit
    const FRAG_MARCH = `#version 300 es
precision highp float;
precision highp int;
in vec2 vUv;
layout(location = 0) out vec4 outUvMask;
layout(location = 1) out vec4 outLit;
layout(location = 2) out vec4 outJac;
uniform float uAspect;
uniform float uT;
uniform float uEnvelope;
${NOISE_GLSL}
${HEIGHT_GLSL}
vec2 mirrorUV(vec2 uv){
  vec2 m = mod(abs(uv), 2.0);
  return mix(m, 2.0 - m, step(1.0, m));
}
void main(){
  vec2 uvDown = vec2(vUv.x, 1.0 - vUv.y);
  float ndcX = (uvDown.x - 0.5) * 2.0 * uAspect;
  float ndcY = -(uvDown.y - 0.5) * 2.0;
  vec3 camPos = vec3(${camPos[0].toFixed(6)}, ${camPos[1].toFixed(6)}, ${camPos[2].toFixed(6)});
  vec3 rayDir = normalize(
    vec3(${fwd[0].toFixed(6)}, ${fwd[1].toFixed(6)}, ${fwd[2].toFixed(6)}) * ${FOCAL.toFixed(2)}
    + vec3(${camRight[0].toFixed(6)}, ${camRight[1].toFixed(6)}, ${camRight[2].toFixed(6)}) * ndcX
    + vec3(${camUp[0].toFixed(6)}, ${camUp[1].toFixed(6)}, ${camUp[2].toFixed(6)}) * ndcY);
  float dzSign = rayDir.z >= 0.0 ? 1.0 : -1.0;
  float dzSafe = dzSign * max(abs(rayDir.z), 0.000001);
  float tTop = (uEnvelope - camPos.z) / dzSafe;
  float tBot = (-uEnvelope - camPos.z) / dzSafe;
  float tEnter = max(min(tTop, tBot), 0.0);
  float tExit = min(max(tTop, tBot), ${MARCH_FAR.toFixed(1)});
  vec3 farPos = camPos + rayDir * ${MARCH_FAR.toFixed(1)};
  float hit = 0.0;
  float finalT = ${MARCH_FAR.toFixed(1)};
  float hitU = farPos.x * 0.5 + 0.5;
  float hitV = farPos.y * 0.5 + 0.5;
  vec3 lit = vec3(1.0);
  if (tExit > tEnter) {
    float stepSize = (tExit - tEnter) / ${MARCH_STEPS.toFixed(1)};
    float tMarch = tEnter;
    vec3 pStart = camPos + rayDir * tEnter;
    float prevDiff = pStart.z - heightFn(vec2(pStart.x * 0.5 + 0.5, pStart.y * 0.5 + 0.5));
    for (int s = 0; s < ${MARCH_STEPS}; s++) {
      tMarch += stepSize;
      vec3 pos = camPos + rayDir * tMarch;
      float h = heightFn(vec2(pos.x * 0.5 + 0.5, pos.y * 0.5 + 0.5));
      float diff = pos.z - h;
      if (diff < 0.0 && prevDiff > 0.0) { hit = 1.0; break; }
      prevDiff = diff;
    }
    if (hit > 0.5) {
      float tLow = tMarch - stepSize;
      float tHigh = tMarch;
      for (int r = 0; r < ${MARCH_REFINE}; r++) {
        float tMid = (tLow + tHigh) * 0.5;
        vec3 pMid = camPos + rayDir * tMid;
        if (pMid.z - heightFn(vec2(pMid.x * 0.5 + 0.5, pMid.y * 0.5 + 0.5)) > 0.0) tLow = tMid;
        else tHigh = tMid;
      }
      finalT = (tLow + tHigh) * 0.5;
      vec3 hitPos = camPos + rayDir * finalT;
      hitU = hitPos.x * 0.5 + 0.5;
      hitV = hitPos.y * 0.5 + 0.5;
      float normalEps = 0.01;
      float hC = heightFn(vec2(hitU, hitV));
      float hR = heightFn(vec2(hitU + normalEps, hitV));
      float hUp = heightFn(vec2(hitU, hitV + normalEps));
      float dhdu = (hR - hC) / normalEps;
      float dhdv = (hUp - hC) / normalEps;
      vec3 nrm = normalize(vec3(dhdu * -0.5, dhdv * -0.5, 1.0));
      vec3 lightDir = normalize(vec3(${LIGHT_DIR[0]}, ${LIGHT_DIR[1]}, ${LIGHT_DIR[2]}));
      vec3 viewDir = -rayDir;
      float diffuse = clamp(dot(nrm, lightDir), 0.0, 1.0);
      vec3 halfVec = normalize(lightDir + viewDir);
      float specPow = ${(GLOSS * 128 + 4).toFixed(1)};
      float specular = pow(clamp(dot(nrm, halfVec), 0.0, 1.0), specPow) * ${HIGHLIGHTS.toFixed(4)};
      vec3 totalLight = vec3(0.4) + vec3(diffuse * 0.6) + vec3(specular);
      lit = clamp(mix(vec3(1.0), totalLight, ${LIGHTING.toFixed(4)}), vec3(0.0), vec3(3.0));
    }
  }
  vec2 rawSampleUV = vec2(hitU, 1.0 - hitV);
  vec2 finalUV = mirrorUV(rawSampleUV);
  float edgeAA = 0.05;
  float nearT = ${(NEAR_CUTOFF * MARCH_FAR).toFixed(4)};
  float farT = ${(FAR_CUTOFF * MARCH_FAR).toFixed(4)};
  float nearMask = smoothstep(nearT - edgeAA, nearT + edgeAA, finalT);
  float farMask = smoothstep(farT + edgeAA, farT - edgeAA, finalT);
  float finalMask = hit * nearMask * farMask;
  outUvMask = vec4(finalUV, finalMask, 0.0);
  outLit = vec4(lit, 0.0);
  // UV 对屏幕像素的雅可比 —— 在本 pass 全精度值上取导数（半精度纹理上取会是量化噪声）
  outJac = vec4(dFdx(finalUV), dFdy(finalUV));
}`;

    // Pass 2 — DotGrid（dotGridCellCenterUV / dotGridAlpha verbatim；
    // speed 0 / offset 0 / twinkle 0 已常量折叠）+ 渐变亮度 map + 合成
    const FRAG_DOTS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uUvMask;
uniform sampler2D uLit;
uniform sampler2D uJac;
uniform vec2 uRes;
uniform float uJacScale; // Pass1 像素 → Pass2 像素的导数换算（cw / w）
uniform float uDotMaxPx; // 点半径上限（设备像素）：抑制近景畸变团块
vec3 encodeSrgb(vec3 c){
  c = clamp(c, 0.0, 1.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(0.0031308, c));
}
vec2 dotGridCellCenterUV(vec2 uv, vec2 viewport, float density){
  float aspect = viewport.x / viewport.y;
  float correctedX = uv.x * aspect;
  float correctedY = 1.0 - uv.y;
  float ccx = (floor(correctedX * density) + 0.5) / density;
  float ccy = (floor(correctedY * density) + 0.5) / density;
  return vec2(ccx / aspect, 1.0 - ccy);
}
/*
 * 与原版 dotGridAlpha 的差异（Park 2026-08-17「不够圆」）：
 * 原版在贴附后的网格空间量 fract 距离，透视会把点剪切成斜杠（官方缩略图同样）。
 * 这里用 UV 雅可比逆变换把偏移换算回屏幕像素位移 —— 点永远是屏幕正圆，
 * 半径仍按 √|det J|（透视缩放的几何均值）衰减，远小近大的节奏不变。
 * 雅可比来自 Pass1 全精度导数（uJac），不能在半精度 UV 纹理上取 fwidth（量化噪声）。
 */
float dotGridAlpha(vec2 uv, vec4 jac, vec2 viewport, float density, float dotSize){
  float aspect = viewport.x / viewport.y;
  vec2 correctedUV = vec2(uv.x * aspect, 1.0 - uv.y);
  vec2 gridUV = correctedUV * density;
  // grid = (u·aspect, 1−v)·density → 链式法则换算雅可比（y 分量取反不影响度量）
  vec2 gx = vec2(jac.x * aspect, -jac.y) * density * uJacScale;
  vec2 gy = vec2(jac.z * aspect, -jac.w) * density * uJacScale;
  float det = gx.x * gy.y - gx.y * gy.x;
  if (abs(det) < 1e-12) return 0.0;
  vec2 d = fract(gridUV) - 0.5;
  // Δp = J⁻¹·d：回到该 cell 中心所需的屏幕位移（像素）
  vec2 dp = vec2(gy.y * d.x - gy.x * d.y, -gx.y * d.x + gx.x * d.y) / det;
  float s = sqrt(abs(det));
  // 半径封顶（设备像素）：近景点不放大 → 波面畸变没有可见空间；
  // 轮廓处 s 异常时点自然缩没，不会变成不规则团块
  float rPx = min(dotSize * 0.5 / s, uDotMaxPx);
  return 1.0 - smoothstep(rPx - 0.5, rPx, length(dp));
}
// uvMask 是 RGBA32F + NEAREST（32F 线性过滤是扩展），手动双线性
vec4 sampleUvMask(vec2 uv){
  vec2 ts = vec2(textureSize(uUvMask, 0));
  vec2 ph = uv * ts - 0.5;
  vec2 base = floor(ph);
  vec2 f = ph - base;
  vec2 lo = clamp(base, vec2(0.0), ts - 1.0);
  vec2 hi = clamp(base + 1.0, vec2(0.0), ts - 1.0);
  vec4 t00 = texelFetch(uUvMask, ivec2(lo), 0);
  vec4 t10 = texelFetch(uUvMask, ivec2(hi.x, lo.y), 0);
  vec4 t01 = texelFetch(uUvMask, ivec2(lo.x, hi.y), 0);
  vec4 t11 = texelFetch(uUvMask, ivec2(hi), 0);
  return mix(mix(t00, t10, f.x), mix(t01, t11, f.x), f.y);
}
void main(){
  vec2 screenUv = vec2(vUv.x, 1.0 - vUv.y);
  vec2 texUv = vec2(screenUv.x, 1.0 - screenUv.y);
  vec4 uvMask = sampleUvMask(texUv);
  vec3 lit = texture(uLit, texUv).rgb;
  vec4 jac = texture(uJac, texUv);
  vec2 drapedUV = uvMask.xy;
  float mask = uvMask.z;
  // LinearGradient：白在底(#fff)黑在顶，linear 空间即 lum = v（y-down）
  vec2 cell = dotGridCellCenterUV(drapedUV, uRes, ${DENSITY.toFixed(1)});
  float lum = clamp(cell.y, 0.0, 1.0);
  float dotSize = lum * ${DOT_OUT_MAX.toFixed(4)};
  float alpha = dotGridAlpha(drapedUV, jac, uRes, ${DENSITY.toFixed(1)}, dotSize) * ${DOT_FADE.toFixed(4)};
  vec3 dotRgb = clamp(vec3(${DOT[0].toFixed(6)}, ${DOT[1].toFixed(6)}, ${DOT[2].toFixed(6)}) * lit, 0.0, 1.0);
  float a = alpha * mask;
  vec3 bg = vec3(${BG[0].toFixed(6)}, ${BG[1].toFixed(6)}, ${BG[2].toFixed(6)});
  vec3 col = mix(bg, dotRgb, a);
  outColor = vec4(encodeSrgb(col), 1.0);
}`;

    let failed = false;
    let raf = 0;
    let running = true;
    let visible = true;
    function fail() {
      if (failed) return;
      failed = true;
      running = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      if (canvas) canvas.style.display = "none";
    }

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("[roi-point-waves]", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }
    function link(vsSrc, fsSrc) {
      const v = compile(gl.VERTEX_SHADER, vsSrc);
      const f = compile(gl.FRAGMENT_SHADER, fsSrc);
      if (!v || !f) return null;
      const p = gl.createProgram();
      gl.attachShader(p, v);
      gl.attachShader(p, f);
      gl.linkProgram(p);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn("[roi-point-waves] link", gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        return null;
      }
      return p;
    }

    const progMarch = link(VERT, FRAG_MARCH);
    const progDots = link(VERT, FRAG_DOTS);
    if (!progMarch || !progDots) {
      bail();
      return () => {};
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    // ═══ 波场纹理 ═══
    // Park 2026-08-17：鼠标划过抖动太厉害 → 移除涟漪交互（指针监听 +
    // CPU 波动方程整段删掉）。纹理保留全零，shader 的 uCursorActive 恒为 0。
    const CELLS = WAVE_GRID * WAVE_GRID;
    const waveHalf = new Uint16Array(CELLS);

    const waveTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, waveTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, WAVE_GRID, WAVE_GRID, 0, gl.RED, gl.HALF_FLOAT, waveHalf);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);

    // ═══ Pass 1 MRT 目标 ═══
    const uvMaskTex = gl.createTexture();
    const litTex = gl.createTexture();
    const jacTex = gl.createTexture();
    const marchFbo = gl.createFramebuffer();
    let compW = 0;
    let compH = 0;

    function allocTarget(tex, w, h, float32) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      // 32F 线性过滤需要 OES_texture_float_linear，一律 NEAREST + shader 里手动双线性
      const filter = float32 ? gl.NEAREST : gl.LINEAR;
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (float32) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, null);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      }
    }

    function ensureCompute(w, h) {
      if (w === compW && h === compH) return true;
      compW = w;
      compH = h;
      try {
        // UV 必须 32F：半精度量化(~5e-4)在点判定里就是可见噪声
        allocTarget(uvMaskTex, w, h, true);
        allocTarget(litTex, w, h);
        allocTarget(jacTex, w, h);
        gl.bindFramebuffer(gl.FRAMEBUFFER, marchFbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, uvMaskTex, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, litTex, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, jacTex, 0);
        gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);
        const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        if (!ok) fail();
        return ok;
      } catch {
        fail();
        return false;
      }
    }

    const locsMarch = {
      aPos: gl.getAttribLocation(progMarch, "aPos"),
      uAspect: gl.getUniformLocation(progMarch, "uAspect"),
      uT: gl.getUniformLocation(progMarch, "uT"),
      uEnvelope: gl.getUniformLocation(progMarch, "uEnvelope"),
      uWave: gl.getUniformLocation(progMarch, "uWave"),
      uCursorActive: gl.getUniformLocation(progMarch, "uCursorActive"),
    };
    const locsDots = {
      aPos: gl.getAttribLocation(progDots, "aPos"),
      uUvMask: gl.getUniformLocation(progDots, "uUvMask"),
      uLit: gl.getUniformLocation(progDots, "uLit"),
      uJac: gl.getUniformLocation(progDots, "uJac"),
      uRes: gl.getUniformLocation(progDots, "uRes"),
      uJacScale: gl.getUniformLocation(progDots, "uJacScale"),
      uDotMaxPx: gl.getUniformLocation(progDots, "uDotMaxPx"),
    };

    gl.useProgram(progMarch);
    gl.uniform1i(locsMarch.uWave, 0);
    gl.useProgram(progDots);
    gl.uniform1i(locsDots.uUvMask, 0);
    gl.uniform1i(locsDots.uLit, 1);
    gl.uniform1i(locsDots.uJac, 2);

    function drawQuad(aPos) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    let animT = 0;
    let lastFrame = performance.now();
    let cssW = Math.max(1, section.clientWidth);
    let cssH = Math.max(1, section.clientHeight);
    let resizeTimer = 0;

    function measure() {
      cssW = Math.max(1, section.clientWidth);
      cssH = Math.max(1, section.clientHeight);
    }

    function sizes() {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      let w = Math.max(1, Math.floor(cssW * dpr));
      let h = Math.max(1, Math.floor(cssH * dpr));
      if (w > OUT_MAX_SIDE) {
        h = Math.max(1, Math.floor((h * OUT_MAX_SIDE) / w));
        w = OUT_MAX_SIDE;
      }
      if (h > OUT_MAX_SIDE) {
        w = Math.max(1, Math.floor((w * OUT_MAX_SIDE) / h));
        h = OUT_MAX_SIDE;
      }
      const fit = Math.min(1, COMPUTE_MAX / Math.max(w, h));
      const cw = Math.max(16, Math.round(w * fit));
      const ch = Math.max(16, Math.round(h * fit));
      return { w, h, cw, ch };
    }

    function shouldDraw() {
      return running && visible && !failed && !document.hidden && !gl.isContextLost();
    }

    function kick() {
      if (!raf && shouldDraw()) raf = requestAnimationFrame(draw);
    }

    let lastDrawn = 0;

    function draw(now) {
      raf = 0;
      if (!shouldDraw()) return;
      if (now - lastDrawn < FRAME_MS) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastDrawn = now;
      try {
        const { w, h, cw, ch } = sizes();
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w;
          canvas.height = h;
        }
        if (!ensureCompute(cw, ch)) return;

        const dt = Math.min(0.016, Math.max(0, (now - lastFrame) * 0.001));
        lastFrame = now;
        animT += dt * SURF_SPEED;
        const aspect = w / Math.max(h, 1);

        // 涟漪交互已禁用（Park）：cursorActive 恒 0，shader 跳过波场采样
        const cursorActive = 0;
        const envelope = AMP + HEIGHT_SLAB_PAD;

        // Pass 1: raymarch → uvMask + lit
        gl.bindFramebuffer(gl.FRAMEBUFFER, marchFbo);
        gl.viewport(0, 0, cw, ch);
        gl.useProgram(progMarch);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, waveTex);
        gl.uniform1f(locsMarch.uAspect, aspect);
        gl.uniform1f(locsMarch.uT, animT);
        gl.uniform1f(locsMarch.uEnvelope, envelope);
        gl.uniform1f(locsMarch.uCursorActive, cursorActive);
        drawQuad(locsMarch.aPos);

        // Pass 2: 点阵合成 → 屏幕
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, w, h);
        gl.useProgram(progDots);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, uvMaskTex);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, litTex);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, jacTex);
        gl.uniform2f(locsDots.uRes, w, h);
        gl.uniform1f(locsDots.uJacScale, cw / w);
        gl.uniform1f(locsDots.uDotMaxPx, DOT_MAX_RADIUS_CSS * (w / Math.max(cssW, 1)));
        drawQuad(locsDots.aPos);
        gl.activeTexture(gl.TEXTURE0);
      } catch (err) {
        console.warn("[roi-point-waves] draw", err);
        fail();
        return;
      }
      if (shouldDraw()) raf = requestAnimationFrame(draw);
    }

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = 0;
        measure();
        kick();
      }, 80);
    }

    function onVisibility() {
      if (document.hidden) {
        if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }
      lastFrame = performance.now();
      kick();
    }

    function onContextLost(e) {
      e.preventDefault();
      fail();
    }

    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            visible = en.isIntersecting;
            if (visible) {
              lastFrame = performance.now();
              kick();
            } else if (raf) {
              cancelAnimationFrame(raf);
              raf = 0;
            }
          });
        },
        { threshold: 0.02, rootMargin: "40px" }
      );
      io.observe(section);
    }

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(section);
    }

    measure();
    kick();

    teardown = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (canvas) canvas.removeEventListener("webglcontextlost", onContextLost);
      if (io) io.disconnect();
      if (ro) {
        try {
          ro.disconnect();
        } catch {
          /* ignore */
        }
      }
      try {
        gl.deleteTexture(waveTex);
        gl.deleteTexture(uvMaskTex);
        gl.deleteTexture(litTex);
        gl.deleteTexture(jacTex);
        gl.deleteFramebuffer(marchFbo);
        gl.deleteBuffer(quad);
        gl.deleteProgram(progMarch);
        gl.deleteProgram(progDots);
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      } catch {
        /* ignore */
      }
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  } catch (err) {
    console.warn("[fx:roi-point-waves.js]", err);
  }

  return function dispose() {
    if (typeof teardown === "function") {
      try {
        teardown();
      } catch {
        /* ignore */
      }
      teardown = null;
    }
  };
}
