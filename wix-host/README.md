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

Local secrets live in `.env.local` (gitignored — contains the Wix client secret) and are read by the
build. It doesn't travel with git: run `npx wix env pull` once per checkout, logged in as owner.

### Publish a preview

Preview and release are **human-run**, not automated — see [`docs/deploy.md`](../docs/deploy.md) for why.

```bash
npx wix login           # one-time owner login (opens a browser; session lasts ~4h)
npx wix env pull        # one-time per checkout: writes the gitignored .env.local
npm run deploy:preview  # wix whoami (fail-fast auth check) -> build -> wix preview -> ephemeral URL
```

`deploy:preview` aborts in ~4s if you're not logged in — re-run `npx wix login` and try again.
When you're ready to publish for real, `npm run deploy:release` (same guard, ends in `wix release`;
does **not** touch DNS).

## Notes

- **Homepage routing (resolved):** under `output: 'server'`, Wix serves `public/index.html` at `/`
  with an empty `src/pages/`. Verified on a live preview — `/`, all sub-pages, and assets return 200.
  `src/pages/404.astro` provides the not-found page and keeps the build non-empty.
