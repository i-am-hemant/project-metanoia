#!/usr/bin/env node
// Verify every internal link in dist/ resolves to a real file.
//
// Astro prefixes links it generates with `base`, but absolute paths hardcoded in
// frontmatter or markdown bypass that and 404 only in production. This catches
// both that and ordinary typo'd links. Run after `pnpm build`.
//
//   node scripts/check-links.mjs
//
import { readFileSync, existsSync } from 'node:fs';
import { glob } from 'node:fs/promises';
import { join, dirname, relative, normalize } from 'node:path';

const DIST = 'dist';
const BASE = '/project-metanoia/';

const files = [];
for await (const f of glob(`${DIST}/**/*.html`)) files.push(f);

if (files.length === 0) {
  console.error(`No HTML found in ${DIST}/. Run \`pnpm build\` first.`);
  process.exit(1);
}

const problems = [];

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const [, href] of html.matchAll(/href="([^"#?]+)"/g)) {
    if (/^(https?:|mailto:|data:|\/\/)/.test(href)) continue;

    let target;
    if (href.startsWith(BASE)) {
      target = join(DIST, href.slice(BASE.length));
    } else if (href.startsWith('/')) {
      // Absolute but missing the base prefix — works locally, 404s in production.
      problems.push({ file, href, kind: 'unprefixed (missing base)' });
      continue;
    } else {
      target = normalize(join(dirname(file), href));
    }

    const candidates = [target, join(target, 'index.html'), `${target.replace(/\/$/, '')}/index.html`];
    if (!candidates.some(existsSync)) {
      problems.push({ file, href, kind: 'missing target' });
    }
  }
}

if (problems.length > 0) {
  console.error(`Broken internal links: ${problems.length}\n`);
  for (const p of problems) {
    console.error(`  ${relative(DIST, p.file)}\n    -> ${p.href}  [${p.kind}]`);
  }
  process.exit(1);
}

console.log(`OK: all internal links resolve across ${files.length} pages.`);
