import { EXPLORE } from "../../content/returnsCopy.js";

/**
 * Explore More — Tracking card + full Tracking API card
 * (API block matches tracking-react ExploreMore: ascii, code-window anim, carriers)
 */
export default function ExploreMore() {
  return (
    <section className="section alt rt-explore">
      <div className="section-inner">
        <div className="section-head">
          <h2>{EXPLORE.title}</h2>
          <p className="lead">{EXPLORE.lead}</p>
        </div>
        <div className="explore-grid">
          <a className="explore-card explore-card-returns" href="#">
            <div className="explore-card-copy">
              <span className="explore-title-ico explore-title-ico-returns" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <h3>{EXPLORE.trackingTitle}</h3>
              <p>{EXPLORE.trackingDesc}</p>
              <span className="explore-link">
                <span className="explore-link-label">{EXPLORE.trackingCta}</span>
                <span className="explore-link-arrow" aria-hidden="true">→</span>
              </span>
            </div>
            <div className="returns-ui" aria-hidden="true">
              <div className="returns-ui-blobs" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
              <div className="returns-ui-stack">
                <div className="returns-ui-card">
                  <p className="returns-ui-brand">URBAN STANDARDS</p>
                  <div className="returns-ui-head">
                    <strong>Track your order</strong>
                    <span>Out for delivery · today by 8 PM</span>
                  </div>
                  <div className="returns-ui-list">
                    <div className="returns-ui-item is-active">
                      <div className="returns-ui-thumb">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 15.5c1.5-3.5 5-5.5 9-5.5 2.2 0 4 .7 5.5 1.8L21 14" />
                          <path d="M3 15.5h15.5a2.5 2.5 0 010 5H6.2c-1.8 0-3.2-1.4-3.2-3.2 0-.6.2-1.2.5-1.8z" />
                        </svg>
                      </div>
                      <div className="returns-ui-meta">
                        <span className="name">Sneakers</span>
                        <span className="sub"><em>#US-28491</em><i>·</i><b>UPS</b></span>
                      </div>
                      <span className="returns-ui-arrow" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                    <div className="returns-ui-item">
                      <div className="returns-ui-thumb">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3h4v3h-4z" />
                          <path d="M8 9h8l-1 11a2 2 0 01-2 2h-2a2 2 0 01-2-2L8 9z" />
                        </svg>
                      </div>
                      <div className="returns-ui-meta">
                        <span className="name">Perfume</span>
                        <span className="sub"><em>#US-28492</em><i>·</i><b>DHL</b></span>
                      </div>
                      <span className="returns-ui-arrow" aria-hidden="true">
                        <svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8h9M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="returns-method">
                  <p className="returns-method-title">Shipment status</p>
                  <div className="returns-method-list">
                    <div className="returns-method-opt">
                      <span className="rm-dot"></span>
                      <span className="rm-label">In transit</span>
                    </div>
                    <div className="returns-method-opt is-selected">
                      <span className="rm-dot"></span>
                      <span className="rm-label">Out for delivery</span>
                      <span className="rm-tag">LIVE</span>
                    </div>
                    <div className="returns-method-opt">
                      <span className="rm-dot"></span>
                      <span className="rm-label">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>

          {/* Full Tracking API card — same DOM as tracking-react for landing-inline FX */}
          <a
            className="explore-card explore-card-api"
            href="https://api.17track.net/en/doc"
            target="_blank"
            rel="noopener"
          >
            <div className="api-ascii" aria-hidden="true">
              <pre className="api-ascii-layer api-ascii-a"></pre>
              <pre className="api-ascii-layer api-ascii-b"></pre>
            </div>
            <div className="explore-card-copy">
              <span className="explore-title-ico explore-title-ico-api" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
                  <path className="ico-a-left" d="M8 7l-4 5 4 5" />
                  <path className="ico-a-slash" d="M13 5l-2 14" />
                  <path className="ico-a-right" d="M16 7l4 5-4 5" />
                </svg>
              </span>
              <h3>{EXPLORE.apiTitle}</h3>
              <p>{EXPLORE.apiDesc}</p>
              <span className="explore-link">
                <span className="explore-link-label">{EXPLORE.apiCta}</span>
                <span className="explore-link-arrow" aria-hidden="true">→</span>
              </span>
            </div>
            <div className="explore-api-visual" aria-hidden="true">
              <div className="code-window" data-code-anim="api">
                <div className="code-window-chrome">
                  <span className="cw-dots"><i></i><i></i><i></i></span>
                  <span className="cw-path">track/v2.4/register</span>
                  <span className="cw-progress">
                    <span className="cw-progress-bar"><i data-cw-bar></i></span>
                    <span data-cw-pct>0%</span>
                  </span>
                </div>
                <div className="code-window-body">
                  <div className="cw-tasks" data-cw-tasks>
                    <div className="cw-task is-running" data-cw-task="0">
                      <span className="cw-ico">|</span>
                      <span className="cw-label">
                        <span className="hl">Register tracking numbers</span>{" "}
                        <span className="tag">api</span>
                      </span>
                      <span className="cw-status">[running]</span>
                    </div>
                    <div className="cw-task is-pending" data-cw-task="1">
                      <span className="cw-ico">|</span>
                      <span className="cw-label">
                        <span className="hl">Parse accepted / rejected</span>{" "}
                        <span className="tag">guide</span>
                      </span>
                      <span className="cw-status">[queued]</span>
                    </div>
                  </div>
                  <div className="cw-thought" data-cw-thought>
                    Thought for 0.0s
                  </div>
                  <div className="cw-edit">
                    <div className="cw-edit-head">
                      <strong>Edit</strong> <span>src/17track/register.js</span>
                    </div>
                    <div className="cw-code" data-cw-typewriter>
                      <div className="cw-code-scroll" data-cw-scroll></div>
                    </div>
                  </div>
                </div>
                <div className="code-window-foot">
                  <div className="code-window-foot-top">
                    <span className="cw-build">Build</span>
                    <span className="cw-prompt">Webhook receives TRACKING_UPDATED</span>
                    <span className="cw-explore">Explore →</span>
                  </div>
                </div>
              </div>
              <div className="api-carriers">
                <svg
                  className="api-carriers-lines"
                  viewBox="0 0 280 80"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <circle className="api-flow-hub" cx="140" cy="4" r="3" fill="rgba(191,219,254,0.95)" />
                  <path className="api-flow-static" d="M140 4 C140 30, 28 34, 28 76" />
                  <path className="api-flow-static" d="M140 4 C140 28, 84 30, 84 76" />
                  <path className="api-flow-static" d="M140 4 C140 34, 140 48, 140 76" />
                  <path className="api-flow-static" d="M140 4 C140 28, 196 30, 196 76" />
                  <path className="api-flow-static" d="M140 4 C140 30, 252 34, 252 76" />
                  <path className="api-flow-pulse p1" d="M140 4 C140 30, 28 34, 28 76" />
                  <path className="api-flow-pulse p2" d="M140 4 C140 28, 84 30, 84 76" />
                  <path className="api-flow-pulse p3" d="M140 4 C140 34, 140 48, 140 76" />
                  <path className="api-flow-pulse p4" d="M140 4 C140 28, 196 30, 196 76" />
                  <path className="api-flow-pulse p5" d="M140 4 C140 30, 252 34, 252 76" />
                  <circle cx="28" cy="76" r="2.4" fill="rgba(191,219,254,0.95)" />
                  <circle cx="84" cy="76" r="2.4" fill="rgba(191,219,254,0.95)" />
                  <circle cx="140" cy="76" r="2.4" fill="rgba(191,219,254,0.95)" />
                  <circle cx="196" cy="76" r="2.4" fill="rgba(191,219,254,0.95)" />
                  <circle cx="252" cy="76" r="2.4" fill="rgba(191,219,254,0.95)" />
                </svg>
                <div className="api-carriers-row">
                  <div className="api-carrier" title="USPS">
                    <span className="api-carrier-tile">
                      <img src="/assets/carriers/usps.svg?v=2" alt="USPS" width="36" height="36" loading="lazy" decoding="async" />
                    </span>
                    <span className="api-carrier-name">USPS</span>
                  </div>
                  <div className="api-carrier" title="UPS">
                    <span className="api-carrier-tile">
                      <img src="/assets/carriers/ups.svg?v=2" alt="UPS" width="36" height="36" loading="lazy" decoding="async" />
                    </span>
                    <span className="api-carrier-name">UPS</span>
                  </div>
                  <div className="api-carrier" title="DHL">
                    <span className="api-carrier-tile">
                      <img src="/assets/carriers/dhl.svg?v=2" alt="DHL" width="36" height="36" loading="lazy" decoding="async" />
                    </span>
                    <span className="api-carrier-name">DHL</span>
                  </div>
                  <div className="api-carrier" title="DPD">
                    <span className="api-carrier-tile">
                      <img src="/assets/carriers/dpd.svg?v=2" alt="DPD" width="36" height="36" loading="lazy" decoding="async" />
                    </span>
                    <span className="api-carrier-name">DPD</span>
                  </div>
                  <div className="api-carrier" title="GLS">
                    <span className="api-carrier-tile">
                      <img src="/assets/carriers/gls.svg?v=2" alt="GLS" width="36" height="36" loading="lazy" decoding="async" />
                    </span>
                    <span className="api-carrier-name">GLS</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
