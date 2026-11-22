/* ==========================================================
   EventPulse — modal.js
   Small helper for pop-ups (speaker profile, registration).
   Uses the native <dialog> element, which gives us:
   Escape to close, a dimmed backdrop and keyboard focus kept inside.
   ========================================================== */

(function () {
  "use strict";

  EP.modal = {
    // Create an empty dialog and add it to the page
    create: function (id) {
      var dialog = document.createElement("dialog");
      dialog.id = id;
      dialog.className = "modal";
      dialog.setAttribute("aria-labelledby", id + "-title");
      document.body.appendChild(dialog);

      dialog.addEventListener("click", function (e) {
        // A click on the dimmed backdrop lands on the dialog itself
        if (e.target === dialog || e.target.closest("[data-close]")) EP.modal.close(dialog);
      });

      dialog.addEventListener("close", function () {
        document.documentElement.classList.remove("modal-open");
        // Give focus back to the button that opened the pop-up
        if (dialog._opener && document.contains(dialog._opener)) dialog._opener.focus();
      });

      return dialog;
    },

    open: function (dialog, opener) {
      dialog._opener = opener || document.activeElement;
      if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute("open", ""); // very old browsers
      }
      document.documentElement.classList.add("modal-open");
    },

    close: function (dialog) {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
        dialog.dispatchEvent(new Event("close"));
      }
    }
  };
})();
