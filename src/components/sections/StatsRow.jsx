import { useCallback, useEffect, useId, useRef, useState } from "react";
import { STATS, STATS_HEAD } from "../../content/returnsCopy.js";

/** easeOutExpo — crisp settle on the final digit */
function easeOutExpo(t) {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Count from 0 → target while `active`. Restarts every hover enter.
 * Returns formatted display string using `format(n)`.
 */
function useCountOnHover(target, active, format, duration = 980) {
  const [text, setText] = useState(() => format(target));
  const rafRef = useRef(0);
  const startRef = useRef(0);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);

    if (!active) {
      setText(format(target));
      return undefined;
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setText(format(target));
      return undefined;
    }

    startRef.current = performance.now();
    setText(format(0));

    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const n = target * easeOutExpo(t);
      setText(format(n));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setText(format(target));
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, format, duration]);

  return text;
}

function formatPercentPlus(n) {
  return `${Math.round(n)}%+`;
}

function formatPercent(n) {
  return `${Math.round(n)}%`;
}

function formatSevenTwentyFour(n) {
  return `${Math.round(n)}×24h`;
}

/* ─── Illustrations ─────────────────────────────────────────────── */

/**
 * Q1 growth curve — 左下角贴底边起步，沿底缓行后上扬至右上。
 * 描边用真实 path 长度 + 直接写 strokeDash*，不用 pathLength / non-scaling-stroke（会画不完）。
 */
const Q1_PATH =
  "M 0 260 C 36 260, 72 259, 110 256 C 155 250, 185 230, 215 195 C 250 150, 285 100, 325 55 C 355 25, 380 8, 400 2";

const Q1_AREA = `${Q1_PATH} L 400 260 L 0 260 Z`;
const Q1_DUR = 1.25;

function IlluSpark({ active, runId, uid }) {
  const measureRef = useRef(null);
  const lineRef = useRef(null);
  const lenRef = useRef(0);
  const [lead, setLead] = useState({ x: 100, y: 0.77 });
  const [revealW, setRevealW] = useState(400);

  const measureLen = useCallback(() => {
    const path = measureRef.current;
    if (!path) return 0;
    const len = path.getTotalLength();
    if (len > 0) lenRef.current = len;
    return lenRef.current;
  }, []);

  /** p∈[0,1]：同时更新描边 dash、圆点、面积揭开宽度 */
  const applyProgress = useCallback(
    (progress) => {
      const p = Math.max(0, Math.min(1, progress));
      const path = measureRef.current;
      const line = lineRef.current;
      const len = measureLen() || (path ? path.getTotalLength() : 0);
      if (!len) return;

      // 直接写 SVG 属性，避免 React style + pathLength 不同步
      if (line) {
        line.setAttribute("stroke-dasharray", String(len));
        // 终点强制 0，消除浮点残差「差一截」
        line.setAttribute("stroke-dashoffset", p >= 0.999 ? "0" : String(len * (1 - p)));
      }

      const pt = path.getPointAtLength(p * len);
      setLead({ x: (pt.x / 400) * 100, y: (pt.y / 260) * 100 });
      setRevealW(p >= 0.999 ? 400 : Math.max(2, pt.x + 10));
    },
    [measureLen]
  );

  useEffect(() => {
    // 挂载后量长度并画满
    const id = requestAnimationFrame(() => applyProgress(1));
    return () => cancelAnimationFrame(id);
  }, [applyProgress]);

  useEffect(() => {
    if (!active) {
      applyProgress(1);
      return undefined;
    }
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      applyProgress(1);
      return undefined;
    }

    const start = performance.now();
    const dur = Q1_DUR * 1000;
    let raf = 0;
    applyProgress(0);

    const tick = (now) => {
      const raw = Math.min(1, (now - start) / dur);
      // 用平滑但不拖尾的 ease，最后一帧强制 1
      const e = raw >= 1 ? 1 : 1 - Math.pow(1 - raw, 3);
      applyProgress(e);
      if (raw < 1) raf = requestAnimationFrame(tick);
      else applyProgress(1);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, runId, applyProgress]);

  return (
    <div className={`rt-illu rt-illu-spark${active ? " is-run" : ""}`} aria-hidden="true">
      <svg className="rt-spark-svg" viewBox="0 0 400 260" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${uid}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${uid}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="55%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <clipPath id={`${uid}-reveal`} clipPathUnits="userSpaceOnUse">
            <rect x="0" y="0" height="260" width={revealW} />
          </clipPath>
        </defs>

        <g className="rt-spark-grid">
          {[70, 120, 170, 220].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} />
          ))}
        </g>

        {/* 不可见测量路径 */}
        <path ref={measureRef} d={Q1_PATH} fill="none" stroke="none" />

        <g clipPath={`url(#${uid}-reveal)`}>
          <path className="rt-spark-area" fill={`url(#${uid}-fill)`} d={Q1_AREA} />
        </g>

        <path
          ref={lineRef}
          className="rt-spark-line"
          d={Q1_PATH}
          fill="none"
          stroke={`url(#${uid}-stroke)`}
        />
      </svg>

      <span
        className={`rt-spark-lead-el${active ? " is-run" : ""}`}
        style={{ left: `${lead.x}%`, top: `${lead.y}%` }}
      />
    </div>
  );
}

const BAR_HEIGHTS = [0.28, 0.42, 0.55, 0.68, 0.82, 1];

function IlluBars({ uid }) {
  return (
    <div className="rt-illu rt-illu-bars" aria-hidden="true">
      {/* 右侧多留白，避免柱顶贴容器边出现竖线 */}
      <svg viewBox="0 0 180 200" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id={`${uid}-bar`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#14b8a6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
          </linearGradient>
        </defs>
        {BAR_HEIGHTS.map((h, i) => {
          const maxH = 168;
          const bh = maxH * h;
          const x = 8 + i * 24;
          const y = 192 - bh;
          /* 越靠右越淡，避免右侧出现硬边 */
          const op = 1 - (i / (BAR_HEIGHTS.length - 1)) * 0.35;
          return (
            <g
              key={i}
              className={`rt-bar-col c${i}`}
              style={{ ["--i"]: i, opacity: op }}
            >
              <rect
                className="rt-bar-rect"
                x={x}
                y={y}
                width="15"
                height={bh}
                rx="3"
                fill={`url(#${uid}-bar)`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function IlluClock({ active, runId, uid }) {
  return (
    <div className="rt-illu rt-illu-clock" aria-hidden="true">
      <svg viewBox="0 0 140 140">
        <defs>
          <linearGradient id={`${uid}-arc`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#0d9488" />
          </linearGradient>
          <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle className="rt-clock-pulse p-a" cx="70" cy="70" r="54" />
        <circle className="rt-clock-pulse p-b" cx="70" cy="70" r="54" />

        <circle className="rt-clock-face" cx="70" cy="70" r="48" />
        <circle className="rt-clock-face-in" cx="70" cy="70" r="40" />

        <g className="rt-clock-ticks">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const r0 = i % 3 === 0 ? 36 : 38;
            const r1 = 44;
            return (
              <line
                key={i}
                className={i % 3 === 0 ? "major" : "minor"}
                x1={70 + Math.cos(a) * r0}
                y1={70 + Math.sin(a) * r0}
                x2={70 + Math.cos(a) * r1}
                y2={70 + Math.sin(a) * r1}
              />
            );
          })}
        </g>

        <circle
          className="rt-clock-arc"
          cx="70"
          cy="70"
          r="48"
          fill="none"
          stroke={`url(#${uid}-arc)`}
          filter={`url(#${uid}-soft)`}
        />

        <g className="rt-clock-hands" transform="translate(70 70)">
          <g className="rt-hand-h">
            <line className="rt-clock-hand-h" x1="0" y1="4" x2="0" y2="-22" />
            {active ? (
              <animateTransform
                key={`h-${runId}`}
                attributeName="transform"
                type="rotate"
                from="-40"
                to="55"
                dur="1.15s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.22 0.61 0.36 1"
                keyTimes="0;1"
              />
            ) : null}
          </g>
          <g className="rt-hand-m">
            <line className="rt-clock-hand-m" x1="0" y1="6" x2="0" y2="-32" />
            {active ? (
              <animateTransform
                key={`m-${runId}`}
                attributeName="transform"
                type="rotate"
                from="20"
                to="210"
                dur="1.05s"
                fill="freeze"
                calcMode="spline"
                keySplines="0.22 0.61 0.36 1"
                keyTimes="0;1"
              />
            ) : null}
          </g>
          <g className="rt-hand-s">
            <line className="rt-clock-hand-s" x1="0" y1="8" x2="0" y2="-36" />
            {active ? (
              <animateTransform
                key={`s-${runId}`}
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="1.4s"
                repeatCount="indefinite"
              />
            ) : null}
          </g>
          <circle className="rt-clock-hub" r="3.8" />
          <circle className="rt-clock-hub-dot" r="1.6" />
        </g>
      </svg>
    </div>
  );
}

/* ─── Cell ──────────────────────────────────────────────────────── */

function StatCell({ stat, index, active, runId, onEnter, onLeave }) {
  const uid = useId().replace(/:/g, "");
  const kind = stat.kind;

  const format = useCallback(
    (n) => {
      if (kind === "wide") return formatSevenTwentyFour(n);
      if (kind === "meter") return formatPercent(n);
      return formatPercentPlus(n);
    },
    [kind]
  );

  const target =
    kind === "wide" ? 7 : kind === "meter" ? stat.fill ?? 80 : parseInt(stat.value, 10) || 0;

  const display = useCountOnHover(target, active, format);

  return (
    <article
      className={`rt-quad-cell q${index + 1} is-${kind}${active ? " is-hover" : ""}`}
      role="listitem"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {kind === "spark" && <IlluSpark active={active} runId={runId} uid={uid} />}
      {kind === "big" && <IlluBars uid={uid} />}
      {kind === "wide" && <IlluClock active={active} runId={runId} uid={uid} />}
      {/* Q4 只用底部进度条，不再叠圆环装饰 */}

      <div className="rt-bento-top">
        <span className="rt-bento-label">{stat.label}</span>
        {stat.tag ? <span className="rt-bento-tag">{stat.tag}</span> : null}
      </div>

      <div className="rt-bento-main">
        <strong className="rt-bento-value" aria-label={stat.value}>
          {display}
        </strong>
        {stat.hint ? <span className="rt-bento-hint">{stat.hint}</span> : null}
        {stat.kicker || stat.points?.length ? (
          <div className="rt-quad-tags">
            {stat.kicker ? (
              <span className="rt-bento-process-sub">{stat.kicker}</span>
            ) : null}
            {stat.points?.length ? (
              <ul className="rt-quad-chips">
                {stat.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {kind === "meter" ? (
        <div className="rt-bento-meter" aria-hidden="true">
          <div className="rt-bento-meter-track">
            <div
              className="rt-bento-meter-fill"
              style={{ ["--fill"]: `${stat.fill ?? 80}%` }}
            />
          </div>
          <div className="rt-bento-meter-scale">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      ) : null}
    </article>
  );
}

/**
 * Four quadrants + center cross.
 * Hover: number count-up + illustration SVG animation.
 */
export default function StatsRow() {
  const [hover, setHover] = useState(-1);
  const [runId, setRunId] = useState(0);
  const [accentIn, setAccentIn] = useState(false);
  const headRef = useRef(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return undefined;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setAccentIn(true);
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setAccentIn(true);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setAccentIn(true);
          io.disconnect();
        }
      },
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="rt-stats" aria-label="Key metrics">
      <div className="rt-wrap rt-stats-frame">
        <header className="rt-stats-head" ref={headRef}>
          <h2 className="rt-stats-title">
            {STATS_HEAD.titleBefore}
            <span className={`rt-stats-accent${accentIn ? " is-in" : ""}`}>
              {STATS_HEAD.titleAccent}
            </span>
          </h2>
          {STATS_HEAD.lead ? (
            <p className="rt-stats-lead">{STATS_HEAD.lead}</p>
          ) : null}
        </header>
        <div
          className={`rt-quad${hover >= 0 ? ` is-hover-q${hover + 1}` : ""}`}
          role="list"
        >
          <span className="rt-quad-cross rt-quad-cross-h" aria-hidden="true" />
          <span className="rt-quad-cross rt-quad-cross-v" aria-hidden="true" />
          {/* 四片 1/4 光：只做渐隐渐显，圆心都在 + */}
          <span className="rt-quad-center-glow-q1" aria-hidden="true" />
          <span className="rt-quad-center-glow-q2" aria-hidden="true" />
          <span className="rt-quad-center-glow-q3" aria-hidden="true" />
          <span className="rt-quad-center-glow-q4" aria-hidden="true" />
          {/* 中心粗十字键 */}
          <span className="rt-quad-cross-key" aria-hidden="true">
            <span className="rt-quad-cross-key-h" />
            <span className="rt-quad-cross-key-v" />
          </span>

          {STATS.map((stat, i) => (
            <StatCell
              key={stat.label}
              stat={stat}
              index={i}
              active={hover === i}
              runId={hover === i ? runId : 0}
              onEnter={() => {
                setHover(i);
                setRunId((n) => n + 1);
              }}
              onLeave={() => setHover(-1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
