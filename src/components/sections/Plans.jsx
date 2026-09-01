import { useState } from "react";
import { HERO, PLANS } from "../../content/returnsCopy.js";

/** Basic / Pro / Max — aligned Subscribe row, Max border beam */
export default function Plans() {
  /* ≤640 手机档 tab 切换（API 同款分段控件）：桌面 grid 平铺不受影响 */
  const [planIdx, setPlanIdx] = useState(0);

  return (
    <section className="rt-plans" id="returns-plans">
      <div className="rt-wrap rt-plans-inner">
        <h2 className="rt-plans-title">{PLANS.title}</h2>
        <div
          className="rt-plan-tabs"
          role="tablist"
          aria-label="Pricing plans"
          style={{ "--i": planIdx }}
        >
          <span className="rt-plan-tabs-thumb" aria-hidden="true" />
          {PLANS.items.map((plan, i) => (
            <button
              key={plan.name}
              type="button"
              role="tab"
              aria-selected={i === planIdx}
              className={i === planIdx ? "is-active" : ""}
              onClick={() => setPlanIdx(i)}
            >
              {plan.name}
            </button>
          ))}
        </div>
        <div className="rt-plans-grid">
          {PLANS.items.map((plan, i) => (
            <article
              key={plan.name}
              className={`rt-plan-card${plan.recommended ? " is-recommended" : ""}${plan.name === "Basic" ? " is-basic" : ""}${i === planIdx ? " is-active" : ""}`}
            >
              {plan.recommended ? (
                <span className="rt-plan-badge">{PLANS.recommended}</span>
              ) : null}

              {/* fixed top stack so Subscribe buttons share one baseline */}
              <div className="rt-plan-top">
                <header className="rt-plan-head">
                  <h3>{plan.name}</h3>
                  <p>{plan.subtitle}</p>
                </header>

                <div className="rt-plan-price-slot">
                  {plan.price ? (
                    <>
                      <div className="rt-plan-price">
                        <strong>{plan.price}</strong>
                        <span>{plan.priceUnit}</span>
                      </div>
                      {plan.quota ? (
                        <p className="rt-plan-quota">{plan.quota}</p>
                      ) : null}
                    </>
                  ) : (
                    <div className="rt-plan-price-placeholder" aria-hidden="true" />
                  )}
                </div>

                <a
                  className={`rt-plan-subscribe${plan.recommended ? " is-primary" : ""}`}
                  href={HERO.trialHref}
                  target="_blank"
                  rel="noopener"
                >
                  {PLANS.subscribe}
                </a>
              </div>

              <div className="rt-plan-body">
                {plan.problems?.length ? (
                  <div className="rt-plan-block">
                    <h4>{plan.solve}</h4>
                    <ul>
                      {plan.problems.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="rt-plan-block">
                  <h4>{plan.rightsTitle}</h4>
                  <ul className="is-check">
                    {plan.capabilities.map((c) => (
                      <li key={c}>
                        <span className="rt-plan-check" aria-hidden="true">
                          ✓
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="rt-plans-cta">
          <a className="btn-switch" href={HERO.trialHref} target="_blank" rel="noopener">
            <span className="btn-switch-knob" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35" />
                <circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55" />
                <circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8" />
                <path d="M13 7.5L18.5 12 13 16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="btn-switch-label">{PLANS.trial}</span>
          </a>
          <a className="btn-demo" href={HERO.demoHref}>
            {PLANS.demo}
          </a>
        </div>
      </div>
    </section>
  );
}
