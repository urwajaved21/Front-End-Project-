/* ==========================================================
   EventPulse — store.js
   Saves small bits of data in the browser (localStorage).
   If localStorage is blocked (private window, strict settings),
   it falls back to memory so the site still works for that visit.
   ========================================================== */

(function () {
  "use strict";

  var PREFIX = "eventpulse.v1.";
  var memory = {};

  EP.store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(PREFIX + key);
        if (raw !== null) return JSON.parse(raw);
      } catch (err) { /* blocked or corrupt: use memory below */ }
      return Object.prototype.hasOwnProperty.call(memory, key) ? memory[key] : fallback;
    },

    set: function (key, value) {
      memory[key] = value;
      try {
        window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (err) { /* blocked: memory copy is enough for this visit */ }
    }
  };
})();
