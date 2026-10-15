import type { Page } from "@playwright/test";
import { expect, forceMotionEnd, gateRouteGroup, requiresServer, test } from "./support/fixtures";
import { mockupRoute } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* Home's phone length (task Q2.15; the CMO's built review of the selling update, ruling R1,
 * wiki/qa/cmo-review-selling-update-built-2026-10-15.md). The length is accepted for launch with no cuts, on a condition:
 * Home gains no fold unless one leaves, and the length is pinned so it cannot grow unseen. At 390 x 844, with reduced
 * motion and every reveal at its end, the offer's heading ("What you get, and what you pay.", `#offer-title`) starts at
 * most 7,700 px down the page and the page is at most 15,500 px long (the review measured 7,569 and 15,027 on the build
 * of 5b245a26). Build only: the approved mockup predates the selling update, and is not what R1 accepts.
 * Proven red with a planted block that pushes the page down (KH_E2E_PLANT=firstscreen: 900 px at the top of <main>):
 *   KH_E2E_PLANT=firstscreen KH_REUSE_SERVER=1 npx playwright test --project=site test/e2e/home-length.spec.ts
 */

/** R1's two limits, in CSS px at 390 x 844. */
export const HOME_LENGTH = { offerTopMax: 7_700, pageMax: 15_500 } as const;

const HOME = mockupRoute("home");
const PHONE = VIEWPORTS.find((vp) => vp.name === "phone-390x844")!;

/** Where the offer's heading starts on the page and how long the page is, once the fonts and every reveal have settled. */
async function lengths(page: Page): Promise<{ offerTop: number | null; page: number }> {
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await forceMotionEnd(page);
  return page.evaluate(() => {
    const heading = document.querySelector("#offer-title");
    return {
      offerTop: heading ? Math.round(heading.getBoundingClientRect().top + window.scrollY) : null,
      page: document.documentElement.scrollHeight,
    };
  });
}

test.describe("Home's phone length (R1): the offer heading and the page held to the review's limits", () => {
  requiresServer();
  gateRouteGroup(HOME);

  test(`${PHONE.name}: the offer heading at most ${HOME_LENGTH.offerTopMax} px down, the page at most ${HOME_LENGTH.pageMax} px`, async ({ harness }) => {
    const { page } = await harness.open(HOME, PHONE);
    const measured = await lengths(page);
    console.log(`[home-length] ${PHONE.name}: offer heading at ${measured.offerTop} px, page ${measured.page} px (limits ${HOME_LENGTH.offerTopMax}, ${HOME_LENGTH.pageMax})`);
    expect(measured.offerTop, "Home has no #offer-title: the offer fold left or lost its heading").not.toBeNull();
    expect(measured.offerTop!, "the offer heading moved further down Home than R1 allows: a fold was added above it").toBeLessThanOrEqual(HOME_LENGTH.offerTopMax);
    expect(measured.page, "Home is longer than R1 allows: a fold was added, or one grew").toBeLessThanOrEqual(HOME_LENGTH.pageMax);
  });
});
