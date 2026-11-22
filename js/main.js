/* ==========================================================
   EventPulse — main.js
   Mobile menu and footer year (used on every page).
   Features live in their own files: tabs.js, accordion.js, speakers.js,
   register.js, seats.js, calendar.js, map.js, filters.js.
   ========================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ---- Footer year ----
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ---- Mobile menu ----
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu after tapping a link
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setOpen(false);
  });

  // Close with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  // Close if the window grows to desktop size (e.g. a tablet is rotated)
  const desktop = window.matchMedia("(min-width: 801px)");
  const onResize = (e) => { if (e.matches) setOpen(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", onResize);
  else desktop.addListener(onResize); // older Safari
});
