# REPAC Deployment — Wix-Managed Headless (canonical reference)

> Source of truth for deploying the REPAC static site to **Wix-Managed Headless**. Written to
> survive context loss between sessions and to guide a future client handoff. Each claim is tagged
> **[VERIFIED]** (we proved it this project), **[OPEN]** (unverified / undecided), or
> **[DEFERRED]** (intentionally not built yet). Don't promote an OPEN item to fact without testing.

## 1. Architecture

The REPAC site is plain static HTML (`*.html`, `css/`, `js/`, `images/` at the repo root). Wix-Managed
Headless requires an **Astro** frontend, so `wix-host/` is a thin Astro wrapper:

- `scripts/sync-static.mjs` copies the root static files into `wix-host/public/` (gitignored).
- Wix serves `public/` at the site root. **[VERIFIED]** `/` serves `public/index.html`; all
  sub-pages + assets return 200; unknown paths 404 — all with an empty `src/pages/` (only
  `404.astro`). No `src/pages/index.astro` is needed.
- `astro.config.mjs`: `output: 'server'`, integrations `[wix()]`, adapter
  `@wix/cloud-provider-fetch-adapter` (applied only when `NODE_ENV=production`).
  - **[VERIFIED]** The adapter selects its backend from `WIX_CLOUD_PROVIDER` (in `.env.local`). When
    that var is **absent**, the build falls back to `@astrojs/cloudflare` — so `@astrojs/cloudflare`
    must remain a dependency. (Removing it broke the no-`.env.local` build; see §7 Known issues.)

Project linkage lives in `wix-host/wix.config.json` (committed; identifiers, not secrets):
- `appId`: `00bcd193-1c95-4f01-a2bd-b47bf917fb52`
- `siteId`: `9830980c-d83c-48fd-aa0c-d67c909406bd`

## 2. Current status

**Deploy model: the human is the executor (Shape B).** Preview and release are run locally by an
account owner; there is no CI that talks to Wix. Rationale in §3.

| Capability | State |
|---|---|
| Local build (`npm run build` = sync + `wix build`) | ✅ **[VERIFIED]** works (server bundle, 16 routes) |
| Local preview (`npm run deploy:preview`, owner browser login) | ✅ **[VERIFIED]** deploys, serves correctly |
| Fail-fast auth preflight (`wix whoami` fronting deploy scripts) | ✅ aborts in ~4s when logged out, before the build |
| CI | **none** — static site; no Wix CI (see §3) |
| Release (`npm run deploy:release` → `wix release`) | **[READY]** — owner go-ahead granted (Aug 2026); local, human-run; §5 |
| Domain cutover + rollback | **[BLOCKED on account consolidation]** — transfer P_B into the org owner's account (co-locate with P_A + domain), then premium plan; org officers run the swap; §6 prerequisites |

## 3. Why there is no CI — the permission wall, and how we resolved it

**[VERIFIED] Wix's privileged CLI operations require an account-owner session that an API key
cannot hold.** `wix env pull` fails in CI with `403 PERMISSION_DENIED: VELO.APP_PROJECT_READ`, tested
with a key broadened to **all sites (premium + drafts)** — still failed. So:

- `VELO.APP_PROJECT_READ` is an **app/project-owner** permission on a *different axis* from site
  access. **It is not grantable to an API key**, regardless of scope. Site-scoping is irrelevant.
- Locally these commands work only because we're logged in as the **owner** via browser (the
  `wix login` session in `~/.wix/auth`), not via an API key.

**Resolution — the human is the executor (Shape B).** Instead of fighting the wall, the owner runs
the privileged steps locally, where the owner session already exists. Preview/release are the two
`npm run deploy:*` scripts (§9), each fronted by a `wix whoami` fail-fast check so a stale ~4h token
aborts in seconds. CI does nothing Wix-related; the owner's local `wix build` is the build check.

**Abandoned approaches** (recorded so they aren't reopened):
- *CI `wix login --api-key` + `wix env pull`* — dies at the 403 wall above.
- *Env-injection* (store `WIX_CLIENT_*` as GitHub vars/secrets, skip `env pull`) — even if it
  unblocked the build, `wix preview` is itself an app-project operation and would likely 403 on the
  same wall; never worth carrying the client secret in GitHub to find out.
- *Keyless static-check CI* — only re-ran the file-copy the owner's local build already does; pure
  ceremony, deleted.

## 4. Authentication

- **Owner auth = local `wix login`** (browser). It writes an OAuth session to `~/.wix/auth`
  (access token, `expiresIn` ~4h + a refresh token). This session is what clears the
  `VELO.APP_PROJECT_READ` wall (§3), so it's what authorizes preview/release.
- **`wix whoami`** confirms the session (`Logged in as <email>`, exit 0) and fronts the deploy
  scripts as the fail-fast check; on a dead session it exits non-zero in ~4s.
- **`.env.local`** (`WIX_CLIENT_ID` / `WIX_CLIENT_SECRET` / `WIX_CLIENT_PUBLIC_KEY` /
  `WIX_CLIENT_INSTANCE_ID` / `WIX_CLOUD_PROVIDER`) is the headless OAuth app's identity, read by the
  build. Gitignored; obtained once via `wix env pull` while logged in as owner, then kept locally.
- **No CI credentials.** The `WIX_API_KEY` GitHub secret and `WIX_CLIENT_ID` repo variable that the
  old keyed CI used were **deleted** as unused. (If a keyed approach is ever revisited, note that an
  API key cannot clear the §3 wall — that's why it was abandoned.)

## 5. Release — local & human-run (**owner go-ahead granted, Aug 2026**)

Release is a local command, not a workflow (same reason as preview, §3):
- `cd wix-host && npm run deploy:release` — `wix whoami` → build → `wix release`. **[VERIFIED]**
  `wix release` produces **versioned** releases; **there is no `wix rollback` command.**
- Owner go-ahead is granted, so this is unblocked — but it stays a **deliberate owner-run action**,
  not automation. A release publishes a new headless version; it does **not** itself reassign the live
  domain — that's the separate cutover step (§6), which needs a premium plan and keeps the legacy
  Editor site as the rollback lever.

## 6. Cutover & rollback — **[DEFERRED]**

**[VERIFIED] The two are separate Wix properties, and there is nothing to migrate:**
- Live site = a **classic Wix Editor** site, metaSiteId `9dbcaac9-3336-4ec2-8c8f-4a4f275aad06`.
  Probed `https://www.repac-riverside.org` directly: served by Wix's **Thunderbolt** viewer with
  `"editorType":""`, `"isResponsive":false`, `"siteType":"UGC"` — the classic drag-and-drop Editor,
  **not** Wix Studio (which reports a non-empty `editorType` and `isResponsive:true`) and not
  Harmony; headers `server: Pepyaka` + `x-wix-meta-site-id` confirm Wix hosting. The `square.site`
  store on the homepage is an outbound link, not the host. The headless project is a **different**
  site, siteId `9830980c-d83c-48fd-aa0c-d67c909406bd` (+ appId `00bcd193-…`). Different metaSite =
  different property.
- **[VERIFIED via docs]** Wix cannot convert an Editor site to Wix-Managed Headless in place, nor
  migrate its data in — it's an unshipped feature request. So go-live is inherently a **cross-property
  domain move**, not an upgrade.
- **[VERIFIED via owner dashboard audit, Aug 2026]** The legacy property holds **no business data to
  preserve** — zero Contacts and zero Site Members beyond the account's own admin/staff logins (which
  live at the account level and are unaffected), and the static site uses an external Square store.
  So the migration is **static-site-only**; no members/email-campaign preservation plan is needed.
  (For the record: even if data existed, Wix does **not** transfer Contacts-as-members or Email
  Marketing history/reputation between properties (Wix support docs), and a site *duplicate* also
  excludes all of that. The real recovery point is simply the intact legacy site itself, not a duplicate.)

The deployed headless app is therefore a **fresh rebuild**. Consequences for rollback:

**Rollback layers (strongest lever last):**
1. **Prevent:** only `wix release` an artifact already validated via its `wix preview` URL.
2. **Within headless:** `git revert <bad-commit>` → re-release. Deterministic, fully in your control
   (repo is source of truth). This is the primary rollback.
3. **Wix version re-promote:** releases are versioned; the dashboard *should* let you re-promote an
   earlier version — **[OPEN]** exact UI unconfirmed; rely on layer 2.
4. **Migration rollback = domain reassignment.** A domain maps to one Wix property at a time.
   Cutover = reassign domain to the headless project; rollback = reassign back to the (intact) old site.

**Cutover guidance:**
- Live site type is **[RESOLVED]** — it's a Wix Editor site (§6 top). So rollback is an internal
  **domain reassignment** between two Wix properties + an **SSL re-validation window** (not an instant
  TTL flip — both sites are on Wix). **Keep the legacy Editor site published/undeleted** as the
  rollback lever; do not delete it.
- **[VERIFIED] The legacy property also hosts live assets the new site links to — a second, separate
  reason not to delete it.** Two PDFs are served from
  `9dbcaac9-3336-4ec2-8c8f-4a4f275aad06.filesusr.com/ugd/…` — that host *is* the legacy metaSiteId,
  i.e. the old Editor site's Media Manager. Deleting the legacy property breaks them even after a
  successful cutover, when the rollback-lever argument above no longer feels urgent. Either keep the
  property indefinitely, or re-host the PDFs (repo or the headless project's media) and update the
  links before retiring it. Retiring the legacy site is therefore **not** a no-op cleanup task.
- Reassignment is a supported first-class action (Domains → *Assign to a Different Site*). Both
  properties can be Premium at once — that's just two plans (a paid **parity/overlap window** if you
  want A and B both live before committing).
- Wix-Managed Headless needs a **premium plan** to serve a custom domain.
- Lowest-risk pattern: validate on a **subdomain** (e.g. `beta.repac-riverside.org`) before
  reassigning the apex `www.repac-riverside.org`.
- **Owner go-ahead: granted (Aug 2026).** Execution is still a deliberate owner-run step, not
  automated — run it intentionally, keep the legacy Editor site published as the rollback lever, and
  attach a premium plan first (custom domain requires it).

### Execution — three stages (validate green, then hand to blue)

Blue = **P_A** (legacy, live). Green = **P_B** (headless, new). The rollout proves green under
progressively less privilege, then hands it to the org so *they* control the domain switch.

- **Stage I — deploy to green as OWNER.** Prove the green env itself. While the operator still owns
  P_B: get the deployable state onto `main` (merge infra + content PRs, esp. the banner removal),
  `npm run deploy:preview`, run the **preview validation checklist** (detail 4 below), then
  `npm run deploy:release`. **Exit:** a validated, released P_B. Fully in the operator's control; no
  org involvement.
- **Stage II — deploy to green as ADMIN (co-owner).** Prove the operator can still deploy *without*
  owner — the one untested assumption (detail 2, `[VERIFY]`). Cheapest faithful test is a
  **colleague-sandbox round-trip**: transfer P_B to a trusted colleague → they re-invite the operator
  as co-owner → operator runs `deploy:preview` as co-owner → colleague transfers P_B back. (Or test
  against a throwaway headless project the colleague owns, never touching P_B.) The wall is
  role-based on the project, so a colleague-owner is a faithful proxy for the org-owner. **Exit:**
  co-owner deploy proven — or, if it fails, "who deploys" settled *before* any org handoff, with no
  production account touched.
- **Stage III — site-transfer green to BLUE's owner (REPAC's account) for the domain switch.** Only
  after I + II pass: operator transfers P_B into REPAC's Wix account (the one holding P_A + the
  domain); REPAC re-invites the operator as co-owner; attach P_B's premium plan there (detail 3).
  Then REPAC's officers reassign the domain P_A→P_B **at their discretion** — subdomain
  (`beta.`) first, then the apex — with rollback = reassign back to P_A. **Exit:** cutover owned by
  the org; the operator remains the co-owner/admin deployer for both envs.

### Supporting detail for the stages

**1. Identify the two properties by ID, never by console display name** (names are editable and easy
to confuse when the account holds several sites). The blue-green pair:

| | Property | Fixed ID | Role |
|---|---|---|---|
| **P_A** | Legacy Editor site | metaSiteId `9dbcaac9-3336-4ec2-8c8f-4a4f275aad06` | Live now; **keep** = rollback target |
| **P_B** | Headless project | siteId `9830980c-d83c-48fd-aa0c-d67c909406bd` (appId `00bcd193-…`) | Deploy target (= `wix-host/wix.config.json`) |

- Confirm P_B in the console by the metaSiteId in its dashboard URL (`…/dashboard/9830980c-…/`) and
  that it matches `wix.config.json` — the repo can only deploy where that file points.
- Confirm P_A by re-reading the live domain's own id (no console needed):
  `curl -s https://www.repac-riverside.org/ | grep -o '"metaSiteId":"[^"]*"' | head -1` → expect
  `9dbcaac9-…`.
- Any site whose id is **neither** of these is unrelated to the migration — do not touch it.

**2. [BLOCKER] Consolidate P_A + the domain + P_B into the ORG owner's account.** Domain reassignment
(*Domains → Assign to a Different Site*) is a **within-account** operation — the target dropdown only
lists sites in the account that holds the domain. As of Aug 2026 the operator is only a **co-owner**
of P_A; the domain lives in the **org owner's** account (an org officer), while P_B was created in the
operator's own account → they're in *different* accounts, so the swap can't be done as-is.
- **Consolidation direction: bring P_B TO the org, not P_A to the operator.** Ownership of the org's
  web presence stays with the org; the operator's ownership of P_B is **transient**. The operator
  (current owner of P_B) initiates **Transfer a Premium Site to Another Wix Account** → the org owner's
  account; the org owner accepts. That co-locates domain + P_A + P_B in the **org** account, so the
  org officers can run **both** cutover (P_A→P_B) and rollback (P_B→P_A) in-account.
- **Operator keeps push access as co-owner/admin on both envs.** After the transfer, the org owner
  re-invites the operator as co-owner on P_B (and they already are on P_A), so the operator remains
  the technical deployer for both. `wix.config.json`'s `siteId` is unchanged by the transfer (the
  metaSite id is stable across account moves), so the repo keeps deploying to the same P_B.
- **[VERIFY — risk] Does co-owner/admin suffice for `wix release`/`preview`?** The deploy path (§3/§4)
  was only ever proven as the **account owner** of P_B; the blocking permission `VELO.APP_PROJECT_READ`
  is described as *project-owner* level. Whether a co-owner's `wix login` session clears it is
  **untested** — this is what **Stage II** proves. If co-owner is insufficient, either the org owner
  deploys or the operator is granted owner — settle it in Stage II, not after cutover.
- `.org` transfers freely (not one of Wix's whole-site-only extensions). Sequencing: **Stage I/II
  prove green while the operator still owns P_B; only then Stage III transfers it** — so nothing is
  handed over unproven.

**3. Attach the premium plan to P_B in the ORG account.** Wix-Managed Headless needs a premium plan to
serve a custom domain, and Premium is per-site. Buy/assign it **during Stage III** (after the transfer)
so it lands on P_B **in the org owner's account** (the one holding the domain) — not on the operator's
account by mistake.

**4. Validate the P_B preview before any release/cutover** (this is what rollback-layer-1 "validated
via its preview URL" means). Run `npm run deploy:preview` (§9), open the ephemeral URL, and confirm:
- `/` returns **200** and renders the real homepage (not the 404 route).
- Key sub-pages load: `about.html`, `engineering-program.html`, `events.html`, `repac-faq.html`.
- Assets resolve: `css/style.css` and `js/main.js` return 200 (no broken styling/nav).
- The **UNOFFICIAL DRAFT banner is absent** (it ships from content branch #58; only launch a preview
  built from a branch where it's removed).
- A bogus path (e.g. `/nope`) serves the 404 page.

Quick automated pass against the preview host:
```bash
BASE="https://<preview-host>.wix-site-host.com"   # from `npm run deploy:preview` output
for p in / about.html engineering-program.html events.html repac-faq.html css/style.css js/main.js; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$BASE/$p")" "$p"
done            # expect 200 for every line
```

## 7. Ownership transfer / client handoff

- Deploy auth is a **local owner `wix login`** session (§4), not a stored key — so handoff is simply:
  the new owner logs in as themselves and runs the `npm run deploy:*` scripts. There is **no CI secret
  to rotate** (the old `WIX_API_KEY` secret was deleted).
- The new owner needs owner/co-owner rights on the headless project (appId `00bcd193-…`) to log in and
  preview/release. **[VERIFIED via docs]** site-level operations require the owner account.
- The preview URL host encodes the owner account (`…-drewshapiro.wix-site-host.com`) — it will change
  under the client's account.

## 8. Known issues / TODO

- **[RESOLVED]** `@astrojs/cloudflare` restored to `wix-host/package.json` (it's the fallback adapter
  when `WIX_CLOUD_PROVIDER` is unset). The §3 env-injection-vs-manual fork is closed: Shape B
  (human-run preview/release, no CI) is the chosen model.
- **[READY, owner go-ahead granted Aug 2026]** Cutover/rollback is no longer permission-blocked. The
  remaining gate is **mechanical**: attach a premium plan (needed to serve the custom domain) and have
  the owner run the release locally. The live site type is settled (§6, classic Wix Editor). Release is
  already a local command (§5) — no `wix-release.yml` to build.

## 9. Quick reference

```bash
cd wix-host
npm install
npx wix login            # one-time owner login (browser; session ~4h). `wix whoami` to check.

npm run deploy:preview   # wix whoami -> build -> wix preview  (ephemeral URL; safe)
npm run deploy:release   # wix whoami -> build -> wix release  (DEFERRED; only when blessed)
```

- If a deploy script aborts at `wix whoami`, re-run `npx wix login`.
- First-time `.env.local` setup (while logged in as owner): `npx wix env pull`.
- Preview URL pattern: `https://<id>-riverside-<acct>-<owner>.wix-site-host.com`
- CLI: `@wix/cli` (GA since Feb 2026). Commands used: `login`, `whoami`, `env pull`, `build`,
  `preview`, `release`. No `rollback`.
