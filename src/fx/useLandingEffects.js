import { useEffect } from "react";
import { useLenis } from "./useLenis.js";
import { mountProductDock } from "./mountProductDock.js";
import {
  observeVisibility,
  prefersReducedMotion,
  shouldReduceFx,
  whenIdle,
} from "./utils.js";

/**
 * Static import map so Vite emits real FX chunks (literal paths only).
 */
const FX_LOADERS = {
  responsive: () => import("./modules/responsive-fx.js"),
  borderBeam: () => import("./modules/border-beam.js"),
  topbarTheme: () => import("./modules/topbar-theme.js"),
  undertones: () => import("./modules/undertones-shader.js"),
  heroWash: () => import("./modules/hero-wash-shader.js"),
  impactMetrics: () => import("./modules/impact-metrics.js"),
  impactBg: () => import("./modules/impact-bg-shader.js"),
  landingInline: () => import("./modules/landing-inline.js"),
  thinkingOrb: () => import("./modules/thinking-orb.js"),
  aiLab: () => import("./modules/ai-lab.js"),
  aiTitleParticles: () => import("./modules/ai-title-particles.js"),
  bottomCta: () => import("./modules/bottom-cta-shader.js"),
};

/**
 * Core + deferred FX via React lifecycle.
 * - Lenis: useLenis
 * - Product dock: mountProductDock (above-fold, real destroy)
 * - Heavy modules: static dynamic-import map + IntersectionObserver
 */
export function useLandingEffects() {
  useLenis();

  useEffect(() => {
    const disposers = [];
    let cancelled = false;

    // Page-level rAF tracking — cancels continuous GPU loops on unmount
    const rafs = new Set();
    const origRAF = window.requestAnimationFrame.bind(window);
    const origCAF = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => {
      let id;
      id = origRAF((t) => {
        rafs.delete(id);
        return cb(t);
      });
      rafs.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      rafs.delete(id);
      return origCAF(id);
    };

    async function mountNamed(key) {
      if (cancelled || !FX_LOADERS[key]) return;
      try {
        const mod = await FX_LOADERS[key]();
        if (cancelled || !mod?.mount) return;
        const d = mod.mount();
        if (typeof d === "function") disposers.push(d);
      } catch (err) {
        console.warn(`[useLandingEffects] ${key}`, err);
      }
    }

    // —— Core above-the-fold ——
    (async () => {
      await mountNamed("responsive");
      await mountNamed("borderBeam");
      // Topbar height + on-dark (independent of AI Lab)
      await mountNamed("topbarTheme");
      // Product dock WebGL/frosted pipeline — not deferred
      try {
        const disposeDock = await mountProductDock();
        if (!cancelled && typeof disposeDock === "function") {
          disposers.push(disposeDock);
        }
      } catch (err) {
        console.warn("[useLandingEffects] product dock", err);
      }

      // Returns hero: shaders.com glass wash (immediate, like API)
      const isReturns = document.querySelector(".returns-page");
      const hero = document.querySelector(".hero");
      if (hero && isReturns && !shouldReduceFx()) {
        await mountNamed("heroWash");
      } else if (hero && !isReturns && !shouldReduceFx()) {
        const stopIdle = whenIdle(() => {
          const unvis = observeVisibility(
            hero,
            (vis) => {
              if (vis && !hero.dataset.fxUndertones) {
                hero.dataset.fxUndertones = "1";
                mountNamed("undertones");
              }
            },
            { threshold: 0.02, rootMargin: "40px" }
          );
          disposers.push(unvis);
        }, 600);
        disposers.push(stopIdle);
      }
    })();

    // —— Impact deferred ——
    const impact = document.getElementById("business-impact");
    if (impact) {
      let loaded = false;
      disposers.push(
        observeVisibility(impact, (vis) => {
          if (!vis || loaded) return;
          loaded = true;
          mountNamed("impactMetrics");
          if (!shouldReduceFx()) mountNamed("impactBg");
        })
      );
    }

    // —— Features / explore deferred (no Lenis/dock inside) ——
    const features = document.getElementById("key-features");
    const explore = document.querySelector(".explore-grid");
    const featuresOrExplore = features || explore;
    if (featuresOrExplore) {
      let loaded = false;
      disposers.push(
        observeVisibility(
          featuresOrExplore,
          (vis) => {
            if (!vis || loaded) return;
            loaded = true;
            mountNamed("landingInline");
          },
          { rootMargin: "120px" }
        )
      );
    }

    // —— AI Lab deferred ——
    const ai = document.getElementById("ai-lab");
    if (ai) {
      let loaded = false;
      disposers.push(
        observeVisibility(
          ai,
          (vis) => {
            if (!vis || loaded) return;
            loaded = true;
            mountNamed("thinkingOrb");
            mountNamed("aiLab");
            if (!prefersReducedMotion()) mountNamed("aiTitleParticles");
          },
          { rootMargin: "160px" }
        )
      );
    }

    // —— Bottom CTA deferred ——
    const cta = document.getElementById("bottom-cta");
    if (cta && !shouldReduceFx()) {
      let loaded = false;
      disposers.push(
        observeVisibility(cta, (vis) => {
          if (!vis || loaded) return;
          loaded = true;
          mountNamed("bottomCta");
        })
      );
    }

    return () => {
      cancelled = true;
      disposers.forEach((d) => {
        try {
          d();
        } catch {
          /* ignore */
        }
      });
      rafs.forEach((id) => origCAF(id));
      rafs.clear();
      window.requestAnimationFrame = origRAF;
      window.cancelAnimationFrame = origCAF;
    };
  }, []);
}
