// Fails if any link in the root *.html is broken.
//
//   Internal: the target file must exist. This is the repo's own bug class --
//   #15 and #24 were both references left behind after a page was renamed.
//   External: the URL must not 404. Link rot is the other half; the site points
//   at Square, Google Calendar/Docs, DPS, and PDFs still hosted on the legacy
//   Wix site, none of which we control.
//
// Run locally exactly as CI does:  node scripts/check-links.mjs
// Offline?  SKIP_EXTERNAL=1 node scripts/check-links.mjs
//
// ponytail: only 404/410 fail the build. Timeouts, 403s and 5xx are reported as
// warnings -- plenty of hosts bot-block or rate-limit, and a flaky third party
// must not block an unrelated content PR. Promote them to failures if the
// warnings turn out to be real breakage rather than noise.

import { readdirSync, readFileSync, existsSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const pages = readdirSync(root).filter((f) => f.endsWith('.html'));
const refPattern = /(?:href|src)\s*=\s*["']([^"']+)["']/gi;
const skip = /^(?:#|mailto:|tel:|javascript:|data:)/i;

const broken = [];
const external = new Map(); // url -> ["page:line", ...]

for (const page of pages) {
  const html = readFileSync(root + page, 'utf8');
  for (const match of html.matchAll(refPattern)) {
    const [, raw] = match;
    if (skip.test(raw)) continue;
    const where = `${page}:${html.slice(0, match.index).split('\n').length}`;

    if (/^(?:https?:)?\/\//i.test(raw)) {
      const url = raw.startsWith('//') ? `https:${raw}` : raw;
      external.set(url, [...(external.get(url) ?? []), where]);
      continue;
    }

    const target = decodeURIComponent(raw.split(/[?#]/)[0]);
    if (!target) continue;
    if (!existsSync(root + target.replace(/^\//, ''))) {
      broken.push(`${where}  ->  ${raw}  (file not found)`);
    }
  }
}

// A default fetch User-Agent gets refused by enough hosts to be useless here.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0 Safari/537.36 repac-link-check';

async function probe(url) {
  // HEAD first (cheap); some hosts answer it with 403/405 but serve a real GET.
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        headers: { 'user-agent': UA, accept: '*/*' },
        signal: AbortSignal.timeout(20000),
      });
      if (res.ok) return { ok: true };
      if (res.status === 404 || res.status === 410) {
        return { ok: false, fatal: true, detail: `HTTP ${res.status}` };
      }
      if (method === 'GET') return { ok: false, detail: `HTTP ${res.status}` };
    } catch (err) {
      if (method === 'GET') return { ok: false, detail: err.message };
    }
  }
  return { ok: false, detail: 'unreachable' };
}

const warnings = [];

if (!process.env.SKIP_EXTERNAL && external.size) {
  const urls = [...external.keys()];
  console.log(`Checking ${urls.length} external URLs...`);

  // ponytail: fixed pool of 6. Enough to keep 20 URLs under ~10s, low enough
  // that we don't look like a scraper to any single host.
  let next = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        const result = await probe(url);
        if (result.ok) continue;
        const sites = external.get(url).join(', ');
        const line = `${sites}  ->  ${url}  (${result.detail})`;
        (result.fatal ? broken : warnings).push(line);
      }
    }),
  );
}

if (warnings.length) {
  console.warn(`\nUnverified (not failing the build) -- ${warnings.length}:\n`);
  for (const w of warnings) console.warn(`  ${w}`);
}

if (broken.length) {
  console.error(`\nBroken links (${broken.length}):\n`);
  for (const b of broken) console.error(`  ${b}`);
  process.exit(1);
}

console.log(`\nOK -- ${pages.length} pages, ${external.size} external URLs, no broken links.`);
