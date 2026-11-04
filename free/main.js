/* Faithfully Built — free chapter page logic.
   You shouldn't need to edit this file. Settings live in config.js. */
(function () {
  "use strict";

  var cfg = window.FB_CONFIG || {};
  var FALLBACK_LAYLO = "https://laylo.com/isaiahleemusic/2QuLgX";
  var CONSENT_KEY = "fb_free_consent";

  /* ---------- 1. Build the Laylo link, carrying campaign info along ---------- */
  var PASS_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];

  function buildSignupUrl(ctaLocation) {
    var url;
    try {
      url = new URL(cfg.LAYLO_URL || FALLBACK_LAYLO);
    } catch (e) {
      url = new URL(FALLBACK_LAYLO);
    }
    var here = new URLSearchParams(window.location.search);
    PASS_PARAMS.forEach(function (key) {
      var val = here.get(key);
      if (val && !url.searchParams.has(key)) url.searchParams.set(key, val);
    });
    // Default attribution if the visitor didn't arrive from a tagged ad
    if (!url.searchParams.has("utm_source")) url.searchParams.set("utm_source", "free-chapter-page");
    if (!url.searchParams.has("utm_content") && ctaLocation) url.searchParams.set("utm_content", ctaLocation);
    return url.toString();
  }

  var ctas = document.querySelectorAll("[data-cta]");
  ctas.forEach(function (a) {
    a.href = buildSignupUrl(a.getAttribute("data-cta"));
  });

  /* ---------- 2. Privacy link + author photo from config ---------- */
  if (cfg.PRIVACY_POLICY_URL) {
    ["privacy-link", "consent-privacy"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = cfg.PRIVACY_POLICY_URL;
    });
  }

  if (cfg.AUTHOR_PHOTO) {
    var frame = document.getElementById("author-photo");
    if (frame) {
      var img = new Image();
      img.alt = "Isaiah Lee, author of Faithfully Built";
      img.loading = "lazy";
      img.decoding = "async";
      img.onload = function () {
        frame.innerHTML = "";
        frame.appendChild(img);
        frame.hidden = false;
        var grid = document.getElementById("author-grid");
        if (grid) grid.classList.add("has-photo");
      };
      img.src = cfg.AUTHOR_PHOTO;
    }
  }

  /* ---------- 3. Meta Pixel (only if an ID is set and the visitor allows it) ---------- */
  var pixelId = String(cfg.META_PIXEL_ID || "").trim();
  var gpc = navigator.globalPrivacyControl === true;

  function loadPixel() {
    if (window.fbq || !pixelId) return;
    /* Standard Meta Pixel base code */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
  }

  function storedConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function saveConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
  }

  if (pixelId && !gpc) {
    if (!cfg.REQUIRE_CONSENT) {
      loadPixel();
    } else {
      var choice = storedConsent();
      if (choice === "yes") {
        loadPixel();
      } else if (choice !== "no") {
        var banner = document.getElementById("consent");
        if (banner) {
          banner.hidden = false;
          banner.addEventListener("click", function (ev) {
            var btn = ev.target.closest("[data-consent]");
            if (!btn) return;
            var v = btn.getAttribute("data-consent");
            saveConsent(v);
            banner.hidden = true;
            if (v === "yes") loadPixel();
          });
        }
      }
    }
  }

  /* ---------- 4. Track button clicks (NOT a Lead — signups are tracked by Laylo) ---------- */
  window.dataLayer = window.dataLayer || [];

  ctas.forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var where = a.getAttribute("data-cta");

      // For Google Tag Manager / GA4 if you add it later
      window.dataLayer.push({ event: "free_chapter_click", cta_location: where });

      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "FreeChapterClick", { cta_location: where });

        // Give the pixel a moment to send before leaving the page.
        // Skip the delay for new-tab / modified clicks.
        if (!(ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button === 1)) {
          ev.preventDefault();
          var dest = a.href;
          setTimeout(function () { window.location.href = dest; }, 250);
        }
      }
    });
  });
})();
