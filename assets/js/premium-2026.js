/* PREMIUM 2026 LAYER: scroll progress, cursor spotlight, depth parallax, availability pill. Additive only. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var body = document.body;

    // 1. Scroll progress bar
    var bar = document.createElement("div");
    bar.id = "p-progress";
    bar.setAttribute("aria-hidden", "true");
    body.appendChild(bar);

    // 2. Cursor spotlight (fine pointers only)
    if (window.matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
      var glow = document.createElement("div");
      glow.id = "p-glow";
      glow.setAttribute("aria-hidden", "true");
      body.appendChild(glow);
      var gx = 0, gy = 0, tx = 0, ty = 0;
      window.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; glow.classList.add("on"); }, { passive: true });
      var glowStep = function () {
        if (Math.abs(tx - gx) < 0.2 && Math.abs(ty - gy) < 0.2) return; // idle: no writes
        gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
        glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      };
      if (window.gsap) gsap.ticker.add(glowStep);
      else (function loop() { glowStep(); requestAnimationFrame(loop); })();
    }

    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Progress follows the smoothed scroll position
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) { bar.style.transform = "scaleX(" + self.progress + ")"; }
    });

    if (reduce) return;

    // 4. Depth parallax: each layer moves at its own speed
    function layer(sel, from, to, extra) {
      document.querySelectorAll(sel).forEach(function (el) {
        var trigger = el.closest("section") || el;
        gsap.fromTo(el, Object.assign({ yPercent: from }, extra && extra.from),
          Object.assign({ yPercent: to, ease: "none",
            scrollTrigger: { trigger: trigger, start: "top bottom", end: "bottom top", scrub: true } }, extra && extra.to));
      });
    }
    layer(".about-three-thumb img", -8, 8, { from: { scale: 1.15 }, to: { scale: 1.15 } });
    layer(".portfolio-thumb img", -7, 7, { from: { scale: 1.14 }, to: { scale: 1.14 } });

    // 5. Magnetic pull on primary buttons
    document.querySelectorAll(".tw-hover-btn").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.25, duration: 0.4, ease: "power3.out" });
      });
      btn.addEventListener("mouseleave", function () { gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,.4)" }); });
    });

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
