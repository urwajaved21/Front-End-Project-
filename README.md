# EventPulse

A website for campus tech events. Hackathons, coding bootcamps and guest lectures usually get announced in group chats and on posters, so people miss them or sign up late. EventPulse puts the schedule, the speakers, the venue and the sign-up in one place.

I'm building it as my project for the Zynvex Solutions Batch 5 virtual internship (Front End track).

- **Name:** Muhammad Urwa Javed
- **Internship ID:** ZYNVEX-CERT-2192
- **Live link:** not deployed yet (that's part of Module 4)

## Where the project is at

**Module 3 is done** (Nov 09 – Nov 15): everything on the site now works. The agenda has day tabs, speakers open in a popup, the FAQ is an accordion, the venue shows a map, and registration happens in an overlay with validation. Seat counters update live when someone registers, and any event can be added to a calendar.

**Module 3 (functionality)**

- Agenda tabs for Day 1, 2 and 3 (mouse, touch and arrow keys), opening on today's day if the festival is running
- Speaker popup with bio, sessions, a Register button and links
- FAQ accordion, one answer open at a time
- Venue map with Leaflet and OpenStreetMap, with a plain-address fallback if the map can't load
- Registration overlay with validation: name, email, optional student ID, event, experience level and consent
- Live seat counters with three states: **Seats open**, **Filling fast** (25% or fewer left) and **Sold out**
- Registration saves to `localStorage`, so seat counts and "You registered" tags survive a reload and sync between tabs
- Confirmation screen with a code and an **Add to calendar** button that downloads an `.ics` file (one event, or all of them)
- Event filters on the Events page: by type, hide sold-out, and `events.html?type=hackathon` links
- Edge cases: empty filter results, all events sold out, duplicate registration, an event selling out while the form is open, blocked `localStorage`, map failing to load, JavaScript turned off

**Module 2 (core structure and main pages)**

- Header with logo, nav links and a Register button, sticky at the top
- Mobile menu that opens from a hamburger button on small screens
- Footer with links, shared on every page
- Home page with every section filled in: hero, about, 3-day agenda, speakers, venue, FAQ and registration
- Events page with six event cards, Speakers page with eight speaker cards
- Base styling using the design tokens from Module 1

**Module 1 (planning and setup)**

- Decided what the site does and who it's for, listed every page and feature
- Sketched wireframes for desktop, mobile and the popups
- Picked the tools, set up this Git repo, chose colors, fonts and layout rules

The event names, speaker names, address and seat numbers are sample content I made up. They're consistent with each other (the agenda matches the events and the speakers) so I can swap in real details later.

## Who it's for

**Students** who want to see what's coming up, look at the speakers, check how many seats are left and register without hunting through messages.

**Organizers** who need one clean page that gets people to sign up.

## Pages

| Page | File | What it's for |
|---|---|---|
| Home | `index.html` | The main page: intro, agenda, speakers, venue map, FAQ and registration |
| Events | `events.html` | Every event in one list, with filters by type |
| Speakers | `speakers.html` | The full speaker line-up |
| Template | `template.html` | A blank page with the shared header and footer, for making new pages |

Home is one long page because most visitors only need to see the event and register. Events and Speakers are separate pages so Home doesn't get crowded.

## How it works

All content lives in `js/data.js`: events, agenda, speakers, FAQ and venue. The pages build their sections from that one file, so the agenda, event cards, speaker popups and seat counts can never disagree. To use real details, edit `data.js` and nothing else.

`js/main.js` does the rest, in sections: state and seat counts, seat meters, calendar file, toasts and dialogs, registration form, speaker popup, then the page features.

**Seat counter.** Each event has a total and a starting number of taken seats. Every registration adds one to a counter saved in `localStorage`. Left seats = total − taken. When 25% or fewer are left the badge turns amber ("Filling fast"), and at zero it turns red ("Sold out") and every Register button for that event is disabled.

**Registration and validation.** The form uses `novalidate` and checks fields itself, so the messages are consistent. Errors show under the field when you leave it, and the first wrong field gets focus on submit. Rules: name is letters only, at least 2 characters; email must look like an email; student ID is optional but must be 4–20 letters, numbers or dashes; event must be one with seats left; experience level and consent are required. The same email can't register twice for the same event.

**Calendar.** "Add to calendar" builds a standard iCalendar (`.ics`) file in the browser with the title, time, room, speakers and a reminder one hour before. Times are local, so the event shows at the right hour in whatever timezone the viewer is in.

**Accessibility.** Tabs follow the ARIA tab pattern with arrow-key support. Popups use the native `<dialog>` element, so focus is trapped and Esc closes them. Errors are tied to fields with `aria-describedby`. Buttons have visible focus, and animations stop if the visitor prefers reduced motion.

**Backend.** There isn't one. Registrations are stored in the visitor's own browser, which is fine for a demo but means two different people can't see each other's registrations. There's a "Reset demo data" link in the footer. The short delay in the submit handler stands in for a network request, so a real API can replace it later.

## Tech

- HTML5
- CSS3 (custom properties, Grid and Flexbox)
- Vanilla JavaScript, no frameworks
- Leaflet and OpenStreetMap for the map
- Git and GitHub

I'm not using a framework because the project doesn't need one, and writing it by hand is better practice.

## Design choices

I wanted it to feel like a developer event, so the theme is dark with a violet and teal color pair.

| Use | Color |
|---|---|
| Background | `#0B1020` |
| Cards | `#131A33` |
| Buttons and brand | `#6B46F5` (buttons use a slightly darker `#5836E0` so white text is easy to read) |
| Highlights and live counters | `#22D3A6` |
| "Filling fast" | `#FFB020` |
| "Sold out" and errors | `#FF5D73` |
| Text | `#E8ECF8` |

**Fonts:** Space Grotesk for headings, Inter for body text, JetBrains Mono for numbers like the seat counter.

All colors, font sizes and spacing live in `css/variables.css`, so changing the look later means editing one file.

**Breakpoints:** the layout switches to the mobile menu and single-column sections at 800px. I checked it at 1280px and 390px wide. Fine-tuning for tablet sizes and other devices happens in Module 4.

## Folder layout

```
eventpulse/
├── index.html
├── events.html
├── speakers.html
├── template.html
├── css/
│   ├── variables.css    colors, fonts, spacing
│   ├── base.css         reset, buttons, cards, badges
│   ├── layout.css       header, mobile menu, hero, footer
│   ├── components.css   tabs, speakers, FAQ, map, form, popups, seat meter
│   └── pages.css        events and speakers pages
├── js/
│   ├── data.js          all the content (events, agenda, speakers, FAQ, venue)
│   └── main.js          all the behavior
├── assets/
│   ├── images/
│   └── icons/
└── docs/
    ├── MODULE-1-PLAN.md
    ├── MODULE-3-NOTES.md
    └── wireframes.html
```

## Docs

- [`docs/MODULE-1-PLAN.md`](docs/MODULE-1-PLAN.md) has the full plan: features, tools, design decisions, button flow and risks.
- [`docs/MODULE-3-NOTES.md`](docs/MODULE-3-NOTES.md) has the Module 3 test checklist and what I'd change next.
- [`docs/wireframes.html`](docs/wireframes.html) opens in a browser and shows the style tile and all the wireframes.

## Running it

There's nothing to install. Clone the repo and open `index.html` in a browser.

```bash
git clone <repo-url>
cd eventpulse
```

**For the map, use a local server instead of double-clicking the file.** OpenStreetMap's tile servers can refuse requests from pages opened as `file://`, so the map may show an empty grey box. VS Code's Live Server extension fixes that (it also refreshes the page as you edit), or run `python -m http.server` in the folder and open `http://localhost:8000`. The map also needs an internet connection. Without it, the page shows the venue address and a link instead.

## Git

`main` is the stable branch. I commit in small steps using prefixes like `feat:`, `docs:` and `fix:`, and tag the end of each module (`module-1`, `module-2`, `module-3` and so on).

## Plan

| Module | Dates | Goal |
|---|---|---|
| 1. Planning and setup | Oct 26 – Nov 01 | Done. Plan, wireframes, repo, design choices |
| 2. Core structure | Nov 02 – Nov 08 | Done. Header, footer and nav; all three pages with static content and base styling |
| 3. Functionality | Nov 09 – Nov 15 | Done. Tabs, popups, accordion, form, seat counter, calendar file, map, filters |
| 4. Polish and delivery | Nov 16 – Nov 22 | Responsive fixes, browser testing, cleanup, deploy, final README |

Things I'm watching out for in Module 4: tablet sizes, testing Chrome, Firefox, Safari and Edge, the map on the deployed site, and trimming anything in the CSS and JS I'm not using.
