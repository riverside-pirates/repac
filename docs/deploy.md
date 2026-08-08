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
| Release (`npm run deploy:release` → `wix release`) | **[DEFERRED]** — local, human-run; design in §5 |
| DNS cutover + rollback | **[DEFERRED]** — runbook in §6 |

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

## 5. Release — **[DEFERRED]**, local & human-run

Release is a local command, not a workflow (same reason as preview, §3):
- `cd wix-host && npm run deploy:release` — `wix whoami` → build → `wix release`. Run only when
  explicitly blessed. **[VERIFIED]** `wix release` produces **versioned** releases; **there is no
  `wix rollback` command.**
- **Governing constraint:** do **not** `wix release` or cut over DNS until the owner explicitly says
  so. A release publishes a new headless version; it does not itself reassign the live domain (§6).

## 6. Cutover & rollback — **[DEFERRED]**

**[VERIFIED] The two are separate Wix properties, and there is nothing to migrate:**
- Live site = a Wix **Editor** site, metaSiteId `9dbcaac9-3336-4ec2-8c8f-4a4f275aad06` (confirmed
  from its rendered HTML). The headless project is a **different** site, siteId
  `9830980c-d83c-48fd-aa0c-d67c909406bd` (+ appId `00bcd193-…`). Different metaSite = different property.
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
- Reassignment is a supported first-class action (Domains → *Assign to a Different Site*). Both
  properties can be Premium at once — that's just two plans (a paid **parity/overlap window** if you
  want A and B both live before committing).
- Wix-Managed Headless needs a **premium plan** to serve a custom domain.
- Lowest-risk pattern: validate on a **subdomain** (e.g. `beta.repac-riverside.org`) before
  reassigning the apex `www.repac-riverside.org`.
- **[DEFERRED]** Nothing here runs without explicit owner go-ahead (governing constraint: don't
  disrupt the live site).

## 7. Ownership transfer / client handoff

- The `WIX_API_KEY` is bound to **your** account; after transferring the site to the client, your key
  loses site-level access (site-level calls need the owner account's key). **[VERIFIED via docs]**
- Clean handoff: client (new owner) creates their own `WIX_API_KEY` → update the **one GitHub secret**
  → delete your old key. Pipeline unchanged because the key only ever lives in the secret, not code.
- The preview URL host encodes the owner account (`…-drewshapiro.wix-site-host.com`) — it will change
  under the client's account.

## 8. Known issues / TODO

- **[RESOLVED]** `@astrojs/cloudflare` restored to `wix-host/package.json` (it's the fallback adapter
  when `WIX_CLOUD_PROVIDER` is unset). The §3 env-injection-vs-manual fork is closed: Shape B
  (human-run preview/release, no CI) is the chosen model.
- **[DEFERRED]** Cutover/rollback once the live site type (§6) is confirmed and a premium plan is
  attached. Release itself is already a local command (§5) — no `wix-release.yml` to build.

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
