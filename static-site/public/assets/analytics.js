// Google Analytics 4. The measurement ID comes from the GA_MEASUREMENT_ID
// environment variable on Netlify (injected into the page by
// netlify/edge-functions/story-meta.js), so nothing needs editing here.
// Without an ID every call below does nothing.
(function () {
  var meta = document.querySelector('meta[name="ga-measurement-id"]');
  var id = meta && meta.content;

  window.TruyenCuoi = window.TruyenCuoi || {};
  window.TruyenCuoi.track = function () {};
  if (!id) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  // Page views (including /story/<id> changes made by the "Another one" button)
  // are recorded by GA's enhanced measurement.
  window.gtag("config", id);

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(script);

  window.TruyenCuoi.track = function (name, params) { window.gtag("event", name, params || {}); };
})();
