# OpenSpec Requirements Document
## REPAC - Riverside Engineering Parent Action Council Website
### repac-riverside.org

**Version:** 1.2
**Date:** 2026-11-17
**Status:** Requirements spec of record — the intended source for the README-level docs.
Reconciled against the repository on 2026-08-11 and against the live site and outside sources on
2026-11-17. The site is live at www.repac-riverside.org (see `README.md`).

**Facts policy.** §8.2 is the single list of organizational facts. Each fact says how it was
verified (IRS record, DPS page, REPAC leadership) or that it *needs confirmation*. A fact that needs
confirmation is tracked in `TODO.md` under "Waiting on REPAC leadership" and the `blocked:
needs-facts` issue label. Don't add a fact to a page unless it can go in §8.2 with a source.

---

## 1. Project Overview

### 1.1 Organization
REPAC (Riverside Engineering Parent Action Council) is a 501(c)(3) nonprofit organization supporting
the Project Lead The Way (PLTW) pre-engineering program at Riverside High School in Durham, NC.
Its 501(c)(3) status is confirmed by the IRS record; the founding date and NC incorporation month
still need confirmation — see §8.2.

### 1.2 Purpose
The website serves as the primary digital presence for REPAC, providing information to current and prospective engineering families, facilitating community engagement, and supporting fundraising efforts.

### 1.3 Target Audiences
- **Primary:** Parents/guardians of current Riverside engineering students
- **Secondary:** Prospective families (incoming freshmen and DPS Magnet and CTE Pathway lottery applicants)
- **Tertiary:** Community members, corporate sponsors, alumni families

---

## 2. Current Sitemap

```
repac-riverside.org/
|
|-- index.html                  [Home]
|-- about.html                  [About REPAC]
|-- engineering-program.html    [Program Overview]
|   |-- course-descriptions.html    [PLTW Course Descriptions]
|   |-- freshman-info.html          [Incoming Freshman Info]
|-- engineering-faq.html        [Engineering Program FAQ]
|   |-- repac-faq.html              [REPAC Organization FAQ]
|-- student-activities.html     [Student Activities]
|-- events.html                 [Events]
|-- fundraising.html            [Fundraising]
|-- repac-documents.html        [REPAC Documents — not in nav; linked from Home > Resources]
|
|-- css/style.css               [Shared Stylesheet]
|-- js/main.js                  [Shared JavaScript]
|-- images/                     [Image assets]
|-- wix-host/                   [Astro deployment wrapper — see §3.1]
```

### 2.1 Navigation Structure
| Nav Item | Page | Dropdown Children |
|---|---|---|
| Home | `index.html` | -- |
| About | `about.html` | -- |
| Program | `engineering-program.html` | Overview, Courses, Freshman Info |
| FAQ | `engineering-faq.html` | Engineering FAQ, REPAC FAQ |
| Activities | `student-activities.html` | -- |
| Events | `events.html` | -- |
| Fundraising | `fundraising.html` | -- |
| Spirit Wear | Square storefront (external, new tab) | -- |

`repac-documents.html` is intentionally absent from the primary nav; it is reached from the Resources
list on the home page. Every page must carry the identical nav (see FR-STY-01), including the
external Spirit Wear item.

---

## 3. Technical Architecture

### 3.1 Stack
| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS3 (custom properties / variables) |
| Scripting | Vanilla JavaScript (IIFE, no dependencies) |
| Build Tools | None for the site itself (static files, no build step) |
| Local preview | Open `index.html`, or `python3 -m http.server` |
| Deployment | Wix-Managed Headless via the `wix-host/` Astro wrapper |

The static files at the repo root are the site. `wix-host/` is a thin Astro wrapper that exists only
because Wix-Managed Headless requires an Astro frontend: a sync script copies the root static files
into `wix-host/public/`, and an account owner runs preview and release locally (there is no CI that
talks to Wix). **[`docs/deploy.md`](docs/deploy.md) is the canonical deployment reference** — auth,
the preview/release flow, and the cutover/rollback runbook live there and are not restated here.

### 3.2 Design System
| Token | Value | Usage |
|---|---|---|
| `--pirate-black` | `#2a1b47` | Header, footer, headings, table headers (a very dark purple, despite the name) |
| `--pirate-gold` | `#d4a017` | Brand accent, section underlines, buttons (primary) |
| `--pirate-gold-light` | `#f0d060` | Hover states, hero subtitle |
| `--pirate-purple` | `#4b2e83` | Links, card headings, buttons (secondary), `.highlight` info boxes |
| `--pirate-purple-light` | `#6b46a8` | Link hover, button hover |
| `--font-main` | Segoe UI / system sans-serif | All body text |
| `--max-width` | `1100px` | Content container |
| `--nav-height` | `60px` | Sticky header |

### 3.3 Layout Components
- **Sticky header** with brand mark (skull-and-crossbones &#9760;) and horizontal nav
- **Dropdown menus** (CSS hover on desktop, JS toggle on mobile)
- **Hero section** (home page only) with gradient background
- **Card grid** (`auto-fit`, `minmax(260px, 1fr)`) for quick links and content blocks
- **Info boxes** (gold left-border default, purple left-border `.highlight` variant)
- **FAQ accordion** (JS toggle `.open` class, `+`/`-` indicator)
- **Resource lists** (nested bulleted link lists, used for Home > Resources and REPAC Documents)
- **Media block** (side-by-side text and image, used for Spirit Wear)
- **Calendar embed** (responsive iframe pair — month view on desktop, agenda view on mobile — with a
  loading overlay and spinner)
- **Responsive table wrapper** (`.table-wrap`, horizontal scroll)
- **Placeholder blocks** (dashed gold border, italic) for content pending from leadership
- **3-column footer** with quick links, resources, and copyright
- **Mobile breakpoint** at `768px` (hamburger menu, stacked cards, stacked nav)

### 3.4 JavaScript Behaviors
| Feature | Implementation |
|---|---|
| Mobile nav toggle | `.nav-toggle` click toggles `.open` on `.site-nav`, updates `aria-expanded` |
| Dropdown on touch | Prevents default on mobile dropdown links, toggles `.open` on parent |
| FAQ accordion | Click `.faq-question` toggles `.open` on `.faq-item` parent |
| Active nav link | Matches the last path segment of `window.location.pathname` to `href`, adds `.active` |
| Calendar loading state | Adds `.loaded` to `.calendar-container` once both iframes load; 10s fallback timeout |

The temporary "UNOFFICIAL DRAFT" banner was removed in August 2026 (#58) ahead of launch.

---

## 4. Page-by-Page Content Requirements

### 4.1 Home (`index.html`)
| Section | Content | Status |
|---|---|---|
| Hero | Organization name, school/location, tagline ("Supporting PLTW... since 2008") | Complete |
| Welcome blurb | REPAC description, 501(c)(3) status, mission summary, meeting cadence | Complete |
| Quick Links grid | 6 cards: About, Engineering Program, Incoming Freshmen, Student Activities, Events, Fundraising | Complete |
| Resources | Links to the Pathway Handbook, REPAC Documents, meeting minutes, Google Group sign-up, RHS/DPS resources, PLTW | Complete |
| Mission statement | Fundraising, mentors, competitions, community | Complete |

### 4.2 About (`about.html`)
| Section | Content | Status |
|---|---|---|
| History | Founding, incorporation, 501(c)(3) status | Complete — founding date and incorporation month need confirmation (§8.2) |
| Mission | Bulleted list of REPAC activities | Complete |
| Organization Details | Table: official name, tax ID, address, founded, incorporation, IRS status, membership, meetings | Complete — name, tax ID, address and 501(c)(3) match the IRS record; other rows per §8.2 |
| Executive Board | Officers and committee chairs for the current academic year, plus a fallback contact for reaching a member | Complete — 2026-2027 roster, no open chairs. Year-stamped: refresh every academic year |
| Get Involved | Membership info (no dues), CTA to meetings | Complete |

### 4.3 Engineering Program (`engineering-program.html`)
| Section | Content | Status |
|---|---|---|
| What is PLTW | PLTW description, Riverside's standing in DPS | Complete |
| Program Structure | Foundation courses (IED, POE, DE) and specialty courses as cards | Complete |
| College Credit | PLTW end-of-course assessment credit opportunities | Complete |
| Meet Our Faculty | Faculty cards with name and course taught | Complete — the six names match DPS's 2026 PLTW announcement; course assignments need confirmation |
| Admission | Magnet program (listed by DPS as a CTE pathway), DPS Magnet and CTE Pathway lottery (January), attendance-zone priority, links to DPS and freshman info | Complete — matches DPS; awaiting the program director's confirmation (§8.2) |

### 4.4 Course Descriptions (`course-descriptions.html`)
| Section | Content | Status |
|---|---|---|
| Foundation: IED (9th) | Design process, Onshape 3D modeling, engineering notebooks | Complete |
| Foundation: POE (10th) | Mechanisms, strength of structures and materials, automation | Complete |
| Foundation: DE (11th) | Combinational/sequential logic, circuit design tools | Complete |
| Specialty courses | AE, CEA, CIM, CSE, CSP, CSA, SEC — each with prerequisites | Complete |
| Program requirement note | Three foundation courses plus at least one specialty course; satisfies the DPS 4-course concentration | Complete |

### 4.5 Freshman Info (`freshman-info.html`)
| Section | Content | Status |
|---|---|---|
| Getting Into the Program | DPS Magnet and CTE Pathway lottery, eligibility, attendance-zone priority | Complete — matches DPS; awaiting the program director's confirmation (§8.2) |
| What to Expect | IED course, standard academic schedule | Complete |
| Supplies & Materials | School-provided vs. family-provided supply lists | Complete |
| Getting Involved | REPAC meetings, TSA, social events | Complete |
| FAQ links | Buttons to both FAQ pages | Complete |
| Key Contacts | Engineering faculty by course | Complete — course assignments need confirmation; a REPAC leadership contact is still missing |

### 4.6 Engineering FAQ (`engineering-faq.html`)
| Question | Status |
|---|---|
| What is PLTW? | Complete |
| How to get into the program? | Complete — matches DPS; awaiting the program director's confirmation (§8.2) |
| Prior experience needed? | Complete |
| What courses? | Complete |
| College credit? | Complete |
| Career preparation? | Complete |
| Only for future engineers? | Complete |
| Software used? | Complete |
| Transfer after freshman year? | Complete |
| Durham Tech / Career and College Promise? | Complete — links Durham Tech's dual enrollment page |
| What is NTHS? | Complete |
| NTHS membership criteria at Riverside? | Complete — criteria need confirmation |
| DPS grading scale? | Complete |
| Unweighted GPA calculation? | Complete |
| Weighted GPA calculation? | Complete — which PLTW courses earn +1.0 needs confirmation (§8.2) |

### 4.7 REPAC FAQ (`repac-faq.html`)
| Question | Status |
|---|---|
| What is REPAC? | Complete |
| Who can be a member? | Complete |
| When/where meetings? | Complete |
| Tax-exempt status? | Complete |
| How funds are used? | Complete |
| How to get involved? | Complete |
| How to donate? | Complete — points at the Fundraising page rather than restating the methods |
| How to contact REPAC? | Complete |

### 4.8 Student Activities (`student-activities.html`)
| Section | Content | Status |
|---|---|---|
| TSA | Chapter description, competition event types, encouragement to join | Complete |
| FIRST Robotics | NCSSM's Team 900 (Zebracorns) and a link to its site | Complete — whether it is open to all RHS engineering students needs confirmation |
| Contest Opportunities | Contests the faculty coordinate or publicize | Complete |
| Field Trips | Annual engineering trip and freshman trip | Complete |
| Tallo | Professional networking profile guidance | Complete |
| Xello | DPS CTE career/college planning tool | Complete |
| Local Enrichment Programs | List of university, business, and community programs students have attended | Complete |

### 4.9 Events (`events.html`)
| Section | Content | Status |
|---|---|---|
| Event Calendar | Embedded REPAC Google Calendar, month view on desktop and agenda view on mobile, with loading state | Complete |

### 4.10 REPAC Documents (`repac-documents.html`)
| Section | Content | Status |
|---|---|---|
| About REPAC | Origin, shift in focus after PLTW accreditation, incorporation and 501(c)(3) dates | Complete — September 2016 501(c)(3) matches the IRS record; July 2016 incorporation needs confirmation (§8.2) |
| Key Documents | Bylaws (PDF), RHS Engineering Pathway Handbook, "What REPAC Does" (PDF) | Complete — two links are hosted on legacy Wix file storage (§9.2) |
| Related Pages | Cross-links to About, REPAC FAQ, Fundraising | Complete |
| Contact | REPAC email address | Complete |

### 4.11 Fundraising (`fundraising.html`)
| Section | Content | Status |
|---|---|---|
| Spirit Wear | Description, product photo, link to the Square storefront | Complete |
| How Funds Are Used | 4 cards: equipment, competitions, supplies, events | Complete |
| Make a Donation | 501(c)(3) note, online (Square) and by-check options | Complete — check payee and mailing instructions need confirmation |
| Corporate Matching & Sponsorship | Employer matching, sponsorship inquiries | Complete |
| Questions or Comments | REPAC email address | Complete |

---

## 5. Placeholder Content Inventory

A placeholder is a `class="placeholder"` block: content the page needs but doesn't have, rendered as
a visibly distinct dashed box (FR-CON-04) so it can't be mistaken for finished copy. The inventory is
whatever that class currently matches — regenerate it rather than trusting a list:

```bash
grep -rn 'class="placeholder"' *.html
```

**Currently: none.** The last three — the Executive Board roster on `about.html` and the donate and
contact answers on `repac-faq.html` — were filled in August 2026.

An empty inventory means no section is *visibly* unfinished. It does not mean the content is
verified: the facts marked *needs confirmation* in §8.2 are still outstanding, and the board roster
carries an academic-year stamp that goes stale annually.

---

## 6. Functional Requirements

### 6.1 Navigation
- **FR-NAV-01:** Sticky header remains visible on scroll across all pages
- **FR-NAV-02:** Dropdown menus appear on hover (desktop) and tap (mobile)
- **FR-NAV-03:** Current page highlighted with `.active` class in nav
- **FR-NAV-04:** Hamburger menu toggles mobile nav at breakpoint <= 768px
- **FR-NAV-05:** `aria-expanded` attribute updates on mobile nav toggle for accessibility
- **FR-NAV-06:** External nav destinations (Spirit Wear) open in a new tab

### 6.2 Content Display
- **FR-CON-01:** FAQ accordion expands/collapses individual items on click
- **FR-CON-02:** Card grids reflow responsively (`auto-fit`, minimum 260px per card)
- **FR-CON-03:** Tables scroll horizontally on narrow viewports (via the `.table-wrap` wrapper)
- **FR-CON-04:** Placeholder sections are visually distinct (dashed gold border, italic text)
- **FR-CON-05:** The embedded calendar shows a loading state until the iframes load, and switches
  between month and agenda views at the mobile breakpoint

### 6.3 Responsiveness
- **FR-RES-01:** All pages must be usable on viewports from 320px to 1920px+
- **FR-RES-02:** Mobile breakpoint at 768px: stacked nav, single-column cards
- **FR-RES-03:** Hero section scales font size down on mobile
- **FR-RES-04:** Footer grid collapses to single column on narrow screens

### 6.4 Consistency
- **FR-STY-01:** All pages share identical header, footer, and navigation markup
- **FR-STY-02:** All pages load `css/style.css` and `js/main.js`
- **FR-STY-03:** Color palette, typography, and component patterns are consistent site-wide

---

## 7. Non-Functional Requirements

### 7.1 Performance
- **NFR-PERF-01:** No third-party JavaScript or CSS frameworks, CDNs, or analytics in page code. The
  permitted external dependencies are content embeds and outbound links: the Google Calendar iframe
  on `events.html`, the Square storefront, and Google Docs/Drive resources.
- **NFR-PERF-02:** Total page weight should remain under 100KB per page (excluding images)
- **NFR-PERF-03:** No build step required to serve the site; the static files are deployable as-is to
  any static host, and the `wix-host/` wrapper copies rather than transforms them (§3.1)

### 7.2 Accessibility
- **NFR-A11Y-01:** Semantic HTML5 elements (`header`, `main`, `footer`, `nav`, `section`)
- **NFR-A11Y-02:** `aria-label` on nav toggle button
- **NFR-A11Y-03:** `aria-expanded` state management on mobile toggle
- **NFR-A11Y-04:** Sufficient color contrast between text and backgrounds
- **NFR-A11Y-05:** Keyboard navigability for all interactive elements (links, buttons, FAQ items)

### 7.3 Browser Compatibility
- **NFR-COMPAT-01:** Support modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- **NFR-COMPAT-02:** CSS custom properties (variables) used throughout; no IE11 support required
- **NFR-COMPAT-03:** JavaScript uses `querySelectorAll` and `classList` (ES5+ compatible)

### 7.4 Maintainability
- **NFR-MAINT-01:** Single shared stylesheet and script for all pages
- **NFR-MAINT-02:** No build tooling, package managers, or transpilation required for the site itself
- **NFR-MAINT-03:** Content updates achievable by editing HTML directly
- **NFR-MAINT-04:** Placeholder pattern provides clear visual cue for incomplete content

### 7.5 SEO & Metadata
- **NFR-SEO-01:** Each page has a unique `<title>` tag
- **NFR-SEO-02:** `<meta charset="UTF-8">` and `<meta name="viewport">` on all pages
- **NFR-SEO-03:** `lang="en"` attribute on `<html>` element

---

## 8. Content & Brand Requirements

### 8.1 Brand Identity
- **School:** Riverside High School, Durham, NC
- **Mascot Theme:** Pirates (skull-and-crossbones icon in brand mark)
- **Color Scheme:** Purple and gold (Riverside Pirates), switched from black/gold/red in August 2026 (#73)
- **Tone:** Welcoming, informative, community-oriented; addresses parents directly

### 8.2 Key Organizational Facts
This is the one place facts are recorded. **Verified** means checked against the source named on
2026-11-17. **Needs confirmation** means only REPAC leadership or the engineering program director
can answer; those rows are tracked in `TODO.md` ("Waiting on REPAC leadership"). Program facts go to
the program director, Mike Dibble.

| Fact | Value | Source / status |
|---|---|---|
| Legal name | Riverside Engineering Parent Action Council Inc | Verified — IRS record |
| Abbreviation | REPAC | -- |
| Tax ID (EIN) | 81-3420851 | Verified — IRS record |
| Address | 3218 Rose of Sharon Rd, Durham NC 27712-3130 (this is Riverside High School's address) | Verified — IRS record, DPS |
| IRS status | 501(c)(3), donations deductible; ruling date September 2016 | Verified — IRS record |
| NC incorporation | July 2016 | Needs confirmation (NC Secretary of State) |
| Founded | February 2008 | Needs confirmation |
| Membership | All RHS engineering parents, no dues | Needs confirmation |
| Board elections | Annually in May | Needs confirmation |
| Meetings | 2nd Thursday of each month, 6:00 PM, RHS Media Center | Needs confirmation |
| Contact email | REPACrhs@gmail.com | -- |
| Program type | Magnet program. DPS lists it as a Career and Technical Education (CTE) pathway, and admits through its Magnet and CTE Pathway lottery | "Magnet" is REPAC's usage; the DPS listing is verified (DPS CTE Pathways page). Which label to lead with needs the program director's confirmation |
| Admission | Only through the DPS Magnet and CTE Pathway lottery, which opens each January; applicants must live in Durham County; students in Riverside's attendance zone get priority seating only if they enter the lottery and rank Riverside Engineering first | Verified — DPS CTE Pathways and lottery pages; program director asked to confirm |
| In-zone admission odds | The site makes no claim | Needs confirmation before saying anything |
| Entrance requirements | No entrance exam or GPA requirement | Needs confirmation |
| PLTW recognition | PLTW Distinguished High School, 9th consecutive year (2026) | Verified — DPS announcement; not yet on the site |
| Weighted GPA (PLTW) | State policy gives college-level weighting (+1.0) to PLTW courses approved for college credit | Policy verified — SBE GRAD-009; which Riverside PLTW courses qualify needs confirmation |
| Faculty | Mike Dibble, William Oakley, Ryan Patridge, Andrew (Drew) Byers, Benjamin Drugatz, Emily Quadrio | Names verified — DPS announcement; course assignments need confirmation |
| Curriculum | Project Lead The Way (PLTW) | -- |
| Competition org | Technology Student Association (TSA) | -- |

Sources: IRS record via [ProPublica Nonprofit Explorer](https://projects.propublica.org/nonprofits/organizations/813420851);
[DPS CTE Pathways](https://welcome.dpsnc.net/cte-pathways/); [About Riverside (DPS)](https://www.dpsnc.net/o/riverside/page/about-riverside);
[SBE policy GRAD-009](https://content.govdelivery.com/attachments/NCSBE/2025/10/03/file_attachments/3409884/GRAD-009%20-%20Grading%20and%20Transcript%20Standards%2010-02-2025.pdf);
[Riverside news feed (PLTW Distinguished, faculty)](https://www.dpsnc.net/o/riverside/live-feed/?page_no=4).

### 8.3 PLTW Course Sequence
Three foundation courses are required, plus **at least one** specialty course — which also satisfies
the DPS four-course "concentration" requirement. Additional specialty courses may be taken with
faculty approval as scheduling allows.

**Foundation courses (all required):**

| Typically taken | Course | Code |
|---|---|---|
| Freshman (9th) | Introduction to Engineering Design | IED |
| Sophomore (10th) | Principles of Engineering | POE |
| Junior (11th) | Digital Electronics | DE |

**Specialty courses (at least one required):**

| Course | Code | Prerequisite |
|---|---|---|
| Aerospace Engineering | AE | POE |
| Civil Engineering & Architecture | CEA | POE |
| Computer Integrated Manufacturing | CIM | POE |
| Computer Science Essentials | CSE | None |
| AP Computer Science Principles | CSP | CSE recommended |
| AP Computer Science A | CSA | CSP |
| Cybersecurity | SEC | CSE |

Which specialty courses run in a given year is a scheduling matter for the engineering department and
needs confirmation before the list is presented as a catalog.

---

## 9. Identified Gaps & Recommendations

### 9.1 Missing Content (Requires REPAC Leadership Input)
No placeholder blocks remain (§5). What's still owed is verification rather than drafting: the facts
marked *needs confirmation* in §8.2, the specialty-course offerings in §8.3, and an annual refresh of
the year-stamped board roster on `about.html` (currently 2026-2027, no open chairs).

### 9.2 Missing Technical Features
| # | Gap | Recommendation |
|---|---|---|
| 1 | No `<meta name="description">` tags | Add unique descriptions per page for SEO |
| 2 | No Open Graph / social sharing metadata | Add `og:title`, `og:description`, `og:image` tags |
| 3 | No favicon | The live site serves Wix's blank placeholder `favicon.ico`. Add a REPAC favicon |
| 4 | No sitemap.xml | The live `robots.txt` (auto-generated by Wix) points at `/sitemap.xml`, which returns 404 |
| 5 | No robots.txt in the repo | Wix serves its own; decide whether to override it |
| 6 | No 404 page in the static site | The deployed site is covered by `wix-host/src/pages/404.astro`; a static-host 404 is still missing for non-Wix serving |
| 7 | No contact form | Consider a simple contact form; a `mailto:` link is in place on two pages |
| 8 | No analytics | Consider privacy-respecting analytics (e.g., Plausible, GoatCounter) |
| 9 | No print styles | Add `@media print` CSS for clean printing of schedules/FAQs |
| 10 | No skip-to-content link | Add skip navigation link for screen reader accessibility |
| 11 | `.table-wrap` defined but unused | Wrap the `about.html` table (and any future tables) to satisfy FR-CON-03 |
| 12 | Old Wix URLs return 404 | Since cutover, all 15 legacy paths (`/repac`, `/engineering-program`, …) 404. Add redirects to the matching new pages |
| 13 | Two PDFs still hosted by the legacy site | `repac-documents.html` links two PDFs on legacy Wix file storage (#69). They break if the legacy site is deleted; move them to the REPAC Google Drive |
| 14 | Header/footer duplicated in every file | Consider a static site generator or HTML includes for DRY templates |
| 15 | Deploy only copies some files | `wix-host/scripts/sync-static.mjs` copies `*.html`, `css/`, `js/`, `images/` only. Any other root file (robots.txt, sitemap.xml, favicon, `documents/`) is silently left out |

### 9.3 Content Enhancement Opportunities
| # | Opportunity | Description |
|---|---|---|
| 1 | Photo gallery | Showcase engineering labs, student projects, TSA competitions, events |
| 2 | Testimonials | Student/parent quotes about the engineering program |
| 3 | Alumni spotlight | Where have graduates gone? College and career outcomes |
| 4 | Newsletter signup | Currently an outbound Google Form link; consider on-site integration |
| 5 | Sponsor recognition | Logo wall for corporate sponsors and matching employers |
| 6 | Faculty bios and photos | Expand the faculty cards beyond name and course |

---

## 10. File Inventory

| File | Purpose |
|---|---|
| `index.html` | Home page with hero, quick links, resources, mission |
| `about.html` | Organization history, mission, org details, executive board roster |
| `engineering-program.html` | PLTW program overview, course cards, faculty, admission |
| `course-descriptions.html` | Foundation and specialty course descriptions |
| `freshman-info.html` | Admission lottery, freshman expectations, supplies, contacts |
| `engineering-faq.html` | Engineering program Q&As |
| `repac-faq.html` | REPAC organization Q&As |
| `repac-documents.html` | Bylaws, handbook, org documents, contact |
| `student-activities.html` | TSA, robotics, contests, field trips, enrichment programs |
| `events.html` | Embedded REPAC Google Calendar |
| `fundraising.html` | Spirit wear, fund usage, donations, sponsorship |
| `css/style.css` | Complete design system and responsive styles |
| `js/main.js` | Nav toggle, dropdown, FAQ accordion, active link, calendar loading state |
| `images/` | Image assets |
| `wix-host/` | Astro wrapper for Wix-Managed Headless deployment (§3.1, `docs/deploy.md`) |
| `README.md` | Start here: what the site is, its live status, how to make a change |
| `AGENTS.md` | Working rules for AI coding agents (and a useful checklist for people) |
| `TODO.md` | Backlog, plus the questions waiting on REPAC leadership |
| `SITE_ANALYSIS.md` | April 2026 audit of the legacy Wix site and IA rationale (historical) |
| `docs/deploy.md` | Canonical deployment reference |
| `scripts/check-links.mjs` | Link check run by CI on every PR |

**Total site:** 11 HTML pages, 1 CSS file, 1 JS file, plus image assets.

---

*This OpenSpec document is the requirements spec of record for repac-riverside.org. It describes what
the site must be, not a point-in-time status report; content marked placeholder or "needs
confirmation" is outstanding work, not a description of intent.*
