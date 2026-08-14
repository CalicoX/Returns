/**
 * Returns DOM stages — same pattern as tracking feature-stage / fx-glass.
 */

import { useEffect, useRef, useState } from "react";

const HERO_PHOTO =
  "https://images.pexels.com/photos/5012078/pexels-photo-5012078.jpeg?auto=compress&cs=tinysrgb&w=1400";
const HERO_ITEMS = [
  {
    id: "set",
    name: "Olive Green Sports Set",
    meta: "Olive | xxl",
    price: "$80.00",
    qty: "x2",
    img: `${HERO_PHOTO}&h=240`,
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
      setMouse({
        x: er.left - sr.left + er.width * 0.78,
        y: er.top - sr.top + er.height * 0.55,
        on: true,
        click: false,
      });
    }

    async function clickTarget(sel, apply, my) {
      if (my !== gen) return;
      const el = stage.querySelector(sel);
      pointAt(el);
      await later(720);
      if (my !== gen) return;
      setMouse((m) => ({ ...m, click: true }));
      await later(140);
      if (my !== gen) return;
      apply();
      await later(180);
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
        await later(280);
        if (my !== gen) return;
        setStep(1);
        await later(520);
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
          await later(480);
          if (my !== gen) return;
          await clickTarget(
            '[data-demo="reason"]',
            () => {
              setReason("Arrive too late");
              setStep(3);
            },
            my
          );
          await later(480);
          if (my !== gen) return;
          await clickTarget(
            '[data-demo="method"]',
            () => {
              setMethod("green");
            },
            my
          );
          await later(2400);
          if (my !== gen) return;
          setMouse((m) => ({ ...m, on: false }));
          await later(420);
        } else {
          setItem("jacket");
          await later(700);
          if (my !== gen) return;
          setStep(2);
          setReason("Arrive too late");
          await later(700);
          if (my !== gen) return;
          setStep(3);
          setMethod("green");
          await later(2400);
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

/** 0 · Branded portal */
export function DomStagePortal() {
  return (
    <div className="feature-visual rt-dom-stage-wrap rt-portal-wrap">
      <div className="feature-stage is-active" data-theme="branded" style={{ ["--fx-c"]: 1 }}>
        <div className="feature-stage-art rt-portal-scene" aria-hidden="true">
          <figure className="rt-portal-photo">
            <img
              src="https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt=""
              width="1200"
              height="800"
              decoding="async"
            />
          </figure>

          <div className="fx-glass rt-portal-product">
            <div className="fx-illus rt-dom-illus-coat" />
            <strong>Merino Overcoat</strong>
            <span>Size M · $248</span>
          </div>

          <div className="rt-portal-dock">
            <div className="fx-glass rt-portal-brand">
              <strong>Brand experience</strong>
              <span>Custom visuals · copy · theme</span>
            </div>
            <span className="rt-label-chip">
              <b>Label</b>
              <em>Live</em>
            </span>
            <span className="rt-label-refund">
              <i aria-hidden="true">−</i>
              <em>Refund</em>
            </span>
          </div>

          <div className="fx-glass rt-portal-miles">
            <strong>9 milestones</strong>
            <div className="fx-thumb-row">
              <span className="rt-dom-pill">Submitted</span>
              <span className="rt-dom-pill">Review</span>
              <span className="rt-dom-pill is-on">Label</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 1 · AI workflows */
export function DomStageAi() {
  return (
    <div className="feature-visual rt-dom-stage-wrap">
      <div className="feature-stage is-active" data-theme="notify" style={{ ["--fx-c"]: 1 }}>
        <div className="feature-stage-art" aria-hidden="true">
          <div className="fx-glass fx-main">
            <div className="fx-chrome">
              <i />
              <i />
              <i />
              <span className="fx-url">returns · AI workflow</span>
            </div>
            <div className="fx-body">
              <div className="fx-hero-block has-photo rt-dom-photo-ai">
                <strong>Describe policy in plain language</strong>
                <span>9 triggers × 8 actions</span>
              </div>
              <div className="fx-status-grid">
                <b className="is-ok">
                  Rules<em>AI</em>
                </b>
                <b className="is-ok">
                  Approve<em>Auto</em>
                </b>
                <b className="is-on">
                  Label<em>Live</em>
                </b>
                <b>
                  Refund<em>—</em>
                </b>
              </div>
            </div>
          </div>
          <div className="fx-glass fx-float-a">
            <strong>Policy KB</strong>
            <span>"No returns after 30 days"</span>
          </div>
          <div className="fx-glass fx-float-b">
            <strong>Filter queue</strong>
            <span>Status · reason · channel</span>
          </div>
          <div className="fx-glass fx-float-c">
            <strong>−80% support load</strong>
            <span>No engineering required</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 2 · Revenue recovery */
export function DomStageRecovery() {
  return (
    <div className="feature-visual rt-dom-stage-wrap">
      <div className="feature-stage is-active is-route-on" data-theme="lastmile" style={{ ["--fx-c"]: 1 }}>
        <div className="feature-stage-art" aria-hidden="true">
          <div className="fx-route-map">
            <svg viewBox="0 0 440 220" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="rt-fx-route-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="45%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <filter id="rt-fx-route-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.2" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <path
                  id="rt-fx-route-path"
                  d="M 36 168 C 90 168, 120 120, 168 108 C 220 94, 250 140, 300 128 C 348 116, 360 72, 400 64"
                />
              </defs>
              <rect x="48" y="40" width="52" height="36" rx="6" fill="rgba(255,255,255,0.45)" />
              <rect x="180" y="28" width="70" height="28" rx="6" fill="rgba(255,255,255,0.35)" />
              <rect x="300" y="100" width="60" height="40" rx="6" fill="rgba(255,255,255,0.4)" />
              <path
                className="route-base"
                d="M 36 168 C 90 168, 120 120, 168 108 C 220 94, 250 140, 300 128 C 348 116, 360 72, 400 64"
              />
              <path
                className="route-live"
                filter="url(#rt-fx-route-glow)"
                pathLength="280"
                d="M 36 168 C 90 168, 120 120, 168 108 C 220 94, 250 140, 300 128 C 348 116, 360 72, 400 64"
                stroke="url(#rt-fx-route-grad)"
              />
              <circle className="route-node is-hub" cx="36" cy="168" r="7" />
              <circle className="route-node" cx="168" cy="108" r="5.5" />
              <circle className="route-node" cx="300" cy="128" r="5.5" />
              <circle className="route-node is-home" cx="400" cy="64" r="7" />
              <text className="route-label" x="36" y="192" textAnchor="middle">
                Request
              </text>
              <text className="route-label" x="168" y="96" textAnchor="middle">
                Offer
              </text>
              <text className="route-label" x="300" y="150" textAnchor="middle">
                Keep
              </text>
              <text className="route-label" x="400" y="52" textAnchor="middle">
                Revenue
              </text>
            </svg>
          </div>
          <div className="fx-glass fx-main">
            <div className="fx-chrome">
              <i />
              <i />
              <i />
              <span className="fx-url">returns · recovery</span>
            </div>
            <div className="fx-body">
              <div className="fx-hero-block has-photo rt-dom-photo-recover">
                <strong>Intercept before refund</strong>
                <span>Credit · points · exchange</span>
              </div>
              <div className="fx-row">
                <span className="fx-chip">
                  <i className="fx-dot is-amber" />
                  $15 credit
                </span>
                <span className="fx-chip">
                  <i className="fx-dot is-blue" />
                  Free exchange
                </span>
              </div>
            </div>
          </div>
          <div className="fx-glass fx-float-a">
            <strong>ROI dashboard</strong>
            <span>Real-time return metrics</span>
          </div>
          <div className="fx-glass fx-float-b">
            <strong>20%+ recovery rate</strong>
            <div className="fx-row">
              <span className="fx-chip">Credits</span>
              <span className="fx-chip">Exchange</span>
            </div>
          </div>
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
          {/* Gradient savings mark — no solid box */}
          <div className="rt-carrier-stat">
            <strong>18%+</strong>
            <span>Reduce Return Shipping Costs</span>
          </div>

          {/* Realistic USPS Priority Mail shipping label */}
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

          {/* Rate comparison — floats over the label, frosted glass */}
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
  );
}
