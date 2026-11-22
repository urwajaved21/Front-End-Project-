/* ==========================================================
   EventPulse — tabs.js
   Turns the three stacked agenda days into tabs.
   Without JavaScript all three days simply stay visible.

   Keyboard: Left / Right arrows move between tabs, Home / End jump.
   Link to a day directly with index.html#day2 (or #day1, #day3).
   ========================================================== */

(function () {
  "use strict";

  EP.ready(function () {
    var root = document.querySelector("[data-tabs]");
    if (!root) return;

    var panels = Array.prototype.slice.call(root.querySelectorAll(".agenda-day"));
    if (panels.length < 2) return;

    var list = document.createElement("div");
    list.className = "tabs";
    list.setAttribute("role", "tablist");
    list.setAttribute("aria-label", "Agenda day");

    var tabs = panels.map(function (panel, i) {
      var tab = document.createElement("button");
      tab.type = "button";
      tab.className = "tab";
      tab.id = "tab-" + panel.id;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panel.id);
      tab.innerHTML = "<span></span><small></small>";
      tab.firstChild.textContent = panel.getAttribute("data-day-label");
      tab.lastChild.textContent = panel.getAttribute("data-day-date");

      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", tab.id);

      tab.addEventListener("click", function () { select(i, true); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % panels.length;
        else if (e.key === "ArrowLeft") next = (i - 1 + panels.length) % panels.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = panels.length - 1;
        if (next === null) return;
        e.preventDefault();
        select(next, true);
        tabs[next].focus();
      });

      list.appendChild(tab);
      return tab;
    });

    root.insertBefore(list, root.firstChild);
    root.classList.add("is-tabbed");

    function select(index, updateHash) {
      panels.forEach(function (panel, j) {
        panel.hidden = j !== index;
        tabs[j].setAttribute("aria-selected", j === index ? "true" : "false");
        tabs[j].tabIndex = j === index ? 0 : -1;
      });
      if (updateHash) {
        try { history.replaceState(null, "", "#" + panels[index].id); } catch (err) { /* not important */ }
      }
    }

    function indexFromHash() {
      var id = location.hash.slice(1);
      for (var i = 0; i < panels.length; i++) if (panels[i].id === id) return i;
      return -1;
    }

    var fromHash = indexFromHash();
    select(fromHash === -1 ? 0 : fromHash, false);
    if (fromHash !== -1) root.scrollIntoView();   // the browser couldn't jump to a hidden panel

    window.addEventListener("hashchange", function () {
      var i = indexFromHash();
      if (i !== -1) { select(i, false); root.scrollIntoView(); }
    });
  });
})();
