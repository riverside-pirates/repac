# REPAC website — Riverside Engineering Parent Action Council

The website of REPAC, the 501(c)(3) parent organization that supports the Project Lead The Way (PLTW)
engineering program at Riverside High School in Durham, NC.

**Live at <https://www.repac-riverside.org>.** This repository is the source of the live site.

## Status (checked 2026-11-17)

| | |
|---|---|
| **Live site** | www.repac-riverside.org serves this repo, deployed through Wix-Managed Headless. |
| **What's live** | Whatever was last *released*, not whatever is on `main`. Merging does not publish; an account owner releases by hand (see `docs/deploy.md`). On 2026-11-17 the live site matched `main` except `about.html`, which was a few commits behind. |
| **Old site** | The previous Wix Editor site still exists in REPAC's Wix account but no longer serves the domain. Keep it: it's the rollback target and still hosts two PDFs that `repac-documents.html` links to (#69). |
| **Known live problems** | Old Wix page addresses (`/repac`, `/engineering-program`, …) now return 404, and search setup is incomplete. See the top of `TODO.md`. |

## Making a change

The site is plain HTML, CSS and JavaScript with no build step. To change a page, edit its `.html`
file directly.

1. **Facts need a source.** Names, dates, numbers and policies on the site must match `OPENSPEC.md`
   §8.2, which records where each fact was checked. If you can't verify something, don't publish it;
   add it to "Waiting on REPAC leadership" in `TODO.md`.
2. **The header and footer are copied into all 11 pages.** A change to the menu or footer has to be
   made in every `.html` file. This one-liner should print a single line with the count 11:

   ```bash
   for f in *.html; do awk '/<header class="site-header">/,/<\/header>/' "$f" | md5sum; done | sort | uniq -c
   ```
3. **Check links before opening a pull request.** CI runs the same check on every PR:

   ```bash
   node scripts/check-links.mjs                    # internal and external links
   SKIP_EXTERNAL=1 node scripts/check-links.mjs    # offline: internal links only
   ```
4. **Documents (PDFs, minutes, forms) go in the REPAC Google Drive**, not this repo. Link to them
   with sharing set to "Anyone with the link → Viewer". Images that are part of a page go in
   `images/`.

To preview locally, open `index.html` in a browser, or run `python3 -m http.server 8000` and visit
<http://localhost:8000>.

## What's in the repo

```
index.html                  Home
about.html                  About REPAC: history, mission, organization details, executive board
engineering-program.html    PLTW program overview, faculty, admission
course-descriptions.html    PLTW course details
freshman-info.html          Information for incoming freshmen
engineering-faq.html        Engineering program FAQ
repac-faq.html              REPAC organization FAQ
repac-documents.html        Bylaws and other REPAC documents (linked from Home > Resources)
student-activities.html     TSA, robotics, contests, field trips, enrichment programs
events.html                 Embedded REPAC Google Calendar
fundraising.html            Spirit wear, donations, sponsorship
css/style.css               The one stylesheet
js/main.js                  The one script: mobile menu, FAQ accordion, calendar loading
images/                     Images used on pages
scripts/check-links.mjs     Link checker (run by CI)
wix-host/                   Thin Astro wrapper Wix needs to host the site (see docs/deploy.md)
```

Some things REPAC runs live elsewhere and stay there: spirit wear is a Square storefront and the
events calendar is a Google Calendar.

## Which document to read

| Document | Use it for |
|---|---|
| `README.md` | This overview |
| `OPENSPEC.md` | Requirements for every page, and the verified list of organizational facts (§8.2) |
| `TODO.md` | The backlog, and questions waiting on REPAC leadership |
| `docs/deploy.md` | How the site is built, previewed and released, and how to roll back |
| `AGENTS.md` | Rules for AI coding agents working in this repo (also a good checklist for people) |
| `SITE_ANALYSIS.md` | April 2026 audit of the old Wix site. Historical: explains *why* the site is organized the way it is |
| [GitHub issues](https://github.com/riverside-pirates/repac/issues) | The live worklist. Where an issue and `TODO.md` disagree, the issue is newer |

If two documents disagree, trust them in this order: the live site and outside sources, then
`OPENSPEC.md` §8.2 for facts, `docs/deploy.md` for deployment, then everything else.
