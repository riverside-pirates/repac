# OpenSpec Requirements Document
## REPAC - Riverside Engineering Parent Action Council Website
### repac-riverside.org

**Version:** 1.0
**Date:** 2026-03-09
**Status:** Current State Analysis & Requirements

---

## 1. Project Overview

### 1.1 Organization
REPAC (Riverside Engineering Parent Action Council) is a 501(c)(3) nonprofit organization founded in February 2008. It supports the Project Lead The Way (PLTW) pre-engineering program at Riverside High School in Durham, NC.

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
|-- meetings.html               [Meetings]
|-- events.html                 [Events]
|-- fundraising.html            [Fundraising]
|
|-- css/style.css               [Shared Stylesheet]
|-- js/main.js                  [Shared JavaScript]
```

### 2.1 Navigation Structure
| Nav Item | Page | Dropdown Children |
|---|---|---|
| Home | `index.html` | -- |
| About | `about.html` | -- |
| Program | `engineering-program.html` | Overview, Courses, Freshman Info |
| FAQ | `engineering-faq.html` | Engineering FAQ, REPAC FAQ |
| Activities | `student-activities.html` | -- |
| Meetings | `meetings.html` | -- |
| Events | `events.html` | -- |
| Fundraising | `fundraising.html` | -- |

---

## 3. Technical Architecture

### 3.1 Stack
| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS3 (custom properties / variables) |
| Scripting | Vanilla JavaScript (IIFE, no dependencies) |
| Build Tools | None (static site, no build step) |
| Hosting | Static file hosting (open `index.html` or `python3 -m http.server`) |

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
- **Responsive tables** with horizontal scroll wrapper
- **Placeholder blocks** (dashed yellow border, italic) for content pending from leadership
- **3-column footer** with quick links, resources, and copyright
- **Mobile breakpoint** at `768px` (hamburger menu, stacked cards, stacked nav)

### 3.4 JavaScript Behaviors
| Feature | Implementation |
|---|---|
| Mobile nav toggle | `.nav-toggle` click toggles `.open` on `.site-nav`, updates `aria-expanded` |
| Dropdown on touch | Prevents default on mobile dropdown links, toggles `.open` on parent |
| FAQ accordion | Click `.faq-question` toggles `.open` on `.faq-item` parent |
| Active nav link | Matches `window.location.pathname` to `href` and adds `.active` class |

---

## 4. Page-by-Page Content Requirements

### 4.1 Home (`index.html`)
| Section | Content | Status |
|---|---|---|
| Hero | Organization name, school/location, tagline ("Supporting PLTW... since 2008") | Complete |
| Next Meeting banner | 2nd Thursday, 6 PM, RHS Media Center with link to meetings page | Complete |
| Welcome blurb | REPAC description, 501(c)(3) status, mission summary | Complete |
| Quick Links grid | 6 cards linking to About, Program, Freshman Info, Activities, Meetings, Fundraising | Complete |
| Mission statement | Fundraising, mentors, competitions, community | Complete |

### 4.2 About (`about.html`)
| Section | Content | Status |
|---|---|---|
| History | Founded Feb 2008, incorporated 2016, 501(c)(3) status | Complete |
| Mission | Bulleted list of REPAC activities | Complete |
| Organization Details | Table: founded, incorporation, IRS status, membership, meetings | Complete |
| Executive Board | Board member names and roles | **PLACEHOLDER** |
| Get Involved | Membership info (no dues), CTA to meetings | Complete |

### 4.3 Engineering Program (`engineering-program.html`)
| Section | Content | Status |
|---|---|---|
| What is PLTW | PLTW description, Riverside's standing in DPS | Complete |
| Program Structure | Foundation courses (IED, POE, CEA) and capstone (EDD) as cards | Complete |
| College Credit | PLTW end-of-course assessment credit opportunities | Complete |
| Admission | Magnet program, DPS lottery process, link to freshman info | Complete |

### 4.4 Course Descriptions (`course-descriptions.html`)
| Section | Content | Status |
|---|---|---|
| IED (9th grade) | Design process, 3D modeling, engineering notebooks | Complete |
| POE (10th grade) | Mechanisms, energy, statics, materials, kinematics | Complete |
| CEA (11th grade) | Civil engineering, architecture, Revit software | Complete |
| EDD (12th grade) | Capstone, team projects, professional presentation | Complete |
| Additional Courses | Electives (CS, Digital Electronics, etc.) | **PLACEHOLDER** |

### 4.5 Freshman Info (`freshman-info.html`)
| Section | Content | Status |
|---|---|---|
| Getting Into the Program | DPS magnet lottery process and timeline | Complete |
| What to Expect | IED course, standard academic schedule | Complete |
| Supplies & Materials | Engineering notebook, basic supplies, REPAC funding help | **PLACEHOLDER** (details pending) |
| Getting Involved | REPAC meetings, TSA, community service, social events | Complete |
| FAQ links | Buttons to both FAQ pages | Complete |
| Key Contacts | Engineering dept and REPAC leadership contacts | **PLACEHOLDER** |

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
| Community Service | Description of service projects | **PLACEHOLDER** (specifics pending) |
| Social Events | List of past event types, link to events page | Complete |
| Clubs & Organizations | Robotics, Science Olympiad, etc. | **PLACEHOLDER** |

### 4.9 Meetings (`meetings.html`)
| Section | Content | Status |
|---|---|---|
| Schedule | 2nd Thursday, 6 PM, RHS Media Center | Complete |
| Upcoming Meetings | Table with March, April, May 2026 dates | Complete |
| Meeting Minutes | Archive of past minutes | **PLACEHOLDER** |
| Virtual Attendance | Remote options, communication channels | **PLACEHOLDER** |

### 4.10 Events (`events.html`)
| Section | Content | Status |
|---|---|---|
| Upcoming Events | Cards: monthly meeting, TSA regional, TSA state | Partial (TSA dates TBD) |
| Annual Events | Table of 7 recurring events with typical timing | Complete |
| Volunteer Opportunities | Description + sign-up info | **PLACEHOLDER** |

### 4.11 Fundraising (`fundraising.html`)
| Section | Content | Status |
|---|---|---|
| Spirit Wear | Description of merch, ordering process | **PLACEHOLDER** (links/items pending) |
| How Funds Are Used | 4 cards: equipment, competitions, supplies, events | Complete |
| Make a Donation | 501(c)(3) info, donation options | **PLACEHOLDER** |
| Corporate Matching | Employer matching, sponsorships | **PLACEHOLDER** (tiers/contacts pending) |
| Other Ways to Help | Bulleted list: volunteer, donate materials, mentor, spread the word | Complete |

---

## 5. Placeholder Content Inventory

The following items require input from REPAC leadership before the site is content-complete:

| # | Page | Section | What's Needed |
|---|---|---|---|
| 1 | `about.html` | Executive Board | Board member names, roles, optional photos |
| 2 | `course-descriptions.html` | Additional Courses | Elective course list and descriptions |
| 3 | `freshman-info.html` | Supplies & Materials | Detailed supply list per course |
| 4 | `freshman-info.html` | Key Contacts | Engineering dept email/phone, REPAC leadership contacts |
| 5 | `repac-faq.html` | How to donate? | Donation methods, links, payment platforms |
| 6 | `repac-faq.html` | How to contact? | Email address, social media handles |
| 7 | `student-activities.html` | Community Service | Specific projects, volunteer hour requirements |
| 8 | `student-activities.html` | Clubs & Organizations | Current club list and descriptions |
| 9 | `meetings.html` | Meeting Minutes | PDF/HTML links to past meeting minutes |
| 10 | `meetings.html` | Virtual Attendance | Zoom/Teams links or communication channel info |
| 11 | `events.html` | Upcoming Events | Confirmed TSA competition dates |
| 12 | `events.html` | Volunteer Opportunities | Sign-up links, contact for volunteer coordinator |
| 13 | `fundraising.html` | Spirit Wear | Product catalog, ordering link, pricing |
| 14 | `fundraising.html` | Make a Donation | Online payment link, mailing address, EIN/tax ID |
| 15 | `fundraising.html` | Corporate Sponsorship | Sponsorship tiers, partnership contact |

---

## 6. Functional Requirements

### 6.1 Navigation
- **FR-NAV-01:** Sticky header remains visible on scroll across all pages
- **FR-NAV-02:** Dropdown menus appear on hover (desktop) and tap (mobile)
- **FR-NAV-03:** Current page highlighted with `.active` class in nav
- **FR-NAV-04:** Hamburger menu toggles mobile nav at breakpoint <= 768px
- **FR-NAV-05:** `aria-expanded` attribute updates on mobile nav toggle for accessibility

### 6.2 Content Display
- **FR-CON-01:** FAQ accordion expands/collapses individual items on click
- **FR-CON-02:** Card grids reflow responsively (`auto-fit`, minimum 260px per card)
- **FR-CON-03:** Tables scroll horizontally on narrow viewports
- **FR-CON-04:** Placeholder sections are visually distinct (dashed yellow border, italic text)

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
- **NFR-PERF-01:** Zero external dependencies (no frameworks, CDNs, or third-party scripts)
- **NFR-PERF-02:** Total page weight should remain under 100KB per page (excluding images)
- **NFR-PERF-03:** No build step required; site deployable as-is to any static host

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
- **NFR-MAINT-02:** No build tooling, package managers, or transpilation required
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
| Fact | Value |
|---|---|
| Full Name | Riverside Engineering Parent Action Council |
| Abbreviation | REPAC |
| Founded | February 2008 |
| IRS Status | 501(c)(3) tax-exempt |
| NC Incorporation | 2016 |
| Membership | All RHS engineering parents (no dues) |
| Meeting Schedule | 2nd Thursday of each month, 6:00 PM |
| Meeting Location | RHS Media Center |
| Curriculum | Project Lead The Way (PLTW) |
| Competition Org | Technology Student Association (TSA) |

### 8.3 PLTW Course Sequence
| Year | Course | Code |
|---|---|---|
| Freshman (9th) | Introduction to Engineering Design | IED |
| Sophomore (10th) | Principles of Engineering | POE |
| Junior (11th) | Civil Engineering & Architecture | CEA |
| Senior (12th) | Engineering Design & Development (Capstone) | EDD |

---

## 9. Identified Gaps & Recommendations

### 9.1 Missing Content (Requires REPAC Leadership Input)
All 15 placeholder items cataloged in Section 5 above.

### 9.2 Missing Technical Features
| # | Gap | Recommendation |
|---|---|---|
| 1 | No `<meta name="description">` tags | Add unique descriptions per page for SEO |
| 2 | No Open Graph / social sharing metadata | Add `og:title`, `og:description`, `og:image` tags |
| 3 | No favicon | Add a pirate-themed favicon (`favicon.ico` / `favicon.svg`) |
| 4 | No sitemap.xml | Generate `sitemap.xml` for search engine indexing |
| 5 | No robots.txt | Add basic `robots.txt` allowing all crawlers |
| 6 | No 404 page | Create a custom 404 page with navigation back to home |
| 7 | No contact form | Consider a simple contact form or mailto link |
| 8 | No analytics | Consider privacy-respecting analytics (e.g., Plausible, GoatCounter) |
| 9 | No print styles | Add `@media print` CSS for clean printing of schedules/FAQs |
| 10 | No skip-to-content link | Add skip navigation link for screen reader accessibility |
| 11 | No `images/` directory populated | Add hero images, board photos, spirit wear photos, engineering lab photos |
| 12 | Header/footer duplicated in every file | Consider a static site generator or HTML includes for DRY templates |

### 9.3 Content Enhancement Opportunities
| # | Opportunity | Description |
|---|---|---|
| 1 | Photo gallery | Showcase engineering labs, student projects, TSA competitions, events |
| 2 | Testimonials | Student/parent quotes about the engineering program |
| 3 | Alumni spotlight | Where have graduates gone? College and career outcomes |
| 4 | Newsletter signup | Email list integration for REPAC communications |
| 5 | Calendar integration | Embed Google Calendar or iCal feed for events/meetings |
| 6 | Document repository | Bylaws, financial reports, annual meeting presentations |
| 7 | Sponsor recognition | Logo wall for corporate sponsors and matching employers |

---

## 10. File Inventory

| File | Size (approx) | Purpose |
|---|---|---|
| `index.html` | 5 KB | Home page with hero, quick links, mission |
| `about.html` | 4 KB | Organization history, mission, board (placeholder) |
| `engineering-program.html` | 5 KB | PLTW program overview, course cards, admission |
| `course-descriptions.html` | 5 KB | Detailed IED, POE, CEA, EDD course descriptions |
| `freshman-info.html` | 5 KB | Magnet lottery, freshman expectations, getting involved |
| `engineering-faq.html` | 5 KB | 9 engineering program Q&As |
| `repac-faq.html` | 5 KB | 8 REPAC organization Q&As (2 placeholder) |
| `student-activities.html` | 4 KB | TSA, community service, social events, clubs |
| `meetings.html` | 4 KB | Schedule, upcoming dates, minutes archive (placeholder) |
| `events.html` | 5 KB | Upcoming events, annual events table, volunteering |
| `fundraising.html` | 5 KB | Spirit wear, fund usage, donations, sponsorship |
| `css/style.css` | 8 KB | Complete design system and responsive styles |
| `js/main.js` | 1 KB | Nav toggle, dropdown, FAQ accordion, active link |
| `README.md` | 1 KB | Project documentation |

**Total site:** 11 HTML pages, 1 CSS file, 1 JS file, ~62 KB content (no images)

---

*This OpenSpec document reflects the current state of the repac-riverside.org codebase as of 2026-03-09. It is intended to serve as a baseline requirements reference for ongoing development, content completion, and future enhancements.*
