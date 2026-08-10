// Copies the REPAC static site into wix-host/public/ so Astro serves it verbatim
// at the site root. Run via `npm run sync-static`. Paths are resolved relative to
// this script (not CWD) so it works the same from any working directory.
//
// Source (repo root): every top-level *.html, plus css/, js/, images/.
// Destination: wix-host/public/ (cleared first; gitignored — never committed).

import { existsSync, mkdirSync, readdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const wixHostDir = resolve(scriptDir, '..');
const repoRoot = resolve(wixHostDir, '..');
const publicDir = join(wixHostDir, 'public');

// Top-level directories of static assets to mirror.
const assetDirs = ['css', 'js', 'images'];

// Reset the destination so deletions in the source propagate.
rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });

let htmlCount = 0;
for (const entry of readdirSync(repoRoot, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.html')) {
    cpSync(join(repoRoot, entry.name), join(publicDir, entry.name));
    htmlCount++;
  }
}

let copiedDirs = 0;
for (const dir of assetDirs) {
  const src = join(repoRoot, dir);
  if (existsSync(src)) {
    cpSync(src, join(publicDir, dir), { recursive: true });
    copiedDirs++;
  } else {
    console.warn(`sync-static: skipping missing directory "${dir}/"`);
  }
}

console.log(
  `sync-static: copied ${htmlCount} HTML file(s) and ${copiedDirs} asset dir(s) ` +
    `from ${repoRoot} -> ${publicDir}`,
);
