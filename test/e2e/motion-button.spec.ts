import type { BrowserContext, Locator, Page } from "@playwright/test";
import { expect, test } from "./support/fixtures";
import { STORYBOOK_PORT } from "./support/env";
import { VIEWPORTS, type Viewport } from "./support/viewports";

/* D049 pick 6B, the orange button's arrow nudge (task 2.2; architecture §11.2 row 6, test plan §4.7), on the
 * Button story before any page exists (Playwright project "storybook"):
 *   - with a fine pointer, hovering a Chilli button moves its arrow (.ks-btn__arrow) right by --ks-nudge over
 *     --duration-fast, and it comes back when the pointer leaves;
 *   - on a touch screen (coarse pointer, no hover) the arrow never moves, hovered or tapped;
 *   - with reduced motion the arrow never moves and has no transition.
 * The press is the DS's own :active (bundle.css), not part of this pick's code.
 */

const STORY = `http://localhost:${STORYBOOK_PORT}/iframe.html?id=ui-button--cta-with-arrow&viewMode=story`;
const laptop: Viewport = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;
const phone: Viewport = VIEWPORTS.find((v) => v.width === 390)!;

/** The arrow's horizontal translation in px, from its computed transform (none = 0). */
const shiftOf = (arrow: Locator) =>
  arrow.evaluate((el) => {
    const t = getComputedStyle(el).transform;
    return t === "none" ? 0 : new DOMMatrixReadOnly(t).m41;
  });

/** A CSS time in milliseconds, whichever unit the stylesheet (or its minifier) wrote it in. */
const toMs = (time: string) => (time.trim().endsWith("ms") ? parseFloat(time) : parseFloat(time) * 1000);

const cssVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

async function openStory(context: BrowserContext) {
  const page = await context.newPage();
  await page.goto(STORY, { waitUntil: "load" });
  const button = page.locator("a.kh-btn--cta");
  await expect(button, "the CtaWithArrow story renders one Chilli button").toHaveCount(1);
  const arrow = button.locator("svg.ks-btn__arrow");
  await expect(arrow, "the arrow carries the D049 hook").toHaveCount(1);
  return { page, button, arrow };
}

test.describe("D049 pick 6: the Chilli button's arrow nudge", () => {
  test("fine pointer: hover moves the arrow by --ks-nudge over --duration-fast, leaving brings it back", async ({ harness }) => {
    const { page, button, arrow } = await openStory(await harness.context(laptop, { reducedMotion: "no-preference" }));
    expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(true);
    const nudge = parseFloat(await cssVar(page, "--ks-nudge"));
    expect(nudge, "--ks-nudge is the value D049 names").toBe(5);
    expect(await shiftOf(arrow)).toBe(0);

    const timing = await arrow.evaluate((el) => {
      const s = getComputedStyle(el);
      return { property: s.transitionProperty, duration: s.transitionDuration };
    });
    expect(timing.property).toBe("transform");
    expect(toMs(timing.duration)).toBe(toMs(await cssVar(page, "--duration-fast")));

    await button.hover();
    await expect.poll(() => shiftOf(arrow)).toBe(nudge);
    await page.mouse.move(0, 0);
    await expect.poll(() => shiftOf(arrow)).toBe(0);
  });

  test("touch screen: the arrow never moves, hovered or tapped", async ({ harness }) => {
    const { page, button, arrow } = await openStory(await harness.context(phone, { reducedMotion: "no-preference" }));
    expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(false);
    await button.hover();
    await page.waitForTimeout(400);
    expect(await shiftOf(arrow)).toBe(0);
    await page.route("https://store.kheelona.com/**", (route) => route.abort()); // a tap follows the link; stay put
    await button.dispatchEvent("touchstart");
    await page.waitForTimeout(400);
    expect(await shiftOf(arrow)).toBe(0);
  });

  test("reduced motion: no nudge and no transition, even with a fine pointer", async ({ harness }) => {
    const { page, button, arrow } = await openStory(await harness.context(laptop, { reducedMotion: "reduce" }));
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
    expect(await arrow.evaluate((el) => getComputedStyle(el).transitionDuration)).toBe("0s");
    await button.hover();
    await page.waitForTimeout(400);
    expect(await shiftOf(arrow)).toBe(0);
  });
});
