// Gate A mockup checks for one or more pages (D043). No project dependency: uses the cached Playwright
// and axe-core from the npx cache (see wiki/engineering/lessons.md).
// Usage: node mockup/tools/check.cjs <outDir> <slug> [slug ...]
// Writes, per page and viewport, screen-height screenshots (<slug>-<viewport>-NN.png) and <slug>-report.json:
// sideways scroll (scrollWidth vs clientWidth: never innerWidth, which phone emulation inflates),
// console errors, failed requests, axe violations (reduced motion, reveals forced in), first-screen
// positions of the h1 and the first orange button, page height.
const path = require('path');
const fs = require('fs');
const HOME = process.env.HOME;
const { chromium } = require(HOME + '/.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const axeSrc = fs.readFileSync(HOME + '/.npm/_npx/0f94ee7615faf582/node_modules/axe-core/axe.min.js', 'utf8');
const [out, ...slugs] = process.argv.slice(2);
if (!out || !slugs.length) { console.error('usage: node mockup/tools/check.cjs <outDir> <slug> [slug ...]'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const VIEWS = [
  { n: 'phone-360', w: 360, h: 640, m: true },
  { n: 'phone-390', w: 390, h: 844, m: true },
  { n: 'laptop-1440', w: 1440, h: 900, m: false },
];
(async () => {
  const browser = await chromium.launch();
  const all = {};
  for (const slug of slugs) {
    const url = 'file://' + path.resolve(__dirname, '..', `${slug}.html`);
    const rep = {};
    for (const v of VIEWS) {
      const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, isMobile: v.m, hasTouch: v.m, reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
      page.on('pageerror', (e) => errors.push('pageerror ' + e.message));
      page.on('requestfailed', (r) => errors.push('FAILED ' + r.url()));
      await page.goto(url); await page.waitForTimeout(600);
      const info = await page.evaluate(() => {
        const box = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
        const d = document.documentElement;
        return { height: d.scrollHeight, sideways: d.scrollWidth > d.clientWidth, scrollWidth: d.scrollWidth, clientWidth: d.clientWidth,
          h1: box(document.querySelector('h1')), firstCta: box(document.querySelector('main .kh-btn--cta')), h1Count: document.querySelectorAll('h1').length };
      });
      let i = 0;
      for (let y = 0; y < info.height && i < 40; y += v.h) {
        await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(out, `${slug}-${v.n}-${String(i).padStart(2, '0')}.png`) }); i++;
      }
      const pageErrors = errors.slice(); // axe's own stylesheet requests over file:// fail; they are not page errors
      await page.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in')); });
      await page.addScriptTag({ content: axeSrc });
      // White on Chilli/Blue buttons is the founder's accepted exception (D041): reported apart, never as a failure.
      // (The sticky bar parked off screen with .is-hidden gives axe a false background; it passes once shown.)
      const axe = await page.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] })).violations
        .map((x) => {
          const isExc = (n) => x.id === 'color-contrast' && (() => { const el = document.querySelector(n.target.join(' ')); return !!(el && el.closest('.kh-btn--cta, .kh-btn--primary, .kh-iconbtn--primary, .kh-buybar.is-hidden')); })();
          const real = x.nodes.filter((n) => !isExc(n));
          return { id: x.id, impact: x.impact, n: real.length, acceptedException: x.nodes.length - real.length, sample: real.slice(0, 3).map((n) => n.target.join(' ')) };
        }).filter((x) => x.n > 0 || x.acceptedException > 0));
      rep[v.n] = { ...info, shots: i, errors: pageErrors, axe };
      await ctx.close();
    }
    fs.writeFileSync(path.join(out, `${slug}-report.json`), JSON.stringify(rep, null, 2));
    all[slug] = Object.fromEntries(Object.entries(rep).map(([k, r]) => [k, { height: r.height, sideways: r.sideways, shots: r.shots, errors: r.errors.length, axe: r.axe.map((a) => `${a.impact} ${a.id} x${a.n}` + (a.acceptedException ? ` (+${a.acceptedException} accepted exception D041)` : '')) }]));
  }
  await browser.close();
  console.log(JSON.stringify(all, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });
