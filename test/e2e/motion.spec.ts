import type { Page } from "@playwright/test";
import { expect, gateRouteGroup, requiresServer, routeIsNewDesign, test } from "./support/fixtures";
import { builtUrl, mockupRoute, sweepRoutes } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* The page-level motion sweep (task 1.1; architecture §11.4, test plan §4.7, tasks.md SPA 9).
 * The per-pick cases (reveal timing, doodle draw, nudge, FAQ, films, bar, drawer, bubble) live in
 * the specs of the tasks that build them; this one checks every built route as a whole:
 *   - motion on: after scrolling the whole page, nothing is still running 6 s later
 *     (no loop, nothing longer than five seconds);
 *   - the hero (the first fold) is still at first paint: opacity 1, no transform, no animation;
 *   - reduced motion: after the same scroll, no animation or transition is running at all;
 *   - a client navigation re-arms the reveals (Home → product → back), checked once both pages
 *     render the new design (wave 5).
 */

const vp = VIEWPORTS.find((v) => v.width === 390)!;

async function scrollThrough(page: Page): Promise<void> {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += vp.height / 2) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
}

const running = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) => a.playState === "running")
      .map((a) => {
        const target = (a.effect as KeyframeEffect | null)?.target as Element | null;
        const name = (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? "animation";
        return `${name} on <${target?.tagName.toLowerCase() ?? "?"}${target?.className ? `.${String(target.className).split(" ").join(".")}` : ""}>`;
      }),
  );

for (const route of sweepRoutes()) {
  test.describe(`motion: ${route.id}`, () => {
    gateRouteGroup(route);

    test("hero still at first paint; nothing running 6 s after a full scroll", async ({ harness }) => {
      const { page } = await harness.open(route, vp, { reducedMotion: "no-preference" });
      const hero = await page.evaluate(() => {
        const main = document.querySelector("main");
        const first = main ? Array.from(main.children).find((c) => !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|LINK)$/.test(c.tagName)) : null;
        if (!first) return null;
        const inside = [first, ...Array.from(first.querySelectorAll("*"))];
        return {
          opacity: getComputedStyle(first).opacity,
          transform: getComputedStyle(first).transform,
          animated: inside.filter((el) => el.getAnimations().length > 0).map((el) => el.tagName.toLowerCase()),
        };
      });
      expect(hero, `${route.id}: no first fold in <main>`).not.toBeNull();
      expect(hero!.opacity, `${route.id}: hero opacity at first paint`).toBe("1");
      expect(hero!.transform, `${route.id}: hero transform at first paint`).toBe("none");
      expect(hero!.animated, `${route.id}: hero elements animating at first paint (pick 2: hero still)`).toEqual([]);

      await scrollThrough(page);
      await page.waitForTimeout(6000);
      expect(await running(page), `${route.id}: animations still running 6 s after the scroll`).toEqual([]);
    });

    test("reduced motion leaves nothing running", async ({ harness }) => {
      const { page } = await harness.open(route, vp, { reducedMotion: "reduce" });
      await scrollThrough(page);
      await page.waitForTimeout(500);
      expect(await running(page), `${route.id}: animations running under reduced motion`).toEqual([]);
    });
  });
}

test.describe("motion: reveals re-arm after a client navigation", () => {
  const home = mockupRoute("home");
  const product = mockupRoute("meet-kheelu");
  requiresServer();
  test.beforeAll(async () => {
    const ready = (await routeIsNewDesign(home)) && (await routeIsNewDesign(product));
    test.skip(!ready, "pending: Home and the product page are not both in the new design yet (wave 5)");
  });

  test("Home → product → back reveals below-the-fold blocks again", async ({ harness }) => {
    const { page } = await harness.open(home, vp, { reducedMotion: "no-preference" });
    await page.locator(`a[href="${product.path}"]`).first().click();
    await page.waitForURL(builtUrl(product));
    await page.goBack();
    await page.waitForURL(builtUrl(home));
    await scrollThrough(page);
    await page.waitForTimeout(1500);
    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-reveal]"))
        .filter((el) => !el.classList.contains("is-in"))
        .map((el) => el.tagName.toLowerCase()),
    );
    expect(hidden, "reveal blocks left hidden after a client navigation (the observer did not re-arm)").toEqual([]);
  });
});
