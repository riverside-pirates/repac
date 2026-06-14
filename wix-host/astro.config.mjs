// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import wix from '@wix/astro';
import cloudProviderFetchAdapter from '@wix/cloud-provider-fetch-adapter';
const isBuild = process.env.NODE_ENV == "production";

// Minimal vanilla Astro config for Stage 1: the REPAC static site is synced into
// `public/` (see scripts/sync-static.mjs) and served verbatim at the site root.
// `src/pages/` is intentionally left empty so the homepage comes from
// `public/index.html` with no route collision.
//
// Stage 2 (`npm create @wix/new -- headless link`) will add the @wix/astro
// integration + @wix/cloud-provider-fetch-adapter and switch this to
// `output: 'server'`. See README.md.
export default defineConfig({
  publicDir: 'public',
  integrations: [react(), wix()],
  ...(isBuild && { adapter: cloudProviderFetchAdapter({}) }),

  image: {
    domains: ['static.wixstatic.com'],
  },

  output: 'server',
});