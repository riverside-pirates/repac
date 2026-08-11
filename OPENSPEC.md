# OpenSpec Requirements Document
## REPAC - Riverside Engineering Parent Action Council Website
### repac-riverside.org

**Version:** 1.1
**Date:** 2026-08-11
**Status:** Requirements spec of record — the intended source for the README-level docs.
Reconciled against the repository on 2026-08-11. Claims that cannot be verified from a file in this
repo are marked *needs confirmation* and require sign-off from REPAC leadership (tracked with the
`blocked: needs-facts` label).

---

## 1. Project Overview

### 1.1 Organization
REPAC (Riverside Engineering Parent Action Council) is a 501(c)(3) nonprofit organization supporting
the Project Lead The Way (PLTW) pre-engineering program at Riverside High School in Durham, NC.
Founding and incorporation dates are asserted by the site but unverified — see §8.2.

### 1.2 Purpose
The website serves as the primary digital presence for REPAC, providing information to current and prospective engineering families, facilitating community engagement, and supporting fundraising efforts.

### 1.3 Target Audiences
- **Primary:** Parents/guardians of current Riverside engineering students
- **Secondary:** Prospective families (incoming freshmen and magnet lottery applicants)
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
| `--pirate-black` | `#1a1a2e` | Header, footer, headings, table headers |
| `--pirate-gold` | `#d4a017` | Brand accent, section underlines, buttons (primary) |
| `--pirate-gold-light` | `#f0d060` | Hover states, hero subtitle |
| `--pirate-red` | `#8b0000` | Links, card headings, buttons (secondary) |
| `--pirate-red-light` | `#b22222` | Link hover, button hover |
| `--font-main` | Segoe UI / system sans-serif | All body text |
| `--max-width` | `1100px` | Content container |
| `--nav-height` | `60px` | Sticky header |

### 3.3 Layout Components
- **Sticky header** with brand mark (skull-and-crossbones &#9760;) and horizontal nav
- **Dropdown menus** (CSS hover on desktop, JS toggle on mobile)
- **Hero section** (home page only) with gradient background
- **Card grid** (`auto-fit`, `minmax(260px, 1fr)`) for quick links and content blocks
- **Info boxes** (gold left-border default, red left-border `.highlight` variant)
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
| **Draft banner (temporary)** | Injects an "UNOFFICIAL DRAFT" banner at the top of `<body>` on every page. **Must be removed before launch** — it is the marker that the site is not yet live. |

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
| History | Founding, incorporation, 501(c)(3) status | Complete — dates need confirmation (§8.2) |
| Mission | Bulleted list of REPAC activities | Complete |
| Organization Details | Table: founded, incorporation, IRS status, membership, meetings | Complete — dates need confirmation (§8.2) |
| Executive Board | Board member names and roles | **PLACEHOLDER** |
| Get Involved | Membership info (no dues), CTA to meetings | Complete |

### 4.3 Engineering Program (`engineering-program.html`)
| Section | Content | Status |
|---|---|---|
| What is PLTW | PLTW description, Riverside's standing in DPS | Complete |
| Program Structure | Foundation courses (IED, POE, DE) and specialty courses as cards | Complete |
| College Credit | PLTW end-of-course assessment credit opportunities | Complete |
| Meet Our Faculty | Faculty cards with name and course taught | Complete — names/roles need confirmation |
| Admission | Magnet program, DPS lottery process, link to freshman info | Complete |

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
| Getting Into the Program | DPS magnet lottery process and timeline | Complete |
| What to Expect | IED course, standard academic schedule | Complete |
| Supplies & Materials | School-provided vs. family-provided supply lists | Complete |
| Getting Involved | REPAC meetings, TSA, social events | Complete |
| FAQ links | Buttons to both FAQ pages | Complete |
| Key Contacts | Engineering faculty by course | Complete — names/roles need confirmation; a REPAC leadership contact is still missing |

### 4.6 Engineering FAQ (`engineering-faq.html`)
| Question | Status |
|---|---|
| What is PLTW? | Complete |
| How to get into the program? | Complete |
| Prior experience needed? | Complete |
| What courses? | Complete |
| College credit? | Complete |
| Career preparation? | Complete |
| Only for future engineers? | Complete |
| Software used? | Complete |
| Transfer after freshman year? | Complete |
| Durham Tech / Career and College Promise? | Complete — outbound link points at the legacy site (§9.2) |
| What is NTHS? | Complete |
| NTHS membership criteria at Riverside? | Complete — criteria need confirmation |
| DPS grading scale? | Complete |
| Unweighted GPA calculation? | Complete |
| Weighted GPA calculation? | Complete |

### 4.7 REPAC FAQ (`repac-faq.html`)
| Question | Status |
|---|---|
| What is REPAC? | Complete |
| Who can be a member? | Complete |
| When/where meetings? | Complete |
| Tax-exempt status? | Complete |
| How funds are used? | Complete |
| How to get involved? | Complete |
| How to donate? | **PLACEHOLDER** |
| How to contact REPAC? | **PLACEHOLDER** |

### 4.8 Student Activities (`student-activities.html`)
| Section | Content | Status |
|---|---|---|
| TSA | Chapter description, competition event types, encouragement to join | Complete |
| FIRST Robotics | Club description and link to the Zebracorns team site | Complete |
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
| About REPAC | Origin, shift in focus after PLTW accreditation, incorporation and 501(c)(3) dates | Complete — dates need confirmation (§8.2) |
| Key Documents | Bylaws (PDF), RHS Engineering Pathway Handbook, "What REPAC Does" (PDF) | Complete — two links are hosted on legacy Wix file storage (§9.2) |
| Related Pages | Cross-links to About, REPAC FAQ, Fundraising | Complete |
| Contact | REPAC email address | Complete |

### 4.11 Fundraising (`fundraising.html`)
| Section | Content | Status |
|---|---|---|
| Spirit Wear | Description, product photo, link to the Square storefront | Complete |
| How Funds Are Used | 4 cards: equipment, competitions, supplies, events | Complete |
| Make a Donation | 501(c)(3) note, online (Square) and by-check options | Complete |
| Corporate Matching & Sponsorship | Employer matching, sponsorship inquiries | Complete |
| Questions or Comments | REPAC email address | Complete |

---

## 5. Placeholder Content Inventory

The following items require input from REPAC leadership before the site is content-complete. This
list is the set of `class="placeholder"` blocks in the HTML; regenerate it with:

```bash
grep -rn 'class="placeholder"' *.html
```

| # | Page | Section | What's Needed |
|---|---|---|---|
| 1 | `about.html` | Executive Board | Board member names, roles, optional photos |
| 2 | `repac-faq.html` | How to donate? | Donation methods and links |
| 3 | `repac-faq.html` | How to contact? | Email address, social media handles |

Items 2 and 3 are answerable from content the site already publishes elsewhere (the Square donation
link and the REPAC email address on `fundraising.html`); they need leadership confirmation, not new
facts.

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
- **Color Scheme:** Black and gold (pirate theme) with dark red accent
- **Tone:** Welcoming, informative, community-oriented; addresses parents directly

### 8.2 Key Organizational Facts
Rows marked *needs confirmation* are asserted by the site but not verifiable from any authoritative
source in this repo. They must be confirmed by REPAC leadership before launch.

| Fact | Value | Verification |
|---|---|---|
| Full Name | Riverside Engineering Parent Action Council | -- |
| Abbreviation | REPAC | -- |
| Founded | February 2008 | Needs confirmation |
| NC Incorporation | 2016 (`about.html`) / July 2016 (`repac-documents.html`) | Needs confirmation — the two pages disagree |
| IRS 501(c)(3) Status | Granted 2016 (`repac-documents.html` says September 2016) | Needs confirmation |
| Membership | All RHS engineering parents (no dues) | Needs confirmation |
| Board Elections | Annually in May (`repac-documents.html`) | Needs confirmation |
| Meeting Schedule | 2nd Thursday of each month, 6:00 PM | Needs confirmation |
| Meeting Location | RHS Media Center | Needs confirmation |
| Contact Email | REPACrhs@gmail.com | -- |
| Curriculum | Project Lead The Way (PLTW) | -- |
| Competition Org | Technology Student Association (TSA) | -- |

Faculty names and the courses attributed to them on `engineering-program.html` and
`freshman-info.html` likewise need confirmation from the engineering department.

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
The placeholder items cataloged in Section 5, plus the facts marked *needs confirmation* in Section
8.2 and the specialty-course offerings in Section 8.3.

### 9.2 Missing Technical Features
| # | Gap | Recommendation |
|---|---|---|
| 1 | No `<meta name="description">` tags | Add unique descriptions per page for SEO |
| 2 | No Open Graph / social sharing metadata | Add `og:title`, `og:description`, `og:image` tags |
| 3 | No favicon | Add a pirate-themed favicon (`favicon.ico` / `favicon.svg`) |
| 4 | No sitemap.xml | Generate `sitemap.xml` for search engine indexing |
| 5 | No robots.txt | Add basic `robots.txt` allowing all crawlers |
| 6 | No 404 page in the static site | The deployed site is covered by `wix-host/src/pages/404.astro`; a static-host 404 is still missing for non-Wix serving |
| 7 | No contact form | Consider a simple contact form; a `mailto:` link is in place on two pages |
| 8 | No analytics | Consider privacy-respecting analytics (e.g., Plausible, GoatCounter) |
| 9 | No print styles | Add `@media print` CSS for clean printing of schedules/FAQs |
| 10 | No skip-to-content link | Add skip navigation link for screen reader accessibility |
| 11 | `.table-wrap` defined but unused | Wrap the `about.html` table (and any future tables) to satisfy FR-CON-03 |
| 12 | Draft banner still injected | Remove the UNOFFICIAL DRAFT banner from `js/main.js` at launch (§3.4) |
| 13 | Outbound links point at the legacy site | `engineering-faq.html` links to a `repac-riverside.org` page that does not exist in this repo, and `repac-documents.html` serves two PDFs from legacy Wix file storage. Both break if the legacy site is retired after cutover. |
| 14 | Header/footer duplicated in every file | Consider a static site generator or HTML includes for DRY templates |

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
| `about.html` | Organization history, mission, org details, board (placeholder) |
| `engineering-program.html` | PLTW program overview, course cards, faculty, admission |
| `course-descriptions.html` | Foundation and specialty course descriptions |
| `freshman-info.html` | Magnet lottery, freshman expectations, supplies, contacts |
| `engineering-faq.html` | Engineering program Q&As |
| `repac-faq.html` | REPAC organization Q&As (2 placeholder) |
| `repac-documents.html` | Bylaws, handbook, org documents, contact |
| `student-activities.html` | TSA, robotics, contests, field trips, enrichment programs |
| `events.html` | Embedded REPAC Google Calendar |
| `fundraising.html` | Spirit wear, fund usage, donations, sponsorship |
| `css/style.css` | Complete design system and responsive styles |
| `js/main.js` | Draft banner, nav toggle, dropdown, FAQ accordion, active link, calendar loading state |
| `images/` | Image assets |
| `wix-host/` | Astro wrapper for Wix-Managed Headless deployment (§3.1, `docs/deploy.md`) |
| `README.md` | Project documentation |
| `SITE_ANALYSIS.md` | Audit of the legacy Wix site and IA rationale |
| `docs/deploy.md` | Canonical deployment reference |

**Total site:** 11 HTML pages, 1 CSS file, 1 JS file, plus image assets.

---

*This OpenSpec document is the requirements spec of record for repac-riverside.org. It describes what
the site must be, not a point-in-time status report; content marked placeholder or "needs
confirmation" is outstanding work, not a description of intent.*
