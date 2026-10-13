import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { Page } from "@playwright/test";
import { PARITY_TARGET } from "./support/env";
import { VISUAL_DEVIATIONS, hideDeviations } from "./support/deviations";
import { expect, forceMotionEnd, gateRouteGroup, hideForParity, settle, test } from "./support/fixtures";
import { CHUNK_MAX_DIFF_RATIO, HEIGHT_TOLERANCE, captureChunks, pageHeight } from "./support/parity";
import { mockupRoutes } from "./support/routes";
import { APPROVED_WIDTHS } from "./support/viewports";

/* Visual parity with the approved mockup (task 1.1 owns the harness; ADR-011; tasks.md SPA 1).
 *
 * For each approved page at 360 x 640, 390 x 844 and 1440 x 900: the mockup file and the built
 * route, both with reduced motion on, reveals forced, doodles drawn, the review tool hidden and the
 * D050 WhatsApp bubble and its clearance hidden (it has its own spec, task 3.1). Page height must
 * match within 2 percent, then every screen-height chunk may differ in at most 2 percent of its
 * pixels, unless the main session has accepted that chunk as a deviation (support/deviations.ts).
 * A block approved as absent or moved is hidden on its side first (VISUAL_HIDDEN, task 4.8), so the
 * chunks below it still line up; each hide is printed.
 * The mockup's chunks are written as goldens under test/e2e/.goldens/ (git-ignored) and the build
 * is compared with them by Playwright's comparator. A run with --update-snapshots fails at once:
 * it would replace the mockup golden with the build's own screenshot.
 *
 * Calibration: `npm run test:visual -- home --calibrate` compares the mockup with itself and must
 * give zero differing pixels at Playwright's default per-pixel threshold (test plan §4.9), or the
 * harness is not deterministic enough to judge a page. (At threshold 0, two anti-aliased pixels
 * where the fixed buy bar meets an image flickered in some runs; the default threshold absorbs that.)
 */

async function prepare(page: Page): Promise<void> {
  await hideForParity(page);
  await forceMotionEnd(page);
  await settle(page);
}

for (const route of mockupRoutes()) {
  test.describe(`visual parity: ${route.id}`, () => {
    if (PARITY_TARGET === "build") gateRouteGroup(route);

    for (const vp of APPROVED_WIDTHS) {
      test(vp.name, async ({ harness }, testInfo) => {
        // The goldens are always the mockup, written by this test. With --update-snapshots (-u)
        // Playwright would overwrite them with the build's screenshot and every chunk would pass.
        expect(
          ["all", "changed"].includes(testInfo.config.updateSnapshots),
          `visual parity never updates snapshots (updateSnapshots is "${testInfo.config.updateSnapshots}"): the mockup is the golden. Run without -u / --update-snapshots.`,
        ).toBe(false);
        const calibration = PARITY_TARGET === "mockup";
        const { page: mockup } = await harness.openMockup(route.mockup!, vp);
        if (!calibration) await hideDeviations(mockup, route.id, "mockup");
        await prepare(mockup);
        const expectedHeight = await pageHeight(mockup);
        const expectedChunks = await captureChunks(mockup);

        // In calibration, open() loads the mockup again (support/fixtures.ts).
        const { page } = await harness.open(route, vp);
        if (!calibration) await hideDeviations(page, route.id, "build");
        await prepare(page);
        const height = await pageHeight(page);
        if (calibration) expect(height, "calibration: the mockup's height must not change between two loads").toBe(expectedHeight);
        else {
          expect(
            Math.abs(height - expectedHeight) / expectedHeight,
            `${route.id} ${vp.name}: page height ${height} px vs the mockup's ${expectedHeight} px (tolerance ${HEIGHT_TOLERANCE * 100}%)`,
          ).toBeLessThanOrEqual(HEIGHT_TOLERANCE);
        }

        const chunks = await captureChunks(page);
        const deviations = VISUAL_DEVIATIONS[route.id] ?? [];
        for (let i = 0; i < Math.min(chunks.length, expectedChunks.length); i++) {
          const name = `${route.id}-${vp.name}-${String(i).padStart(2, "0")}.png`;
          const golden = testInfo.snapshotPath(name, { kind: "snapshot" });
          mkdirSync(dirname(golden), { recursive: true });
          writeFileSync(golden, expectedChunks[i]);
          const accepted = !calibration && deviations.find((d) => d.viewport === vp.name && d.chunk === i);
          if (accepted) {
            console.log(`[visual-parity] ${route.id} ${vp.name} chunk ${i}: accepted deviation (${accepted.approvedBy}): ${accepted.reason}`);
            continue;
          }
          expect
            .soft(chunks[i], `${route.id} ${vp.name} chunk ${i}`)
            .toMatchSnapshot(name, calibration ? { maxDiffPixels: 0 } : { maxDiffPixelRatio: CHUNK_MAX_DIFF_RATIO });
        }
        console.log(`[visual-parity] ${route.id} ${vp.name}: ${chunks.length} chunk(s), height ${height} px${calibration ? " (calibration)" : ""}`);
      });
    }
  });
}
