import { EXPLORE, TRACK_EVENTS } from "../../content/returnsCopy.js";

/**
 * Explore More — Tracking card + Tracking API card
 * Tracking visual = 5175 Hero module (os-status + float cards)
 * API block matches tracking-react ExploreMore
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
          <a className="explore-card explore-card-tracking" href="#">
            <div className="explore-card-copy">
              <span className="explore-title-ico explore-title-ico-tracking" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect className="ico-t-lid" x="6" y="5.5" width="12" height="3" rx="1.15" />
                  <rect className="ico-t-box" x="6" y="8.5" width="12" height="10.5" rx="1.75" />
                  <path className="ico-t-seam" d="M12 8.5v10.5" />
                </svg>
              </span>
              <h3>{EXPLORE.trackingTitle}</h3>
              <p>{EXPLORE.trackingDesc}</p>
              <span className="explore-link">
                <span className="explore-link-label">{EXPLORE.trackingCta}</span>
                <span className="explore-link-arrow" aria-hidden="true">→</span>
              </span>
            </div>
              <div className="track-ui" aria-hidden="true">
                <div className="os-status">
                  <h3>Your order has been delivered.</h3>
                  <div className="os-progress">
                    <i className="is-on"></i>
                    <i className="is-on"></i>
                    <i className="is-on"></i>
                    <i className="is-on"></i>
                    <i className="is-on is-now"></i>
                  </div>
                  <div className="os-progress-labels">
                    <span>Order pending</span>
                    <span>Info received</span>
                    <span>In transit</span>
                    <span>Pick up</span>
                    <span>Delivered</span>
                  </div>
                <div className="os-carrier">
                  <b>USPS</b>
                  <span>9400 1000 0000 2849 1</span>
                </div>
                <ul className="os-events">
                  {TRACK_EVENTS.map((ev, i) => (
                    <li key={`${ev.title}-${i}`} className={ev.latest ? "is-latest" : undefined}>
                      <strong>{ev.title}</strong>
                      <span>{ev.meta}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="float-card float-card-metric">
                <div className="float-card-top">
                  <span className="label">WISMO inquiries</span>
                  <span className="float-card-tag">−12%</span>
                </div>
                <span className="num">
                  <span className="num-arrow" aria-hidden="true">↓</span>
                  95%
                </span>
                <div className="mini-bars" aria-hidden="true">
                  <span style={{ height: "88%" }}></span>
                  <span style={{ height: "76%" }}></span>
                  <span style={{ height: "64%" }}></span>
                  <span style={{ height: "54%" }}></span>
                  <span style={{ height: "46%" }}></span>
                  <span style={{ height: "38%" }}></span>
                  <span style={{ height: "32%" }}></span>
                  <span style={{ height: "26%" }}></span>
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
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="ico-a-left" d="m6 8-4 4 4 4" />
                  <path className="ico-a-slash" d="m14.5 4-5 16" />
                  <path className="ico-a-right" d="m18 16 4-4-4-4" />
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
