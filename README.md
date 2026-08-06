# REPAC - Riverside Engineering Parent Action Council

Rebuild of the REPAC organization website, supporting the PLTW engineering program at Riverside High School in Durham, NC.

## About

REPAC is a 501(c)(3) nonprofit organization founded in 2008 that supports the Project Lead The Way (PLTW) pre-engineering faculty and students at Riverside High School.

## Status: intended vs. actual

**This repo is not the live site yet.** Read this section before anything else.

| | Intended (end state) | Actual (today) |
|---|---|---|
| **Public site** | This repo, served at `www.repac-riverside.org` | Legacy Wix site at `www.repac-riverside.org`, edited in the Wix visual editor. Not in this repo. |
| **Source of truth** | This repo | The legacy Wix site. This repo is a not-yet-launched replacement. |
| **Hosting** | Wix-Managed Headless, deployed from CI | Nothing. The site runs only on a local `python3 -m http.server`. No hosting, no CI, no domain pointed here. |
| **Pages** | Consolidated IA (see `SITE_ANALYSIS.md`) | The pages listed under *Site Structure* below, content-incomplete |
| **Content** | Reviewed and approved by REPAC leadership | Unreviewed. Drafted from the legacy site plus inference; some facts unverified. |

Because none of this is live, `js/main.js` injects a red **UNOFFICIAL DRAFT** banner on every page pointing visitors back to the real site. Its presence is the quickest check on whether the table above still holds — the banner comes out at launch and not before.

## What stands between here and launch

Two independent tracks. Neither blocks the other.

**1. Content and facts** — the larger track, and the one that needs people, not code. Faculty bios and photos, executive board roster, verified founding/incorporation dates, correct faculty roles, the PLTW courses not yet described, sponsor logos, and outbound links (DPS CTE lottery, Google Group, calendar iCal). The authoritative list is `TODO.md` plus the repo issues.

Some sections ship a visible placeholder block instead of real content. To find every one still outstanding:

```bash
grep -rn 'class="placeholder"' *.html
```

**2. Deployment** — engineering. The decision is locked: Wix-Managed Headless, because Wix is load-bearing for the org and moving off it is a separate fight. The shape is an Astro wrapper in `wix-host/` that serves these static files from `public/`, GitHub Actions running `wix preview` per PR and `wix release` to production, then a DNS cutover. If `wix-host/` and `.github/workflows/` aren't present in this repo, that work hasn't landed.

Three questions were open at the time this plan was approved and need a Wix account to settle: whether `wix release` can run non-interactively in CI, the exact API-key permission scope for headless build/release, and an Astro `public/` vs `src/pages` route collision. `docs/deploy.md` is where the answers belong once known.

## Site Structure

Plain HTML/CSS/JS static site — no build tools or dependencies.

```
index.html                  Home page
about.html                  About REPAC (history, mission, board)
engineering-program.html    PLTW program overview
course-descriptions.html    PLTW course details
freshman-info.html          Info for incoming freshmen
engineering-faq.html        Engineering program FAQ
repac-faq.html              REPAC organization FAQ
repac-documents.html        Bylaws, minutes, org documents
student-activities.html     TSA, clubs, community service
events.html                 Events calendar
fundraising.html            Spirit wear, fundraising
css/style.css               Shared stylesheet
js/main.js                  Shared JS (draft banner, nav toggle, FAQ accordion)
images/                     Image assets
```

Not everything the org runs lives here: spirit wear is a separate Square storefront, and the events calendar is Google Calendar. Those stay external.

## Local Development

Open `index.html` in a browser. No build step required.

For a local dev server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Where the rest of the context lives

- `SITE_ANALYSIS.md` — audit of the legacy Wix site and the rationale for consolidating it. Start here to understand *why* the new IA looks like it does.
- `TODO.md` — pre-launch / post-launch / technical backlog. Overlaps the issues below; where they disagree, the issues are newer.
- [GitHub issues](https://github.com/riverside-pirates/repac/issues) — the live worklist.
- `OPENSPEC.md` — change-proposal conventions for this repo.
