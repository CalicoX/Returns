import { useEffect, useMemo, useRef, useState } from "react";
import { HERO, ROI } from "../../content/returnsCopy.js";

function formatUsd(n) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/** Smoothly tween a number toward `target` for metric readouts */
function useTweenedNumber(target, duration = 420) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return undefined;
    }

    cancelAnimationFrame(rafRef.current);
    const from = fromRef.current;
    const delta = target - from;
    if (Math.abs(delta) < 0.5) {
      fromRef.current = target;
      setValue(target);
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const next = from + delta * easeOutCubic(t);
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else {
        fromRef.current = target;
        setValue(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

/** 视觉刻度数（与实际 step 解耦，避免 orders 出现几百格） */
const SLIDER_TICKS = 20;

function SliderField({
  label,
  value,
  min,
  max,
  step,
  prefix,
  suffix,
  onChange,
}) {
  const pct = ((Number(value) - min) / (max - min)) * 100;
  const activeTick = Math.round((clamp(pct, 0, 100) / 100) * SLIDER_TICKS);
  const [dragging, setDragging] = useState(false);

  const commit = (raw) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    onChange(clamp(n, min, max));
  };

  return (
    <label className={`rt-roi-field${dragging ? " is-dragging" : ""}`}>
      <span className="rt-roi-field-label">{label}</span>

      <div className="rt-roi-field-row">
        <div className="rt-roi-input-shell">
          {prefix ? <b className="rt-roi-affix is-prefix">{prefix}</b> : null}
          <input
            className="rt-roi-num"
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => commit(e.target.value)}
          />
          {suffix ? <b className="rt-roi-affix is-suffix">{suffix}</b> : null}
        </div>
      </div>

      <div className="rt-roi-slider-wrap">
        <div className="rt-roi-slider-ticks" aria-hidden="true">
          {Array.from({ length: SLIDER_TICKS + 1 }, (_, i) => (
            <span
              key={i}
              className={`rt-roi-tick${i <= activeTick ? " is-on" : ""}${
                i % 5 === 0 ? " is-major" : ""
              }`}
            />
          ))}
        </div>
        <input
          className="rt-roi-slider"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onChange={(e) => commit(e.target.value)}
        />
      </div>
    </label>
  );
}

/** ROI 计算器 — 上结果 / 下滑杆 · 深灰主题 */
export default function RoiCalculator() {
  const [orders, setOrders] = useState(ROI.defaultOrders);
  const [aov, setAov] = useState(ROI.defaultAov);
  const [rate, setRate] = useState(ROI.defaultRate);
  const [bump, setBump] = useState(false);
  const firstPaint = useRef(true);

  const { loss, recover } = useMemo(() => {
    const o = Number(orders) || 0;
    const a = Number(aov) || 0;
    const r = Number(rate) || 0;
    const lossVal = o * (r / 100) * a * ROI.costFactor;
    return {
      loss: lossVal,
      recover: lossVal * ROI.recoveryRate,
    };
  }, [orders, aov, rate]);

  const lossTween = useTweenedNumber(loss);
  const recoverTween = useTweenedNumber(recover);

  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      return undefined;
    }
    setBump(false);
    const id = requestAnimationFrame(() => setBump(true));
    const clear = window.setTimeout(() => setBump(false), 560);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(clear);
    };
  }, [loss, recover]);

  return (
    <section className="rt-roi" id="returns-roi">
      <div className="rt-wrap">
        <div className="rt-roi-inner">
          <h2 className="rt-roi-title">
            {ROI.titleBefore}{" "}
            <span className="rt-roi-brand">{ROI.brand}</span>{" "}
            {ROI.titleAfter}
          </h2>

          <div className="rt-roi-panel">
            {/* 上：结果 */}
            <div className="rt-roi-metrics">
              <div className="rt-roi-metric">
                <span className="rt-roi-metric-label">{ROI.lossLabel}</span>
                <strong className="rt-roi-metric-value is-loss">
                  {formatUsd(lossTween)}
                </strong>
              </div>
              <div className={`rt-roi-metric is-recover${bump ? " is-bump" : ""}`}>
                <span className="rt-roi-badge">{ROI.recoveryLabel}</span>
                <span className="rt-roi-metric-label">
                  {ROI.monthlyRecoverLabel}
                </span>
                <strong className="rt-roi-metric-value is-gain">
                  {formatUsd(recoverTween)}
                </strong>
              </div>
            </div>

            {/* 下：滑杆 */}
            <div className="rt-roi-controls">
              <SliderField
                label={ROI.ordersLabel}
                value={orders}
                min={ROI.ordersMin}
                max={ROI.ordersMax}
                step={ROI.ordersStep}
                onChange={setOrders}
              />
              <SliderField
                label={ROI.aovLabel}
                value={aov}
                min={ROI.aovMin}
                max={ROI.aovMax}
                step={ROI.aovStep}
                prefix="$"
                onChange={setAov}
              />
              <SliderField
                label={ROI.rateLabel}
                value={rate}
                min={ROI.rateMin}
                max={ROI.rateMax}
                step={ROI.rateStep}
                suffix="%"
                onChange={setRate}
              />
            </div>

            <div className="rt-roi-foot">
              <div className="rt-roi-tips">
                <p>{ROI.tip1}</p>
                <p>{ROI.tip2}</p>
              </div>
              <a className="btn-demo rt-roi-cta" href={HERO.demoHref}>
                {ROI.demo}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
