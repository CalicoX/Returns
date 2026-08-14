/**
 * Returns hero background — Glass Agency Hero from shaders.com
 * (https://previews.shaders.com/sections/glass-agency-hero)
 *
 * Same stack as the API landing, recolored to Returns teal:
 *   FilmGrain(FlutedGlass(Swirl + ChromaFlow))
 *
 * @returns {() => void}
 */
const RETURNS_HERO_SHADER = {
  components: [
    {
      type: "FilmGrain",
      props: { strength: 0.05 },
      children: [
        {
          type: "FlutedGlass",
          props: {
            aberration: 0.61,
            angle: 31,
            frequency: 8,
            highlight: 0.12,
            highlightSoftness: 0,
            lightAngle: -90,
            refraction: 4,
            shape: "rounded",
            softness: 1,
            speed: 0.15,
          },
          children: [
            {
              type: "Swirl",
              props: {
                colorA: "#ffffff",
                colorB: "#f0fdfa",
                detail: 1.7,
              },
            },
            {
              type: "ChromaFlow",
              props: {
                baseColor: "#ffffff",
                downColor: "#14b8a6",
                leftColor: "#5eead4",
                momentum: 13,
                radius: 3.5,
                rightColor: "#0d9488",
                upColor: "#99f6e4",
                intensity: 0.85,
              },
            },
          ],
        },
      ],
    },
  ],
};

export function mount() {
  let cancelled = false;
  let shader = null;
  let canvas = null;

  try {
    const section = document.getElementById("returns-hero");
    if (!section) return () => {};
    if (
      window.__reduceFx ||
      window.__isMobileLayout ||
      (window.matchMedia && window.matchMedia("(max-width: 768px)").matches)
    ) {
      return () => {};
    }

    canvas = document.getElementById("rt-hero-shader") || section.querySelector(".rt-hero-shader");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "rt-hero-shader";
      canvas.id = "rt-hero-shader";
      canvas.setAttribute("aria-hidden", "true");
      section.insertBefore(canvas, section.firstChild);
    }
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    (async () => {
      try {
        const { createShader, isWebGPUSupported } = await import("shaders/js");
        if (cancelled) return;
        if (!isWebGPUSupported()) {
          canvas.style.display = "none";
          return;
        }
        shader = await createShader(canvas, RETURNS_HERO_SHADER, {
          disableTelemetry: true,
          onError: (reason) => {
            console.warn("[hero-wash]", reason);
          },
        });
        if (cancelled) {
          shader.destroy();
          shader = null;
          return;
        }
        section.classList.add("has-hero-shader");
      } catch (err) {
        console.warn("[fx:hero-wash-shader.js]", err);
        if (canvas) canvas.style.display = "none";
      }
    })();
  } catch (err) {
    console.warn("[fx:hero-wash-shader.js]", err);
  }

  return function dispose() {
    cancelled = true;
    sectionClassSafeRemove();
    if (shader) {
      try {
        shader.destroy();
      } catch {
        /* ignore */
      }
      shader = null;
    }
  };

  function sectionClassSafeRemove() {
    try {
      const section = document.getElementById("returns-hero");
      section?.classList.remove("has-hero-shader");
    } catch {
      /* ignore */
    }
  }
}
