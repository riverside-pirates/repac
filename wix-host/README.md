# wix-host — Wix-Managed Headless wrapper for the REPAC site

This is a thin [Astro](https://astro.build) project that wraps the plain static REPAC site (the
`*.html`, `css/`, `js/`, `images/` at the repo root) so it can be deployed to **Wix-Managed
Headless**, which requires an Astro-based frontend.

The static files are **not** edited here. `scripts/sync-static.mjs` copies them into `public/`,
where Astro serves them verbatim at the site root. `public/` is generated and gitignored — never
commit it.

## Local development (no Wix account needed)

```bash
cd wix-host
npm install
npm run build          # sync-static + astro build -> dist/
npm run preview:local  # serve dist/ and click through the site
```

`npm run sync-static` alone re-copies the root static files into `public/` after you edit them.

> Local preview is plain static serving. It verifies the sync and that relative links resolve.
> It does **not** reproduce Wix's `output: 'server'` hosting model — see the homepage-routing note
> below.

## Stage 2 — connect to Wix (manual prerequisites)

These steps require a Wix account and are **not** done yet. The CI workflow
(`.github/workflows/wix-preview.yml`) stays inert until they are.

1. Create a **Wix-Managed Headless** project in your Wix account.
2. From this `wix-host/` directory, link the project:
   ```bash
   npm create @wix/new -- headless link
   ```
   This provisions Wix infra and updates the project: it adds `@wix/astro`, `@astrojs/react`, and
   the `@wix/cloud-provider-fetch-adapter`, and switches `astro.config.mjs` to `output: 'server'`.
   **Reconcile** the generated `package.json` with the scripts here — keep `sync-static`, and make
   sure `build` still runs `sync-static` before the Wix build.
3. Create a Wix **API key** (Wix API Keys Manager) and add it to the GitHub repo as the secret
   `WIX_API_KEY`. The preview workflow activates automatically once the secret exists.

### Open risk to verify after linking: homepage routing under `output: 'server'`

Once linked, the deployed app is server-rendered — `/` is handled by the Wix server function, not a
static file server. It is **unverified** whether an empty `src/pages/` causes the deployed site to
serve `public/index.html` at `/`, or 404 the homepage. After the first `wix preview`, **load the
preview's `/` explicitly**. If the homepage 404s, add a real `src/pages/index.astro` (and possibly a
catch-all `src/pages/[...slug].astro`) that emits the static HTML, instead of relying on `public/`.
