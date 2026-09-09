/* ===========================================================
   UBT Sustainability Club — site behaviour
   Mobile nav + a safety net for the logo file.
   =========================================================== */
(function () {
  'use strict';

  /* --- mobile navigation --- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', function () {
      setOpen(!nav.classList.contains('open'));
    });
    nav.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'A') setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setOpen(false);
    });
  }

  /* --- logo safety net ---
     The official logo lives at assets/logo.png and is used exactly as
     supplied. If that file has not been added yet, fall back to a plain
     text wordmark so the header never renders as a broken image. */
  var logo = document.getElementById('brandLogo');
  var fallback = document.getElementById('brandFallback');
  if (logo && fallback) {
    var useFallback = function () {
      logo.hidden = true;
      logo.style.display = 'none';
      fallback.hidden = false;
    };
    logo.addEventListener('error', useFallback);
    if (logo.complete && logo.naturalWidth === 0) useFallback();
  }

  var footerLogo = document.getElementById('footerLogo');
  if (footerLogo) {
    var hideFooterLogo = function () { footerLogo.style.display = 'none'; };
    footerLogo.addEventListener('error', hideFooterLogo);
    if (footerLogo.complete && footerLogo.naturalWidth === 0) hideFooterLogo();
  }
})();
