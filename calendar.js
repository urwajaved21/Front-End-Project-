/* ==========================================================
   EventPulse — calendar.js
   Calendar invites after registering:
   - a downloadable .ics file (works with Apple, Outlook, Google)
   - a "Add to Google Calendar" link
   Times are written as local time, so they show at the same hour
   wherever the person's calendar is set.
   ========================================================== */

(function () {
  "use strict";

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // "2026-12-11T16:00" -> "20261211T160000"
  function stamp(local) {
    return local.replace(/[-:]/g, "") + "00";
  }

  function utcNow() {
    var d = new Date();
    return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
           pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + "Z";
  }

  // .ics text rules: escape \ ; , and new lines
  function clean(text) {
    return String(text).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  }

  // .ics lines should be 75 characters or fewer; longer ones continue on the next line after a space
  function fold(line) {
    var out = [];
    while (line.length > 74) {
      out.push(line.slice(0, 74));
      line = " " + line.slice(74);
    }
    out.push(line);
    return out.join("\r\n");
  }

  function buildIcs(ev, reg) {
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EventPulse//Tech Week//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + reg.code + "-" + ev.id + "@eventpulse",
      "DTSTAMP:" + utcNow(),
      "DTSTART:" + stamp(ev.start),
      "DTEND:" + stamp(ev.end),
      "SUMMARY:" + clean(ev.title),
      "LOCATION:" + clean(ev.place + ", " + EP.venue.name),
      "DESCRIPTION:" + clean(ev.blurb + "\nBooking code: " + reg.code),
      "BEGIN:VALARM",
      "TRIGGER:-PT1H",
      "ACTION:DISPLAY",
      "DESCRIPTION:" + clean(ev.title + " starts in 1 hour"),
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR"
    ];
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  function fileName(ev) {
    return ev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".ics";
  }

  function download(ev, reg) {
    var blob = new Blob([buildIcs(ev, reg)], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName(ev);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function googleUrl(ev) {
    var params = new URLSearchParams({
      action: "TEMPLATE",
      text: ev.title,
      dates: stamp(ev.start) + "/" + stamp(ev.end),
      details: ev.blurb,
      location: ev.place + ", " + EP.venue.name
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  EP.calendar = { ics: buildIcs, download: download, googleUrl: googleUrl, fileName: fileName };
})();
