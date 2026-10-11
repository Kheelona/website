// Builds the Gate A mockup pages from shared partials (D043). No dependencies.
// Usage: node mockup/build.mjs
//
// Sources:  mockup/pages/<slug>.html   one page body each, starting with a meta comment:
//             <!--page {"title": "...", "description": "...", "url": "/safety", "buybar": true, "active": "safety", "css": true} -->
//           "css": true links mockup/css/<slug>.css (page-only composition, DS tokens only).
//           then the content of <main>, then optionally <!--after-main--> and extra markup (dialogs).
//           mockup/partials/{nav,footer,buybar,drawer}.html   shared by every page.
// Tokens:   {{icon:name}} and {{icon-chev:name}} become inline DS icons (design-system/project/assets/Icons).
// Output:   mockup/<slug>.html for every page. mockup/index.html is the review index (pages/index.html).
// Links between pages use the mockup file names (home.html, meet-kheelu.html, ...); the real URL of each
// page is its meta "url". Every visual value comes from the read-only design system.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const ds = join(here, '..', 'design-system', 'project');
const read = (p) => readFileSync(p, 'utf8');
const partial = (name) => read(join(here, 'partials', `${name}.html`));

const icon = (name, extra = '') => {
  const svg = read(join(ds, 'assets', 'Icons', `${name}.svg`));
  const paths = (svg.match(/<path [^>]*?d="[^"]+"[^>]*?(?:\/>|><\/path>)/g) || []).join('').replace(/\sfill="[^"]*"/g, '');
  if (!paths) throw new Error(`icon ${name}: no paths`);
  return `<svg class="kh-icon${extra}" viewBox="0 0 256 256" aria-hidden="true" focusable="false">${paths}</svg>`;
};
const icons = (s) => s
  .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, (_, n) => icon(n))
  .replace(/\{\{icon-chev:([a-z0-9-]+)\}\}/g, (_, n) => icon(n, ' kh-drawer__chev'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const head = (m) => `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${esc(m.title)}</title>
<meta name="description" content="${esc(m.description)}">
<!-- Gate A mockup (D043), built by mockup/build.mjs from mockup/pages/${m.slug}.html. Real URL: ${esc(m.url || '')}.
     Every visual value comes from the design system (read-only): tokens.css and bundle.css. mockup.css composes. -->
<link rel="stylesheet" href="../design-system/project/tokens.css">
<link rel="stylesheet" href="../design-system/project/components/bundle.css">
<link rel="stylesheet" href="mockup.css">
${m.css ? `<link rel="stylesheet" href="css/${m.slug}.css">\n` : ''}<link rel="icon" href="../design-system/project/assets/Logo/favicon-32.png">
</head>
<body class="kh-page" data-theme="light">
<a class="kh-btn kh-btn--secondary mk-skip" href="#main"><span>Skip to content</span></a>

`;

const build = (slug) => {
  const src = read(join(here, 'pages', `${slug}.html`));
  const mm = src.match(/^<!--page (\{[\s\S]*?\}) -->\n/);
  if (!mm) throw new Error(`${slug}: missing <!--page {...} --> meta`);
  const m = { slug, buybar: false, chrome: true, ...JSON.parse(mm[1]) };
  let body = src.slice(mm[0].length);
  let after = '';
  const cut = body.indexOf('<!--after-main-->');
  if (cut >= 0) { after = body.slice(cut + '<!--after-main-->'.length); body = body.slice(0, cut); }
  let nav = partial('nav');
  if (m.active) nav = nav.replace(new RegExp(`(<a class="kh-nav__link" href="${m.active}\\.html")`), '$1 aria-current="page"');
  const out = m.chrome === false
    // Pages without the site chrome (the review index) carry their own markup.
    ? head(m) + body + after + '\n</body>\n</html>\n'
    : head(m) + nav + '\n<main id="main">\n' + body.trim() + '\n</main>\n\n' + partial('footer') + '\n'
      + (m.buybar ? partial('buybar') + '\n' : '') + partial('drawer') + '\n' + after.trim() + (after.trim() ? '\n\n' : '')
      + '<script src="mockup.js" defer></script>\n</body>\n</html>\n';
  const html = icons(out);
  if (/\{\{[^}]+\}\}/.test(html)) throw new Error(`${slug}: unreplaced token ${html.match(/\{\{[^}]+\}\}/)[0]}`);
  writeFileSync(join(here, `${slug}.html`), html);
  return { slug, bytes: html.length };
};

// node mockup/build.mjs [slug ...] builds only those pages (agents building in parallel pass their own).
const all = readdirSync(join(here, 'pages')).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)).sort();
const slugs = process.argv.length > 2 ? process.argv.slice(2) : all;
const results = slugs.map(build);
console.log(results.map((r) => `${r.slug}.html ${r.bytes}`).join('\n'));
