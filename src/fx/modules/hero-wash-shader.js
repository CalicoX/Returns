/**
 * Returns hero wash — API 同款自研 WebGL（不走 npm `shaders` 包）。
 *
 * Pipeline（与 API `hero-wash-shader.js` 相同）:
 *   Pass 1 (FBO):   Swirl + ChromaFlow premultiplied-over
 *   Pass 2 (screen): FlutedGlass refraction + linear→sRGB
 *
 * 色板跟 Returns 青绿（H4），不要 API 的紫 / 蓝 / 橙：
 *   Swirl:      #FFFFFF / #f0f7f3（带青绿倾向；#f7fffc 静止时几乎看不见，
 *               #e9f2ee 又太亮抢插图，Park 2026-08-17 两轮调到中间值）
 *   ChromaFlow: base #FFFFFF
 *               up #99f6e4 · right #0f766e · down #14b8a6
 *               left #0d9488（替换 API 橙色 #FF3805）
 *   FilmGrain:  关闭（白底发脏，H5）
 *
 * 兼容：WebGL1 主路径；WebGL2 仅可选加速。fragment 支持 highp 就用 highp，
 * 否则降 mediump（GL_FRAGMENT_PRECISION_HIGH 宏判断）。
 * 浮点 FBO / RGBA16F 探测失败就走 RGBA8。context lost → 青绿 fallback。
 *
 * @returns {() => void}
 */
export function mount() {
  let teardown = null;

  try {
    const section = document.getElementById("returns-hero");
    if (!section) return () => {};

    if (
      window.__reduceFx ||
      window.__isMobileLayout ||
      (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
    ) {
      section.classList.add("hero-shader-fallback");
      return () => {};
    }

    let canvas =
      document.getElementById("rt-hero-shader") ||
      section.querySelector(".rt-hero-shader");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "rt-hero-shader";
      canvas.id = "rt-hero-shader";
      canvas.setAttribute("aria-hidden", "true");
      section.insertBefore(canvas, section.firstChild);
    }
    canvas.style.cssText =
      "width:100%;height:100%;display:block;pointer-events:none;";

    function getGL() {
      const tries = [
        {
          type: "webgl2",
          opts: {
            alpha: false,
            antialias: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          },
        },
        {
          type: "webgl",
          opts: {
            alpha: false,
            antialias: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false,
          },
        },
        {
          type: "webgl",
          opts: {
            alpha: false,
            antialias: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
          },
        },
        {
          type: "experimental-webgl",
          opts: { alpha: false, antialias: false, preserveDrawingBuffer: false },
        },
      ];
      for (let i = 0; i < tries.length; i++) {
        try {
          const gl = canvas.getContext(tries[i].type, tries[i].opts);
          if (gl && !gl.isContextLost()) {
            return { gl, isGL2: tries[i].type === "webgl2" };
          }
        } catch {
          /* next */
        }
      }
      return { gl: null, isGL2: false };
    }

    const got = getGL();
    const gl = got.gl;
    const isGL2 = got.isGL2;

    let failed = false;
    let raf = 0;
    let running = true;
    let visible = true;
    function fail() {
      if (failed) return;
      failed = true;
      running = false;
      visible = false;
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      section.classList.remove("has-hero-shader");
      section.classList.add("hero-shader-fallback");
      if (canvas) canvas.style.display = "none";
    }

    if (!gl) {
      fail();
      return () => {};
    }

    section.classList.add("has-hero-shader");
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);

    function isWeakGpu() {
      try {
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const raw = info
          ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || "")
          : String(gl.getParameter(gl.RENDERER) || "");
        const n = raw.toLowerCase();
        return /swiftshader|llvmpipe|softpipe|microsoft basic render|gdi generic|mali-4|mali-t6|mali-t7|adreno 3[0-9]{2}([^0-9]|$)|adreno 4[0-1][0-9]([^0-9]|$)|powervr sgx/.test(
          n
        );
      } catch {
        return false;
      }
    }

    function canUseHalfFloatField() {
      if (!isGL2 || !gl.RGBA16F || !gl.HALF_FLOAT) return false;
      try {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, 4, 4, 0, gl.RGBA, gl.HALF_FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const err = gl.getError();
        gl.deleteTexture(t);
        return err === gl.NO_ERROR;
      } catch {
        return false;
      }
    }

    const weakGpu = isWeakGpu();
    const fieldPacked = !canUseHalfFloatField();
    const extColorHalf = isGL2 ? gl.getExtension("EXT_color_buffer_float") : null;

    // —— Preset props (locked) ——
    const SW_DETAIL = 1;
    const SW_BLEND = 50;
    const SW_SPEED = 1;

    const CF_GRID = weakGpu ? 96 : 128;
    const CF_RADIUS = 3.5;
    const CF_MOMENTUM = 13;
    const CF_INTENSITY = 1.2;
    const CF_FADE_SCALE = 0.45;

    const FG_ANGLE = 31;
    const FG_FREQ = 8;
    const FG_SOFTNESS = 1;
    const FG_REFRACTION = 4;
    const FG_ABERRATION = 0.61;
    const FG_LIGHT = -90;
    const FG_HIGHLIGHT = 0.12;
    const FG_HIGHLIGHT_SOFT = 0.3;
    const FG_EXP_HI = 8;
    const FG_EXP_LO = 3;

    const GRAIN_STRENGTH = 0;
    const GRAIN_BIAS = 2;

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

    const SWIRL_A = lin("#FFFFFF");
    const SWIRL_B = lin("#f0f7f3");
    const CF_BASE = lin("#FFFFFF");
    const CF_UP = lin("#99f6e4");
    const CF_DOWN = lin("#14b8a6");
    const CF_LEFT = lin("#0d9488");
    const CF_RIGHT = lin("#0f766e");

    const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

    // 支持 highp 的设备用 highp（mediump 在部分 GPU 是 16-bit，玻璃棱边界会出锯齿），
    // 不支持的老移动端仍降回 mediump，不影响兼容。
    const PRECISION = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif`;

    const FRAG_SCENE = `${fieldPacked ? "#define FIELD_PACKED\n" : ""}
${PRECISION}
varying vec2 vUv;
uniform sampler2D uField;
uniform float uSwirlTime;
uniform vec3 uSwirlA, uSwirlB;
uniform vec3 uCfBase, uCfUp, uCfDown, uCfLeft, uCfRight;

const float SW_DETAIL = ${SW_DETAIL.toFixed(1)};
const float SW_BLEND = ${SW_BLEND.toFixed(1)};

vec2 swirlField(vec2 uv, float t){
  float freq1 = SW_DETAIL;
  vec2 d1 = vec2(
    uv.x + sin(uv.y * freq1 * 1.7 + t * 0.8) * 0.12 + cos(uv.x * freq1 * 0.9 - t * 0.5) * 0.05,
    uv.y + cos(uv.x * freq1 * 1.3 - t * 0.6) * 0.12 + sin(uv.y * freq1 * 1.1 + t * 0.7) * 0.05
  );
  float pattern1 = sin(d1.x * freq1 * 2.1 + d1.y * freq1 * 1.8 + t * 0.4);
  float freq2 = SW_DETAIL * 2.1;
  vec2 d2 = vec2(
    d1.x + cos(d1.y * freq2 * 2.7 - t * 0.45) * 0.07 + sin(d1.x * freq2 * 1.9 + t * 0.6) * 0.04,
    d1.y + sin(d1.x * freq2 * 2.3 + t * 0.65) * 0.07 + cos(d1.y * freq2 * 1.6 - t * 0.4) * 0.04
  );
  float pattern2 = cos(d2.x * freq2 * 1.4 - d2.y * freq2 * 1.9 + t * 0.35);
  float freq3 = SW_DETAIL * 3.7;
  vec2 d3 = vec2(
    d2.x + sin(d2.y * freq3 * 1.8 + t * 0.85) * 0.04 + cos(d2.x * freq3 * 1.3 - t * 0.55) * 0.025 + sin((d2.x + d2.y) * freq3 * 0.7 + t * 0.9) * 0.02,
    d2.y + cos(d2.x * freq3 * 1.6 - t * 0.75) * 0.04 + sin(d2.y * freq3 * 1.1 + t * 0.5) * 0.025 + cos((d2.x + d2.y) * freq3 * 0.8 - t * 0.95) * 0.02
  );
  float pattern3 = sin(d3.x * freq3 * 1.1 + d3.y * freq3 * 1.5 - t * 0.55);
  float combined = pattern1 * 0.45 + pattern2 * 0.35 + pattern3 * 0.2;
  float blendBias = (SW_BLEND - 50.0) * 0.006;
  float blendFactor = smoothstep(0.3, 0.7, combined * 0.5 + 0.5 + blendBias);
  float shimmer = sin(t * 2.5 + combined * 8.0) * 0.015 + 1.0;
  return vec2(blendFactor, shimmer);
}

vec4 fieldTap(vec2 uv){
  vec4 s = texture2D(uField, clamp(uv, 0.0, 1.0));
#ifdef FIELD_PACKED
  s = vec4(s.xy * 2.0 - 1.0, s.z, s.w);
#endif
  return s;
}

vec4 chromaFlow(vec2 uv){
  float px = 1.0 / ${CF_GRID.toFixed(1)};
  vec4 s0 = fieldTap(uv);
  vec4 s1 = fieldTap(uv + vec2(px, 0.0));
  vec4 s2 = fieldTap(uv + vec2(0.0, px));
  vec4 s3 = fieldTap(uv + vec2(-px, 0.0));
  vec4 s4 = fieldTap(uv + vec2(0.0, -px));

  float liquidIntensity = smoothstep(0.0, 0.1, (s0.z + s1.z + s2.z + s3.z + s4.z) * 0.2);
  vec2 flow = (s0.xy + s1.xy + s2.xy + s3.xy + s4.xy) * 0.2;
  float flowMagnitude = length(flow);
  float hasFlow = smoothstep(0.01, 0.1, flowMagnitude);
  float nx = flow.x / (flowMagnitude + 0.001);
  float ny = flow.y / (flowMagnitude + 0.001);

  float rightAmount = smoothstep(0.0, 0.7, max(nx, 0.0));
  float leftAmount  = smoothstep(0.0, 0.7, max(-nx, 0.0));
  float upAmount    = smoothstep(0.0, 0.7, max(ny, 0.0));
  float downAmount  = smoothstep(0.0, 0.7, max(-ny, 0.0));

  vec3 horizontalColor = uCfLeft * leftAmount + uCfRight * rightAmount;
  vec3 verticalColor   = uCfDown * downAmount + uCfUp * upAmount;
  float horizontalWeight = leftAmount + rightAmount;
  float verticalWeight   = upAmount + downAmount;
  float totalWeight = horizontalWeight + verticalWeight + 0.001;

  vec3 dirRGB = horizontalColor * (horizontalWeight / totalWeight)
              + verticalColor * (verticalWeight / totalWeight);
  float dirA = (horizontalWeight * horizontalWeight + verticalWeight * verticalWeight) / totalWeight;

  vec3 rgb = mix(uCfBase, dirRGB, hasFlow) * liquidIntensity;
  float a = mix(1.0, dirA, hasFlow) * liquidIntensity;
  return vec4(rgb, a);
}

void main(){
  vec2 uvDown = vec2(vUv.x, 1.0 - vUv.y);
  vec2 f = swirlField(uvDown, uSwirlTime);
  vec3 swirl = mix(uSwirlA, uSwirlB, f.x) * f.y;
  vec4 cf = chromaFlow(uvDown);
  vec3 scene = cf.rgb + swirl * (1.0 - cf.a);
  gl_FragColor = vec4(scene, 1.0);
}`;

    const FRAG_GLASS = `
${PRECISION}
varying vec2 vUv;
uniform sampler2D uScene;
uniform vec2 uRes;

const float PI = 3.14159265358979;
const float ANGLE_DEG = ${FG_ANGLE.toFixed(1)};
const float FREQUENCY = ${FG_FREQ.toFixed(1)};
const float SOFTNESS = ${FG_SOFTNESS.toFixed(2)};
const float REFRACTION = ${FG_REFRACTION.toFixed(2)};
const float ABERRATION = ${FG_ABERRATION.toFixed(2)};
const float LIGHT_ANGLE_DEG = ${FG_LIGHT.toFixed(1)};
const float HIGHLIGHT = ${FG_HIGHLIGHT.toFixed(2)};
const float HIGHLIGHT_SOFT = ${FG_HIGHLIGHT_SOFT.toFixed(2)};
const float EXP_HI = ${FG_EXP_HI.toFixed(1)};
const float EXP_LO = ${FG_EXP_LO.toFixed(1)};
const float GRAIN_STRENGTH = ${GRAIN_STRENGTH.toFixed(3)};
const float GRAIN_BIAS = ${GRAIN_BIAS.toFixed(1)};

vec2 mirrorUV(vec2 uv){
  vec2 m = mod(abs(uv), 2.0);
  return mix(m, 2.0 - m, step(1.0, m));
}

vec3 encodeSrgb(vec3 c){
  c = clamp(c, 0.0, 1.0);
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(0.0031308, c));
}

vec3 sampleScene(vec2 uvDown){
  vec2 m = mirrorUV(uvDown);
  return texture2D(uScene, vec2(m.x, 1.0 - m.y)).rgb;
}

void main(){
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
  float aspect = uRes.x / max(uRes.y, 1.0);

  float r = ANGLE_DEG * PI / 180.0;
  float cosA = cos(r);
  float sinA = sin(r);

  vec2 aspCorr = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  float u = aspCorr.x * cosA + aspCorr.y * sinA;

  float flutePos = u * FREQUENCY;
  float cellPos = (fract(flutePos) - 0.5) * 2.0;
  float absCell = max(abs(cellPos), 0.0001);
  float exponent = mix(EXP_HI, EXP_LO, SOFTNESS);
  float slope = sign(cellPos) * pow(absCell, exponent);

  float halfCell = 0.5 / max(FREQUENCY, 0.001);
  float refrU = -(slope * REFRACTION) * halfCell;
  vec2 refractedUV = vec2(uv.x + (refrU * cosA) / aspect, uv.y + refrU * sinA);

  float chrU = refrU * ABERRATION * 0.5;
  vec2 chrOff = vec2((chrU * cosA) / aspect, chrU * sinA);

  float slopeSq = min(slope * slope, 1.0);
  float nz = sqrt(1.0 - slopeSq);
  float halfAng = LIGHT_ANGLE_DEG * PI / 360.0;
  float hx = sin(halfAng);
  float hy = cos(halfAng);
  float nDotH = max(slope * hx + nz * hy, 0.0);
  float shininess = exp2(8.0 - HIGHLIGHT_SOFT * 7.0);
  float fresnel = pow(1.0 - nz, 5.0);
  float fresnelMix = 0.04 + 0.96 * fresnel;
  float spec = pow(nDotH, shininess) * fresnelMix * HIGHLIGHT;

  vec3 col;
  col.r = sampleScene(refractedUV + chrOff).r;
  col.g = sampleScene(refractedUV).g;
  col.b = sampleScene(refractedUV - chrOff).b;

  col += vec3(spec);

  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  float grain = noise * 2.0 - 1.0;
  float brightness = clamp(dot(col, vec3(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  float darkFactor = pow(1.0 - brightness + 0.000001, GRAIN_BIAS);
  col += grain * darkFactor * (GRAIN_STRENGTH * 0.1);

  gl_FragColor = vec4(encodeSrgb(col), 1.0);
}`;

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("[hero-wash]", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    }
    function link(vs, fs) {
      const v = compile(gl.VERTEX_SHADER, vs);
      const f = compile(gl.FRAGMENT_SHADER, fs);
      if (!v || !f) return null;
      const p = gl.createProgram();
      gl.attachShader(p, v);
      gl.attachShader(p, f);
      gl.linkProgram(p);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn("[hero-wash] link", gl.getProgramInfoLog(p));
        gl.deleteProgram(p);
        return null;
      }
      return p;
    }

    const progScene = link(VERT, FRAG_SCENE);
    const progGlass = link(VERT, FRAG_GLASS);
    if (!progScene || !progGlass) {
      fail();
      return () => {};
    }

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const fieldData = new Float32Array(CF_GRID * CF_GRID * 4);
    const tempField = new Float32Array(CF_GRID * CF_GRID * 4);
    const fieldHalf = fieldPacked ? null : new Uint16Array(CF_GRID * CF_GRID * 4);
    const fieldBytes = fieldPacked ? new Uint8Array(CF_GRID * CF_GRID * 4) : null;

    const f32buf = new Float32Array(1);
    const u32buf = new Uint32Array(f32buf.buffer);
    function toHalf(v) {
      f32buf[0] = v;
      const x = u32buf[0];
      const sign = (x >>> 16) & 0x8000;
      const exp = (x >>> 23) & 0xff;
      let mant = x & 0x7fffff;
      if (exp < 103) return sign;
      if (exp > 142) return sign | 0x7c00;
      if (exp < 113) {
        mant |= 0x800000;
        return sign | ((mant >> (126 - exp)) + ((mant >> (125 - exp)) & 1));
      }
      return sign | ((exp - 112) << 10) | (mant >> 13);
    }

    const fieldTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fieldTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (fieldPacked) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CF_GRID, CF_GRID, 0, gl.RGBA, gl.UNSIGNED_BYTE, fieldBytes);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, CF_GRID, CF_GRID, 0, gl.RGBA, gl.HALF_FLOAT, fieldHalf);
    }

    function uploadField() {
      gl.bindTexture(gl.TEXTURE_2D, fieldTex);
      if (fieldPacked) {
        for (let k = 0; k < CF_GRID * CF_GRID; k++) {
          const i = k * 4;
          fieldBytes[i] = Math.max(0, Math.min(255, (fieldData[i] * 0.5 + 0.5) * 255));
          fieldBytes[i + 1] = Math.max(0, Math.min(255, (fieldData[i + 1] * 0.5 + 0.5) * 255));
          fieldBytes[i + 2] = Math.max(0, Math.min(255, fieldData[i + 2] * 255));
          fieldBytes[i + 3] = 255;
        }
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, CF_GRID, CF_GRID, gl.RGBA, gl.UNSIGNED_BYTE, fieldBytes);
      } else {
        for (let k = 0; k < fieldData.length; k++) fieldHalf[k] = toHalf(fieldData[k]);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, CF_GRID, CF_GRID, gl.RGBA, gl.HALF_FLOAT, fieldHalf);
      }
    }

    const sceneTex = gl.createTexture();
    const sceneFbo = gl.createFramebuffer();
    let fullW = 0;
    let fullH = 0;
    let sceneIsHalfFloat = !!(extColorHalf && isGL2 && gl.RGBA16F && gl.HALF_FLOAT);

    function allocScene(w, h) {
      gl.bindTexture(gl.TEXTURE_2D, sceneTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      try {
        if (sceneIsHalfFloat) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
        } else if (isGL2) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
      } catch {
        return false;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return ok;
    }

    function ensureFull(w, h) {
      if (w === fullW && h === fullH) return true;
      fullW = w;
      fullH = h;
      canvas.width = w;
      canvas.height = h;
      if (allocScene(w, h)) return true;
      if (sceneIsHalfFloat) {
        sceneIsHalfFloat = false;
        if (allocScene(w, h)) return true;
      }
      fail();
      return false;
    }

    const locsScene = {
      aPos: gl.getAttribLocation(progScene, "aPos"),
      uField: gl.getUniformLocation(progScene, "uField"),
      uSwirlTime: gl.getUniformLocation(progScene, "uSwirlTime"),
      uSwirlA: gl.getUniformLocation(progScene, "uSwirlA"),
      uSwirlB: gl.getUniformLocation(progScene, "uSwirlB"),
      uCfBase: gl.getUniformLocation(progScene, "uCfBase"),
      uCfUp: gl.getUniformLocation(progScene, "uCfUp"),
      uCfDown: gl.getUniformLocation(progScene, "uCfDown"),
      uCfLeft: gl.getUniformLocation(progScene, "uCfLeft"),
      uCfRight: gl.getUniformLocation(progScene, "uCfRight"),
    };
    const locsGlass = {
      aPos: gl.getAttribLocation(progGlass, "aPos"),
      uScene: gl.getUniformLocation(progGlass, "uScene"),
      uRes: gl.getUniformLocation(progGlass, "uRes"),
    };

    gl.useProgram(progScene);
    gl.uniform1i(locsScene.uField, 0);
    gl.uniform3fv(locsScene.uSwirlA, SWIRL_A);
    gl.uniform3fv(locsScene.uSwirlB, SWIRL_B);
    gl.uniform3fv(locsScene.uCfBase, CF_BASE);
    gl.uniform3fv(locsScene.uCfUp, CF_UP);
    gl.uniform3fv(locsScene.uCfDown, CF_DOWN);
    gl.uniform3fv(locsScene.uCfLeft, CF_LEFT);
    gl.uniform3fv(locsScene.uCfRight, CF_RIGHT);
    gl.useProgram(progGlass);
    gl.uniform1i(locsGlass.uScene, 0);

    function drawQuad(aPos) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    let ptrX = 0.5;
    let ptrY = 0.5;
    let prevX = 0.5;
    let prevY = 0.5;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let lastSimTime = performance.now();
    let fieldMax = 0;

    function stepFlowField(aspect) {
      const currentTime = performance.now();
      const dt = Math.min((currentTime - lastSimTime) / 1000, 0.016);
      lastSimTime = currentTime;

      const velX = dt > 0 ? (ptrX - prevX) / dt : 0;
      const velY = dt > 0 ? (ptrY - prevY) / dt : 0;
      mouseVelX = mouseVelX * 0.85 + velX * 0.15;
      mouseVelY = mouseVelY * 0.85 + velY * 0.15;
      prevX = ptrX;
      prevY = ptrY;

      const injecting = Math.abs(velX) + Math.abs(velY) > 0.01;
      if (!injecting && fieldMax < 1e-4) return;

      const intensity = CF_INTENSITY;
      const radius = CF_RADIUS * 0.05;
      const momentum = CF_MOMENTUM;
      const flowFadeRate = 1 - (dt * CF_FADE_SCALE) / Math.max(0.1, 1);
      const liquidFadeRate = 1 - dt * CF_FADE_SCALE;
      const flowSpeed = momentum * 50 * dt;
      let newMax = 0;
      const G = CF_GRID;

      for (let i = 0; i < G; i++) {
        for (let j = 0; j < G; j++) {
          const idx = (i * G + j) * 4;
          const fx0 = fieldData[idx];
          const fy0 = fieldData[idx + 1];
          tempField[idx] = fx0 * flowFadeRate;
          tempField[idx + 1] = fy0 * flowFadeRate;
          tempField[idx + 2] = fieldData[idx + 2] * liquidFadeRate;
          tempField[idx + 3] = 0;

          if (Math.abs(fx0) > 0.001 || Math.abs(fy0) > 0.001) {
            const advectX = j - fx0 * flowSpeed;
            const advectY = i - fy0 * flowSpeed;
            const x0 = Math.floor(advectX);
            const y0 = Math.floor(advectY);
            const x1 = x0 + 1;
            const y1 = y0 + 1;
            if (x0 >= 0 && y0 >= 0 && x1 < G && y1 < G) {
              const fx = advectX - x0;
              const fy = advectY - y0;
              const i00 = (y0 * G + x0) * 4;
              const i01 = (y0 * G + x1) * 4;
              const i10 = (y1 * G + x0) * 4;
              const i11 = (y1 * G + x1) * 4;
              const sampledLiquid =
                fieldData[i00 + 2] * (1 - fx) * (1 - fy) +
                fieldData[i01 + 2] * fx * (1 - fy) +
                fieldData[i10 + 2] * (1 - fx) * fy +
                fieldData[i11 + 2] * fx * fy;
              tempField[idx + 2] = sampledLiquid * liquidFadeRate;
            }
          }
          const m = Math.max(
            Math.abs(tempField[idx]),
            Math.abs(tempField[idx + 1]),
            tempField[idx + 2]
          );
          if (m > newMax) newMax = m;
        }
      }

      if (injecting) {
        const speed = Math.sqrt(mouseVelX * mouseVelX + mouseVelY * mouseVelY);
        const effectiveRadius = radius * Math.min(speed * speed * 20, 1);
        const maxDistSq = effectiveRadius * 2 * (effectiveRadius * 2);
        const radSq = effectiveRadius * effectiveRadius;
        const addScale = intensity * 100 * dt * 0.01;
        const speedMultiplier = Math.min(speed * 10, 1);

        for (let i = 0; i < G; i++) {
          for (let j = 0; j < G; j++) {
            const cellX = (j + 0.5) / G;
            const cellY = (i + 0.5) / G;
            const dx = aspect >= 1 ? (cellX - ptrX) * aspect : cellX - ptrX;
            const dy = aspect >= 1 ? cellY - ptrY : (cellY - ptrY) / aspect;
            const distSq = dx * dx + dy * dy;
            if (distSq < maxDistSq) {
              const idx = (i * G + j) * 4;
              const influence = Math.exp(-distSq / radSq);
              tempField[idx] += mouseVelX * influence * addScale;
              tempField[idx + 1] += mouseVelY * influence * addScale;
              tempField[idx + 2] += influence * addScale * speedMultiplier;
              tempField[idx] = Math.max(-1, Math.min(1, tempField[idx]));
              tempField[idx + 1] = Math.max(-1, Math.min(1, tempField[idx + 1]));
              tempField[idx + 2] = Math.max(0, Math.min(1, tempField[idx + 2]));
            }
          }
        }
      }

      fieldMax = injecting ? 1 : newMax;
      fieldData.set(tempField);
      uploadField();
    }

    let swirlTime = 0;
    let lastFrame = performance.now();
    let cssW = Math.max(1, section.clientWidth);
    let cssH = Math.max(1, section.clientHeight);
    let resizeTimer = 0;
    // 强 GPU 按 API 版跑满 2x，弱 GPU 才压分辨率——1.5x/1920 会让玻璃棱边界出锯齿。
    const MAX_SIDE = weakGpu ? 1920 : 2880;
    const dprCap = weakGpu ? 1.25 : 2;

    function pickDpr() {
      const raw = window.devicePixelRatio || 1;
      return Math.min(raw, dprCap);
    }

    function measureCss() {
      cssW = Math.max(1, section.clientWidth);
      cssH = Math.max(1, section.clientHeight);
    }

    function bufferSize() {
      const dpr = pickDpr();
      let w = Math.max(1, Math.floor(cssW * dpr));
      let h = Math.max(1, Math.floor(cssH * dpr));
      if (w > MAX_SIDE) {
        h = Math.max(1, Math.floor((h * MAX_SIDE) / w));
        w = MAX_SIDE;
      }
      if (h > MAX_SIDE) {
        w = Math.max(1, Math.floor((w * MAX_SIDE) / h));
        h = MAX_SIDE;
      }
      return { w, h };
    }

    function shouldDraw() {
      return running && visible && !failed && !document.hidden && !gl.isContextLost();
    }

    function kick() {
      if (!raf && shouldDraw()) raf = requestAnimationFrame(draw);
    }

    function draw(now) {
      raf = 0;
      if (!shouldDraw()) return;
      try {
        const { w, h } = bufferSize();
        if (!ensureFull(w, h)) return;

        const rawDt = Math.min(0.1, Math.max(0, (now - lastFrame) * 0.001));
        lastFrame = now;
        swirlTime += rawDt * SW_SPEED;
        const aspect = w / Math.max(h, 1);

        stepFlowField(aspect);

        gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFbo);
        gl.viewport(0, 0, w, h);
        gl.useProgram(progScene);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fieldTex);
        gl.uniform1f(locsScene.uSwirlTime, swirlTime);
        drawQuad(locsScene.aPos);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, w, h);
        gl.useProgram(progGlass);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneTex);
        gl.uniform2f(locsGlass.uRes, w, h);
        drawQuad(locsGlass.aPos);
      } catch (err) {
        console.warn("[hero-wash] draw", err);
        fail();
        return;
      }
      if (shouldDraw()) raf = requestAnimationFrame(draw);
    }

    function onPointer(e) {
      const rect = section.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      ptrX = (e.clientX - rect.left) / rect.width;
      ptrY = (e.clientY - rect.top) / rect.height;
    }

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = 0;
        measureCss();
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
      lastSimTime = lastFrame;
      kick();
    }

    function onContextLost(e) {
      e.preventDefault();
      fail();
    }

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
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
              lastSimTime = lastFrame;
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
    } else {
      visible = true;
    }

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(section);
    }

    uploadField();
    measureCss();
    kick();

    teardown = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      if (io) io.disconnect();
      if (ro) {
        try {
          ro.disconnect();
        } catch {
          /* ignore */
        }
      }
      try {
        gl.deleteTexture(fieldTex);
        gl.deleteTexture(sceneTex);
        gl.deleteFramebuffer(sceneFbo);
        gl.deleteBuffer(quad);
        gl.deleteProgram(progScene);
        gl.deleteProgram(progGlass);
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      } catch {
        /* ignore */
      }
      section.classList.remove("has-hero-shader");
    };
  } catch (err) {
    console.warn("[fx:hero-wash-shader.js]", err);
    try {
      const section = document.getElementById("returns-hero");
      if (section) {
        section.classList.remove("has-hero-shader");
        section.classList.add("hero-shader-fallback");
      }
      const canvas = document.getElementById("rt-hero-shader");
      if (canvas) canvas.style.display = "none";
    } catch {
      /* ignore */
    }
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
