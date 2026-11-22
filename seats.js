/* ==========================================================
   EventPulse — seats.js
   Live seat counters.

   - Starting numbers come from data.js (capacity and taken).
   - Every registration adds one to "taken". The browser remembers it.
   - There is no server, so a timer also adds a seat now and then,
     to imitate other people registering (switch off with
     EP.config.simulateLive = false in data.js).

   Three states per event:
     open  -> plenty of seats
     low   -> 30% or less left ("filling fast", amber)
     full  -> sold out (red), registering joins the waitlist
   ========================================================== */

(function () {
  "use strict";

  var added = {};          // seats added on top of the starting numbers
  var listeners = [];

  function load() {
    added = EP.store.get("added", {}) || {};
  }

  function find(id) { return EP.byId(EP.events, id); }

  function taken(id) {
    var ev = find(id);
    if (!ev) return 0;
    var extra = Number(added[ev.id]) || 0;
    return Math.min(ev.capacity, Math.max(0, ev.taken + extra));
  }

  function left(id) {
    var ev = find(id);
    return ev ? ev.capacity - taken(id) : 0;
  }

  function state(id) {
    var ev = find(id);
    if (!ev) return "full";
    var l = left(id);
    if (l <= 0) return "full";
    if (l / ev.capacity <= EP.config.seatLowRatio) return "low";
    return "open";
  }

  function label(id) {
    var l = left(id), s = state(id);
    if (s === "full") return "Sold out";
    if (s === "low") return "Only " + l + " left";
    return l + " seats left";
  }

  function addOne(id) {
    load(); // pick up changes made in another tab
    if (left(id) <= 0) return false;
    added[id] = (Number(added[id]) || 0) + 1;
    EP.store.set("added", added);
    render(id);
    listeners.forEach(function (fn) { fn(id); });
    return true;
  }

  // Update every counter, bar and Register button on the page
  function render(bumpId) {
    var els = document.querySelectorAll("[data-seats]");
    Array.prototype.forEach.call(els, function (el) {
      var id = el.getAttribute("data-seats"), s = state(id);
      el.textContent = label(id);
      el.classList.toggle("seats--low", s === "low");
      el.classList.toggle("seats--full", s === "full");
      if (bumpId !== undefined && String(bumpId) === id) {
        el.classList.remove("is-bumped");
        void el.offsetWidth; // restart the little pulse animation
        el.classList.add("is-bumped");
      }
    });

    var buttons = document.querySelectorAll("a[data-register][data-event]");
    Array.prototype.forEach.call(buttons, function (a) {
      a.textContent = state(a.getAttribute("data-event")) === "full" ? "Join waitlist" : "Register";
    });

    var cap = 0, tk = 0;
    EP.events.forEach(function (ev) { cap += ev.capacity; tk += taken(ev.id); });
    setText("[data-meter-taken]", tk);
    setText("[data-meter-total]", cap);
    setText("[data-total-seats]", cap);
    setText("[data-hero-seats]", "Free, " + (cap - tk) + " seats left");
    var bar = document.querySelector("[data-meter-bar]");
    if (bar) bar.style.width = Math.round((tk / cap) * 100) + "%";
  }

  function setText(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  // Pretend other people are registering (only events that still have plenty of seats)
  function simulateOne() {
    load();
    var open = EP.events.filter(function (ev) { return state(ev.id) === "open"; });
    if (!open.length) return;
    addOne(open[Math.floor(Math.random() * open.length)].id);
  }

  function scheduleSimulation() {
    var range = EP.config.simulateEveryMs;
    var wait = range[0] + Math.random() * (range[1] - range[0]);
    setTimeout(function () {
      if (!document.hidden) simulateOne();
      scheduleSimulation();
    }, wait);
  }

  EP.seats = {
    taken: taken,
    left: left,
    state: state,
    label: label,
    reserve: addOne,
    render: render,
    onChange: function (fn) { listeners.push(fn); }
  };

  EP.ready(function () {
    load();
    render();
    if (EP.config.simulateLive) scheduleSimulation();
    // Keep several open tabs in sync
    window.addEventListener("storage", function () { load(); render(); listeners.forEach(function (fn) { fn(); }); });
  });
})();
