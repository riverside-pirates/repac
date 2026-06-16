// @ts-check
import { defineConfig } from 'astro/config';

import wix from '@wix/astro';
import cloudProviderFetchAdapter from '@wix/cloud-provider-fetch-adapter';
const isBuild = process.env.NODE_ENV == 'production';

// Wix-Managed Headless wrapper. The REPAC static site is synced into `public/`
// (see scripts/sync-static.mjs) and Wix serves it at the site root (`/` ->
// public/index.html). `src/pages/` holds only 404.astro. The Wix adapter is
// applied for production builds only; `wix dev` runs without it.
export default defineConfig({
  publicDir: 'public',
  integrations: [wix()],
  ...(isBuild && { adapter: cloudProviderFetchAdapter({}) }),

  image: {
    domains: ['static.wixstatic.com'],
  },

  output: 'server',
});
