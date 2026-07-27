/* Assembler: inline Glory font + webp assets + shared kit.css + copy into each
   templates/*.html -> dist/*.html (self-contained, artifact/Vercel-ready).
   Portable: all paths are relative to this file. Run: `node assemble.mjs`
   Requires Node >= 20 (import.meta.url). */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = dirname(fileURLToPath(import.meta.url));      // docs/wireframes/2026-07
const REPO = join(BASE, '..', '..', '..');                // repo root
const WEBP = join(BASE, 'assets-web');
const FONT = join(REPO, 'Design/design-system/fonts/Glory-VariableFont_wght.ttf');
const KITF = join(BASE, 'kit.css');
const TPL  = join(BASE, 'templates');
const DIST = join(BASE, 'dist');
mkdirSync(DIST, { recursive: true });

const imgs = {};
for (const f of readdirSync(WEBP)) if (f.endsWith('.webp'))
  imgs[basename(f, '.webp')] = 'data:image/webp;base64,' + readFileSync(join(WEBP, f)).toString('base64');

const glory = 'data:font/ttf;base64,' + readFileSync(FONT).toString('base64');
const fontFace = `@font-face{font-family:"Glory";src:url(${glory}) format("truetype");font-weight:100 900;font-display:swap}`;
const kit = readFileSync(KITF, 'utf8')
  .replace('/* {{FONT_FACES}}  <- assembler injects @font-face (Glory display) here */', fontFace);

const copy = JSON.parse(readFileSync(join(BASE, 'copy.json'), 'utf8'));
const getPath = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);

const fill = (html) => html
  .replace('{{KIT_CSS}}', kit)
  .replace('{{COPY_JSON}}', () => JSON.stringify(copy))
  .replace(/\{\{COPY:([a-zA-Z0-9_.]+)\}\}/g, (_, p) => {
    const v = getPath(copy, p);
    if (v == null) { console.warn('  ! missing copy:', p); return ''; }
    return String(v);
  })
  .replace(/\{\{IMG:([a-z0-9-]+)\}\}/g, (_, n) => imgs[n] || (console.warn('  ! missing img:', n), ''));

let built = 0;
for (const f of readdirSync(TPL)) if (f.endsWith('.html')) {
  const out = fill(readFileSync(join(TPL, f), 'utf8'));
  writeFileSync(join(DIST, f), out);
  console.log('built', f, (out.length / 1024).toFixed(0) + 'KB');
  built++;
}
if (!built) console.log('no templates in', TPL);
console.log('assets available:', Object.keys(imgs).join(', '));
