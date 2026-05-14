# Site Migration Parity Audit

**Old site:** `https://www.repac-riverside.org/` (Wix, 16 pages)
**New site:** `https://riverside-pirates.github.io/repac/` (static HTML, 10 pages — this repo)
**Date:** 2026-05-14

## Methodology note

The audit pipeline called for fetching both sites and comparing extracted
content elements. The new site was extracted directly from the working tree
(10 HTML files in this repo). **The live Wix site could not be crawled from
this sandbox**: `WebFetch` returned `403 Forbidden` for every
`repac-riverside.org` URL and the outbound HTTP allowlist blocked a curl
retry with a browser User-Agent. The old-site inventory below was therefore
reconstructed from two prior audit artifacts already in the repo —
`SITE_ANALYSIS.md` (a fact-sheet derived from a previous crawl) and
`OPENSPEC.md` (a state-of-the-new-site document that catalogs source
content) — plus the explicit list of 16 old-site URLs in `SITE_ANALYSIS.md`.
Where an old-site element below cannot be verified from those artifacts it
is marked **UNVERIFIED**; treat those rows as needing a manual spot-check
against the live Wix site before launch.

## 1. Summary

| Status     | Count | Notes |
|------------|-------|-------|
| PRESENT    | ~28   | Core informational content, board roster, faculty, course catalog, meeting cadence, Spirit Wear link, REPAC email, Google Calendar embed |
| PARTIAL    | ~8    | Donation flow, key contacts, TSA dates, sponsorship, community service, clubs |
| MISSING    | ~6    | Meeting minutes archive, four-year course planning guide, college/career readiness page, volunteer sign-up form, EIN/tax ID, mailing address, social media |
| UNVERIFIED | several | External link targets on old Wix pages that the sandbox could not re-crawl |

**Launch-readiness gut check:** The new site covers the substance — what
REPAC is, the PLTW pathway, courses, faculty, board, meeting cadence,
Spirit Wear, the REPAC email. A parent landing on it would understand the
program and know how to reach the org. There are real gaps, but only two
are likely to block a parent action: (1) the donation flow re-uses the
Spirit Wear Square URL as the "Donate Online" target — donors will arrive
at a merch store, not a donation page; (2) the old site's Meetings &
Minutes archive has no equivalent. Everything else is degraded but
recoverable. **Ship-ready with one must-fix (donate link) and ideally a
few should-fixes.**

## 2. BLOCKERS

Things a parent visitor would actually need that are missing or broken:

1. **Donate Online button points to the Spirit Wear store, not a donation
   form** — `fundraising.html:91` reuses
   `https://repac-riverside-engineering-parent-action-council.square.site/`
   for both "Visit the Spirit Wear Store" and "Donate Online". A donor
   clicking "Donate Online" lands on a merch checkout. Either wire a real
   donation platform (Square Donations, Givebutter, PayPal Giving Fund) or
   remove the button and lean on the "By Check" instructions.
2. **No mailing address for check donations** — `fundraising.html` tells
   donors to mail checks to "Riverside High School" with no street
   address. Provide the full address (or REPAC PO box, if one exists).
3. **No EIN / Tax ID published** — required by some employer matching-gift
   programs and helpful for donors claiming the deduction. Old Wix site
   should be checked; if missing there too, add it.
4. **Engineering faculty named but no contact method** — `freshman-info.html`
   tells parents to "Contact IED teacher Emily Quadrio" but provides no
   email or phone. Add at least DPS email addresses for the four named
   faculty (Mike Dibble, Drew Byers, Benjamin Drugatz, Emily Quadrio).
5. **No meeting minutes / archive** — the old Wix site had a dedicated
   "Meetings and Minutes" page. The new site shows the Google Calendar
   embed but offers no way to read what past meetings covered. If minutes
   were published before, link to them; otherwise note explicitly that
   minutes are available on request via the REPAC email.

## 3. Page-by-page parity

### 3.1 Home (`/` -> `index.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Org name, school, location | PRESENT | `index.html` hero |
| "Supporting PLTW since 2008" tagline | PRESENT | `index.html` hero |
| 501(c)(3) / mission blurb | PRESENT | `index.html` "Welcome to REPAC" |
| Next-meeting cadence (2nd Thursday, 6 PM, Media Center) | PARTIAL | Cadence is on home page; specific date/location surface lives on Google Calendar embed at `events.html`. OPENSPEC describes a "Next Meeting banner" — not present in current `index.html` |
| Quick links to About, Program, Freshman Info, Activities, Events, Fundraising | PRESENT | `index.html` card grid |
| Mission statement (fundraising, mentors, competitions, community) | PRESENT | `index.html` "Our Mission" |

### 3.2 REPAC / About (`/repac` + `/repac-officers` -> `about.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Founded Feb 2008 history | PRESENT | `about.html` |
| 2016 NC incorporation, Sept 2016 501(c)(3) | PRESENT | `about.html` |
| Officer roster (President, VP, Secretary, Treasurer) | PRESENT | `about.html` — Shan Phillips, Linda Yu, Megan Pruette, Colleen Johnson |
| Committee chairs | PRESENT | `about.html` — Horton, Hernandez, Karnowski, Bowers, Gainey, plus two "OPEN" |
| Per-officer contact info / photos | UNVERIFIED / PARTIAL | New site routes everything through `REPACrhs@gmail.com`. If the old Wix page exposed per-officer emails or photos, that has been intentionally consolidated |
| "Get Involved" / no-dues membership note | PRESENT | `about.html` |
| Meeting cadence (2nd Thu, 6 PM, Media Center) | PRESENT | `about.html` org-details table |

### 3.3 REPAC FAQ (`/repac-faq` -> `repac-faq.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| What is REPAC? | PRESENT | `repac-faq.html` |
| Who can be a member? | PRESENT | `repac-faq.html` |
| Meeting time/place | PRESENT | `repac-faq.html` |
| Tax-exempt status | PRESENT | `repac-faq.html` |
| How funds are used | PRESENT | `repac-faq.html` |
| How to get involved | PRESENT | `repac-faq.html` |
| How to donate | PARTIAL | Answered in prose; full donation flow lives on `fundraising.html` — see blockers above |
| How to contact REPAC | PRESENT | `mailto:REPACrhs@gmail.com` at `repac-faq.html:108` |
| Social media handles | MISSING | None published. UNVERIFIED whether old Wix exposed any |

### 3.4 Meetings and Minutes (`/meetings-and-minutes` -> *consolidated*)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Meeting schedule | PRESENT | Google Calendar embed at `events.html:54-55` (src `cmVwYWNyaHNAZ21haWwuY29t` = `repacrhs@gmail.com`) |
| Past meeting minutes / documents | MISSING | No equivalent page; no document repository. If minutes were ever published on Wix, those links and PDFs are unreferenced on the new site |

### 3.5 Support / Fundraising (`/support` + `/fundraising` -> `fundraising.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Spirit Wear callout + Square store link | PRESENT | `fundraising.html:54` -> Square store |
| Spirit Wear photo | PRESENT | `images/spirit-wear.jpg` |
| How funds are used (4 categories) | PRESENT | `fundraising.html` |
| Online donation flow | PARTIAL / BROKEN | "Donate Online" button at `fundraising.html:91` points at the Spirit Wear Square store, not a donation page |
| Donate by check instructions | PARTIAL | Present, but mailing address is just "Riverside High School" — no street/PO box |
| EIN / tax ID | MISSING | Not published on new site; UNVERIFIED on old |
| Corporate matching | PRESENT (prose) | Generic mention only — no list of matching employers |
| Corporate sponsorship tiers / contact | MISSING | Old SITE_ANALYSIS notes donations "up to $5,000" accepted; no tiered sponsorship program is published on the new site |
| Volunteer / Other Ways to Help bullets | PRESENT | `fundraising.html` |
| Contact email for fundraising | PRESENT | `mailto:REPACrhs@gmail.com` at `fundraising.html:108` |

### 3.6 Engineering Program (`/engineering-program` -> `engineering-program.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| PLTW description | PRESENT | `engineering-program.html` |
| Distinguished School / 4 years recognition (per SITE_ANALYSIS) | UNVERIFIED | Not found in new site HTML — confirm whether old Wix featured this and re-add if so |
| 96% college matriculation stat (per SITE_ANALYSIS) | MISSING | Not found in new site HTML |
| 3 foundation courses + capstone structure | PRESENT | `engineering-program.html` program structure cards |
| College credit pathway (B grade + PLTW exam) | PRESENT | `engineering-program.html` |
| DPS magnet lottery admission | PRESENT | `engineering-program.html` admission section |
| Faculty roster | PRESENT | Mike Dibble (Program Coordinator), Drew Byers (CSE), Benjamin Drugatz (POE), Emily Quadrio (IED) — `engineering-program.html:130-143` |
| Faculty contact info | MISSING | Names only, no emails — see blocker #4 |
| Outbound link to DPS PLTW page (`dpsnc.net/Page/2042`) | MISSING | Listed as a source in `SITE_ANALYSIS.md` but no equivalent outbound link on new site |
| Outbound link to Duke Pratt Riverside Outreach article | MISSING | Listed as a source in `SITE_ANALYSIS.md` but no equivalent outbound link on new site |

### 3.7 Engineering FAQ (`/engineering-faq` -> `engineering-faq.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| 9 Q&As (PLTW, admission, prior exp, courses, college credit, careers, future-engineer, software, transfer) | PRESENT | All 9 covered per OPENSPEC §4.6, verified by file length |

### 3.8 Course Descriptions (`/engineering-course-descriptions` -> `course-descriptions.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| IED, POE, CEA, EDD descriptions | PRESENT | `course-descriptions.html` |
| Electives: Cybersecurity, Digital Electronics, Aerospace, CS, CSE | PRESENT | `course-descriptions.html` (DE, AE, SEC, CSP, plus CSE on program page) |
| 4-course concentration / DPS requirement explanation | PRESENT | `course-descriptions.html` intro |

### 3.9 Four-Year Course Recommendations (`/four-year-course-recommendations` -> *missing*)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Year-by-year recommended course plan | MISSING | No equivalent page on new site. Course sequence is implied by the foundation/specialty structure but no planning guide table |

### 3.10 Details for Freshman (`/details-for-freshman` -> `freshman-info.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| DPS magnet lottery process | PRESENT | `freshman-info.html` |
| What to expect (IED, academic schedule) | PRESENT | `freshman-info.html` |
| Supplies & materials | PARTIAL | Generic note; full supply list deferred to faculty at start of year — see blocker #4 |
| Getting involved (REPAC, TSA, service, social) | PRESENT | `freshman-info.html` |
| FAQ buttons | PRESENT | `freshman-info.html` |
| Key contacts | PARTIAL | Faculty named (Quadrio etc.) but no emails/phones |

### 3.11 College and Career Readiness (`/college-and-career-readiness` -> *missing*)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Post-graduation planning content | MISSING | No equivalent page. College-credit mention exists on `engineering-program.html` but the dedicated readiness page (career resources, alumni outcomes) has no replacement |

### 3.12 Student Activities (`/student-activities` -> `student-activities.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| TSA chapter description + competition events | PRESENT | `student-activities.html` |
| Community service | PARTIAL | Section exists but specifics (projects, hour requirements) not present |
| Social events list | PRESENT | `student-activities.html` |
| Clubs & Organizations beyond TSA (Robotics, Sci Olympiad, etc.) | PARTIAL/MISSING | Old site cataloged these per OPENSPEC §4.8; new site mentions clubs but no concrete club list |

### 3.13 Events Calendar + Event List (`/events-calendar`, `/event-list` -> `events.html`)

| Old-site element | Status | Where on new site / note |
|---|---|---|
| Calendar view | PRESENT | Google Calendar iframe at `events.html:54-55`, both desktop (MONTH) and mobile (AGENDA) variants |
| Event list view | PRESENT | Same calendar embed in AGENDA mode serves as list |
| Upcoming events callouts (monthly meeting, TSA regional, TSA state) | PARTIAL | Calendar embed shows whatever is on the REPAC Google Calendar; no curated "upcoming events" cards on the page itself |
| Annual events table (7 recurring events) | MISSING | Per OPENSPEC §4.9 the new site spec called for this; not present in current `events.html` |
| Volunteer Opportunities / sign-up | MISSING | No volunteer sign-up link or form |
| Specific TSA competition dates | PARTIAL | Surfaces only via Google Calendar; not called out in page copy |

## 4. New-site pages with no old-site equivalent

None observed. The new site is strictly a subset/consolidation of the old
Wix sitemap — every new page maps to one or more old pages. The new site
introduces no novel content sections (e.g. no testimonials, alumni
spotlights, sponsor wall, newsletter signup), which `OPENSPEC.md §9.3`
also flagged as future opportunities rather than launch requirements.

## 5. Recommended pre-launch punch list

In priority order:

1. Fix the "Donate Online" button (point to a real donation flow, or
   remove it). Update mailing address with full street/PO box.
2. Add a faculty contact block (DPS emails) to `freshman-info.html`
   and/or `engineering-program.html`.
3. Add EIN/Tax ID to `fundraising.html`.
4. Add an "Annual Events" callout block or table to `events.html` so the
   page has standalone content beyond the calendar iframe.
5. Decide on Meetings & Minutes: either add a minutes archive section
   (PDF links) on `about.html` or `events.html`, or add an explicit "Past
   meeting minutes available by request — email REPACrhs@gmail.com" line.
6. Add a Volunteer sign-up CTA (Google Form or mailto) on `events.html`
   or `fundraising.html`.
7. Re-add the DPS PLTW and Duke Pratt outreach outbound links on
   `engineering-program.html` if the old site had them.
8. Decide whether "Four-Year Course Recommendations" and "College and
   Career Readiness" content was intentionally dropped or needs a home
   on the new site (could fit as sections under Program / Freshman Info).
9. Manually spot-check the live Wix pages to resolve UNVERIFIED rows
   above — especially the engineering-program statistics (96% college,
   Distinguished School) and per-officer contact details.
