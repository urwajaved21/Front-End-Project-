/* ==========================================================
   EventPulse — speakers.js
   Speaker profile pop-up. Any button with data-speaker="1"
   opens the profile for that speaker (details live in data.js).
   ========================================================== */

(function () {
  "use strict";

  var dialog = null;

  function open(id, opener) {
    var s = EP.byId(EP.speakers, id);
    if (!s) return;
    if (!dialog) dialog = EP.modal.create("speaker-dialog");

    var esc = EP.escapeHtml;
    var links = (s.links || []).map(function (l) {
      return '<a class="btn btn--ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + "</a>";
    }).join("");

    dialog.innerHTML =
      '<div class="modal__box">' +
        '<button type="button" class="modal__close" data-close aria-label="Close">×</button>' +
        '<div class="speaker-modal__head">' +
          '<div class="speaker-card__photo" aria-hidden="true">' + esc(s.initials) + "</div>" +
          "<div>" +
            '<h2 id="speaker-dialog-title">' + esc(s.name) + "</h2>" +
            '<p class="speaker-card__role">' + esc(s.role) + "</p>" +
          "</div>" +
        "</div>" +
        "<p>" + esc(s.bio) + "</p>" +
        '<p class="speaker-modal__session"><span>Session</span>' + esc(s.session) + "</p>" +
        '<div class="success__actions">' + links +
          '<a class="btn" href="index.html#agenda" data-close>See the agenda</a>' +
        "</div>" +
      "</div>";

    EP.modal.open(dialog, opener);
  }

  document.addEventListener("click", function (e) {
    var button = e.target.closest("[data-speaker]");
    if (button) open(button.getAttribute("data-speaker"), button);
  });
})();
