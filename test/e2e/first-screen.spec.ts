import type { Page } from "@playwright/test";
import { expect, forceMotionEnd, gateRouteGroup, hideForParity, test } from "./support/fixtures";
import { PARITY_TARGET } from "./support/env";
import { MOCKUP_SLUGS } from "./support/mockup-text";
import { mockupRoute, sweepRoutes } from "./support/routes";
import { FIRST_SCREEN_VIEWPORTS, VIEWPORTS } from "./support/viewports";

/* The first phone screen and tap targets (task 1.1; test plan §4.1 and §4.6, tasks.md SPA 4).
 *
 * Home and product: the h1, the chilli button, the price sentence and the delivery line all end
 * inside the first screen at 360 x 590 (short in-app browser) and 360 x 640 (D045 measured 584 px).
 * Every route at 360 x 640: each link and button is reachable on the edges of a 44 x 44 box
 * centred on it (elementFromPoint returns it or a descendant, which counts the ported ::before
 * tap extensions). Links inside a sentence of running text are WCAG 2.5.8's inline exception and
 * are counted apart. The first-screen rule is calibrated on the approved mockup, which passes it;
 * the tap-target pass on the mockup is printed, because the build fixes a small target with an
 * invisible ::before tap extension (no visual change), and a point that lands on a neighbouring
 * target (overlapping extensions, as in the approved trust lines) is printed as "crowded".
 */

const FIRST_SCREEN_PAGES = ["home", "meet-kheelu"] as const;
const tapViewport = VIEWPORTS[0];

async function firstScreenBottoms(page: Page) {
  return page.evaluate(() => {
    const bottom = (sel: string) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().bottom) : null;
    };
    return {
      h1: bottom("main h1"),
      cta: bottom("main .kh-btn--cta"),
      price: bottom("main .ks-price, main .mk-price"),
      delivery: bottom("main .kh-trustline li"),
      viewport: window.innerHeight,
    };
  });
}

function assertFirstScreen(m: Awaited<ReturnType<typeof firstScreenBottoms>>, label: string) {
  for (const key of ["h1", "cta", "price", "delivery"] as const) {
    expect(m[key], `${label}: no ${key} found`).not.toBeNull();
    expect(m[key]!, `${label}: the ${key} ends at ${m[key]} px, below the first screen (${m.viewport} px)`).toBeLessThanOrEqual(m.viewport);
  }
}

/** Targets whose 44 x 44 box edges do not all land on the target (test plan §4.6).
 *  A point that lands on a NEIGHBOURING target (two tap extensions overlapping, as in the approved
 *  trust lines) is "crowded": printed for the main session, not failed, because the approved mockup
 *  has it. A point that lands on plain content means the target itself is too small: that fails. */
async function smallTargets(page: Page) {
  const count = await page.locator("main a[href], main button, main summary").count();
  const failing: string[] = [];
  const crowded: string[] = [];
  let inline = 0;
  for (let i = 0; i < count; i++) {
    const verdict = await page.evaluate((index) => {
      const TARGETS = "a[href], button, summary, [role='button']";
      const el = document.querySelectorAll<HTMLElement>("main a[href], main button, main summary")[index];
      const style = getComputedStyle(el);
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0 || style.visibility === "hidden") return { kind: "skip" };
      const own = (el.textContent ?? "").trim().length;
      const around = (el.parentElement?.textContent ?? "").trim().length;
      if (el.tagName === "A" && style.display === "inline" && around > own + 20) return { kind: "inline" };
      el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let kind = "ok";
      for (const [x, y] of [
        [cx - 21, cy],
        [cx + 21, cy],
        [cx, cy - 21],
        [cx, cy + 21],
      ]) {
        const hit = document.elementFromPoint(x, y);
        if (hit && (hit === el || el.contains(hit))) continue;
        if (hit?.closest(TARGETS)) kind = kind === "small" ? "small" : "crowded";
        else kind = "small";
      }
      const label = `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 40)}"`;
      return { kind, label };
    }, i);
    if (verdict.kind === "inline") inline++;
    else if (verdict.kind === "small") failing.push(verdict.label!);
    else if (verdict.kind === "crowded") crowded.push(verdict.label!);
  }
  return { failing, crowded, inline, checked: count };
}

test.describe("first screen: calibration on the approved mockup", () => {
  for (const slug of FIRST_SCREEN_PAGES) {
    for (const vp of FIRST_SCREEN_VIEWPORTS) {
      test(`${slug} ${vp.name}`, async ({ harness }) => {
        const { page } = await harness.openMockup(slug, vp);
        await hideForParity(page);
        assertFirstScreen(await firstScreenBottoms(page), `mockup ${slug} ${vp.name}`);
      });
    }
  }
});

test.describe("tap targets: calibration on the approved mockup", () => {
  for (const slug of MOCKUP_SLUGS) {
    test(slug, async ({ harness }) => {
      const { page } = await harness.openMockup(slug, tapViewport);
      await hideForParity(page);
      await forceMotionEnd(page);
      const r = await smallTargets(page);
      // Informative on the mockup: a small target here is fixed in the build with an invisible
      // ::before tap extension (as the mockup's trust links have), so it never blocks parity.
      console.log(
        `[tap-targets] mockup ${slug}: ${r.checked} targets, ${r.inline} inline links; ` +
          `small (the build adds a tap extension): ${r.failing.join("; ") || "none"}; crowded: ${r.crowded.join("; ") || "none"}`,
      );
      expect(r.checked, `mockup ${slug}: the instrument found no targets`).toBeGreaterThan(0);
    });
  }
});

for (const slug of FIRST_SCREEN_PAGES) {
  const route = mockupRoute(slug);
  test.describe(`first screen: ${route.id}`, () => {
    gateRouteGroup(route);
    for (const vp of FIRST_SCREEN_VIEWPORTS) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        await hideForParity(page);
        assertFirstScreen(await firstScreenBottoms(page), `${route.id} ${vp.name}`);
      });
    }
  });
}

for (const route of sweepRoutes()) {
  test.describe(`tap targets: ${route.id}`, () => {
    test.skip(PARITY_TARGET === "mockup", "self-test: the calibration block above already measures the mockup");
    gateRouteGroup(route);
    test(tapViewport.name, async ({ harness }) => {
      const { page } = await harness.open(route, tapViewport);
      await forceMotionEnd(page);
      const r = await smallTargets(page);
      console.log(`[tap-targets] ${route.id}: ${r.checked} targets, ${r.inline} inline links in running text (WCAG 2.5.8 exception), crowded: ${r.crowded.join("; ") || "none"}`);
      expect(r.failing, `${route.id}: targets smaller than 44 x 44 px`).toEqual([]);
    });
  });
}
