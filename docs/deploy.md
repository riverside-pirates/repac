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

| Capability | State |
|---|---|
| Local build (`npm run build` = sync + `wix build`) | ✅ **[VERIFIED]** works (server bundle, 16 routes) |
| Manual preview (`wix preview` via interactive browser login) | ✅ **[VERIFIED]** deploys, serves correctly |
| CI keyless path (sync + verify) on every PR | ✅ **[VERIFIED]** green |
| CI auth `wix login --api-key` | ✅ **[VERIFIED]** succeeds in GitHub Actions |
| **CI-driven `wix preview`** | ❌ **blocked** — see §3 |
| Release pipeline (`wix release`) | **[DEFERRED]** — design in §5 |
| DNS cutover + rollback | **[DEFERRED]** — runbook in §6 |

Open PRs: **#52** (Stage 1: wrapper + gated workflow), **#53** (Stage 2: link + keyed preview).
Merge #52 first; #53 auto-retargets to `main`.

## 3. The CI preview blocker (the central finding)

The CI workflow (`.github/workflows/wix-preview.yml`) does, on the keyed path:
`wix login --api-key` → `wix env pull` → `npm run build` → `wix preview`.

**[VERIFIED] `wix env pull` fails in CI with `403 PERMISSION_DENIED: VELO.APP_PROJECT_READ`.**
This was tested with an API key broadened to **all sites (premium + drafts)** and still failed —
proving:

- `VELO.APP_PROJECT_READ` is an **app/project-owner** permission, on a *different axis* from site
  access. **It is not grantable to an API key**, regardless of site scope.
- Site-scoping is therefore irrelevant to this blocker. (Aside: the "Specific sites" picker only
  lists *premium* sites and there's no REST API to create/scope keys, so a draft headless project
  can only be reached via an "All sites" key anyway.)

**Why it matters:** `wix env pull` reads project config the build needs (`WIX_CLIENT_*`,
`WIX_CLOUD_PROVIDER`). Locally it works only because we're logged in as the **owner** via browser —
not via API key.

### The proposed workaround (env-injection) — **[OPEN]**
Stop using `wix env pull` in CI. Instead store the full `.env.local` contents (which **includes the
real `WIX_CLIENT_SECRET`**) as a single GitHub secret and write it to `wix-host/.env.local` before
`npm run build`.

**Unresolved risk — do not assume this is the fix:** env-injection only unblocks `env pull` + build.
**`wix preview` is also an app-project operation and may 403 on the same owner-permission wall.** We
have *never* run `wix preview` via an API key (only via browser login). So env-injection might just
move the wall one step. One keyed CI run after wiring it would be decisive:
- green + preview URL → CI preview is viable, done.
- 403 at `wix preview` → **CI-driven preview via API key is not supported**; fall back to manual
  preview (developer runs `wix preview` locally — **[VERIFIED]** that works — and shares the URL),
  with CI staying as keyless build-sanity only.

**Decision pending from the site owner:** wire env-injection (accepting the client secret in GitHub)
to run the decisive test, or pivot to manual preview now.

## 4. Authentication & API keys

- **API keys are account-level**, created only by an account **owner/co-owner** in the API Keys
  Manager (UI only — **[VERIFIED]** no REST API to create or scope them).
- Site-level calls only work with a key from the **site's owner account**.
- `wix login --api-key "$WIX_API_KEY"` is the documented + **[VERIFIED]** CI auth path.
- The two distinct credentials — **don't conflate**:
  - `WIX_API_KEY` (GitHub secret) — account-level, authenticates the CLI in CI.
  - `WIX_CLIENT_ID` / `WIX_CLIENT_SECRET` / `WIX_CLOUD_PROVIDER` (in `.env.local`) — the headless
    OAuth app's identity, used by the build. Normally fetched by `wix env pull`; gitignored.
- **Scope guidance:** the static site calls zero Wix business-data APIs, so the key needs none of the
  business-vertical scopes (Stores/Members/Contacts/etc.). The blocking permission
  (`VELO.APP_PROJECT_READ`) is **not** a selectable key scope (§3).
- **Least-privilege at go-live:** when the project gets a premium plan it becomes selectable in the
  "Specific sites" picker; re-scope the key from "All sites" to just `siteId 9830980c…` then.

## 5. Release pipeline — **[DEFERRED]**

Design for when preview is settled and we're ready to publish:
- `.github/workflows/wix-release.yml` (production branch / manual): same auth+build as preview,
  ending in `wix release` (`--version-type major|minor`, `--comment`).
- **[VERIFIED]** `wix release` produces **versioned** releases. **There is no `wix rollback` command.**
- Will inherit the same API-key permission question as preview (§3) — validate before relying on it.

## 6. Cutover & rollback — **[DEFERRED]**

The deployed headless app is a **fresh rebuild**; **[VERIFIED via docs]** Wix cannot migrate an
existing Wix Editor site's content/data into a headless project. Consequences for rollback:

**Rollback layers (strongest lever last):**
1. **Prevent:** only `wix release` an artifact already validated via its `wix preview` URL.
2. **Within headless:** `git revert <bad-commit>` → re-release. Deterministic, fully in your control
   (repo is source of truth). This is the primary rollback.
3. **Wix version re-promote:** releases are versioned; the dashboard *should* let you re-promote an
   earlier version — **[OPEN]** exact UI unconfirmed; rely on layer 2.
4. **Migration rollback = domain reassignment.** A domain maps to one Wix property at a time.
   Cutover = reassign domain to the headless project; rollback = reassign back to the (intact) old site.

**Cutover guidance:**
- **[OPEN] Confirm what the current live REPAC site actually is** — a Wix Editor site vs. an external
  host (the homepage references a `square.site` store). This changes rollback:
  - If **Wix Editor site**: rollback is internal domain reassignment + an **SSL re-validation window**
    (not an instant TTL flip — both sites are on Wix). **Keep the old Editor site published/undeleted.**
  - If **external host**: lowering DNS TTL before cutover enables a fast repoint back — that classic
    advice applies only here.
- Wix-Managed Headless needs a **premium plan** to serve a custom domain.
- Lowest-risk pattern: validate on a **subdomain** (e.g. `beta.repac-riverside.org`) before
  reassigning the apex `www.repac-riverside.org`.

## 7. Ownership transfer / client handoff

- The `WIX_API_KEY` is bound to **your** account; after transferring the site to the client, your key
  loses site-level access (site-level calls need the owner account's key). **[VERIFIED via docs]**
- Clean handoff: client (new owner) creates their own `WIX_API_KEY` → update the **one GitHub secret**
  → delete your old key. Pipeline unchanged because the key only ever lives in the secret, not code.
- The preview URL host encodes the owner account (`…-drewshapiro.wix-site-host.com`) — it will change
  under the client's account.

## 8. Known issues / TODO

- **[BUG, pending revert]** `@astrojs/cloudflare` was pruned from `wix-host/package.json` (commit
  `5ddf4eb`); it must be **restored** — the build falls back to it when `WIX_CLOUD_PROVIDER` is unset
  (the CI condition while `env pull` is blocked). The React-stack prune in the same commit is fine
  (verified — no React components).
- **[DECISION]** Resolve the §3 env-injection-vs-manual-preview fork.
- **[DEFERRED]** Build `wix-release.yml`, finish cutover/rollback once the live site type (§6) is
  confirmed and a premium plan is attached.

## 9. Quick reference

```bash
# Local (authenticated via browser: `wix login`)
cd wix-host
npm install
npm run build            # sync-static + wix build -> dist/ (needs .env.local; `wix env pull` to fetch)
npx wix preview          # deploys an ephemeral preview, prints the URL

# CI auth (non-interactive)
npx wix login --api-key "$WIX_API_KEY"
```

- Preview URL pattern: `https://<id>-riverside-<acct>-<owner>.wix-site-host.com`
- CLI: `@wix/cli` (GA since Feb 2026). Commands: `login --api-key`, `env pull`, `build`, `preview`,
  `release`. No `rollback`.
