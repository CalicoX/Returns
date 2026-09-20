import { useState } from "react";
import { HERO, PLANS } from "../../content/returnsCopy.js";

const money = (n) => `$${n}`;
/** 超额单价固定两位小数（$0.20 / $1.20），整数月费保持 $5 */
const cents = (n) => `$${n.toFixed(2)}`;

/** 单张套餐卡：年付开关 + 额度下拉 + 权益清单 */
function PlanCard({ plan, yearly, onToggle, active }) {
  const tiers = plan.quotas?.[yearly ? "year" : "month"] ?? [];
  const [tierIdx, setTierIdx] = useState(0);
  const tier = tiers[tierIdx] ?? tiers[0] ?? null;

  return (
    <article
      className={`rt-plan-card${plan.recommended ? " is-recommended" : ""}${
        plan.quotas ? "" : " is-free"
      }${active ? " is-active" : ""}`}
    >
      {plan.recommended ? <span className="rt-plan-badge">{PLANS.recommended}</span> : null}

      <div className="rt-plan-top">
        <header className="rt-plan-head">
          <h3>{plan.name}</h3>
          <p>{plan.subtitle}</p>
        </header>

        <div className="rt-plan-price-slot">
          {/* Free 无年付/额度控件，仍占位以保持四卡按钮同一基线 */}
          <div className="rt-plan-cycle">
            {plan.quotas ? (
              <>
                <button
                  type="button"
                  role="switch"
                  aria-checked={yearly}
                  aria-label={PLANS.billedYearly}
                  className={`rt-plan-switch${yearly ? " is-on" : ""}`}
                  onClick={onToggle}
                >
                  <span aria-hidden="true" />
                </button>
                <span className="rt-plan-cycle-label">{PLANS.billedYearly}</span>
                {yearly ? <em className="rt-plan-save">{PLANS.save}</em> : null}
              </>
            ) : null}
          </div>

          <div className="rt-plan-price">
            <strong>US {money(tier ? tier.price : 0)}</strong>
            <span>{PLANS.perMonth}</span>
          </div>

          {plan.quotas ? (
            <div className="rt-plan-quota-row">
              <span className="rt-plan-select">
                <select
                  aria-label="Returns / Month"
                  value={tier.quota}
                  onChange={(e) =>
                    setTierIdx(
                      Math.max(
                        0,
                        tiers.findIndex((t) => String(t.quota) === e.target.value)
                      )
                    )
                  }
                >
                  {tiers.map((t) => (
                    <option key={t.quota} value={t.quota}>
                      {t.quota}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="rt-plan-quota-unit">Returns / Month</span>
            </div>
          ) : (
            <p className="rt-plan-quota">{plan.freeQuota}</p>
          )}
          <p className="rt-plan-overage">
            {plan.overage ? `Additional Returns: ${cents(plan.overage)} each` : "\u00A0"}
          </p>
        </div>

        <a
          className={`rt-plan-subscribe${plan.recommended ? " is-primary" : ""}`}
          href={HERO.trialHref}
          target="_blank"
          rel="noopener"
        >
          {PLANS.startTrial}
        </a>
      </div>

      <div className="rt-plan-body">
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
  );
}

/** Free / Basic / Pro / Max + 企业定制版横幅 */
export default function Plans() {
  const [yearly, setYearly] = useState(false);
  const [planIdx, setPlanIdx] = useState(0);
  const { enterprise } = PLANS;

  return (
    <section className="rt-plans" id="returns-plans">
      <div className="rt-wrap rt-plans-inner">
        <h2 className="rt-plans-title">{PLANS.title}</h2>
        <p className="rt-plans-lead">{PLANS.lead}</p>

        <div className="rt-plan-tabs" role="tablist" aria-label="Pricing plans">
          {/* 位置由内联 left 直接算：样式表里的 var 版在 Chrome 下算不出（见 CSS 注释） */}
          <span
            className="rt-plan-tabs-thumb"
            aria-hidden="true"
            style={{ left: `calc(4px + ${planIdx} * ((100% - 20px) / 4 + 4px))` }}
          />
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
            <PlanCard
              key={plan.name}
              plan={plan}
              yearly={yearly}
              onToggle={() => setYearly((v) => !v)}
              active={i === planIdx}
            />
          ))}
        </div>

        <div className="rt-enterprise">
          <div className="rt-enterprise-intro">
            <h3>{enterprise.name}</h3>
            <p>{enterprise.subtitle}</p>
            <a
              className="rt-enterprise-cta"
              href={enterprise.href}
              target="_blank"
              rel="noopener"
            >
              {enterprise.cta}
            </a>
          </div>
          <div className="rt-enterprise-features">
            <h4>{enterprise.featureTitle}</h4>
            <ul>
              {enterprise.features.map((f) => (
                <li key={f}>
                  <span className="rt-plan-check" aria-hidden="true">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
