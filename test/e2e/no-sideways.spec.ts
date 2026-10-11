import type { Page } from "@playwright/test";
import { expect, forceMotionEnd, gateRouteGroup, test } from "./support/fixtures";
import { sweepRoutes } from "./support/routes";
import { SIDEWAYS_VIEWPORTS } from "./support/viewports";

/* No sideways scroll (task 1.1; test plan §4.6, tasks.md SPA 4, lessons §2).
 *
 * `scrollWidth > clientWidth` must be false on every built route at 320 px and on the whole
 * viewport matrix: after forcing reveals, with the phone drawer open, and with the films strip
 * scrolled to each end with its focused tile scaled (D049 pick 8). Never innerWidth: in phone
 * emulation an overflowing page widens the layout viewport, so innerWidth grows with the overflow.
 */

async function sideways(page: Page): Promise<{ scrollWidth: number; clientWidth: number } | null> {
  const m = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  return m.scrollWidth > m.clientWidth ? m : null;
}

for (const route of sweepRoutes()) {
  test.describe(`no sideways scroll: ${route.id}`, () => {
    gateRouteGroup(route);

    for (const vp of SIDEWAYS_VIEWPORTS) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        await forceMotionEnd(page);
        expect(await sideways(page), `${route.id} ${vp.name}: the page scrolls sideways`).toBeNull();

        const menu = page.locator("[data-open-menu], button[aria-controls][aria-expanded]").first();
        if (vp.isMobile && (await menu.isVisible().catch(() => false))) {
          await menu.click();
          expect(await sideways(page), `${route.id} ${vp.name}: sideways scroll with the drawer open`).toBeNull();
          await page.keyboard.press("Escape");
        }

        const strips = page.locator("[data-films], .ks-films__track");
        for (let i = 0; i < (await strips.count()); i++) {
          const strip = strips.nth(i);
          await strip.scrollIntoViewIfNeeded();
          for (const end of ["start", "end"] as const) {
            await strip.evaluate((el, e) => {
              el.scrollLeft = e === "end" ? el.scrollWidth : 0;
            }, end);
            await page.waitForTimeout(400);
            expect(await sideways(page), `${route.id} ${vp.name}: sideways scroll with films strip ${i} at its ${end}`).toBeNull();
          }
        }
      });
    }
  });
}
