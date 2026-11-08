# EventPulse

A website for campus tech events. Hackathons, coding bootcamps and guest lectures usually get announced in group chats and on posters, so people miss them or sign up late. EventPulse puts the schedule, the speakers, the venue and the sign-up in one place.

I'm building it as my project for the Zynvex Solutions Batch 5 virtual internship (Front End track).

- **Name:** Muhammad Urwa Javed
- **Internship ID:** ZYNVEX-CERT-2192
- **Live link:** not deployed yet (that's part of Module 4)

## Where the project is at

**Module 2 is done** (Nov 02 – Nov 08): the layout and all three pages are built with static content and styled. Nothing is interactive yet apart from the mobile menu. Tabs, popups, the accordion, the form and the map come in Module 3.

**Module 2 (core structure and main pages)**

- Header with logo, nav links and a Register button, sticky at the top
- Mobile menu that opens from a hamburger button on small screens
- Footer with links, shared on every page
- Home page with every section filled in: hero, about, 3-day agenda, speakers, venue, FAQ and a registration form layout
- Events page with six event cards (seat counts, sold-out state)
- Speakers page with eight speaker cards
- Base styling for all of it, using the design tokens from Module 1
- Made the main button color a bit darker so white text on it is easier to read

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

I kept Home as one long page because most visitors only need to see the event and register. Events and Speakers are separate pages so Home doesn't get crowded. Buttons on Home link to both, and they link back.

The event names, dates and speaker names are sample content for now. I'll swap in real details before the final delivery.

## What it will do (by Module 3)

- Agenda with tabs for each day
- Speaker popups with a short bio and links
- FAQ accordion
- Venue map using Leaflet and OpenStreetMap
- Registration form in an overlay, with validation
- Live seat counter that changes when someone registers, with "filling fast" and "sold out" states
- Add to calendar (downloads an .ics file)
- Event filters on the Events page

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
| Buttons and brand | `#6B46F5` |
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
│   ├── base.css         reset, buttons, cards
│   ├── layout.css       header, mobile menu, hero, footer
│   ├── components.css   home page sections (agenda, venue, FAQ, form)
│   └── pages.css        events and speakers pages
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
└── docs/
    ├── MODULE-1-PLAN.md
    └── wireframes.html
```

## Docs

- [`docs/MODULE-1-PLAN.md`](docs/MODULE-1-PLAN.md) has the full plan: features, tools, design decisions, button flow and risks.
- [`docs/wireframes.html`](docs/wireframes.html) opens in a browser and shows the style tile and all the wireframes.

## Running it

There's nothing to install. Clone the repo and open `index.html` in a browser. VS Code's Live Server extension is handy if you want the page to refresh as you edit.

```bash
git clone <repo-url>
cd eventpulse
```

## Git

`main` is the stable branch. I commit in small steps using prefixes like `feat:`, `docs:` and `fix:`, and tag the end of each module (`module-1`, `module-2` and so on).

## Plan

| Module | Dates | Goal |
|---|---|---|
| 1. Planning and setup | Oct 26 – Nov 01 | Done. Plan, wireframes, repo, design choices |
| 2. Core structure | Nov 02 – Nov 08 | Done. Header, footer and nav; all three pages with static content and base styling |
| 3. Functionality | Nov 09 – Nov 15 | Tabs, popups, accordion, form, seat counter, calendar file, map |
| 4. Polish and delivery | Nov 16 – Nov 22 | Responsive fixes, browser testing, cleanup, deploy, final README |

Things I'm watching out for: the map failing to load (I'll show a plain address as a backup), running short on time in Module 3 (so the registration form and seat counter come first), and browser differences (I'll test Chrome, Firefox, Safari and Edge in Module 4).
