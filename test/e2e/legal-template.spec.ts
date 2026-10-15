import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Page } from "@playwright/test";
import { STORYBOOK_PORT } from "./support/env";
import { expect, hideForParity, PLANTS, requiresServer, settle, test } from "./support/fixtures";
import { CHUNK_MAX_DIFF_RATIO, HEIGHT_TOLERANCE, captureChunks, mainText, pageHeight, sentenceDiff, sentences } from "./support/parity";
import { ruleMockupPage } from "./support/seller-facts";
import { APPROVED_WIDTHS, type Viewport } from "./support/viewports";

/* The legal template against the four approved legal pages (task 4.3; tasks.md 4.3 "Test": visual parity with fixture
 * content copied from them), before the legal routes exist (tasks 5.11-5.14 run SPA 1 on the routes themselves).
 *
 * For privacy, terms, refund and shipping at 360 x 640, 390 x 844 and 1440 x 900 (and two widths in between), reduced
 * motion on: the mockup page
 * (mockup/<slug>.html) with everything but its <main> hidden (the chrome is the shells', task 3.1, and has its own
 * parity), against the template's story in the static Storybook build (src/layouts/LegalTemplate/LegalTemplate.stories.tsx:
 * the template inside a <main>, fixture content from test/fixtures/legal). As SPA 1 and 2: the <main> height within
 * 2 percent, every screen-height chunk at most 2 percent differing pixels, and the same sentences. The mockup's chunks
 * are the goldens (git-ignored, D039), written by this test; it never updates snapshots.
 *
 * Runs in the "site" project and opens the Storybook server Playwright starts beside the site (playwright.config.ts,
 * KH_STORYBOOK_PORT). Prove it red with a planted violation in the story page:
 *   KH_E2E_PORT=3484 KH_STORYBOOK_PORT=6124 KH_E2E_PLANT=visual npx playwright test test/e2e/legal-template.spec.ts
 * (also `height` and `text`).
 */

const SLUGS = ["privacy", "terms", "refund", "shipping"] as const;

/** Besides the approved widths, two in between, since the template must equal the mockup at every width
 *  (mockup-css-mapping §2): a tablet held upright (touch: the contents keep their 48 px rows) and a small laptop where
 *  the 1024 px rules start (mouse: the compact rows). */
const IN_BETWEEN: readonly Viewport[] = [
  { name: "tablet-768x1024", width: 768, height: 1024, isMobile: true, group: "phone" },
  { name: "laptop-1024x768", width: 1024, height: 768, isMobile: false, group: "laptop" },
];
const storyUrl = (slug: (typeof SLUGS)[number]) => `http://localhost:${STORYBOOK_PORT}/iframe.html?id=layouts-legaltemplate--${slug}&viewMode=story`;

/** The mockup page as the template draws it: the page's <main> alone (skip link, nav, footer and drawer hidden). */
const MAIN_ONLY = "body > :not(main) { display: none !important; }";

/** The elements that carry the words. Both pages have the same ones in the same order (LegalTemplate.test.tsx compares
 *  the markup); the mockup's value-marker spans and the build's no-wrap span inside the phone link are not in the set. */
const TEXT_ELEMENTS = "main :is(h1, h2, h3, p, li, a, strong, th, td)";

type Typeset = { tag: string; font: string; color: string; box: string };

/** Each text element's computed type (family, size, line height, weight, tracking), colour and box (to the half pixel).
 *  A 2 percent pixel budget per screen cannot see a weight or a line height on a few headings; this sees all of them
 *  (mockup-css-mapping §5 rule 10). */
function typeset(page: Page): Promise<Typeset[]> {
  return page.evaluate((selector) => {
    const half = (n: number) => Math.round(n * 2) / 2;
    return Array.from(document.querySelectorAll<HTMLElement>(selector)).map((el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        font: `${s.fontFamily.split(",")[0]} ${s.fontSize}/${s.lineHeight} ${s.fontWeight} ${s.letterSpacing}`,
        color: s.color,
        box: `${half(r.left + scrollX)},${half(r.top + scrollY)} ${half(r.width)}x${half(r.height)}`,
      };
    });
  }, TEXT_ELEMENTS);
}

requiresServer();

async function plant(page: Page): Promise<void> {
  const name = process.env.KH_E2E_PLANT;
  if (!name) return;
  if (!["visual", "height", "text"].includes(name)) throw new Error(`KH_E2E_PLANT=${name}: this spec takes visual, height or text`);
  await page.evaluate(PLANTS[name]);
}

for (const slug of SLUGS) {
  test.describe(`legal template parity: ${slug}`, () => {
    for (const vp of [...APPROVED_WIDTHS, ...IN_BETWEEN]) {
      test(vp.name, async ({ harness }, testInfo) => {
        expect(
          ["all", "changed"].includes(testInfo.config.updateSnapshots),
          `legal template parity never updates snapshots (updateSnapshots is "${testInfo.config.updateSnapshots}"): the mockup is the golden.`,
        ).toBe(false);

        const { page: mockup } = await harness.openMockup(slug, vp);
        // The seller sentence without the GSTIN and the close's help line without the call (D063 items 2-3; task Q2.3;
        // support/seller-facts.ts): the template prints both from seller.ts. The document's own lines keep the number.
        await ruleMockupPage(mockup, ["main"]);
        await mockup.addStyleTag({ content: MAIN_ONLY });
        await hideForParity(mockup);
        await settle(mockup);

        const context = await harness.context(vp);
        const story = await context.newPage();
        await story.goto(storyUrl(slug), { waitUntil: "load" });
        await story.locator("#storybook-root main h1").waitFor();
        await hideForParity(story);
        await settle(story);
        await plant(story);

        const expectedHeight = await pageHeight(mockup);
        const height = await pageHeight(story);
        expect(
          Math.abs(height - expectedHeight) / expectedHeight,
          `${slug} ${vp.name}: <main> ${height} px tall vs the mockup's ${expectedHeight} px (tolerance ${HEIGHT_TOLERANCE * 100}%)`,
        ).toBeLessThanOrEqual(HEIGHT_TOLERANCE);

        const diff = sentenceDiff(sentences(await mainText(mockup)), sentences(await mainText(story)));
        expect(diff, `${slug} ${vp.name}: sentences of <main>`).toEqual({ missing: [], extra: [] });

        const expectedType = await typeset(mockup);
        const type = await typeset(story);
        expect(type.length, `${slug} ${vp.name}: text elements in <main>`).toBe(expectedType.length);
        const off = type.flatMap((t, i) => (JSON.stringify(t) === JSON.stringify(expectedType[i]) ? [] : [`#${i} ${JSON.stringify(t)} vs the mockup's ${JSON.stringify(expectedType[i])}`]));
        expect.soft(off, `${slug} ${vp.name}: computed type, colour and box of every text element`).toEqual([]);

        const expectedChunks = await captureChunks(mockup);
        const chunks = await captureChunks(story);
        for (let i = 0; i < Math.min(chunks.length, expectedChunks.length); i++) {
          const name = `legal-${slug}-${vp.name}-${String(i).padStart(2, "0")}.png`;
          const golden = testInfo.snapshotPath(name, { kind: "snapshot" });
          mkdirSync(dirname(golden), { recursive: true });
          writeFileSync(golden, expectedChunks[i]);
          expect.soft(chunks[i], `${slug} ${vp.name} chunk ${i}`).toMatchSnapshot(name, { maxDiffPixelRatio: CHUNK_MAX_DIFF_RATIO });
        }
        console.log(`[legal-template] ${slug} ${vp.name}: ${chunks.length} chunk(s), <main> ${height} px (mockup ${expectedHeight} px)`);
      });
    }
  });
}
