/**
 * Returns 全站 .btn-switch（Free Trial 胶囊）border beam。
 * tracking 里同款效果由 ai-lab.js 的 switchBtnFx 挂载，但该模块只在
 * 页面存在 #ai-lab 时加载；Returns 页没有 AI Lab 区块，所以单独挂。
 * 覆盖 Hero / FeatureRows×4 / Plans / BrandsSay / BottomCta；
 * 离屏实例由 IntersectionObserver 加 data-paused 停动画。
 * 色板用 border-beam.js 的 teal 变体，hueRange 收窄避免飘出青绿域。
 * @returns {() => void}
 */
export function mount() {
  const cleanups = [];
  try {
    if (typeof window.mountBorderBeam !== "function") return () => {};
    var btns = document.querySelectorAll(".returns-page .btn-switch");
    if (!btns.length) return () => {};

    var io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            function (entries) {
              entries.forEach(function (e) {
                if (e.isIntersecting) {
                  e.target.setAttribute("data-active", "");
                  e.target.removeAttribute("data-paused");
                } else {
                  e.target.setAttribute("data-paused", "");
                }
              });
            },
            { threshold: 0.05 }
          )
        : null;

    btns.forEach(function (el, i) {
      if (!el.querySelector(".btn-switch-shader")) {
        var sh = document.createElement("span");
        sh.className = "btn-switch-shader";
        sh.setAttribute("aria-hidden", "true");
        el.insertBefore(sh, el.firstChild);
      }

      if (el.getAttribute("data-beam")) return;

      var h = el.getBoundingClientRect().height || 44;
      var radius = Math.round(h / 2);

      /* 2px 描边 + 高不透明度：1px/0.5 档在青绿底上肉眼看不出 */
      window.mountBorderBeam(el, {
        id: "rt-cta-" + i,
        theme: "dark",
        colorVariant: "teal",
        borderRadius: radius,
        borderWidth: 2,
        duration: 2.05 + i * 0.12,
        brightness: 1.6,
        saturation: 1.35,
        strength: 1,
        strokeOpacity: 0.95,
        innerOpacity: 0.75,
        bloomOpacity: 0.65,
        hueRange: 10,
        active: true,
      });

      if (io) io.observe(el);
    });

    if (io) {
      cleanups.push(function () {
        io.disconnect();
      });
    }
  } catch (err) {
    console.warn("[fx:returns-cta-beam.js]", err);
  }
  return function dispose() {
    while (cleanups.length) {
      var fn = cleanups.pop();
      try {
        if (typeof fn === "function") fn();
      } catch {
        /* ignore */
      }
    }
  };
}
