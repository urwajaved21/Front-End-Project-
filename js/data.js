/* ==========================================================
   EventPulse — data.js
   SAMPLE DATA. Replace with your real events, speakers and venue.
   Every other script reads from this one file.

   - capacity / taken : seats. "taken" is the starting value; after that
     the browser remembers changes in localStorage.
   - start / end      : local time, used for calendar invites.
   - links            : optional, e.g. [{ label: "LinkedIn", url: "https://..." }]
   ========================================================== */

"use strict";

window.EP = window.EP || {};

EP.events = [
    {"id": "codesprint", "type": "hackathon", "label": "Hackathon", "title": "CodeSprint 24h Hackathon", "date": "11–12 Dec", "start": "2026-12-11T16:00", "end": "2026-12-12T16:00", "place": "Main Auditorium", "capacity": 120, "taken": 64, "blurb": "Form a team and build a working project in 24 hours. Mentors on hand, prizes for the top three teams."},
    {"id": "webdev", "type": "bootcamp", "label": "Bootcamp", "title": "Web Dev Bootcamp", "date": "11 Dec", "start": "2026-12-11T09:00", "end": "2026-12-11T12:30", "place": "Computer Lab 2", "capacity": 60, "taken": 42, "blurb": "A hands-on morning covering HTML, CSS and JavaScript. You leave with your own small site."},
    {"id": "careers", "type": "lecture", "label": "Guest lecture", "title": "Careers in Software Engineering", "date": "10 Dec", "start": "2026-12-10T14:00", "end": "2026-12-10T15:00", "place": "Seminar Hall", "capacity": 200, "taken": 95, "blurb": "An industry guest explains how to land a first tech role, with time for questions."},
    {"id": "git", "type": "bootcamp", "label": "Bootcamp", "title": "Git & GitHub Essentials", "date": "10 Dec", "start": "2026-12-10T11:30", "end": "2026-12-10T13:00", "place": "Computer Lab 1", "capacity": 60, "taken": 22, "blurb": "Version control from zero: commits, branches, pull requests and working in a team."},
    {"id": "uijam", "type": "hackathon", "label": "Hackathon", "title": "UI Jam: Design & Build", "date": "10 Dec", "start": "2026-12-10T15:00", "end": "2026-12-10T21:00", "place": "Innovation Hub", "capacity": 40, "taken": 40, "blurb": "A 6-hour front-end challenge. Take a design brief and turn it into a live page."},
    {"id": "ai", "type": "lecture", "label": "Guest lecture", "title": "AI in Practice", "date": "11 Dec", "start": "2026-12-11T14:00", "end": "2026-12-11T15:30", "place": "Seminar Hall", "capacity": 150, "taken": 71, "blurb": "A practical talk on how developers use AI tools in real projects, and where they fall short."}
];

EP.speakers = [
    {"id": 1, "initials": "AM", "name": "Ayesha Malik", "role": "Senior Software Engineer", "session": "Opening keynote", "bio": "Ayesha has spent nine years building web platforms at product companies. She talks about shipping small projects in public and learning from the feedback.", "links": []},
    {"id": 2, "initials": "DR", "name": "Daniyal Raza", "role": "Front-End Lead", "session": "Web Dev Bootcamp", "bio": "Daniyal leads a front-end team and has taught HTML, CSS and JavaScript to hundreds of beginners. His workshops are mostly live coding.", "links": []},
    {"id": 3, "initials": "SI", "name": "Sana Iqbal", "role": "UX Designer", "session": "UI Jam judge", "bio": "Sana designs interfaces for mobile and web products. She will judge UI Jam on usability, clarity and how well the build matches the brief.", "links": []},
    {"id": 4, "initials": "HS", "name": "Hamza Siddiqui", "role": "Data Scientist", "session": "AI in Practice", "bio": "Hamza builds machine-learning features for a consumer app. His talk covers where AI tools save time in real projects and where they get in the way.", "links": []},
    {"id": 5, "initials": "MK", "name": "Maria Khan", "role": "Open-Source Maintainer", "session": "Git & GitHub Essentials", "bio": "Maria maintains a popular open-source library and reviews pull requests every week. She will show how teams actually use Git day to day.", "links": []},
    {"id": 6, "initials": "BA", "name": "Bilal Ahmed", "role": "Startup Founder", "session": "Careers in Software Engineering", "bio": "Bilal started his company straight out of university. He has hired junior engineers and will explain what he looks for in a first application.", "links": []},
    {"id": 7, "initials": "FQ", "name": "Dr. Farhan Qureshi", "role": "Faculty Mentor", "session": "CodeSprint mentor", "bio": "Dr. Qureshi teaches software engineering and has mentored student teams at hackathons for years. He helps teams scope their idea so it can be finished.", "links": []},
    {"id": 8, "initials": "ZH", "name": "Zara Hussain", "role": "DevOps Engineer", "session": "CodeSprint mentor", "bio": "Zara looks after deployment and infrastructure for a cloud team. She helps hackathon teams get their project online before the demos.", "links": []}
];

EP.venue = {"name": "Innovation Hub, Main Campus", "address": "University Road, Block C (sample address)", "lat": 33.6844, "lng": 73.0479, "zoom": 16};

EP.config = {
  seatLowRatio: 0.3,   // at or below this share of seats left = "filling fast"
  simulateLive: true,        // fake other people registering so the counters move
  simulateEveryMs: [15000, 30000]
};

// Small helper: run a function once the page is ready
EP.ready = function (fn) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
  else fn();
};

EP.escapeHtml = function (text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

EP.byId = function (list, id) {
  return list.find(function (item) { return String(item.id) === String(id); });
};
