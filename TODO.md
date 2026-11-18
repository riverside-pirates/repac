# REPAC site backlog

Last reviewed 2026-11-17. [GitHub issues](https://github.com/riverside-pirates/repac/issues) are the
live worklist; this file is the overview. When something is done, delete the line (git history keeps
it).

## 1. Problems on the live site (do these first)

- [ ] **Redirect the old Wix addresses.** Since cutover, every old page address returns 404, which
  breaks bookmarks, search results and links from other sites. Suggested targets:

  | Old address | Redirect to |
  |---|---|
  | `/repac`, `/repac-officers` | `about.html` |
  | `/repac-faq` | `repac-faq.html` |
  | `/meetings-and-minutes` | `repac-documents.html` |
  | `/support`, `/fundraising` | `fundraising.html` |
  | `/engineering-program` | `engineering-program.html` |
  | `/engineering-course-descriptions`, `/four-year-course-recommendations` | `course-descriptions.html` |
  | `/engineering-faq` | `engineering-faq.html` |
  | `/details-for-freshman` | `freshman-info.html` |
  | `/college-and-career-readiness` | `engineering-faq.html` until #47 adds its own page |
  | `/student-activities` | `student-activities.html` |
  | `/events-calendar`, `/event-list` | `events.html` |

- [ ] **Fix search setup.** The live `robots.txt` is Wix's auto-generated one and points at
  `/sitemap.xml`, which returns 404. `/favicon.ico` is Wix's blank placeholder. (#31, #40)
- [ ] **Make the deploy copy every file it should.** `wix-host/scripts/sync-static.mjs` copies only
  `*.html`, `css/`, `js/` and `images/`, so a root `robots.txt`, `sitemap.xml` or favicon would
  never reach the live site. This blocks #40 and #61.
- [ ] **Move the two PDFs the old Wix site still hosts** to the REPAC Google Drive (#69). They break
  if the old site is ever deleted.
- [ ] **Record which Wix account owns the live site** after cutover (`docs/deploy.md` §5). The plan
  was `REPACrhs@gmail.com`.
- [ ] **Turn branch protection back on** for `main`, requiring the `links` check instead of a review
  (#16). Commits are reaching `main` with no PR and no passing check.
- [ ] **Look into the occasional 500 on the home page** (about 1 request in 50 on 2026-11-17, gone
  on retry). It looks like the server bundle's cold start.

## 2. Waiting on REPAC leadership

These questions were drafted in November 2026 for the program director, Mike Dibble. The REPAC
questions at the end may need to go to the board. Until they're answered, the site either avoids the
claim or keeps the current wording, as noted. Record each answer in `OPENSPEC.md` §8.2 and update
the page.

- [ ] Should the site call the program a magnet program, a CTE pathway, or both? DPS lists it as a
  CTE pathway; REPAC has always said magnet. (Currently both.)
- [ ] Confirm the admission rules now on the site, taken from DPS: lottery only, opens in January,
  Durham County residents, attendance-zone priority only when ranked first.
- [ ] Do in-zone applicants almost always get a seat? (The old "almost always automatically win"
  line was removed because DPS says in-zone students must still enter the lottery.)
- [ ] Is it true there's no entrance exam or GPA requirement? (`engineering-faq.html`, kept for now)
- [ ] Which Riverside PLTW courses get the +1.0 weighted-GPA bonus? State policy gives it to PLTW
  courses approved for college credit, while `engineering-faq.html` says all PLTW courses. (kept for now)
- [ ] Confirm the February 2008 founding date and the July 2016 NC incorporation.
- [ ] Are these still current: membership for all engineering parents with no dues, board elections
  in May, meetings on the 2nd Thursday at 6:00 PM in the Media Center?
- [ ] Donations by check: the right payee and the mailing address (with an attention line) to print
  on `fundraising.html`.
- [ ] Is there a donation page or item in the Square store we can link straight to?
- [ ] Faculty course assignments for 2026-2027, and a REPAC leadership contact for `freshman-info.html`.
- [ ] Which specialty courses run this year (`OPENSPEC.md` §8.3)?
- [ ] Is NCSSM's FIRST Robotics team (Team 900) open to all Riverside engineering students?
- [ ] Are the NTHS membership criteria on `engineering-faq.html` still current?

## 3. Content to add

- [ ] Mention the PLTW Distinguished High School recognition (9th consecutive year in 2026, per DPS)
- [ ] Faculty bios and photos
- [ ] Sponsor logos (#23)
- [ ] Google Calendar subscribe (iCal) link on `events.html`
- [ ] College and Career Readiness page (#44, PR #47)
- [ ] Four-Year Course Recommendations page (#57, PR #61). The PDFs belong in the REPAC Google
  Drive, and the class years need updating.
- [ ] Student of the Quarter (#50, PR #51). Blocked until there's a way to update it without a release.
- [ ] Alumni landing spot (#35)
- [ ] More helpful outbound links (#32)

## 4. Accessibility

- [ ] FAQ questions can't be opened with a keyboard (they're `<div>`s, not buttons)
- [ ] Desktop dropdown menus open only on mouse hover
- [ ] The calendar iframes on `events.html` have no `title`
- [ ] Hovered links in resource lists turn gold on white, which is too faint (2.4:1 contrast)

## 5. Engineering

- [ ] Stop copying the header and footer by hand into 11 pages (#41)
- [ ] Analytics, before more SEO work (#4)
- [ ] `scripts/check-links.mjs` fails if the repo path contains a space (use `fileURLToPath`)
- [ ] Longer term: separate content from hosting (#64)
