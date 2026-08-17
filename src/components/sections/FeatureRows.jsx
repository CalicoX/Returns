import { useEffect, useRef } from "react";
import { FEATURES, HERO } from "../../content/returnsCopy.js";
import { FEATURE_STAGES } from "../../illustrations/featureStages.js";

/**
 * Sticky 视口钉住；左右同一条内容叠在窗口里跟着页滚上移（不是整屏盖住）。
 */
export default function FeatureRows() {
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const viewportRef = useRef(null);
  const stackRef = useRef(null);
  const total = String(FEATURES.length).padStart(2, "0");

  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const stack = stackRef.current;
    if (!track || !sticky || !viewport || !stack) return undefined;

    const slides = Array.from(stack.querySelectorAll(".rt-feature-slide"));
    const n = slides.length;
    if (!n) return undefined;

    const mq = window.matchMedia("(max-width: 960px)");
    const gap = 36;
    let panelH = 0;
    let travel = 1;
    let lastP = -1;
    let raf = 0;
    let sectionVisible = true;
    let lenisOff = null;
    let hookTimer = 0;
    let hookTimeout = 0;
    let resizeTimer = 0;

    function pinTop() {
      const topbar = document.querySelector(".topbar");
      if (topbar) {
        const h = Math.max(Math.ceil(topbar.getBoundingClientRect().height), 56);
        document.documentElement.style.setProperty("--topbar-h", `${h}px`);
        return h;
      }
      return (
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")) || 64
      );
    }

    function measure() {
      if (mq.matches) {
        track.style.height = "";
        viewport.style.height = "";
        slides.forEach((s) => {
          s.style.height = "";
          s.style.removeProperty("--fp-blur");
          s.style.removeProperty("--fp-op");
        });
        stack.style.transform = "";
        travel = 1;
        lastP = -1;
        return;
      }

      const pt = pinTop();
      const stickyH = Math.max(320, window.innerHeight - pt);
      panelH = Math.round(stickyH);
      slides.forEach((s) => {
        s.style.height = `${panelH}px`;
      });
      viewport.style.height = `${panelH}px`;
      travel = Math.max(1, (n - 1) * (panelH + gap));
      track.style.height = `${stickyH + travel}px`;
    }

    function progress() {
      const pt = pinTop();
      const rect = track.getBoundingClientRect();
      const scrolled = Math.min(travel, Math.max(0, pt - rect.top));
      return scrolled / travel;
    }

    function apply(p) {
      p = Math.max(0, Math.min(1, p));
      lastP = p;
      const stride = panelH + gap;
      const continuous = p * (n - 1);
      const y = -continuous * stride;
      stack.style.transform = Math.abs(y) < 0.5 ? "none" : `translate3d(0, ${y.toFixed(2)}px, 0)`;

      slides.forEach((slide, i) => {
        const leave = Math.abs(continuous - i);
        slide.classList.toggle("is-active", leave < 0.45);
        let blur = 0;
        let op = 1;
        if (leave > 0.22) {
          const t = Math.min(1, (leave - 0.22) / 0.78);
          const ease = t * t;
          blur = ease * 12;
          op = 1 - ease * 0.45;
        }
        slide.style.setProperty("--fp-blur", `${blur.toFixed(2)}px`);
        slide.style.setProperty("--fp-op", Math.max(0.4, op).toFixed(3));
        slide.classList.toggle("is-leaving", blur > 0.2);
        const stage = slide.querySelector(".feature-stage");
        if (stage) {
          let c = Math.max(0, 1 - leave);
          c = c * c * (3 - 2 * c);
          stage.style.setProperty("--fx-c", c.toFixed(3));
        }
      });
    }

    function onScroll() {
      if (mq.matches || !sectionVisible || document.hidden) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (panelH < 80) measure();
        apply(progress());
      });
    }

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resizeTimer = 0;
        measure();
        onScroll();
      }, 80);
    }

    function listenMq(fn) {
      if (mq.addEventListener) mq.addEventListener("change", fn);
      else if (mq.addListener) mq.addListener(fn);
    }
    function unlistenMq(fn) {
      if (mq.removeEventListener) mq.removeEventListener("change", fn);
      else if (mq.removeListener) mq.removeListener(fn);
    }

    function hookLenis() {
      if (lenisOff || !window.__lenis || typeof window.__lenis.on !== "function") return;
      window.__lenis.on("scroll", onScroll);
      lenisOff = () => {
        try {
          window.__lenis?.off?.("scroll", onScroll);
        } catch {
          /* ignore */
        }
      };
    }

    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      onScroll();
    }

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    listenMq(onResize);
    hookLenis();
    hookTimer = window.setInterval(hookLenis, 200);
    hookTimeout = window.setTimeout(() => clearInterval(hookTimer), 2500);

    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          sectionVisible = !!entry?.isIntersecting;
          if (sectionVisible) onScroll();
          else if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        },
        { threshold: 0.01, rootMargin: "80px" }
      );
      io.observe(track);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearInterval(hookTimer);
      clearTimeout(hookTimeout);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (lenisOff) lenisOff();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      unlistenMq(onResize);
      if (io) io.disconnect();
      track.style.height = "";
      viewport.style.height = "";
      stack.style.transform = "";
      slides.forEach((s) => {
        s.style.height = "";
        s.style.removeProperty("--fp-blur");
        s.style.removeProperty("--fp-op");
      });
    };
  }, []);

  return (
    <section className="rt-features" id="key-features">
      <div className="rt-feature-scroll" ref={trackRef}>
        <div className="rt-feature-sticky" ref={stickyRef}>
          <div className="rt-feature-viewport" ref={viewportRef}>
            <ul className="rt-feature-stack" ref={stackRef}>
              {FEATURES.map((f, i) => {
                const Stage = FEATURE_STAGES[i];
                return (
                  <li key={f.title} className={`rt-feature-slide${i === 0 ? " is-active" : ""}`}>
                    <div className="rt-feature-inner rt-wrap">
                      <div className="rt-feature-copy">
                        <span className="rt-feature-step">
                          {String(i + 1).padStart(2, "0")} / {total}
                        </span>
                        <h2>{f.title}</h2>
                        {f.summary ? <p className="rt-feature-summary">{f.summary}</p> : null}
                        {f.body ? <p className="rt-feature-body">{f.body}</p> : null}
                        <ul className="rt-feature-bullets">
                          {f.bullets.map((b) => (
                            <li key={b}>
                              <span className="rt-check" aria-hidden="true">
                                ✓
                              </span>
                              {b}
                            </li>
                          ))}
                        </ul>
                        <a
                          className="btn-switch"
                          href={HERO.trialHref}
                          target="_blank"
                          rel="noopener"
                        >
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
                          <span className="btn-switch-label">{f.cta}</span>
                        </a>
                      </div>
                      <div className="rt-feature-media">
                        {Stage ? <Stage /> : null}
                        {!f.badgeInArt ? (
                          <div className="rt-feature-badge">
                            <strong>{f.badge}</strong>
                            <span>{f.badgeLabel}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
