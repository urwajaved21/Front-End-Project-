# EventPulse

A website for campus tech events. Hackathons, coding bootcamps and guest lectures usually get announced in group chats and on posters, so people miss them or sign up late. EventPulse puts the schedule, the speakers, the venue and the sign-up in one place.

I built it as my project for the Zynvex Solutions Batch 5 virtual internship (Front End track).

- **Name:** Muhammad Urwa Javed
- **Internship ID:** ZYNVEX-CERT-2192
- **Live site:** _add your link here after deploying (steps in [`docs/DEPLOY.md`](docs/DEPLOY.md))_

![EventPulse home page on desktop](<img width="945" height="434" alt="image" src="https://github.com/user-attachments/assets/429a520b-e2c3-4b5a-ad36-7b72c828d02d" />
)

<table>
  <tr>
    <td><img src="docs/screenshots/home-mobile.jpg" alt="Home page on a phone" width="240"></td>
    <td><img src="docs/screenshots/agenda-tabs.jpg" alt="Agenda with day tabs" width="420"></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/events-page.jpg" alt="Events page with filters" width="240"></td>
    <td><img src="docs/screenshots/registration-success.jpg" alt="Registration confirmation with calendar buttons" width="420"></td>
  </tr>
</table>

## Who it's for

**Students** who want to see what's coming up, look at the speakers, check how many seats are left and register without hunting through messages.

**Organizers** who need one clean page that gets people to sign up.

## What it does

- **Three pages:** Home, Events and Speakers, with a sticky menu that becomes a hamburger menu on phones
- **Agenda tabs** for Day 1, 2 and 3 (arrow keys work, and `index.html#day2` opens a day directly)
- **Speaker pop-ups** with a short bio
- **FAQ accordion**, one answer open at a time
- **Registration pop-up** on every page, with form validation and clear error messages
- **Live seat counters** with three states: plenty, filling fast (amber) and sold out (red)
- **Waitlist** for sold-out events, and a check that stops the same email registering for the same event twice
- **Calendar invite** after registering: an `.ics` download and a Google Calendar link
- **Venue map** with Leaflet and OpenStreetMap, plus a directions link
- **Events filters and search**, with an empty state when nothing matches

## Pages

| Page | File | What it's for |
|---|---|---|
| Home | `index.html` | Intro, agenda, speakers, venue map, FAQ and registration |
| Events | `events.html` | Every event in one list, with filters and search |
| Speakers | `speakers.html` | The full speaker line-up |
| Not found | `404.html` | Friendly error page for bad links |
| Template | `template.html` | A blank page with the shared header and footer, for making new pages |

## Tech

- HTML5
- CSS3 (custom properties, Grid and Flexbox)
- Vanilla JavaScript, no frameworks and no build step
- Leaflet and OpenStreetMap for the map
- localStorage for seat counts and registrations
- Git and GitHub

I didn't use a framework because the project doesn't need one, and writing it by hand is better practice.

## Running it

There's nothing to install. Clone the repo and open `index.html` in a browser. VS Code's Live Server extension is handy if you want the page to refresh as you edit.

```bash
git clone <repo-url>
cd eventpulse
```

## Things to know

- **The content is sample content.** Event names, speakers, bios, the address and the seat numbers are made up. The data lives in `js/data.js`, and the matching text on the cards is in the HTML pages.
- **Seat counts are simulated.** There is no server. The starting numbers come from `data.js`, each registration adds one, and the browser remembers it with localStorage. A timer also adds a seat every 15 to 30 seconds on events that still have plenty, to imitate other people registering. Set `simulateLive: false` in `data.js` to turn that off. Registrations are saved only in the visitor's own browser.
- **The map needs an internet connection.** Leaflet is downloaded only when the visitor scrolls near the venue section. If it can't load, the page shows the venue card and the directions link instead.
- **The venue coordinates are a sample location.** Change `lat`, `lng` and the address in `js/data.js` to your real campus.
- **Calendar times** are written as local time, so an event at 16:00 shows at 16:00 in the person's calendar.
- **Without JavaScript** the agenda and FAQ still show in full, but registration needs JavaScript.

## Design

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

## Responsive design

I checked every page at widths from 320px to 1920px (small phone to large desktop), including a phone in landscape and tablets. Nothing scrolls sideways, the pop-ups fit the screen and can be scrolled when they are taller than it, and buttons and links are at least 44px tall to tap. Below 800px the menu becomes a hamburger menu and sections stack in one column.

## Accessibility

- Semantic HTML, one `h1` per page and no skipped heading levels
- A "Skip to content" link, and a visible focus outline on everything you can tab to
- Tabs, accordion and pop-ups work with the keyboard (arrow keys, Enter, Escape), and focus returns to the button that opened a pop-up
- Form fields have labels, and errors are announced next to the field
- Text and background colors meet the 4.5:1 contrast guideline
- Animations switch off for people who ask their device for reduced motion

## Performance

- The home page's own files (HTML, CSS, JavaScript) come to about 29 KB gzipped
- No images to download, and no frameworks
- Scripts are deferred so they don't block the page from showing
- Leaflet (the map library) loads only when you scroll near the map, not with the page
- Fonts use `display=swap` so text shows straight away

## Browser support

Built with features that current versions of Chrome, Edge, Firefox and Safari support (2022 and later). I checked the layout and every feature in Chromium (the engine behind Chrome and Edge). The pop-ups use the native `<dialog>` element, which needs Safari 15.4 or newer.

## Folder layout

```
eventpulse/
├── index.html
├── events.html
├── speakers.html
├── 404.html
├── template.html
├── robots.txt
├── css/
│   ├── variables.css    colors, fonts, spacing
│   ├── base.css         reset, buttons, cards
│   ├── layout.css       header, mobile menu, hero, footer
│   ├── components.css   home page sections (agenda, venue, FAQ, pick list)
│   ├── pages.css        events and speakers pages
│   └── interactive.css  tabs, accordion, pop-ups, form, map, filters
├── js/
│   ├── data.js          events, speakers and venue (edit this one)
│   ├── store.js         saves data in the browser
│   ├── main.js          mobile menu, footer year
│   ├── modal.js         pop-up helper
│   ├── seats.js         live seat counters
│   ├── calendar.js      .ics file and Google Calendar link
│   ├── register.js      registration pop-up and validation
│   ├── speakers.js      speaker pop-up
│   ├── tabs.js          agenda tabs
│   ├── accordion.js     FAQ accordion
│   ├── filters.js       events filters and search
│   └── map.js           Leaflet map (loaded on demand)
├── assets/
│   ├── icons/           favicon
│   └── images/
└── docs/
    ├── DEPLOY.md        deploy and submit steps
    ├── HOW-IT-WORKS.md  how each feature works
    ├── MODULE-1-PLAN.md planning document
    ├── wireframes.html  wireframes and style tile
    └── screenshots/
```

## Docs

- [`docs/DEPLOY.md`](docs/DEPLOY.md): putting the site online and what to submit
- [`docs/HOW-IT-WORKS.md`](docs/HOW-IT-WORKS.md): how each feature works and which file to look in
- [`docs/MODULE-1-PLAN.md`](docs/MODULE-1-PLAN.md): the original plan with features, tools, design decisions and risks
- [`docs/wireframes.html`](docs/wireframes.html): open in a browser to see the wireframes and style tile

## How it was built

| Module | Dates | What I did |
|---|---|---|
| 1. Planning and setup | Oct 26 – Nov 01 | Plan, wireframes, repo, colors, fonts and layout rules |
| 2. Core structure | Nov 02 – Nov 08 | Header, mobile menu, footer, and the three pages with content |
| 3. Functionality | Nov 09 – Nov 15 | Tabs, pop-ups, accordion, registration, seat counters, calendar invites, map, filters |
| 4. Polish and delivery | Nov 16 – Nov 22 | Responsive and accessibility fixes, performance, cleanup, 404 page, deployment guide |

I commit in small steps using prefixes like `feat:`, `docs:` and `fix:`, and tag the end of each module (`module-1` to `module-4`).

## License

For educational / internship purposes.
