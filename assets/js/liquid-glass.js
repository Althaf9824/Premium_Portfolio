/* LIQUID GLASS LAYER (2026): ambient light, pointer specular, 3D tilt, hero depth.
   Additive only. Uses no new libraries; reads scroll from ScrollSmoother when present. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

  var LIGHT = [
    ".header.header-three", ".banner-three-left", ".banner-three-counter-item:not(.bg-black)",
    ".portfolio-three-item", ".testimonial-three-wrapper", ".brand-three-item",
    ".p-card:not(.ink)", ".p-faq details", ".about-three-counter .tw-btn-circle"
  ];
  var DARK = [".service-three-single", ".footer-three-top-info", ".p-card.ink", ".banner-three-counter-item.bg-black"];
  var TILT = [".portfolio-three-item", ".testimonial-three-wrapper", ".p-card", ".service-three-single", ".brand-three-item"];

  function mark(list, cls) {
    list.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { el.classList.add.apply(el.classList, cls); });
    });
  }

  function init() {
    // 1. Ambient light layer
    var amb = document.createElement("div");
    amb.id = "lg-ambient";
    amb.setAttribute("aria-hidden", "true");
    ["o1", "o2", "o3", "o4"].forEach(function (c) {
      var o = document.createElement("div");
      o.className = "lg-orb " + c;
      amb.appendChild(o);
    });
    document.body.insertBefore(amb, document.body.firstChild);
    var orbs = amb.querySelectorAll(".lg-orb");
    var speeds = [-0.05, 0.035, -0.03, 0.06];

    // 2. Tag glass surfaces
    mark(LIGHT, ["lg-glass"]);
    mark(DARK, ["lg-glass", "lg-dark"]);
    if (finePointer && !reduce) mark(TILT, ["lg-tilt"]);

    // 3. Pointer specular light + tilt, one delegated listener
    var active = null;
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var el = e.target.closest && e.target.closest(".lg-glass");
      if (active && active !== el) release(active);
      if (!el) { active = null; return; }
      active = el;
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty("--mx", x + "px");
      el.style.setProperty("--my", y + "px");
      if (el.classList.contains("lg-tilt")) {
        var px = x / r.width - 0.5, py = y / r.height - 0.5;
        var max = Math.min(6, 2400 / r.width); // wide surfaces tilt less
        el.classList.add("is-tilting");
        el.style.transform = "perspective(1000px) rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" + (px * max).toFixed(2) + "deg) translateZ(0)";
      }
    }, { passive: true });
    document.addEventListener("pointerleave", function () { if (active) release(active); active = null; });
    function release(el) {
      el.classList.remove("is-tilting");
      if (el.classList.contains("lg-tilt")) el.style.transform = "";
    }

    // 4. Hero depth: image and stat tiles drift in opposite directions
    var hero = document.querySelector(".banner-three-wrapper");
    if (hero && finePointer && !reduce) {
      var area = document.querySelector(".banner-three-area") || hero;
      area.addEventListener("pointermove", function (e) {
        var r = area.getBoundingClientRect();
        hero.style.setProperty("--hx", ((e.clientX - r.left) / r.width - 0.5) * 2);
        hero.style.setProperty("--hy", ((e.clientY - r.top) / r.height - 0.5) * 2);
      }, { passive: true });
      area.addEventListener("pointerleave", function () {
        hero.style.setProperty("--hx", 0);
        hero.style.setProperty("--hy", 0);
      });
    }

    // 5. Ambient orbs drift with scroll at different speeds (depth)
    if (!reduce) {
      var last = -1;
      var step = function () {
        var sm = window.ScrollSmoother && ScrollSmoother.get && ScrollSmoother.get();
        var y = sm ? sm.scrollTop() : window.pageYOffset;
        if (Math.abs(y - last) > 0.5) {
          last = y;
          for (var i = 0; i < orbs.length; i++) {
            orbs[i].style.transform = "translate3d(0," + (y * speeds[i]).toFixed(1) + "px,0)";
          }
        }
      };
      if (window.gsap) gsap.ticker.add(step); // shared ticker, no extra rAF loop
      else (function loop() { step(); requestAnimationFrame(loop); })();
    }

    // 6. Header thickens once the page moves
    var header = document.querySelector(".header.header-three");
    if (header) {
      var lgS = null;
      var onScroll = function (y) { var v = (y || 0) > 40; if (v !== lgS) { lgS = v; header.classList.toggle("lg-scrolled", v); } };
      if (window.lgOnScroll) window.lgOnScroll(onScroll); else window.addEventListener("scroll", function () { onScroll(window.pageYOffset); }, { passive: true });
      onScroll(window.pageYOffset);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
