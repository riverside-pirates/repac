# Working in this repo (for AI agents, and a checklist for people)

This is the public website of REPAC, a parent nonprofit at Riverside High School in Durham, NC. It's
live at <https://www.repac-riverside.org>, and families rely on it for things like how to get into
the engineering program. Getting a fact wrong here has real consequences, so accuracy matters more
than polish.

Read `README.md` first. It explains the live status and which document to trust for what.

## Rules

1. **Don't invent or "improve" facts.** Names, dates, numbers, deadlines, prices, eligibility rules
   and policies must match `OPENSPEC.md` §8.2, which records the source for each one. If a change
   needs a fact you can't verify from an authoritative source (IRS, DPS, PLTW, REPAC leadership),
   don't publish it. Add the question to "Waiting on REPAC leadership" in `TODO.md` instead.
2. **When you verify or correct a fact, update §8.2 too**, with the source and the date you checked.
3. **The header and footer are duplicated in all 11 `.html` files.** Change every file, then confirm
   they still match (this should print one line with the count 11):

   ```bash
   for f in *.html; do awk '/<header class="site-header">/,/<\/header>/' "$f" | md5sum; done | sort | uniq -c
   ```
4. **Run the link check before you finish:** `node scripts/check-links.mjs`. CI runs it on every PR,
   and a 404 fails the build. Use `SKIP_EXTERNAL=1` only when you're offline.
5. **Keep the site plain.** HTML, one stylesheet (`css/style.css`), one script (`js/main.js`). No
   frameworks, CDNs, trackers or build step for the pages themselves.
6. **New files at the repo root won't be deployed.** `wix-host/scripts/sync-static.mjs` copies only
   `*.html`, `css/`, `js/` and `images/`. If you add anything else, update that script in the same
   change.
7. **Don't commit documents.** PDFs, minutes and forms go in the REPAC Google Drive and get linked;
   only page images go in `images/`.
8. **Don't deploy, and don't touch Wix settings.** Releasing is a manual step an account owner runs
   (`docs/deploy.md`). Merging to `main` doesn't publish anything. Never commit `wix-host/.env.local`.
9. **The board roster is dated.** When you update names on `about.html`, update the academic-year
   heading above them.
10. **Write for parents.** Plain words, short sentences, no marketing copy. Address families directly.

## Where to look

| Need | File |
|---|---|
| Verified facts and page requirements | `OPENSPEC.md` (§8.2 for facts) |
| Open work and unanswered questions | `TODO.md`, then GitHub issues (issues are newer) |
| How deploys and rollbacks work | `docs/deploy.md` |
| Why the site is organized this way | `SITE_ANALYSIS.md` (historical, April 2026) |
