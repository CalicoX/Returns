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
          <a className="explore-card explore-card-tracking" href="#">
            <div className="explore-card-copy">
              <span className="explore-title-ico explore-title-ico-tracking" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round">
                  <rect className="ico-t-box" x="4" y="8" width="16" height="12.5" rx="1.4" />
                  <path className="ico-t-lid" d="M4 8l8-4.2L20 8" />
                  <path className="ico-t-seam" d="M12 3.8v16.7M4 12h16" />
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
              <div className="track-ui-board">
                <p className="track-ui-status">Your order has been delivered.</p>
                <div className="track-ui-progress">
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M7 8h10l-1 12H8L7 8z" />
                      <path d="M9.5 8V7a2.5 2.5 0 015 0v1" />
                    </svg>
                  </i>
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="4" y="5" width="16" height="14" rx="1.5" />
                      <path d="M8 9h8M8 13h5" />
                    </svg>
                  </i>
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 16V8h11v8H3z" />
                      <path d="M14 11h4l3 3v2h-7v-5z" />
                      <circle cx="7" cy="17.5" r="1.6" />
                      <circle cx="17" cy="17.5" r="1.6" />
                    </svg>
                  </i>
                  <i>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 17V9l7-4 7 4v8" />
                      <path d="M9 17v-5h6v5" />
                    </svg>
                  </i>
                  <i className="is-now">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 20V10l8-6 8 6v10" />
                      <path d="M10 20v-6h4v6" />
                    </svg>
                  </i>
                </div>
                <div className="track-ui-labels">
                  <span>Ordered</span>
                  <span>Processed</span>
                  <span>Shipped</span>
                  <span>Out</span>
                  <span>Delivered</span>
                </div>
                <div className="track-ui-events">
                  <div className="track-ui-ev-head">
                    <strong>Shipping Events</strong>
                    <span>USPS · United States</span>
                  </div>
                  <ol className="track-ui-ev-list">
                    <li className="track-ui-ev is-now">
                      <i></i>
                      <div>
                        <b>Aug 18, 10:22</b>
                        <span>Shingle Springs, CA · Delivered</span>
                      </div>
                    </li>
                    <li className="track-ui-ev">
                      <i></i>
                      <div>
                        <b>Aug 18, 08:14</b>
                        <span>Out for Delivery, USPS</span>
                      </div>
                    </li>
                    <li className="track-ui-ev">
                      <i></i>
                      <div>
                        <b>Aug 17, 21:06</b>
                        <span>Arrived at Post Office</span>
                      </div>
                    </li>
                    <li className="track-ui-ev">
                      <i></i>
                      <div>
                        <b>Aug 16, 14:40</b>
                        <span>Picked Up by Shipping Partner</span>
                      </div>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="track-ui-wismo">
                <div className="track-ui-wismo-top">
                  <span>WISMO inquiries</span>
                </div>
                <p className="track-ui-wismo-num">
                  <b>↓</b>
                  35%
                </p>
                <p className="track-ui-wismo-hint">More shoppers self-serve after purchase</p>
                <div className="track-ui-bars">
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
              <div className="track-ui-video">
                <div className="track-ui-video-top">
                  <span>Brand video</span>
                </div>
                <div className="track-ui-thumb">
                  <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80"
                    alt=""
                    width="168"
                    height="105"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="track-ui-play">
                    <svg viewBox="0 0 12 12" fill="currentColor">
                      <path d="M3.2 2.1v7.8L10 6 3.2 2.1z" />
                    </svg>
                  </span>
                </div>
                <strong>Studio edit · unbox film</strong>
                <p>
                  0:42
                  <i></i>
                  Post-purchase story
                </p>
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
