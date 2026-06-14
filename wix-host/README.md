# wix-host — Wix-Managed Headless wrapper for the REPAC site

This is a thin [Astro](https://astro.build) project that wraps the plain static REPAC site (the
`*.html`, `css/`, `js/`, `images/` at the repo root) so it can be deployed to **Wix-Managed
Headless**, which requires an Astro-based frontend.

The static files are **not** edited here. `scripts/sync-static.mjs` copies them into `public/`,
where Wix serves them at the site root (confirmed: `/` serves `public/index.html`). `public/` is
generated and gitignored — never commit it. The project is linked to a Wix-Managed Headless project
via `wix.config.json` (committed; holds the `appId`/`siteId`, which are identifiers, not secrets).

## Local development

```bash
cd wix-host
npm install
npm run build          # sync-static + wix build -> dist/ (server output)
```

`npm run sync-static` alone re-copies the root static files into `public/` after you edit them.

Local secrets from `wix create ... link` live in `.env.local` (gitignored — contains the Wix client
secret). CI does **not** use them; it authenticates with an API key instead (below).

### Publish a preview manually

```bash
npm run sync-static
npx wix preview        # uploads + returns an ephemeral preview URL
```

## CI — preview on every PR

`.github/workflows/wix-preview.yml` publishes a Wix preview for each PR and posts the URL as a PR
comment. It authenticates non-interactively with `wix login --api-key "$WIX_API_KEY"` (the documented
CI auth path). Every Wix step is gated on the `WIX_API_KEY` repo secret, so PRs without it (e.g. from
forks) only verify the static sync and stay green.

**To activate it:** create a Wix **API key** (Wix dashboard → API Keys Manager) scoped for the
headless project, then add it to the GitHub repo as a secret named exactly **`WIX_API_KEY`**
(Settings → Secrets and variables → Actions). No code change needed — the next PR run goes live.

## Notes

- **Homepage routing (resolved):** under `output: 'server'`, Wix serves `public/index.html` at `/`
  with an empty `src/pages/`. Verified on a live preview — `/`, all sub-pages, and assets return 200.
  `src/pages/404.astro` provides the not-found page and keeps the build non-empty.
