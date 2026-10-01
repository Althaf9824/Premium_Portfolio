/***************************************************
==================== JS INDEX ======================
****************************************************

01. PreLoader Js
02. Sticky Js
03. Menu Controls JS
04. offcanvas Menu JS
05. offcanvas two Menu JS
06. Sidebar Js
07. AOS Js
08. Backtotop Js
09. Magnific Popup Js
10. Counter Js
11. Feature Widget Animation Js
12. Service Two Images Hover Animation Js
13. Bg Image For Attribute  Js
14. Mouse active Js





****************************************************/

(function ($) {
  "use strict";

  ////////////////////////////////////////////////////
  // 01. PreLoader Js
  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const preloader = document.querySelector(".preloader");
    const svg = document.getElementById("preloaderSvg");
    const cover = "M0,1005S175,995,500,995s500,5,500,5V0H0Z"; // original full-cover shape
    const curve = "M0 520S220 250 520 290s480 230 480 230V0H0Z";
    const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";

    // Transition state: loadingStart -> loadingActive -> loadingExit -> pageRevealed
    // CSS keeps the navbar hidden until pageRevealed.
    const setState = (state) => body.setAttribute("data-transition", state);

    // Safety net: never leave the site without a navbar if GSAP fails to load
    if (!window.gsap || !preloader) {
      if (preloader) preloader.style.display = "none";
      setState("pageRevealed");
      return;
    }
    const failSafe = setTimeout(() => {
      preloader.style.display = "none";
      setState("pageRevealed");
    }, 8000);

    // Create GSAP timeline (existing animation, unchanged timings)
    setState("loadingActive");
    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(failSafe);
        setState("pageRevealed"); // navbar appears only now, after the loader is fully gone
      },
    });

    // Text animation
    tl.to(".preloader-heading .load-text, .preloader-heading .cont", {
      delay: 0.35,
      y: -40,
      opacity: 0,
      duration: 0.3,
    })
      // SVG curve animation (page starts to be revealed)
      .call(() => setState("loadingExit"))
      .to(svg, {
        duration: 0.4,
        attr: { d: curve },
        ease: "power2.inOut",
      })
      // Flatten SVG
      .to(svg, {
        duration: 0.35,
        attr: { d: flat },
        ease: "power2.inOut",
      })
      // Slide preloader up
      .to(".preloader", {
        y: "-130%",
        duration: 0.45,
        ease: "power3.inOut",
      })
      // Remove from DOM flow
      .set(".preloader", {
        display: "none",
        zIndex: -1,
      });

    // Clicking an internal page link: cover the screen instantly (same loader, same shape)
    // so the old navbar can't flash while the browser switches pages.
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.hasAttribute("data-scroll") || a.hasAttribute("download") || a.hasAttribute("data-fancybox")) return;
      const target = a.getAttribute("target");
      if (target && target !== "_self") return;
      const href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(href)) return;
      let url;
      try { url = new URL(a.href, location.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      const file = url.pathname.split("/").pop();
      if (file && /\.[a-z0-9]+$/i.test(file) && !/\.(html?|php)$/i.test(file)) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;

      clearTimeout(failSafe);
      tl.kill();
      gsap.set(".preloader", { clearProps: "all" });
      gsap.set(".preloader-heading .load-text, .preloader-heading .cont", { clearProps: "all" });
      gsap.set(svg, { attr: { d: cover } });
      setState("loadingStart");
    });

    // Back/forward cache: page restored with the loader frozen on screen
    window.addEventListener("pageshow", (e) => {
      if (!e.persisted) return;
      preloader.style.display = "none";
      setState("pageRevealed");
    });
  });

  ////////////////////////////////////////////////////
  // 02. Sticky Js
  var $hdr = $(".header"), $btt = $(".back-to-top-wrapper"), lgFixed = null, lgBtt = null, lgTick = false;
  window.lgOnScroll = function (fn) { (window.lgOnScroll.q = window.lgOnScroll.q || []).push(fn); };
  function lgScrollFrame() {
    lgTick = false;
    var y = window.pageYOffset || 0;
    var f = y >= 260, b = y > 300;
    if (f !== lgFixed) { lgFixed = f; $hdr.toggleClass("fixed-header", f); }
    if (b !== lgBtt) { lgBtt = b; $btt.toggleClass("back-to-top-btn-show", b); }
    (window.lgOnScroll.q || []).forEach(function (fn) { fn(y); });
  }
  window.addEventListener("scroll", function () {
    if (!lgTick) { lgTick = true; requestAnimationFrame(lgScrollFrame); }
  }, { passive: true });

  ////////////////////////////////////////////////////
  // 03. Menu Controls JS
  $(".tw-hamburger-toggle").on("click", function () {
    $(".tw-header-side-menu").slideToggle("tw-header-side-menu");
  });
  if ($(".tw-main-menu-content").length && $(".tw-main-menu-mobile").length) {
    let navContent = document.querySelector(".tw-main-menu-content").outerHTML;
    let mobileNavContainer = document.querySelector(".tw-main-menu-mobile");
    mobileNavContainer.innerHTML = navContent;
    let arrow = $(".tw-main-menu-mobile .has-dropdown > a");
    arrow.each(function () {
      let self = $(this);
      let arrowBtn = document.createElement("BUTTON");
      arrowBtn.classList.add("dropdown-toggle-btn");
      arrowBtn.innerHTML = "<i class='ph ph-caret-right'></i>";
      self.append(function () {
        return arrowBtn;
      });
      self.find("button").on("click", function (e) {
        e.preventDefault();
        let self = $(this);
        self.toggleClass("dropdown-opened");
        self.parent().toggleClass("expanded");
        self
          .parent()
          .parent()
          .addClass("dropdown-opened")
          .siblings()
          .removeClass("dropdown-opened");
        self.parent().parent().children(".tw-submenu").slideToggle();
      });
    });
  }

  ////////////////////////////////////////////////////
  // 04. offcanvas Menu JS
  $(".tw-offcanvas-open-btn").on("click", function () {
    $(".tw-offcanvas-2-area").addClass("opened");
    document.body.classList.add("lg-menu-open");

    setTimeout(() => {
      $(".tw-text-hover-effect-word").addClass("animated-text");
    }, 900);
  });

  ////////////////////////////////////////////////////
  // 05. offcanvas two Menu JS
  $(".tw-offcanvas-2-close-btn").on("click", function () {
    setTimeout(() => {
      $(".tw-text-hover-effect-word").removeClass("animated-text");
    }, 1200);

    $(".tw-offcanvas-2-area").removeClass("opened");
    document.body.classList.remove("lg-menu-open");
    $(".body-overlay").removeClass("opened");
  });

  ////////////////////////////////////////////////////
  // 06. Sidebar Js
  $(".tw-menu-bar").on("click", function () {
    $(".twoffcanvas").addClass("opened");
    $(".body-overlay").addClass("apply");
  });
  $(".close-btn").on("click", function () {
    $(".twoffcanvas").removeClass("opened");
    $(".body-overlay").removeClass("apply");
  });
  $(".body-overlay").on("click", function () {
    $(".twoffcanvas").removeClass("opened");
    $(".body-overlay").removeClass("apply");
  });

  ////////////////////////////////////////////////////
  // 07. AOS Js
  AOS.init({
    once: false, // animation will happen every time you scroll
    offset: 0, // start animation when element enters the viewport
    anchorPlacement: "top-bottom", // when the bottom of the element hits the bottom of the screen
  });

  // 08. Backtotop Js
  function back_to_top() {
    var btn = $("#back_to_top");

    btn.on("click", function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 300);
    });
  }
  back_to_top();

  ////////////////////////////////////////////////////
  // 09. Magnific Popup Js
  $(".open-popup").magnificPopup({
    type: "iframe",
    removalDelay: 300,
    mainClass: "mfp-fade",
  });

  ////////////////////////////////////////////////////
  // 10. Counter Js
  new PureCounter();
  new PureCounter({
    filesizing: true,
    selector: ".filesizecount",
    pulse: 2,
  });

  ////////////////////////////////////////////////////
  // 11. Feature Widget Animation Js
  function service_animation() {
    var active_bg = $(".feature-widget .active-bg");
    var element = $(".feature-widget .current");
    $(".feature-widget .feature-2-item").on("mouseenter", function () {
      var e = $(this);
      activeService(active_bg, e);
    });
    $(".feature-widget").on("mouseleave", function () {
      element = $(".feature-widget .current");
      activeService(active_bg, element);
      element.closest(".feature-2-item").siblings().removeClass("mleave");
    });
    activeService(active_bg, element);
  }
  service_animation();
  function activeService(active_bg, e) {
    if (!e.length) {
      return false;
    }
    var topOff = e.offset().top;
    var height = e.outerHeight();
    var menuTop = $(".feature-widget").offset().top;
    e.closest(".feature-2-item").removeClass("mleave");
    e.closest(".feature-2-item").siblings().addClass("mleave");
    active_bg.css({ top: topOff - menuTop + "px", height: height + "px" });
  }
  $(".feature-widget .feature-2-item").on("click", function () {
    $(".feature-widget .feature-2-item").removeClass("current");
    $(this).addClass("current");
  });

  ////////////////////////////////////////////////////
  // 12. Service Two Images Hover Animation Js
  $(".service-two-list-wrap .service-two-list-item").on(
    "mouseenter",
    function () {
      $("#service-two-thumb").removeClass().addClass($(this).attr("rel"));
      $(this).addClass("active").siblings().removeClass("active");
    },
  );

  ////////////////////////////////////////////////////
  // 13. Bg Image For Attribute  Js
  $(".bg-img").each(function () {
    var img = $(this).data("background-image");
    if (img) {
      $(this).css("background-image", "url('" + img + "')");
    }
  });

  ////////////////////////////////////////////////////
  // 14. Mouse active Js
  $(document).ready(function () {
    $(".service-ip-wrapper").on("mouseenter", function () {
      $(this).addClass("active").siblings().removeClass("active");
    });

    $(".service-ip-wrapper").on("mouseenter", function () {
      $(this).addClass("active");
      $(this)
        .parent()
        .siblings()
        .find(".service-ip-wrapper")
        .removeClass("active");
    });
  });

  $(document).ready(function () {
    function initRipples() {
      $(".ripple-image").each(function () {
        var $container = $(this);
        var $img = $container.find("img").first();

        if ($img.length === 0) return;

        var img = new Image();
        img.src = $img.attr("src");

        img.onload = function () {
          var imgURL = img.src;

          $container.css({
            "background-image": "url(" + imgURL + ")",
            "background-size": "cover",
            "background-position": "center center",
          });

          // init ripples plugin
          if (typeof $container.ripples === "function") {
            $container.ripples({
              resolution: 400,
              perturbance: 0.03,
              imageUrl: imgURL,
            });
          }

          $img.hide();
        };
      });
    }

    initRipples();
  });
})(jQuery);
