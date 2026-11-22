/* ==========================================================
   EventPulse — accordion.js
   FAQ accordion: click a question to open its answer.
   Only one answer is open at a time, and the first starts open.
   Without JavaScript every answer stays visible.
   ========================================================== */

(function () {
  "use strict";

  EP.ready(function () {
    var root = document.querySelector("[data-accordion]");
    if (!root) return;

    var items = Array.prototype.slice.call(root.querySelectorAll(".faq-item"));
    root.classList.add("is-enhanced");   // lets the CSS drop its no-JavaScript spacing

    items.forEach(function (item, i) {
      var heading = item.querySelector("h3");
      var answer = item.querySelector("p");
      if (!heading || !answer) return;

      var buttonId = "faq-q" + (i + 1);
      var panelId = "faq-a" + (i + 1);

      // Turn the question text into a button
      var button = document.createElement("button");
      button.type = "button";
      button.className = "faq-btn";
      button.id = buttonId;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      button.innerHTML = "<span></span><span class='faq-icon' aria-hidden='true'></span>";
      button.firstChild.textContent = heading.textContent;
      heading.textContent = "";
      heading.appendChild(button);

      // Wrap the answer in a panel that can be hidden
      var panel = document.createElement("div");
      panel.className = "faq-a";
      panel.id = panelId;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", buttonId);
      panel.hidden = true;
      item.insertBefore(panel, answer);
      panel.appendChild(answer);

      button.addEventListener("click", function () { toggle(i); });
    });

    function toggle(index) {
      items.forEach(function (item, j) {
        var button = item.querySelector(".faq-btn");
        var panel = item.querySelector(".faq-a");
        if (!button || !panel) return;
        var open = j === index && button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", open ? "true" : "false");
        panel.hidden = !open;
        item.classList.toggle("is-open", open);
      });
    }

    toggle(0); // first question open by default
  });
})();
