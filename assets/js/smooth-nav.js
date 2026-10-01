/* Smooth section navigation
   Works for: header menu, ☷ offcanvas menu, VIEW PROJECTS button, footer quick links.
   Any <a data-scroll href="#section-id"> scrolls smoothly to that section. */
(function () {
  "use strict";

  var HEADER_OFFSET = 80; // space kept above the section so the sticky header doesn't cover it

  function getSmoother() {
    return window.ScrollSmoother && ScrollSmoother.get ? ScrollSmoother.get() : null;
  }

  function closeOffcanvas() {
    var area = document.querySelector(".tw-offcanvas-2-area");
    if (area && area.classList.contains("opened")) {
      area.classList.remove("opened");
      document.body.classList.remove("lg-menu-open");
      var overlay = document.querySelector(".body-overlay");
      if (overlay) overlay.classList.remove("opened");
      return true;
    }
    return false;
  }

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var offset = id === "home" ? 0 : HEADER_OFFSET;
    var smoother = getSmoother();

    if (smoother) {
      // Page default smoothing is very slow (4s) - speed it up just for menu jumps.
      var previous = smoother.smooth();
      smoother.smooth(1.1);
      smoother.scrollTo(el, true, "top " + offset + "px");
      clearTimeout(scrollToSection._t);
      scrollToSection._t = setTimeout(function () {
        smoother.smooth(previous);
      }, 1800);
    } else {
      var y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("a[data-scroll]");
    if (!link) return;
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#" || href.length < 2) return;
    e.preventDefault();
    var id = href.slice(1);
    var wasOpen = closeOffcanvas();
    // Give the offcanvas panel a moment to slide away before scrolling
    setTimeout(function () {
      scrollToSection(id);
    }, wasOpen ? 380 : 0);
  });
})();
