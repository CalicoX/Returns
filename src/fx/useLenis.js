import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "./utils.js";

/**
 * Smooth scroll owned by React — exposes window.__lenis for legacy consumers.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      prevent: (node) =>
        !!(
          node &&
          node.closest &&
          node.closest(
            "[data-lenis-prevent], .ogl-page, .ai-case-lightbox-scroll, .ai-case-lightbox"
          )
        ),
    });

    window.__lenis = lenis;

    let raf = 0;
    const frame = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onScroll = () => {
      if (typeof window.__updateAiScroll === "function") {
        window.__updateAiScroll();
      }
    };
    lenis.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      try {
        lenis.off("scroll", onScroll);
      } catch {
        /* older lenis */
      }
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);
}
