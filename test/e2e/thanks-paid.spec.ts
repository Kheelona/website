import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Page } from "@playwright/test";
import { THANKS_PAID } from "../fixtures/store/thanks-paid";
import { hideDeviations, textDeviations } from "./support/deviations";
import { ruleMockupPage } from "./support/seller-facts";
import { STORYBOOK_PORT } from "./support/env";
import { expect, forceMotionEnd, hideForParity, PLANTS, requiresServer, settle, test } from "./support/fixtures";
import { CHUNK_MAX_DIFF_RATIO, HEIGHT_TOLERANCE, captureChunks, mainText, pageHeight, sentenceDiff, sentences } from "./support/parity";
import { APPROVED_WIDTHS } from "./support/viewports";

/* The /thanks paid state against the approved confirmation page (task 4.8 item 3; wiki/qa/deviations.md V5).
 *
 * The route's own parity specs open /thanks with no order, which shows the link-needed state; a real order is never
 * placed and the page's logic is frozen (ADR-013). So the paid state the mockup shows is the story
 * src/layouts/StoreShell/StoreShell.stories.tsx `ThanksPaid`: the five folds and the page's close inside the store chrome,
 * from a fixture order (test/fixtures/store/thanks-paid.ts), proven equal to the route's own render of that order by
 * src/layouts/StoreShell/thanks-paid-story.test.tsx. Here it is compared with mockup/store-confirmation.html, whole page,
 * chrome included, at 360 x 640, 390 x 844 and 1440 x 900, as legal-template.spec.ts compares the legal template's story
 * (tasks.md SPA 1 and 2): the page height within 2 percent, the same sentences in <main>, the computed type, colour and
 * box of every text element of the five folds, and every screen-height chunk at most 2 percent differing pixels.
 *
 * Like for like: the mockup's two sample slots (the email in fold 1, the order number in fold 2, `.mk-placeholder`) take
 * the fixture order's values, as the page prints the order row's; reduced motion on, motion at its end, the D050 bubble
 * hidden (its own spec, task 3.1); the payments line hidden on both sides (VISUAL_HIDDEN, V1: the mockup's in its
 * footer, the build's at the end of main) for the pixels, and accepted where it moved (TEXT_DEVIATIONS, V1) for the
 * words, which are read before it is hidden. The mockup's
 * chunks are the goldens (git-ignored, D039), written by this test; it never updates snapshots.
 *
 * Runs in the "site" project and opens the Storybook server Playwright starts beside the site (playwright.config.ts,
 * KH_STORYBOOK_PORT; `npm run build-storybook` first). Prove it red with a planted violation in the story page:
 *   KH_E2E_PORT=3534 KH_STORYBOOK_PORT=6164 KH_E2E_PLANT=visual npx playwright test test/e2e/thanks-paid.spec.ts
 * (also `height` and `text`).
 */

const SLUG = "store-confirmation";
const STORY_URL = `http://localhost:${STORYBOOK_PORT}/iframe.html?id=layouts-storeshell--thanks-paid&viewMode=story`;

/** The text elements of the five folds (the column), in order. The mockup's value-marker spans are not in the set. */
const TEXT_ELEMENTS = ".ph-no-capture.ph-mask :is(h1, h2, h3, p, li, a, dt, dd, label, button, option)";

type Typeset = { tag: string; font: string; color: string; box: string };

/** Each text element's computed type (family, size, line height, weight, tracking), colour and box (to the half pixel),
 *  which a 2 percent pixel budget per screen cannot see on a few headings (mockup-css-mapping §5 rule 10). */
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

/** The mockup's two sample slots take the fixture order's email and number, as plain text (the page prints the row's). */
async function fillSampleSlots(page: Page): Promise<void> {
  const filled = await page.evaluate(
    ({ email, orderRef }) => {
      const slots: [string, string][] = [
        ['[aria-labelledby="thanks-title"] .mk-placeholder', email],
        ['[aria-labelledby="order-title"] .mk-placeholder', orderRef],
      ];
      for (const [selector, value] of slots) document.querySelector(`main ${selector}`)?.replaceWith(value);
      return document.querySelectorAll("main .mk-placeholder").length;
    },
    { email: THANKS_PAID.order.email, orderRef: THANKS_PAID.order.order_ref },
  );
  expect(filled, "mockup/store-confirmation.html: a sample slot this spec does not fill").toBe(0);
}

requiresServer();

async function plant(page: Page): Promise<void> {
  const name = process.env.KH_E2E_PLANT;
  if (!name) return;
  if (!["visual", "height", "text"].includes(name)) throw new Error(`KH_E2E_PLANT=${name}: this spec takes visual, height or text`);
  await page.evaluate(PLANTS[name]);
}

test.describe("/thanks paid-state parity: the ThanksPaid story against store-confirmation.html", () => {
  for (const vp of APPROVED_WIDTHS) {
    test(vp.name, async ({ harness }, testInfo) => {
      expect(
        ["all", "changed"].includes(testInfo.config.updateSnapshots),
        `/thanks paid-state parity never updates snapshots (updateSnapshots is "${testInfo.config.updateSnapshots}"): the mockup is the golden.`,
      ).toBe(false);

      const { page: mockup } = await harness.openMockup(SLUG, vp);
      // The help fold's line, the store header's and the footer's lines without the GSTIN and the number (D063 items
      // 2-3; task Q2.3; support/seller-facts.ts): the story prints them from seller.ts.
      await ruleMockupPage(mockup, ["main", "header.mk-store-head", "footer.mk-store-foot"]);
      await fillSampleSlots(mockup);

      const context = await harness.context(vp);
      const story = await context.newPage();
      await story.goto(STORY_URL, { waitUntil: "load" });
      await story.locator("#storybook-root main h1").waitFor();
      for (const page of [mockup, story]) {
        await hideForParity(page);
        await forceMotionEnd(page);
      }
      await plant(story);

      /* The words of <main>, with the bubble hidden (its laptop label is not the mockup's) but before the payments line
         is: its move is accepted by its rule (V1); the help line without the call by D063's (task Q2.3). */
      const rules = textDeviations(SLUG);
      const diff = sentenceDiff(sentences(await mainText(mockup)), sentences(await mainText(story)));
      const accepted = [...diff.missing.filter((s) => rules.some((r) => r.mockup.test(s))), ...diff.extra.filter((s) => rules.some((r) => r.build?.test(s)))];
      if (accepted.length) console.log(`[thanks-paid] ${vp.name}: accepted text deviations (${rules.map((r) => r.approvedBy).join("; ")}):\n  ${accepted.join("\n  ")}`);
      expect(
        { missing: diff.missing.filter((s) => !rules.some((r) => r.mockup.test(s))), extra: diff.extra.filter((s) => !rules.some((r) => r.build?.test(s))) },
        `${SLUG} paid ${vp.name}: sentences of <main>`,
      ).toEqual({ missing: [], extra: [] });

      for (const [page, side] of [[mockup, "mockup"], [story, "build"]] as const) {
        await hideDeviations(page, SLUG, side, "thanks-paid");
        await settle(page);
      }

      const expectedHeight = await pageHeight(mockup);
      const height = await pageHeight(story);
      expect(
        Math.abs(height - expectedHeight) / expectedHeight,
        `${SLUG} paid ${vp.name}: page ${height} px tall vs the mockup's ${expectedHeight} px (tolerance ${HEIGHT_TOLERANCE * 100}%)`,
      ).toBeLessThanOrEqual(HEIGHT_TOLERANCE);

      const expectedType = await typeset(mockup);
      const type = await typeset(story);
      expect(type.length, `${SLUG} paid ${vp.name}: text elements in the five folds`).toBe(expectedType.length);
      const off = type.flatMap((t, i) => (JSON.stringify(t) === JSON.stringify(expectedType[i]) ? [] : [`#${i} ${JSON.stringify(t)} vs the mockup's ${JSON.stringify(expectedType[i])}`]));
      expect.soft(off, `${SLUG} paid ${vp.name}: computed type, colour and box of every text element`).toEqual([]);

      const expectedChunks = await captureChunks(mockup);
      const chunks = await captureChunks(story);
      for (let i = 0; i < Math.min(chunks.length, expectedChunks.length); i++) {
        const name = `thanks-paid-${vp.name}-${String(i).padStart(2, "0")}.png`;
        const golden = testInfo.snapshotPath(name, { kind: "snapshot" });
        mkdirSync(dirname(golden), { recursive: true });
        writeFileSync(golden, expectedChunks[i]);
        expect.soft(chunks[i], `${SLUG} paid ${vp.name} chunk ${i}`).toMatchSnapshot(name, { maxDiffPixelRatio: CHUNK_MAX_DIFF_RATIO });
      }
      console.log(`[thanks-paid] ${vp.name}: ${chunks.length} chunk(s), page ${height} px (mockup ${expectedHeight} px)`);
    });
  }
});
