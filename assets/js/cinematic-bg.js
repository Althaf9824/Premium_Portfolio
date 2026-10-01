/* ==========================================================================
   PREMIUM 2026 CINEMATIC SCROLL BACKGROUND
   Additive enhancement only. Injects a fixed background layer behind the
   existing DOM and drives it with scroll — no existing content, text,
   images, or layout is modified, moved, or removed.
   ========================================================================== */
(function () {
  "use strict";

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function buildScene(kind) {
    const scene = document.createElement("div");
    scene.className = "cine-scene";
    scene.dataset.scene = kind;

    const dolly = document.createElement("div");
    dolly.className = "cine-dolly";
    scene.appendChild(dolly);

    const layer = document.createElement("div");
    layer.className = "cine-parallax-layer";
    dolly.appendChild(layer);

    switch (kind) {
      case "clouds": {
        for (let i = 0; i < 6; i++) {
          const c = document.createElement("div");
          c.className = "cine-cloud";
          const size = rand(180, 420);
          c.style.width = size + "px";
          c.style.height = size * 0.55 + "px";
          c.style.top = rand(-5, 70) + "%";
          c.style.left = rand(-10, 90) + "%";
          c.style.opacity = rand(0.35, 0.75);
          layer.appendChild(c);
        }
        break;
      }
      case "sky": {
        layer.style.background =
          "radial-gradient(60% 50% at 50% 0%, rgba(255,255,255,0.9), rgba(235,244,255,0.2) 60%, transparent 75%)";
        for (let i = 0; i < 10; i++) {
          const r = document.createElement("div");
          r.className = "cine-lightray";
          r.style.left = rand(5, 95) + "%";
          r.style.top = "-10%";
          r.style.height = rand(50, 90) + "%";
          r.style.transform = `rotate(${rand(-8, 8)}deg)`;
          layer.appendChild(r);
        }
        break;
      }
      case "glass": {
        for (let i = 0; i < 5; i++) {
          const g = document.createElement("div");
          g.className = "cine-glass-shape";
          const size = rand(120, 320);
          g.style.width = size + "px";
          g.style.height = size + "px";
          g.style.top = rand(0, 80) + "%";
          g.style.left = rand(0, 85) + "%";
          g.style.animationDelay = rand(0, 6) + "s";
          layer.appendChild(g);
        }
        break;
      }
      case "particles": {
        for (let i = 0; i < 26; i++) {
          const p = document.createElement("div");
          p.className = "cine-particle";
          p.style.left = rand(0, 100) + "%";
          p.style.top = rand(30, 100) + "%";
          p.style.animationDelay = rand(0, 18) + "s";
          p.style.animationDuration = rand(14, 26) + "s";
          layer.appendChild(p);
        }
        break;
      }
      case "gradient": {
        layer.style.background =
          "radial-gradient(70% 60% at 30% 30%, rgba(230,255,60,0.14), transparent 60%)," +
          "radial-gradient(60% 55% at 80% 70%, rgba(255,120,40,0.12), transparent 65%)";
        break;
      }
    }
    return scene;
  }

  function init() {
    // The scene layer is hidden by liquid-glass.css; only the reveal observer below is still needed.
    if (false) {

    const root = document.createElement("div");
    root.id = "cinematic-bg";
    root.setAttribute("aria-hidden", "true");

    const base = document.createElement("div");
    base.className = "cine-base";
    root.appendChild(base);

    const sceneOrder = ["clouds", "sky", "glass", "particles", "gradient"];
    const scenes = sceneOrder.map(buildScene);
    scenes.forEach((s) => root.appendChild(s));

    document.body.insertBefore(root, document.body.firstChild);
    scenes[0].classList.add("is-active");

    /* ---------------------------------------------------------------
       Scroll-driven scene switching + camera dolly intensity.
       Uses GSAP ScrollTrigger if available (already loaded by theme),
       otherwise falls back to a lightweight scroll listener.
       --------------------------------------------------------------- */
    const activate = (index) => {
      scenes.forEach((s, i) => s.classList.toggle("is-active", i === index));
    };

    function wireWithGSAP() {
      const st = window.ScrollTrigger;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;

      window.addEventListener(
        "scroll",
        throttle(() => {
          const progress = Math.min(
            1,
            Math.max(0, window.scrollY / (document.documentElement.scrollHeight - window.innerHeight))
          );
          const idx = Math.min(scenes.length - 1, Math.floor(progress * scenes.length));
          activate(idx);

          // subtle extra parallax offset layered on top of the CSS dolly animation
          const offset = progress * -60;
          root.style.transform = `translateY(${offset}px)`;
        }, 50)
      );
    }

    function throttle(fn, wait) {
      let last = 0;
      let timer = null;
      return function (...args) {
        const now = Date.now();
        if (now - last >= wait) {
          last = now;
          fn.apply(this, args);
        } else {
          clearTimeout(timer);
          timer = setTimeout(() => {
            last = Date.now();
            fn.apply(this, args);
          }, wait - (now - last));
        }
      };
    }

    wireWithGSAP();

    }
    /* ---------------------------------------------------------------
       Blur-to-clear reveal for existing section wrappers. Purely a
       class toggle driven by IntersectionObserver — no elements are
       created, removed, reordered, or repositioned.
       --------------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
      [
        ".about-three-thumb",
        ".about-three-counter",
        ".service-three-item",
        ".portfolio-three-item",
        ".testimonial-three-wrapper",
        ".brand-three-item",
      ].join(",")
    );

    revealTargets.forEach((el) => el.classList.add("cine-reveal"));

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("cine-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revealTargets.forEach((el) => io.observe(el));
    } else {
      revealTargets.forEach((el) => el.classList.add("cine-in"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
