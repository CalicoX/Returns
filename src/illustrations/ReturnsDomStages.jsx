/**
 * Returns DOM stages — same pattern as tracking feature-stage / fx-glass.
 */

import { useEffect, useRef, useState } from "react";

const HERO_PHOTO = "/assets/hero-returns.jpg";
const HERO_ITEMS = [
  {
    id: "set",
    name: "Olive Green Sports Set",
    meta: "Olive | xxl",
    price: "$80.00",
    qty: "x2",
    img: HERO_PHOTO,
  },
  {
    id: "jacket",
    name: "Athletic Zip-Up Jacket",
    meta: "White | xxl",
    price: "$60.00",
    qty: "x1",
    img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=160&h=160&q=80",
  },
  {
    id: "sneakers",
    name: "Beige Athletic Sneakers",
    meta: "US 9.5",
    price: "$90.00",
    qty: "x1",
    img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=160&h=160&q=80",
  },
];
const HERO_REASONS = [
  "Arrive too late",
  "Poor quality/faulty",
  "Parcel damaged on arrival",
  "Doesn't suit me",
  "Looks different to image on site",
];
const HERO_METHODS = [
  { id: "exchange", label: "Exchanges", icon: "swap" },
  { id: "refund", label: "Return and Refund", icon: "box" },
  { id: "green", label: "Green Return", icon: "wallet" },
];

function MethodIcon({ kind }) {
  if (kind === "swap") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M6.5 4.5H4.2A1.2 1.2 0 003 5.7v8.6A1.2 1.2 0 004.2 15.5h7.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13.5 15.5h2.3A1.2 1.2 0 0017 14.3V5.7A1.2 1.2 0 0015.8 4.5H8.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M8.2 7.2L6.2 5.2 8.2 3.2M11.8 12.8l2 2 2-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "box") {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M3.5 7.2L10 4l6.5 3.2v8.1L10 18.4 3.5 15.3V7.2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M10 4v14.4M3.5 7.2L10 10.5l6.5-3.3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3.8 8.2h12.4v7.3A1.7 1.7 0 0114.5 17.2H5.5A1.7 1.7 0 013.8 15.5V8.2z" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.8 8.2l1.4-3.4A1.4 1.4 0 016.5 3.8h7a1.4 1.4 0 011.3 1L16.2 8.2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M7 11.4h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/** Hero: lifestyle photo + glass returns cards */
export function DomHeroReturns() {
  const sceneRef = useRef(null);
  const stageRef = useRef(null);
  const [step, setStep] = useState(0);
  const [item, setItem] = useState(null);
  const [reason, setReason] = useState(null);
  const [method, setMethod] = useState(null);
  const [mouse, setMouse] = useState({ x: 48, y: 64, on: false, click: false });

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const visual = scene.parentElement;
    if (!visual) return undefined;

    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const max = 7;
    let raf = 0;
    let latest = null;

    function setTilt(rx, ry) {
      scene.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      scene.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    }

    function setLayer(px, py) {
      scene.style.setProperty("--layer-x", `${(-px * 10).toFixed(2)}px`);
      scene.style.setProperty("--layer-y", `${(-py * 8).toFixed(2)}px`);
      scene.style.setProperty("--layer-nx", `${(px * 7).toFixed(2)}px`);
      scene.style.setProperty("--layer-ny", `${(py * 6).toFixed(2)}px`);
    }

    function apply() {
      raf = 0;
      if (!latest) return;
      const e = latest;
      latest = null;
      const r = visual.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (reduce) return;
      const px = Math.max(-1, Math.min(1, (x / Math.max(r.width, 1)) * 2 - 1));
      const py = Math.max(-1, Math.min(1, (y / Math.max(r.height, 1)) * 2 - 1));
      setTilt(-py * max, px * max);
      setLayer(px, py);
    }

    function onEnter() {
      scene.classList.add("is-tilting");
    }

    function onMove(e) {
      latest = e;
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      latest = null;
      scene.classList.remove("is-tilting");
      setTilt(0, 0);
      setLayer(0, 0);
    }

    visual.addEventListener("pointerenter", onEnter);
    visual.addEventListener("pointermove", onMove);
    visual.addEventListener("pointerleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      visual.removeEventListener("pointerenter", onEnter);
      visual.removeEventListener("pointermove", onMove);
      visual.removeEventListener("pointerleave", onLeave);
      setTilt(0, 0);
      setLayer(0, 0);
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    // ≤768：PC 设计稿（620 stage + flow 左悬出 56 = 676）原样整组等比缩到容器宽（100vw-16）
    function fit() {
      const host = scene.parentElement;
      const w = host ? host.clientWidth : 0;
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      const s = mobile && w > 0 ? Math.min(1, w / 676) : 1;
      scene.style.setProperty("--rt-s", s.toFixed(4));
      scene.style.height = "";
    }

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const reduce =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 768px)").matches;

    let gen = 0;
    const timers = [];

    function later(ms) {
      return new Promise((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });
    }

    function pointAt(el) {
      if (!el) return;
      const sr = stage.getBoundingClientRect();
      const er = el.getBoundingClientRect();
      // --mx/--my 是 stage 未缩放坐标系里的值；≤768 stage 被 scale(--rt-s)，
      // rect 差值是屏幕像素，必须除回缩放比，否则光标飘到插图外（Park 报过位置错）
      const sceneEl = stage.parentElement;
      const s = sceneEl ? parseFloat(sceneEl.style.getPropertyValue("--rt-s")) || 1 : 1;
      setMouse({
        x: (er.left - sr.left + er.width * 0.78) / s,
        y: (er.top - sr.top + er.height * 0.55) / s,
        on: true,
        click: false,
      });
    }

    async function clickTarget(sel, apply, my, slow = false) {
      if (my !== gen) return;
      const el = stage.querySelector(sel);
      pointAt(el);
      await later(slow ? 900 : 520);
      if (my !== gen) return;
      setMouse((m) => ({ ...m, click: true }));
      await later(110);
      if (my !== gen) return;
      apply();
      await later(140);
      if (my !== gen) return;
      setMouse((m) => ({ ...m, click: false }));
    }

    async function play() {
      const my = ++gen;
      while (my === gen) {
        setStep(0);
        setItem(null);
        setReason(null);
        setMethod(null);
        setMouse({ x: 36, y: 48, on: false, click: false });
        await later(reduce ? 120 : 200);
        if (my !== gen) return;
        setStep(1);
        await later(380);
        if (my !== gen) return;
        if (!reduce) {
          await clickTarget(
            '[data-demo="item"]',
            () => {
              setItem("jacket");
              setStep(2);
            },
            my
          );
          await later(360);
          if (my !== gen) return;
          await clickTarget(
            '[data-demo="reason"]',
            () => {
              setReason("Arrive too late");
              setStep(3);
            },
            my
          );
          await later(360);
          if (my !== gen) return;
          await clickTarget(
            '[data-demo="method"]',
            () => {
              setMethod("green");
            },
            my
          );
          // 终态（三卡齐亮）多停留——这是主要画面，别一闪而过
          await later(4200);
          if (my !== gen) return;
          setMouse((m) => ({ ...m, on: false }));
          await later(300);
        } else {
          // reduce / ≤768：不省光标——照常移动+点击演示，只是节奏放慢、少悬停停顿
          await clickTarget(
            '[data-demo="item"]',
            () => {
              setItem("jacket");
              setStep(2);
            },
            my,
            true
          );
          await later(700);
          if (my !== gen) return;
          await clickTarget(
            '[data-demo="reason"]',
            () => {
              setReason("Arrive too late");
              setStep(3);
            },
            my,
            true
          );
          await later(700);
          if (my !== gen) return;
          await clickTarget(
            '[data-demo="method"]',
            () => {
              setMethod("green");
            },
            my,
            true
          );
          // 终态（三卡齐亮）多停留——这是主要画面，别一闪而过
          await later(4200);
          if (my !== gen) return;
          setMouse((m) => ({ ...m, on: false }));
          await later(300);
        }
      }
    }

    play();

    return () => {
      gen += 1;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div className="rt-hero-visual" aria-label="Returns flow overlay">
      <div className="rt-hero-scene" ref={sceneRef}>
        <div className="rt-glass-stage" ref={stageRef}>
          <figure className="rt-glass-photo" aria-hidden="true">
            <img src={HERO_PHOTO} alt="" width="720" height="960" decoding="async" />
          </figure>

          <div className="rt-glass-flow">
            <div className={`rt-glass-card rt-glass-items${step >= 1 ? " is-in" : ""}`}>
              <p>What would you like to return?</p>
              <div className="rt-glass-list" role="radiogroup" aria-label="Return item">
                {HERO_ITEMS.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    role="radio"
                    aria-checked={item === row.id}
                    data-demo={row.id === "jacket" ? "item" : undefined}
                    className={`rt-glass-item${item === row.id ? " is-on" : ""}`}
                    onClick={() => {
                      setItem(row.id);
                      setStep((s) => Math.max(s, 2));
                    }}
                  >
                    <img src={row.img} alt="" width="44" height="44" />
                    <span>
                      <strong>{row.name}</strong>
                      <em>
                        {row.meta}
                        <i />
                        {row.price}
                        <i />
                        {row.qty}
                      </em>
                    </span>
                    <b aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <span className={`rt-glass-link${step >= 2 ? " is-in" : ""}`} aria-hidden="true">
              <b />
              <i />
              <b />
            </span>

            <div className={`rt-glass-card rt-glass-reason${step >= 2 ? " is-in" : ""}`}>
              <p>Select return reason</p>
              <div className="rt-glass-reasons" role="radiogroup" aria-label="Return reason">
                {HERO_REASONS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={reason === label}
                    data-demo={label === "Arrive too late" ? "reason" : undefined}
                    className={`rt-glass-reason-row${reason === label ? " is-on" : ""}`}
                    onClick={() => {
                      setReason(label);
                      setStep((s) => Math.max(s, 3));
                    }}
                  >
                    <b aria-hidden="true">
                      {reason === label ? (
                        <svg viewBox="0 0 12 12" fill="none">
                          <path d="M2.4 6.2L4.8 8.6 9.6 3.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </b>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`rt-glass-card rt-glass-method${step >= 3 ? " is-in" : ""}`}>
            <p>Select return method</p>
            <div className="rt-glass-methods" role="radiogroup" aria-label="Return method">
              {HERO_METHODS.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  role="radio"
                  aria-checked={method === row.id}
                  data-demo={row.id === "green" ? "method" : undefined}
                  className={`rt-glass-method-btn${method === row.id ? " is-on" : ""}`}
                  onClick={() => setMethod(row.id)}
                >
                  <MethodIcon kind={row.icon} />
                  {row.label}
                </button>
              ))}
            </div>
          </div>

          <span
            className={`rt-glass-mouse${mouse.on ? " is-on" : ""}${mouse.click ? " is-click" : ""}`}
            style={{ "--mx": `${mouse.x}px`, "--my": `${mouse.y}px` }}
            aria-hidden="true"
          >
            <i />
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5.2 3.4l12.8 11.2-6.05.35 3.7 6.85-2.35 1.25-3.75-6.9-4.35 4.15z"
                fill="#111827"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function hsvToRgb(h, s, v) {
  const hh = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hh < 60) [r, g, b] = [c, x, 0];
  else if (hh < 120) [r, g, b] = [x, c, 0];
  else if (hh < 180) [r, g, b] = [0, c, x];
  else if (hh < 240) [r, g, b] = [0, x, c];
  else if (hh < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function toHex(r, g, b) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

function PortalMouse({ className = "rt-portal-mouse" }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M5.2 3.4l12.8 11.2-6.05.35 3.7 6.85-2.35 1.25-3.75-6.9-4.35 4.15z"
          fill="#111827"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SelectFrame() {
  return (
    <div className="rt-ai-select" aria-hidden="true">
      <i className="n" />
      <i className="e" />
      <i className="s" />
      <i className="w" />
      <b className="tl" />
      <b className="tr" />
      <b className="bl" />
      <b className="br" />
      <b className="tm" />
      <b className="bm" />
      <b className="ml" />
      <b className="mr" />
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 .6c.35 2.7 1.5 4.7 4.4 6.4-2.9.35-4.05 2.35-4.4 6.4-.35-2.7-1.5-4.7-4.4-6.4C6.5 6.65 7.65 4.65 8 .6z"
        fill="currentColor"
      />
    </svg>
  );
}

const HSV0 = { h: 168, s: 0.88, v: 0.71 };

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/*
 * Feature 插图窄屏整组等比缩放（Park 2026-09-01，Hero --rt-s 同款方案）：
 * ≤768 把场景盒固定成 PC 设计稿尺寸（W×H）再 scale(--fts) 缩到容器宽，
 * 内部布局/动画坐标全部保持 PC 版比例；桌面不写 --fts（走原布局）。
 */
const FEATURE_FIT = { portal: [677, 560], ai: [703, 560], recovery: [677, 519], carriers: [703, 560] };

function useFeatureFit(sceneRef, key) {
  const [w, h] = FEATURE_FIT[key];
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;
    const media = scene.closest(".rt-feature-media");

    function fit() {
      /* 宽度取 .rt-feature-media（grid 列定宽）；--fts 写在 media 上——
         scale 应用在 stage（media 的子级）才能继承到；占位高 H×s 同写 media */
      const mobile = window.matchMedia("(max-width: 768px)").matches;
      if (!mobile) {
        media?.style.removeProperty("--fts");
        media?.style.removeProperty("height");
        return;
      }
      const cw = media ? media.clientWidth : 0;
      if (cw <= 0) return;
      const s = Math.min(1, cw / w);
      media.style.setProperty("--fts", s.toFixed(4));
      media.style.height = `${Math.round(h * s)}px`;
    }

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneRef, key]);
}

function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}

/** 0 · Branded portal */
export function DomStagePortal() {
  const wrapRef = useRef(null);
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const hueRef = useRef(null);
  const svRef = useRef(null);
  useFeatureFit(sceneRef, "portal");
  const [hsv, setHsv] = useState(HSV0);
  const [phase, setPhase] = useState("idle");
  const [sel, setSel] = useState(0);
  const [showStat, setShowStat] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0, on: false, down: false });
  const [r, g, b] = hsvToRgb(hsv.h, hsv.s, hsv.v);
  const hex = toHex(r, g, b);
  const hueColor = `hsl(${hsv.h}, 100%, 50%)`;

  function pickSv(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const s = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    const v = Math.min(1, Math.max(0, 1 - (e.clientY - box.top) / box.height));
    setHsv((cur) => ({ ...cur, s, v }));
  }

  function pickHue(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const h = Math.min(359, Math.max(0, ((e.clientX - box.left) / box.width) * 360));
    setHsv((cur) => ({ ...cur, h }));
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let gen = 0;
    let raf = 0;
    const timers = [];
    const pos = { x: 0, y: 0 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function later(ms) {
      return new Promise((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });
    }

    function sceneXY(el, fx, fy) {
      const scene = sceneRef.current;
      if (!scene || !el) return { ...pos };
      const sr = scene.getBoundingClientRect();
      const r0 = el.getBoundingClientRect();
      // --x/--y 消费在 scene 未缩放坐标系里；≤768 scene 被 scale(--fts)，
      // rect 差值是屏幕像素，必须除回缩放比，否则鼠标飘出插图（同 Hero --rt-s 的坑）
      // --fts 在 media（useFeatureFit 写在那，stage/scene 靠继承消费）；rect 差值是屏幕像素，除回缩放比
      const s = parseFloat(scene.closest(".rt-feature-media")?.style.getPropertyValue("--fts")) || 1;
      return {
        x: (r0.left - sr.left + r0.width * fx) / s,
        y: (r0.top - sr.top + r0.height * fy) / s,
      };
    }

    function put(p, extra = {}) {
      pos.x = p.x;
      pos.y = p.y;
      setMouse((m) => ({ ...m, x: p.x, y: p.y, ...extra }));
    }

    let dead = () => false;

    function moveTo(target, ms) {
      const from = { x: pos.x, y: pos.y };
      const start = performance.now();
      return new Promise((resolve) => {
        function tick(now) {
          if (dead()) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / ms);
          const e = easeOut(t);
          put({ x: lerp(from.x, target.x, e), y: lerp(from.y, target.y, e) });
          if (t < 1) raf = requestAnimationFrame(tick);
          else resolve();
        }
        raf = requestAnimationFrame(tick);
      });
    }

    async function play() {
      const my = ++gen;
      dead = () => my !== gen;

      if (reduce.matches) {
        setSel(100);
        setPhase("pick");
        setShowStat(true);
        return;
      }

      while (my === gen) {
        setPhase("idle");
        setSel(0);
        setHsv(HSV0);
        setShowStat(false);
        put({ x: 0, y: 0 }, { on: false, down: false });
        await later(320);
        if (dead()) return;

        setPhase("drag");
        const card = cardRef.current;
        const a = sceneXY(card, 0.04, 0.06);
        put(a, { on: true, down: true });
        const start = performance.now();
        await new Promise((resolve) => {
          function tick(now) {
            if (dead()) {
              resolve();
              return;
            }
            const t = Math.min(1, (now - start) / 880);
            const e = easeOut(t);
            setSel(e * 100);
            put(sceneXY(card, e * 0.96, e * 0.94), { on: true, down: true });
            if (t < 1) raf = requestAnimationFrame(tick);
            else resolve();
          }
          raf = requestAnimationFrame(tick);
        });
        if (dead()) return;
        put(sceneXY(card, 0.96, 0.94), { down: false });
        setPhase("card");
        await later(480);
        if (dead()) return;

        setPhase("pick");
        const hueEl = hueRef.current;
        const svEl = svRef.current;
        await moveTo(sceneXY(hueEl, HSV0.h / 360, 0.5), 520);
        if (dead()) return;
        put(pos, { down: true });
        await later(80);
        const hFrom = HSV0.h;
        const hTo = 268;
        const hueStart = performance.now();
        await new Promise((resolve) => {
          function tick(now) {
            if (dead()) {
              resolve();
              return;
            }
            const t = Math.min(1, (now - hueStart) / 980);
            const e = easeOut(t);
            const h = lerp(hFrom, hTo, e);
            setHsv((cur) => ({ ...cur, h }));
            put(sceneXY(hueEl, h / 360, 0.5), { down: true });
            if (t < 1) raf = requestAnimationFrame(tick);
            else resolve();
          }
          raf = requestAnimationFrame(tick);
        });
        if (dead()) return;
        put(pos, { down: false });
        await later(180);

        const sTo = 0.72;
        const vTo = 0.82;
        const sFrom = HSV0.s;
        const vFrom = HSV0.v;
        // 先飞到取色环当前位置再按下拖动；直接飞终点会在按下瞬间跳回起点（闪动）
        await moveTo(sceneXY(svEl, sFrom, 1 - vFrom), 420);
        if (dead()) return;
        put(pos, { down: true });
        await later(70);
        const svStart = performance.now();
        await new Promise((resolve) => {
          function tick(now) {
            if (dead()) {
              resolve();
              return;
            }
            const t = Math.min(1, (now - svStart) / 860);
            const e = easeOut(t);
            const s = lerp(sFrom, sTo, e);
            const v = lerp(vFrom, vTo, e);
            setHsv((cur) => ({ ...cur, s, v }));
            put(sceneXY(svEl, s, 1 - v), { down: true });
            if (t < 1) raf = requestAnimationFrame(tick);
            else resolve();
          }
          raf = requestAnimationFrame(tick);
        });
        if (dead()) return;
        put(pos, { down: false });
        setShowStat(true);
        await later(1800);
      }
    }

    if (typeof IntersectionObserver === "undefined") {
      play();
      return () => {
        gen += 1;
        if (raf) cancelAnimationFrame(raf);
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          play();
        } else {
          gen += 1;
          if (raf) cancelAnimationFrame(raf);
          timers.splice(0).forEach((id) => window.clearTimeout(id));
        }
      },
      { threshold: 0.28 }
    );
    io.observe(wrap);

    return () => {
      gen += 1;
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      io.disconnect();
    };
  }, []);

  return (
    <div className="feature-visual rt-dom-stage-wrap rt-portal-wrap" ref={wrapRef}>
      <div className="feature-stage is-active" data-theme="branded" style={{ ["--fx-c"]: 1 }}>
        <div className="feature-stage-art rt-portal-scene" ref={sceneRef}>
          <figure className="rt-portal-photo">
            <img
              src="https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt=""
              width="1400"
              height="900"
              decoding="async"
            />
            <article className="rt-portal-mail">
              <span className="rt-portal-mail-badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="3.5" y="6" width="17" height="12.5" rx="2" stroke="#fff" strokeWidth="1.6" />
                  <path d="M4.2 7.2L12 13.1l7.8-5.9" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="rt-portal-mail-head">
                <i />
                <div>
                  <span>
                    From: <em />
                  </span>
                  <span>
                    To: <em />
                  </span>
                </div>
              </div>
              <strong>It's time to return your items</strong>
              <p>
                <i />
                <i />
                <i />
                <i />
              </p>
              <button type="button">View return details</button>
            </article>
          </figure>

          <div className={`rt-portal-search-wrap is-${phase}`} ref={cardRef}>
            <div
              className="rt-portal-marquee"
              style={{ width: `${sel}%`, height: `${sel}%` }}
              aria-hidden="true"
            />
            <SelectFrame />
            <div className={`rt-portal-search${phase === "card" || phase === "pick" ? " is-in" : ""}`}>
              <strong>Return center</strong>
              <div className="rt-portal-search-row">
                <span className="rt-portal-search-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M6 18.2c1.4-2.2 3.5-3.4 6-3.4s4.6 1.2 6 3.4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div className="rt-portal-fields">
                  <span>Order number</span>
                  <span>Email</span>
                </div>
              </div>
              <button type="button" style={{ background: hex }}>
                Search
              </button>
            </div>
          </div>

          <div className="rt-portal-pick-wrap">
            <div className="rt-portal-picker">
              <header>
                <strong>Color picker</strong>
                <span aria-hidden="true">×</span>
              </header>
              <div
                className="rt-portal-sv"
                ref={svRef}
                style={{ ["--hue"]: hueColor }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  pickSv(e);
                }}
                onPointerMove={(e) => {
                  if (e.buttons) pickSv(e);
                }}
              >
                <i style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} />
              </div>
              <div className="rt-portal-pick-tools">
                <em className="rt-portal-drop" style={{ background: hex }} aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10.2 2.4l3.4 3.4-7.3 7.3H2.9v-3.4l7.3-7.3z"
                      stroke="#fff"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                  </svg>
                </em>
                <button
                  type="button"
                  className="rt-portal-hue"
                  ref={hueRef}
                  aria-label="Hue"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    pickHue(e);
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons) pickHue(e);
                  }}
                >
                  <i style={{ left: `${(hsv.h / 360) * 100}%` }} />
                </button>
              </div>
              <div className="rt-portal-vals">
                <label>
                  HEX
                  <b>{hex}</b>
                </label>
                <label>
                  R<b>{r}</b>
                </label>
                <label>
                  G<b>{g}</b>
                </label>
                <label>
                  B<b>{b}</b>
                </label>
              </div>
            </div>
          </div>

          <span
            className={`rt-portal-scene-mouse${mouse.on ? " is-on" : ""}${mouse.down ? " is-down" : ""}`}
            style={{ ["--x"]: `${mouse.x}px`, ["--y"]: `${mouse.y}px` }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5.2 3.4l12.8 11.2-6.05.35 3.7 6.85-2.35 1.25-3.75-6.9-4.35 4.15z"
                fill="#111827"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className={`rt-portal-ltv${showStat ? " is-in" : ""}`}>
            <strong>3.5x</strong>
            <span>Customer LTV</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const WF_RULES = [
  {
    n: 1,
    title: "10% handling fee for items ≥$15",
    meta: "ID:101  ·  Item value rule",
    when: "Value ≥ $15",
    then: "Add 10% fee",
  },
  {
    n: 2,
    title: "Auto-process for quality issues",
    meta: "ID:102  ·  Quality exception",
    when: "Reason = Quality",
    then: "Auto approve",
  },
  {
    n: 3,
    title: "Unshipped orders: Auto approval",
    meta: "ID:103  ·  Pre-fulfillment",
    when: "Status = Unshipped",
    then: "Instant refund",
  },
];

const WF_PILLS = [
  "Auto refund under $20",
  "Auto-confirm receipt in 7 days",
  "Service fee for items over $100",
  "Workflow vs general settings",
];

function WorkflowBot() {
  const botRef = useRef(null);

  useEffect(() => {
    const bot = botRef.current;
    if (!bot) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function tick() {
      raf = 0;
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      bot.style.setProperty("--ex", `${cx.toFixed(2)}px`);
      bot.style.setProperty("--ey", `${cy.toFixed(2)}px`);
      if (Math.abs(tx - cx) > 0.04 || Math.abs(ty - cy) > 0.04) {
        raf = requestAnimationFrame(tick);
      }
    }

    function onMove(e) {
      const r = bot.getBoundingClientRect();
      const ox = r.left + r.width * 0.5;
      const oy = r.top + r.height * 0.52;
      tx = Math.max(-4.2, Math.min(4.2, (e.clientX - ox) / 24));
      ty = Math.max(-2.6, Math.min(2.6, (e.clientY - oy) / 32));
      if (!raf) raf = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="rt-wf-bot" ref={botRef} aria-hidden="true">
      <div className="rt-wf-bot-fig">
        <span className="rt-wf-bot-head">
          <i className="rt-wf-bot-shine" />
          <span className="rt-wf-bot-visor">
            <span className="rt-wf-bot-face">
              <i className="rt-wf-bot-glass" />
              <i className="rt-wf-bot-eye is-l" />
              <i className="rt-wf-bot-eye is-r" />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}

/** 1 · AI workflows */
export function DomStageAi() {
  const wrapRef = useRef(null);
  const sceneRef = useRef(null);
  const [pill, setPill] = useState(-1);
  const [typed, setTyped] = useState("");
  const [caret, setCaret] = useState(true);
  const [sending, setSending] = useState(false);
  const [ready, setReady] = useState(0);
  const [note, setNote] = useState("");
  const [showStat, setShowStat] = useState(false);
  useFeatureFit(sceneRef, "ai");

  useEffect(() => {
    const id = window.setInterval(() => setCaret((on) => !on), 460);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let gen = 0;
    const timers = [];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function later(ms) {
      return new Promise((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });
    }

    async function play() {
      const my = ++gen;
      if (reduce.matches) {
        setTyped(WF_RULES[2].title);
        setReady(WF_RULES.length);
        setNote(`Created · ${WF_RULES[2].title}`);
        setPill(2);
        setShowStat(true);
        return;
      }

      while (my === gen) {
        setTyped("");
        setReady(0);
        setSending(false);
        setNote("");
        setPill(-1);
        setShowStat(false);
        await later(480);
        if (my !== gen) return;

        for (let i = 0; i < WF_RULES.length; i += 1) {
          const text = WF_RULES[i].title;
          setPill(Math.min(i, WF_PILLS.length - 1));
          setNote("");
          for (let c = 1; c <= text.length; c += 1) {
            setTyped(text.slice(0, c));
            await later(text[c - 1] === " " ? 56 : 24);
            if (my !== gen) return;
          }
          await later(260);
          if (my !== gen) return;
          setSending(true);
          await later(240);
          if (my !== gen) return;
          setReady(i + 1);
          setNote(`Created · ${WF_RULES[i].title}`);
          await later(160);
          setSending(false);
          await later(220);
          setTyped("");
          await later(380);
          if (my !== gen) return;
        }

        setShowStat(true);
        await later(2600);
      }
    }

    if (typeof IntersectionObserver === "undefined") {
      play();
      return () => {
        gen += 1;
        timers.forEach((id) => window.clearTimeout(id));
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          play();
        } else {
          gen += 1;
          timers.splice(0).forEach((id) => window.clearTimeout(id));
        }
      },
      { threshold: 0.35 }
    );
    io.observe(wrap);

    return () => {
      gen += 1;
      timers.forEach((id) => window.clearTimeout(id));
      io.disconnect();
    };
  }, []);

  return (
    <div className="feature-visual rt-dom-stage-wrap rt-wf-wrap" ref={wrapRef}>
      <div className="feature-stage is-active" data-theme="notify" style={{ ["--fx-c"]: 1 }}>
        <div className={`feature-stage-art rt-wf-scene${ready > 0 ? " is-split" : ""}`} ref={sceneRef}>
          <div className="rt-wf-panel-wrap">
            <div className="rt-wf-panel">
              <header className="rt-wf-head">
                <span className="rt-wf-brand">
                  <SparkleIcon />
                  AI Assistant
                </span>
                <em>Beta</em>
                <span className="rt-wf-head-spacer" />
                <span className="rt-wf-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="5.2" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M8 5.2V8l1.8 1.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <span className="rt-wf-icon is-close" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M4.4 4.4l7.2 7.2M11.6 4.4l-7.2 7.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </header>

              <WorkflowBot />

              <h3>Good morning, how can I help you?</h3>
              <p>
                {note ? (
                  <em className="rt-wf-note">{note}</em>
                ) : (
                  "Describe your scenario, or click a shortcut action."
                )}
              </p>

              <div className="rt-wf-pills">
                {WF_PILLS.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    className={pill === i ? "is-on" : undefined}
                    onClick={() => setPill(i)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className={`rt-wf-composer${sending ? " is-sending" : ""}`}>
                <span>
                  {typed ? <em className="rt-wf-typed">{typed}</em> : "Describe your needs"}
                  <i className={`rt-wf-caret${caret && !sending ? " is-on" : ""}`} />
                </span>
                <b className={typed || sending ? "is-on" : undefined} aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M8 11.4V4.6M5.2 7.2L8 4.4l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </b>
              </div>
            </div>
          </div>

          <div className="rt-wf-rules">
            {WF_RULES.map((rule, i) => (
              <article className={`rt-wf-rule${ready > i ? " is-in" : ""}`} key={rule.title}>
                <span className="rt-wf-rule-mark" aria-hidden="true">
                  <SparkleIcon />
                </span>
                <span className="rt-wf-drag" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <b>{rule.n}</b>
                <div>
                  <strong>{rule.title}</strong>
                  <span>{rule.meta}</span>
                  <em>
                    <i>When</i>
                    {rule.when}
                    <i>Then</i>
                    {rule.then}
                  </em>
                </div>
              </article>
            ))}
          </div>

          <div className={`rt-wf-stat${showStat ? " is-in" : ""}`}>
            <strong>−80%</strong>
            <span>Support Workload</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RvClose() {
  return (
    <span className="rt-rv-close" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function RvInfo() {
  return (
    <svg className="rt-rv-info" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7.2V11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="5.2" r="0.8" fill="currentColor" />
    </svg>
  );
}

function RvBolt() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6.8 1.2L2.6 6.6h3l-.8 4.2 4.4-5.6h-3L6.8 1.2z" fill="currentColor" />
    </svg>
  );
}

function RvSwap() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 6.2h10.2M11.6 3.6L14.4 6.2 11.6 8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11.8H3.8M6.4 9.2L3.6 11.8 6.4 14.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RvCreditMark() {
  return (
    <span className="rt-rv-coin" aria-hidden="true">
      <svg viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 5.2v7.6M7.1 6.6c.5-.7 1.2-1 1.9-1 .9 0 1.7.5 1.7 1.4 0 2.1-3.6 1.1-3.6 3.1 0 .9.8 1.5 1.9 1.5.8 0 1.5-.3 2-.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** 2 · Revenue recovery — keep / credit / exchange collage */
export function DomStageRecovery() {
  const wrapRef = useRef(null);
  const sceneRef = useRef(null);
  const acceptRef = useRef(null);
  const xAcceptRef = useRef(null);
  const [phase, setPhase] = useState("offer");
  const [grown, setGrown] = useState(false);
  const [secs, setSecs] = useState(30);
  const [mouse, setMouse] = useState({ x: 28, y: 36, on: false, down: false });
  useFeatureFit(sceneRef, "recovery");

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    let gen = 0;
    let raf = 0;
    const timers = [];
    const pos = { x: 28, y: 36 };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function later(ms) {
      return new Promise((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });
    }

    let isDead = () => false;

    function put(p, extra = {}) {
      pos.x = p.x;
      pos.y = p.y;
      setMouse((m) => ({ ...m, x: p.x, y: p.y, ...extra }));
    }

    function sceneXY(el, fx, fy) {
      const scene = sceneRef.current;
      if (!scene || !el) return { ...pos };
      const sr = scene.getBoundingClientRect();
      const r0 = el.getBoundingClientRect();
      // ≤768 stage 被 scale(--fts)，rect 差值是屏幕像素，除回缩放比（--fts 在 media 上，同 Portal）
      const s = parseFloat(scene.closest(".rt-feature-media")?.style.getPropertyValue("--fts")) || 1;
      return {
        x: (r0.left - sr.left + r0.width * fx) / s,
        y: (r0.top - sr.top + r0.height * fy) / s,
      };
    }

    function moveTo(target, ms) {
      const from = { x: pos.x, y: pos.y };
      const start = performance.now();
      return new Promise((resolve) => {
        function tick(now) {
          if (isDead()) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / ms);
          const e = 1 - (1 - t) * (1 - t);
          put({
            x: from.x + (target.x - from.x) * e,
            y: from.y + (target.y - from.y) * e,
          });
          if (t < 1) raf = requestAnimationFrame(tick);
          else resolve();
        }
        raf = requestAnimationFrame(tick);
      });
    }

    async function play() {
      const my = ++gen;
      isDead = () => my !== gen;

      if (reduce.matches) {
        setGrown(true);
        setPhase("done");
        setSecs(30);
        return;
      }

      setPhase("offer");
      setGrown(false);
      setSecs(30);
      put({ x: 72, y: 90 }, { on: false, down: false });
      await later(520);
      if (isDead()) return;

      setPhase("tick");
      for (let n = 30; n >= 2; n -= 2) {
        setSecs(n);
        await later(55);
        if (isDead()) return;
      }
      setSecs(1);

      const accept = acceptRef.current;
      put(sceneXY(accept, 0.18, 0.35), { on: true, down: false });
      await moveTo(sceneXY(accept, 0.7, 0.55), 500);
      if (isDead()) return;
      put(pos, { down: true });
      setPhase("hit");
      await later(150);
      if (isDead()) return;
      put(pos, { down: false });

      setPhase("credit");
      await later(520);
      if (isDead()) return;

      setPhase("xchg");
      const xAccept = xAcceptRef.current;
      await moveTo(sceneXY(xAccept, 0.64, 0.55), 620);
      if (isDead()) return;
      put(pos, { down: true });
      await later(150);
      if (isDead()) return;
      put(pos, { down: false });
      await later(280);
      if (isDead()) return;
      setPhase("grow");
      await later(3600);
      if (isDead()) return;
      setGrown(true);
      setPhase("done");
    }

    if (typeof IntersectionObserver === "undefined") {
      play();
      return () => {
        gen += 1;
        timers.forEach((id) => window.clearTimeout(id));
        if (raf) cancelAnimationFrame(raf);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          play();
        } else {
          gen += 1;
          timers.splice(0).forEach((id) => window.clearTimeout(id));
          if (raf) cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(wrap);

    return () => {
      gen += 1;
      timers.forEach((id) => window.clearTimeout(id));
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const later = phase === "credit" || phase === "xchg" || phase === "grow" || phase === "done";

  return (
    <div className="feature-visual rt-dom-stage-wrap rt-rv-wrap" ref={wrapRef}>
      <div className="feature-stage is-active" data-theme="recover" style={{ ["--fx-c"]: 1 }}>
        <div className={`feature-stage-art rt-rv-scene is-${phase}${grown ? " is-grown" : ""}`} ref={sceneRef} aria-hidden="true">
          <svg className="rt-rv-curve" viewBox="0 0 640 480" preserveAspectRatio="xMaxYMax meet">
            <defs>
              <linearGradient id="rt-rv-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.34" />
                <stop offset="42%" stopColor="#14b8a6" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="rt-rv-stroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.2" />
                <stop offset="40%" stopColor="#14b8a6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path
              className="rt-rv-curve-fill"
              d="M 18 368 C 140 358, 228 312, 308 230 S 468 102, 608 78 L 640 480 L 0 480 Z"
            />
            <path
              className="rt-rv-curve-line"
              d="M 18 368 C 140 358, 228 312, 308 230 S 468 102, 608 78"
              pathLength="180"
            />
            <circle className="rt-rv-curve-dot" cx="608" cy="78" r="5" />
          </svg>

          <div className="rt-rv-col is-left">
            <article className="rt-rv-keep">
              <header className="rt-rv-modal-head">
                <div>
                  <strong>Keep your item</strong>
                  <p>The merchant proposes a refund of $20. If still usable, we offer a keep incentive.</p>
                </div>
                <RvClose />
              </header>

              <div className="rt-rv-keep-slot" />

              <div className="rt-rv-refund">
                <div className="rt-rv-refund-top">
                  <b>
                    $20.00 <em>USD</em>
                  </b>
                  <span className="rt-rv-pill">
                    <RvBolt />
                    Instant Refund
                  </span>
                </div>
                <p>
                  Retained goods, compensation amount
                  <RvInfo />
                </p>
              </div>

              <div className="rt-rv-actions">
                <span className="rt-rv-btn">Return Anyway</span>
                <span className={`rt-rv-btn is-dark${phase === "hit" || later ? " is-hit" : ""}`} ref={acceptRef}>
                  Accept Refund $20
                  <em className={phase === "tick" || phase === "offer" || phase === "hit" ? "is-on" : ""}>
                    Expire in {secs}s
                  </em>
                </span>
              </div>
            </article>

            <article className="rt-rv-credit">
              <div className="rt-rv-credit-top">
                <b>
                  $20.00 <em>USD</em>
                </b>
                <span className="rt-rv-credit-tag">
                  <RvCreditMark />
                  Store credit
                </span>
              </div>
              <p>
                Credits can offset future purchases.
                <RvInfo />
              </p>
            </article>
          </div>

          <div className="rt-rv-col is-right">
            <div className="rt-rv-stat">
              <strong>20%+</strong>
              <span>Revenue Recovery Rate</span>
            </div>

            <article className="rt-rv-xchg">
              <header className="rt-rv-modal-head">
                <div>
                  <strong>Try an exchange?</strong>
                  <p>As a valued customer, we&apos;d like to offer you an exchange option.</p>
                </div>
                <RvClose />
              </header>
              <div className="rt-rv-switch">
                <RvSwap />
                Switch to exchange
              </div>
              <div className="rt-rv-actions">
                <span className="rt-rv-btn">Return Anyway</span>
                <span className={`rt-rv-btn is-dark${phase === "done" ? " is-hit" : ""}`} ref={xAcceptRef}>
                  Accept
                </span>
              </div>
            </article>
          </div>

          <span
            className={`rt-rv-mouse${mouse.on ? " is-on" : ""}${mouse.down ? " is-down" : ""}`}
            style={{ ["--x"]: `${mouse.x}px`, ["--y"]: `${mouse.y}px` }}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5.2 3.4l12.8 11.2-6.05.35 3.7 6.85-2.35 1.25-3.75-6.9-4.35 4.15z"
                fill="#111827"
                stroke="#fff"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

const RATE_CARDS = [
  {
    id: "usps",
    name: "USPS",
    service: "Ground Advantage",
    price: "$15.00",
    was: "$18.75",
    save: "Saved -20%",
    logo: "usps",
  },
  {
    id: "fedex",
    name: "FedEx",
    service: "Ground",
    price: "$16.88",
    was: "$21.10",
    save: "Saved -20%",
    logo: "fedex",
  },
  {
    id: "ups",
    name: "UPS",
    service: "Ground",
    price: "$17.50",
    was: "$21.88",
    save: "Saved -20%",
    logo: "ups",
  },
];

function CarrierLogo({ kind }) {
  const src =
    kind === "usps"
      ? "/assets/carriers/usps.svg"
      : kind === "ups"
        ? "/assets/carriers/ups.svg"
        : "/assets/carriers/fedex.png";
  return (
    <span className={`rt-rate-logo is-${kind}`} aria-hidden="true">
      <img src={src} alt="" />
    </span>
  );
}

/** Inline SVG barcode — preserveAspectRatio none 保证横向铺满 */
function ShipBarcode() {
  const pattern = [
    3, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1, 1, 2, 3, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 3, 1, 1, 2, 1, 1,
    1, 3, 1, 1, 2, 1, 1, 2, 1, 3, 1, 1, 1, 1, 2, 1, 1, 3, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1, 1, 1, 2, 1, 2, 1, 1, 3, 1, 1, 2,
    1, 1, 1, 2, 3, 1, 1, 1, 2, 1, 1, 1, 3, 1, 2, 1, 1, 2, 1, 1, 1, 3, 1, 1, 2, 1, 3, 1, 1, 1, 2, 1, 1, 2, 1, 1, 3, 1, 1,
    1, 2, 1, 2, 1, 1, 1, 3, 1, 1, 2, 1, 3, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 3, 2, 1, 1, 1, 2, 1, 1, 3, 1, 1, 2, 1, 1,
  ];
  const quiet = 2;
  const units = pattern.reduce((s, w) => s + w, 0);
  const total = units + quiet * 2;
  let x = quiet;
  const bars = [];
  for (let i = 0; i < pattern.length; i += 1) {
    const w = pattern[i];
    if (i % 2 === 0) {
      bars.push(<rect key={i} x={x} y={0} width={w} height={40} fill="#111" />);
    }
    x += w;
  }
  return (
    <svg
      className="rt-ship-barcode"
      viewBox={`0 0 ${total} 40`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="100%" height="100%" fill="#fff" />
      {bars}
    </svg>
  );
}

/** Mini data-matrix style mark (DOM cells, not an image) */
function ShipMatrix() {
  // 10×10 finder-ish pattern for a printed postage IMpb look
  const cells =
    "1111111111" +
    "1000000001" +
    "1011011011" +
    "1010100101" +
    "1001111011" +
    "1010000101" +
    "1011101101" +
    "1001010001" +
    "1010110111" +
    "1111111111";
  return (
    <div className="rt-ship-matrix" aria-hidden="true">
      {cells.split("").map((bit, i) => (
        <i key={i} className={bit === "1" ? "is-on" : undefined} />
      ))}
    </div>
  );
}

/** 3 · Multi-carrier rates — big label + floating glass rate cards */
export function DomStageCarriers() {
  const sceneRef = useRef(null);
  useFeatureFit(sceneRef, "carriers");

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-live");
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.add("is-live");
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="feature-visual rt-dom-stage-wrap rt-carrier-wrap">
      <div className="feature-stage is-active" data-theme="carriers" style={{ ["--fx-c"]: 1 }}>
        <div className="feature-stage-art rt-carrier-scene" ref={sceneRef} aria-hidden="true">
          <div className="rt-carrier-pair">
            <div className="rt-ship-label">
            <div className="rt-ship-top rt-ship-anim" style={{ ["--d"]: 0 }}>
              <div className="rt-ship-p">P</div>
              <div className="rt-ship-postage">
                <span className="rt-ship-paid">US POSTAGE PAID</span>
                <span>Pitney Bowes</span>
                <span>05/18/07</span>
                <span>From 35464</span>
                <span>Flat Rate Box</span>
                <strong>02470007650957</strong>
              </div>
              <ShipMatrix />
            </div>
            <div className="rt-ship-banner rt-ship-anim" style={{ ["--d"]: 1 }}>
              USPS PRIORITY MAIL®
            </div>
            <div className="rt-ship-addr rt-ship-anim" style={{ ["--d"]: 2 }}>
              <div className="rt-ship-from">
                <p>
                  John Smith
                  <br />
                  Pitney Bowes
                  <br />
                  35 Waterview, MSC 26-21
                  <br />
                  Shelton CT 06484
                </p>
              </div>
              <div className="rt-ship-to">
                <p>
                  <span className="rt-ship-ship">SHIP</span> Jim Snow
                  <br />
                  <span className="rt-ship-to-k">TO:</span> Pitney Bowes
                  <br />
                  27 Waterview
                  <br />
                  Sunnyvale CA 94085
                </p>
              </div>
            </div>
            <div className="rt-ship-bottom rt-ship-anim" style={{ ["--d"]: 3 }}>
              <ShipBarcode />
              <div className="rt-ship-track">420 94085 0247 0007 6509 57</div>
              <div className="rt-ship-footer">Electronic Rate Approved #128882300</div>
            </div>
            </div>

            <div className="rt-rate-col">
            <div className="rt-carrier-stat">
              <strong>18%+</strong>
              <span>Reduce Return Shipping Costs</span>
            </div>
            <div className="rt-rate-stack">
            {RATE_CARDS.map((c, i) => (
              <div
                className="rt-rate-card"
                key={c.id}
                style={{ ["--i"]: i }}
              >
                <div className="rt-rate-card-top">
                  <div className="rt-rate-id">
                    <CarrierLogo kind={c.logo} />
                    <div className="rt-rate-meta">
                      <strong>{c.name}</strong>
                      <span>{c.service}</span>
                    </div>
                  </div>
                  <div className="rt-rate-price">
                    <b>
                      {c.price} <em>USD</em>
                    </b>
                    <div className="rt-rate-save">
                      <span className="rt-rate-pill">{c.save}</span>
                      <s>{c.was} USD</s>
                    </div>
                  </div>
                </div>
                <div className="rt-rate-time">
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M8 4.5V8l2.2 1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  Shipping time: 3-4 days
                </div>
              </div>
            ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
