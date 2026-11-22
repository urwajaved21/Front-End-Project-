/* ==========================================================
   EventPulse — register.js
   The registration overlay, used by every "Register" button.

   Flow:
   1. Any element with data-register opens the pop-up
      (data-event="codesprint" pre-selects that event).
   2. The form is checked before it is accepted (see validate()).
   3. A full event adds the person to the waitlist instead of taking a seat.
   4. On success the person gets a booking code and calendar buttons.

   Registrations are saved in the browser only (no server).
   ========================================================== */

(function () {
  "use strict";

  var NAME_RE  = /^[\p{L}][\p{L}\p{M} .'’-]+$/u;   // letters, spaces, . ' -  (at least 2 characters)
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var ROLL_RE  = /^[A-Za-z0-9][A-Za-z0-9\-\/ ]{2,19}$/;  // 3-20 letters, numbers, dash, slash

  var dialog = null;
  var view = null;
  var remembered = { name: "", email: "", roll: "" };  // kept when registering for another event

  // ---------- saved registrations ----------
  function allRegistrations() { return EP.store.get("registrations", []); }

  function saveRegistration(reg) {
    var list = allRegistrations();
    list.push(reg);
    EP.store.set("registrations", list);
  }

  function makeCode() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid mix-ups
    var out = "";
    for (var i = 0; i < 6; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return "EP-" + out;
  }

  // ---------- date text ----------
  function dayText(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  function timeText(iso) { return iso.slice(11, 16); }

  function whenText(ev) {
    if (ev.start.slice(0, 10) === ev.end.slice(0, 10)) {
      return dayText(ev.start) + ", " + timeText(ev.start) + "–" + timeText(ev.end);
    }
    return dayText(ev.start) + ", " + timeText(ev.start) + " to " + dayText(ev.end) + ", " + timeText(ev.end);
  }

  // ---------- validation ----------
  function validate(v) {
    var err = {};
    var name = v.name.trim(), email = v.email.trim().toLowerCase(), roll = v.roll.trim();

    if (!name) err.name = "Enter your full name.";
    else if (!NAME_RE.test(name)) err.name = "Use letters only, at least 2 characters.";

    if (!email) err.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email)) err.email = "Enter a valid email, like you@university.edu.";

    if (!roll) err.roll = "Enter your university or roll number.";
    else if (!ROLL_RE.test(roll)) err.roll = "Use 3 to 20 letters, numbers, dashes or slashes.";

    if (!v.event) err.event = "Choose an event.";
    else if (!EP.byId(EP.events, v.event)) err.event = "That event no longer exists. Choose another.";

    if (!v.agree) err.agree = "You need to agree to continue.";

    // Same person, same event, twice
    if (!err.email && v.event && !err.event) {
      var duplicate = allRegistrations().some(function (r) { return r.email === email && r.eventId === v.event; });
      if (duplicate) err.email = "This email is already registered for this event.";
    }
    return err;
  }

  // ---------- form view ----------
  function optionsHtml(selected) {
    var html = '<option value="">Choose an event</option>';
    EP.events.forEach(function (ev) {
      var full = EP.seats.state(ev.id) === "full";
      var text = ev.title + " · " + ev.date + " · " + (full ? "sold out, join waitlist" : EP.seats.label(ev.id));
      html += '<option value="' + ev.id + '"' + (String(selected) === ev.id ? " selected" : "") + ">" + EP.escapeHtml(text) + "</option>";
    });
    return html;
  }

  function field(id, label, input, extra) {
    return '<div class="field" data-field="' + id + '">' +
      '<label for="rf-' + id + '">' + label + "</label>" + input +
      '<p class="field__error" id="rf-' + id + '-err" hidden></p>' + (extra || "") + "</div>";
  }

  function showForm(eventId) {
    var v = remembered;
    view.innerHTML =
      '<h2 id="register-dialog-title" tabindex="-1">Reserve your seat</h2>' +
      '<p class="modal__lead">Free for students. Takes under a minute.</p>' +
      '<form id="register-form" novalidate>' +
        field("name", "Full name", '<input id="rf-name" name="name" type="text" autocomplete="name" placeholder="Your name" autofocus aria-describedby="rf-name-err" value="' + EP.escapeHtml(v.name) + '">') +
        field("email", "Email", '<input id="rf-email" name="email" type="email" autocomplete="email" placeholder="you@university.edu" aria-describedby="rf-email-err" value="' + EP.escapeHtml(v.email) + '">') +
        field("roll", "University / roll number", '<input id="rf-roll" name="roll" type="text" placeholder="e.g. 21-CS-042" aria-describedby="rf-roll-err" value="' + EP.escapeHtml(v.roll) + '">') +
        field("event", "Event", '<select id="rf-event" name="event" aria-describedby="rf-event-err">' + optionsHtml(eventId) + "</select>",
              '<p class="field__hint" id="rf-seat-note" aria-live="polite"></p>') +
        '<div class="field field--check" data-field="agree">' +
          '<label><input id="rf-agree" name="agree" type="checkbox" aria-describedby="rf-agree-err"> I agree to the event code of conduct</label>' +
          '<p class="field__error" id="rf-agree-err" hidden></p></div>' +
        '<button class="btn" type="submit" id="rf-submit">Reserve my seat</button>' +
      "</form>";

    var form = view.querySelector("#register-form");
    form.addEventListener("submit", onSubmit);
    form.addEventListener("change", function (e) { if (e.target.name === "event") refreshSeatNote(); });
    form.addEventListener("focusout", function (e) { if (e.target.name) checkOne(e.target.name); });
    form.addEventListener("input", function (e) { if (e.target.name) clearIfFixed(e.target.name); });
    refreshSeatNote();
  }

  function values() {
    var f = view.querySelector("#register-form");
    return {
      name: f.elements.name.value,
      email: f.elements.email.value,
      roll: f.elements.roll.value,
      event: f.elements.event.value,
      agree: f.elements.agree.checked
    };
  }

  function refreshSeatNote() {
    var f = view.querySelector("#register-form");
    if (!f) return;
    var note = view.querySelector("#rf-seat-note");
    var btn = view.querySelector("#rf-submit");
    var id = f.elements.event.value;
    if (!id) { note.textContent = ""; btn.textContent = "Reserve my seat"; return; }
    if (EP.seats.state(id) === "full") {
      note.textContent = "This event is full. You'll be added to the waitlist.";
      btn.textContent = "Join waitlist";
    } else {
      note.textContent = EP.seats.label(id) + ".";
      btn.textContent = "Reserve my seat";
    }
  }

  // Keep the event list's seat numbers fresh while the pop-up is open
  function refreshOptions() {
    var f = view && view.querySelector("#register-form");
    if (!f || !dialog.open) return;
    var current = f.elements.event.value;
    f.elements.event.innerHTML = optionsHtml(current);
    refreshSeatNote();
  }

  // ---------- showing errors ----------
  function setError(name, message) {
    var box = view.querySelector('[data-field="' + name + '"]');
    if (!box) return;
    var msg = box.querySelector(".field__error");
    var input = box.querySelector("input, select");
    box.classList.toggle("has-error", !!message);
    msg.textContent = message || "";
    msg.hidden = !message;
    if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function checkOne(name) {
    var v = values();
    // Don't nag about an untouched empty field when the user just tabs past it
    if (name !== "agree" && name !== "event" && !String(v[name]).trim()) return;
    setError(name, validate(v)[name]);
  }

  function clearIfFixed(name) {
    var box = view.querySelector('[data-field="' + name + '"]');
    if (box && box.classList.contains("has-error") && !validate(values())[name]) setError(name, "");
  }

  // ---------- submit ----------
  function onSubmit(e) {
    e.preventDefault();
    var v = values();
    var err = validate(v);
    ["name", "email", "roll", "event", "agree"].forEach(function (k) { setError(k, err[k]); });

    var firstBad = ["name", "email", "roll", "event", "agree"].filter(function (k) { return err[k]; })[0];
    if (firstBad) {
      view.querySelector("#rf-" + firstBad).focus();
      return;
    }

    var btn = view.querySelector("#rf-submit");
    btn.disabled = true;
    btn.textContent = "Reserving…";

    // Short pause so it feels like a real request
    setTimeout(function () {
      var ev = EP.byId(EP.events, v.event);
      var status = "confirmed";
      var justSoldOut = false;

      if (EP.seats.state(ev.id) === "full") {
        status = "waitlist";
      } else if (!EP.seats.reserve(ev.id)) {
        status = "waitlist";      // the last seat went while the form was open
        justSoldOut = true;
      }

      var reg = {
        code: makeCode(),
        name: v.name.trim(),
        email: v.email.trim().toLowerCase(),
        roll: v.roll.trim(),
        eventId: ev.id,
        status: status,
        createdAt: new Date().toISOString()
      };
      saveRegistration(reg);
      remembered = { name: reg.name, email: reg.email, roll: reg.roll };
      showSuccess(reg, ev, justSoldOut);
    }, 450);
  }

  // ---------- success view ----------
  function showSuccess(reg, ev, justSoldOut) {
    var waitlist = reg.status === "waitlist";
    var first = EP.escapeHtml(reg.name.split(" ")[0]);

    var message = waitlist
      ? (justSoldOut ? "The last seat was just taken, so you're on the waitlist for this event." : "This event is full, so you're on the waitlist.") +
        " If a seat opens up, the organizers will contact you."
      : "Thanks, " + first + ". Keep your booking code, you'll need it at check-in.";

    var actions = waitlist ? "" :
      '<div class="success__actions">' +
        '<button type="button" class="btn" data-ics>Add to calendar (.ics)</button>' +
        '<a class="btn btn--ghost" href="' + EP.escapeHtml(EP.calendar.googleUrl(ev)) + '" target="_blank" rel="noopener">Google Calendar</a>' +
      "</div>";

    view.innerHTML =
      '<div class="success">' +
        '<div class="success__icon' + (waitlist ? " success__icon--wait" : "") + '" aria-hidden="true">' + (waitlist ? "…" : "✓") + "</div>" +
        '<h2 id="register-dialog-title" tabindex="-1">' + (waitlist ? "You're on the waitlist" : "You're in!") + "</h2>" +
        '<p class="modal__lead">' + message + "</p>" +
        '<dl class="summary">' +
          "<dt>Event</dt><dd>" + EP.escapeHtml(ev.title) + "</dd>" +
          "<dt>When</dt><dd>" + EP.escapeHtml(whenText(ev)) + "</dd>" +
          "<dt>Where</dt><dd>" + EP.escapeHtml(ev.place) + "</dd>" +
          "<dt>" + (waitlist ? "Waitlist code" : "Booking code") + '</dt><dd class="summary__code">' + reg.code + "</dd>" +
        "</dl>" + actions +
        '<div class="success__links">' +
          '<button type="button" class="linklike" data-another>Register for another event</button>' +
          '<button type="button" class="linklike" data-close>Close</button>' +
        "</div>" +
      "</div>";

    var ics = view.querySelector("[data-ics]");
    if (ics) ics.addEventListener("click", function () { EP.calendar.download(ev, reg); });
    view.querySelector("[data-another]").addEventListener("click", function () {
      showForm("");
      view.querySelector("#rf-event").focus();
    });
    view.querySelector("#register-dialog-title").focus();
  }

  // ---------- opening ----------
  function build() {
    dialog = EP.modal.create("register-dialog");
    dialog.innerHTML = '<div class="modal__box">' +
      '<button type="button" class="modal__close" data-close aria-label="Close">×</button>' +
      '<div id="register-view"></div></div>';
    view = dialog.querySelector("#register-view");
    EP.seats.onChange(refreshOptions);
  }

  function open(eventId, opener) {
    if (!dialog) build();
    showForm(EP.byId(EP.events, eventId) ? eventId : "");
    EP.modal.open(dialog, opener);
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-register]");
    if (!trigger) return;
    e.preventDefault();               // stay on the page, open the pop-up
    open(trigger.getAttribute("data-event"), trigger);
  });

  EP.register = { open: open, validate: validate };
})();
