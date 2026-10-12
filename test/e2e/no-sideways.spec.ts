import type { Page } from "@playwright/test";
import { expect, forceMotionEnd, gateRouteGroup, test } from "./support/fixtures";
import { sweepRoutes } from "./support/routes";
import { SIDEWAYS_VIEWPORTS } from "./support/viewports";

/* No sideways scroll (task 1.1; test plan §4.6, tasks.md SPA 4, lessons §2).
 *
 * `scrollWidth > clientWidth` must be false on every built route at 320 px and on the whole
 * viewport matrix: after forcing reveals, with the phone drawer open, and with the films strip
 * scrolled to each end with its end tile focused and scaled (D049 pick 8; in a second context with
 * motion on, because reduced motion turns the scale off). Never innerWidth: in phone
 * emulation an overflowing page widens the layout viewport, so innerWidth grows with the overflow.
 */

const FILM_STRIPS = "[data-films], .ks-films__track";

/** --duration-base in milliseconds (the focus scale's transition, architecture §11.2 pick 8). */
async function durationBase(page: Page): Promise<number> {
  const raw = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--duration-base").trim());
  const m = /^([\d.]+)(ms|s)$/.exec(raw);
  return m ? Number(m[1]) * (m[2] === "s" ? 1000 : 1) : 500;
}

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

        // The films strip at each end, with motion on (reduced motion turns pick 8's scale off) and
        // the end tile focused, so the scaled tile at the strip's edge is what is measured.
        if (await page.locator(FILM_STRIPS).count()) {
          const { page: moving } = await harness.open(route, vp, { reducedMotion: "no-preference" });
          await forceMotionEnd(moving);
          const strips = moving.locator(FILM_STRIPS);
          const settle = await durationBase(moving);
          for (let i = 0; i < (await strips.count()); i++) {
            const strip = strips.nth(i);
            await strip.scrollIntoViewIfNeeded();
            for (const end of ["start", "end"] as const) {
              await strip.evaluate((el, e) => {
                el.scrollLeft = e === "end" ? el.scrollWidth : 0;
              }, end);
              await moving.waitForTimeout(250);
              const focused = await strip.evaluate((el, e) => {
                const tiles = Array.from(el.querySelectorAll(".ks-film, .mk-film"));
                const tile = e === "end" ? tiles[tiles.length - 1] : tiles[0];
                tiles.forEach((t) => t.classList.toggle("is-focus", t === tile));
                return tiles.length > 0;
              }, end);
              expect(focused, `${route.id}: films strip ${i} has no .ks-film tile (class contract, architecture §11.3)`).toBe(true);
              await moving.waitForTimeout(settle + 100);
              const where = `${route.id} ${vp.name}: films strip ${i} at its ${end}, end tile focused, motion on`;
              expect(await sideways(moving), `${where}: the page scrolls sideways`).toBeNull();
            }
          }
        }
      });
    }
  });
}
