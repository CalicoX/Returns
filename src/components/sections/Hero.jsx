import { HERO } from "../../content/returnsCopy.js";
import { DomHeroReturns } from "../../illustrations/ReturnsDomStages.jsx";

/** Returns Hero — 50/50 split, switch CTA, shader wash, 3D panel */
export default function Hero() {
  return (
    <section className="rt-hero hero" id="returns-hero">
      <canvas className="rt-hero-shader" id="rt-hero-shader" aria-hidden="true" />
      <div className="rt-hero-ambient" aria-hidden="true">
        <span className="rt-hero-blob rt-hero-blob-a" />
        <span className="rt-hero-blob rt-hero-blob-b" />
        <span className="rt-hero-blob rt-hero-blob-c" />
      </div>

      <div className="rt-wrap rt-hero-inner hero-inner">
        <div className="rt-hero-copy">
          <h1>
            <span className="rt-hero-line">{HERO.titleLine1}</span>
            <span className="rt-hero-line">{HERO.titleLine2}</span>
          </h1>

          <p className="lead rt-hero-lead">{HERO.lead}</p>

          <div className="cta-row rt-hero-cta">
            <a className="btn-switch" href={HERO.trialHref} target="_blank" rel="noopener">
              <span className="btn-switch-knob" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="5" cy="12" r="1.4" fill="currentColor" opacity="0.35" />
                  <circle cx="8.2" cy="12" r="1.5" fill="currentColor" opacity="0.55" />
                  <circle cx="11.5" cy="12" r="1.6" fill="currentColor" opacity="0.8" />
                  <path
                    d="M13 7.5L18.5 12 13 16.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="btn-switch-label">{HERO.trial}</span>
            </a>
            <a className="btn-demo" href={HERO.demoHref}>
              {HERO.demo}
            </a>
          </div>
        </div>

        <DomHeroReturns />
      </div>
    </section>
  );
}
