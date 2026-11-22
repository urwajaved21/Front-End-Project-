/* ==========================================================
   EventPulse — map.js
   Venue map using Leaflet + OpenStreetMap.

   To keep the page fast, Leaflet is NOT loaded with the page.
   It is downloaded only when the visitor scrolls close to the
   venue section. If it can't load (offline, blocked), the page
   keeps the plain venue card and the "Get directions" link.

   Change the venue in data.js (EP.venue: lat, lng, name, address).
   ========================================================== */

(function () {
  "use strict";

  var LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  var LEAFLET_JS  = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

  // Download Leaflet's stylesheet and script, then call done(true) or done(false)
  function loadLeaflet(done) {
    if (typeof L !== "undefined") { done(true); return; }

    var waiting = 2, failed = false;
    function finished(ok) {
      if (!ok) failed = true;
      waiting--;
      if (waiting === 0) done(!failed && typeof L !== "undefined");
    }

    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = LEAFLET_CSS;
    css.onload = function () { finished(true); };
    css.onerror = function () { finished(false); };
    document.head.appendChild(css);

    var script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.onload = function () { finished(true); };
    script.onerror = function () { finished(false); };
    document.head.appendChild(script);
  }

  function drawMap(box) {
    var v = EP.venue;

    box.innerHTML = "";
    box.classList.remove("map-placeholder");
    box.classList.add("map");
    box.removeAttribute("role");
    box.removeAttribute("aria-label");

    var map = L.map(box, { scrollWheelZoom: false }).setView([v.lat, v.lng], v.zoom);

    var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Pin made from CSS, so no image files are needed
    var pin = L.divIcon({
      className: "map-pin",
      html: "<span></span>",
      iconSize: [28, 28],
      iconAnchor: [14, 28],
      popupAnchor: [0, -26]
    });

    L.marker([v.lat, v.lng], { icon: pin, title: v.name })
      .addTo(map)
      .bindPopup("<strong>" + EP.escapeHtml(v.name) + "</strong><br>" + EP.escapeHtml(v.address))
      .openPopup();

    // Scroll-zoom only after the person clicks the map, so it doesn't hijack page scrolling
    map.on("focus", function () { map.scrollWheelZoom.enable(); });
    map.on("blur", function () { map.scrollWheelZoom.disable(); });

    // If the map pictures can't load (offline), say so and show the address
    var failed = 0;
    tiles.on("tileerror", function () {
      failed++;
      if (failed !== 3) return;
      var note = document.createElement("p");
      note.className = "map-notice";
      note.textContent = "The map pictures couldn't load. Address: " + v.address + ".";
      box.appendChild(note);
    });
  }

  EP.ready(function () {
    var box = document.getElementById("venue-map");
    if (!box) return;

    var v = EP.venue;

    // Directions link always works, map or not
    var directions = document.getElementById("directions-link");
    if (directions) {
      directions.href = "https://www.google.com/maps/dir/?api=1&destination=" + v.lat + "," + v.lng;
    }

    if (box.getAttribute("data-map") === "off") return;   // map switched off for this copy of the page

    var started = false;
    function start() {
      if (started) return;
      started = true;
      loadLeaflet(function (ok) { if (ok) drawMap(box); });   // not ok: keep the fallback card
    }

    // Load when the venue section is about to scroll into view
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { observer.disconnect(); start(); }
      }, { rootMargin: "400px 0px" });
      observer.observe(box);
    } else {
      start();
    }
  });
})();
