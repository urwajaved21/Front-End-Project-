/* ==========================================================
   EventPulse — filters.js
   Events page: filter by type (chips) and search by text.
   Shows a friendly empty state when nothing matches.

   Link straight to a filter: events.html#hackathon,
   events.html#bootcamp or events.html#lecture.
   ========================================================== */

(function () {
  "use strict";

  EP.ready(function () {
    var grid = document.getElementById("event-grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".event-card"));
    var chips = Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]"));
    var search = document.getElementById("event-search");
    var count = document.getElementById("event-count");
    var empty = document.getElementById("empty-state");
    var clear = document.getElementById("clear-filters");

    var TYPES = ["hackathon", "bootcamp", "lecture"];
    var type = "all";

    function apply() {
      var query = search.value.trim().toLowerCase();
      var shown = 0;

      cards.forEach(function (card) {
        var typeOk = type === "all" || card.getAttribute("data-type") === type;
        var textOk = !query || card.textContent.toLowerCase().replace(/\s+/g, " ").indexOf(query) !== -1;
        card.hidden = !(typeOk && textOk);
        if (!card.hidden) shown++;
      });

      count.textContent = "Showing " + shown + " of " + cards.length + " events";
      empty.hidden = shown !== 0;
      grid.hidden = shown === 0;

      chips.forEach(function (chip) {
        var on = chip.getAttribute("data-filter") === type;
        chip.classList.toggle("is-active", on);
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }

    function setType(next, updateHash) {
      type = next;
      apply();
      if (updateHash) {
        try { history.replaceState(null, "", type === "all" ? location.pathname + location.search : "#" + type); } catch (err) { /* not important */ }
      }
    }

    function typeFromHash() {
      var h = location.hash.slice(1).toLowerCase().replace(/s$/, "");
      return TYPES.indexOf(h) !== -1 ? h : "all";
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () { setType(chip.getAttribute("data-filter"), true); });
    });
    search.addEventListener("input", apply);
    clear.addEventListener("click", function () { search.value = ""; setType("all", true); search.focus(); });
    window.addEventListener("hashchange", function () { setType(typeFromHash(), false); });

    // Seat numbers change, so re-run the search text match when they do
    EP.seats.onChange(function () { if (search.value.trim()) apply(); });

    setType(typeFromHash(), false);
  });
})();
