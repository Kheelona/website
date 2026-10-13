import type { Page } from "@playwright/test";
import { expect, gateRouteGroup, motionStarted, requiresServer, routeIsNewDesign, test, type MotionEvent } from "./support/fixtures";
import { revealOnMoneyInDocument } from "./support/page-checks";
import { builtUrl, mockupRoute, sweepRoutes } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* The page-level motion sweep (task 1.1; architecture §11.4, test plan §4.7, tasks.md SPA 9).
 * The per-pick cases (reveal timing, doodle draw, nudge, FAQ, films, bar, drawer, bubble) live in
 * the specs of the tasks that build them; this one checks every built route as a whole:
 *   - motion on: after scrolling the whole page, nothing is still running 6 s later
 *     (no loop, nothing longer than five seconds);
 *   - the hero (the first fold) is still at first paint: opacity 1, no transform, no animation;
 *   - no entrance motion on the money, on the served page as composed (D049 1A and 2A, SPA 9): no
 *     [data-reveal] on or around the first section, an h1, the price, a chilli button, the offer
 *     card, the sticky bar or a form, and no doodle drawing in the first section
 *     (revealOnMoneyInDocument, the rule no-reveal-on-money.test.tsx runs on fixtures and the mockup);
 *   - reduced motion: from before the first paint to the end of the same scroll, no transition or
 *     animation starts (recorded as each starts, so a finite reveal fade that finished long before
 *     the check is caught too) except the buy bar's opacity fade (pick 4, printed), and none is
 *     running at the end;
 *   - a client navigation re-arms the reveals (Home → product → back), checked once both pages
 *     render the new design (wave 5).
 */

const vp = VIEWPORTS.find((v) => v.width === 390)!;

/* Under reduced motion the only motion architecture §11.2 keeps while a page loads and scrolls is
   pick 4's: the phone buy bar "fades without moving", an opacity transition on .kh-buybar.
   Everything else (reveals, doodles, the films' focus, the bubble) is at its end state at once. */
const REDUCED_MOTION_ALLOWED = (m: MotionEvent): boolean =>
  m.type === "transition" && m.name === "opacity" && /\.kh-buybar(?=[.>])/.test(m.target);

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

    test("no entrance motion on the money (first section, h1, price, CTA, offer, form)", async ({ harness }) => {
      const { page } = await harness.open(route, vp);
      expect(await page.evaluate(revealOnMoneyInDocument, undefined), `${route.id}: reveal or draw on what sells (architecture §11.2 "never animated")`).toEqual([]);
    });

    test("reduced motion: nothing starts but the bar's fade, nothing running", async ({ harness }) => {
      const { page } = await harness.open(route, vp, { reducedMotion: "reduce", recordMotion: true });
      await scrollThrough(page);
      await page.waitForTimeout(500);
      const started = await motionStarted(page);
      const describe = (m: MotionEvent) => `${m.type} ${m.name} on ${m.target}`;
      const accepted = started.filter(REDUCED_MOTION_ALLOWED);
      if (accepted.length) {
        console.log(`[motion] ${route.id}: under reduced motion, accepted (pick 4, the bar fades without moving): ${[...new Set(accepted.map(describe))].join("; ")}`);
      }
      expect(
        started.filter((m) => !REDUCED_MOTION_ALLOWED(m)).map(describe),
        `${route.id}: transitions or animations started under reduced motion`,
      ).toEqual([]);
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
    /* The first visible link: on a phone the laptop nav link comes first in the DOM and is hidden. */
    await page.locator(`a[href="${product.path}"]:visible`).first().click();
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
