import type { Page } from "@playwright/test";
import { describeFindings, runAxe } from "./support/axe";
import { PARITY_TARGET } from "./support/env";
import { expect, forceMotionEnd, gateRouteGroup, settle, test } from "./support/fixtures";
import { sweepRoutes, type Route } from "./support/routes";
import { AXE_TEMPLATE_EXTRA, AXE_VIEWPORTS, type Viewport } from "./support/viewports";

/* Accessibility (task 1.1; architecture §13 and §16.2, test plan §4.5 and §4.6, tasks.md SPA 3).
 *
 * axe-core 4.12.1 (the baseline's engine), WCAG 2.0, 2.1 and 2.2 A and AA plus best practice, on
 * every built route at 360, 390, 1440 and 1920 (templates also 412), with reveals forced, doodles
 * drawn, reduced motion on and a 1.5 s settle (axe skips opacity 0). States, in this order:
 *   the page as loaded;
 *   the phone drawer open;
 *   the first FAQ answer open;
 *   a film playing (its play button clicked, the <video> mounted);
 *   the sticky bar shown (scrolled until it shows; phones only, the DS hides it from 900 px);
 *   on the store: the form submitted empty, with its errors showing (/api/ is blocked first, so
 *     nothing can be ordered); on /thanks this is the address form;
 * and the page as loaded once more with reduced motion off, at 390.
 * Zero critical or serious violations, apart from the classified exceptions (support/axe.ts),
 * which are printed on every run. A state whose element is absent is printed as not exercised,
 * never skipped silently.
 *
 * Companion check (architecture §16.2, test plan §4.6): every visible text field in <main> has a
 * computed font size of at least 16 px, or iOS zooms the page when it is focused. It runs on every
 * route; a store route with no field prints as pending.
 *
 * Planted violations prove each state red (KH_E2E_PLANT, support/fixtures.ts): smallinput, buybar,
 * film, formerrors, motionon.
 */

/** The DS sticky bar is for screens narrower than 900 px (mockup/mockup.css:87). */
const BUYBAR_MAX_WIDTH = 900;

async function check(page: Page, label: string): Promise<void> {
  await page.waitForTimeout(1500);
  const r = await runAxe(page);
  if (r.accepted.length) console.log(`[axe] ${label}: accepted exceptions\n${describeFindings(r.accepted)}`);
  if (r.apart.length) console.log(`[axe] ${label}: white on Kheelu Blue, printed apart until the founder rules\n${describeFindings(r.apart)}`);
  if (r.minor.length) console.log(`[axe] ${label}: moderate or minor\n${describeFindings(r.minor)}`);
  expect(r.blocking, `${label}: critical or serious axe violations\n${describeFindings(r.blocking)}`).toEqual([]);
}

/** Prints (and annotates) the states this test could not exercise, with the reason for each. */
function reportNotExercised(label: string, notes: string[]): void {
  if (!notes.length) return;
  console.log(`[axe] ${label}: not exercised here:\n  ${notes.join("\n  ")}`);
  for (const n of notes) test.info().annotations.push({ type: "pending", description: `${label}: ${n}` });
}

/** Visible text fields in <main>: how many, and those under 16 px. */
async function smallTextFields(page: Page): Promise<{ checked: number; small: string[] }> {
  return page.evaluate(() => {
    const notText = /^(?:checkbox|radio|hidden|submit|button|reset|image|range|color|file)$/i;
    const small: string[] = [];
    let checked = 0;
    for (const el of Array.from(document.querySelectorAll<HTMLElement>("main input, main select, main textarea"))) {
      if (el instanceof HTMLInputElement && notText.test(el.type)) continue;
      const box = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (box.width <= 1 || box.height <= 1 || cs.visibility !== "visible") continue;
      checked++;
      if (parseFloat(cs.fontSize) < 16) {
        const name = el.getAttribute("name");
        small.push(`${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}${name ? `[name="${name}"]` : ""}: ${cs.fontSize}`);
      }
    }
    return { checked, small };
  });
}

async function checkTextFieldSizes(page: Page, route: Route, label: string, notes: string[]): Promise<void> {
  const { checked, small } = await smallTextFields(page);
  if (!checked && route.template === "store") notes.push("text fields at 16 px or more: pending, no text field in <main> yet");
  expect(small, `${label}: text fields under 16 px (iOS zooms the page on focus; architecture §16.2)\n${small.join("\n")}`).toEqual([]);
}

/** Scrolls down until the sticky bar shows; false if it never does. */
async function showStickyBar(page: Page): Promise<boolean> {
  const shown = () =>
    page.evaluate(() => {
      if (document.documentElement.dataset.buybar === "shown") return true;
      const bar = document.querySelector(".kh-buybar:not(.is-hidden)");
      if (!bar) return false;
      const box = bar.getBoundingClientRect();
      const cs = getComputedStyle(bar);
      return box.width > 0 && box.height > 0 && cs.display !== "none" && cs.visibility === "visible" && box.top < window.innerHeight;
    });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round((page.viewportSize()?.height ?? 800) / 2);
  for (let y = 0; y <= height; y += step) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(150);
    if (await shown()) return true;
  }
  return false;
}

/** The store form submitted empty: its errors are checked. Returns a note when not exercised. */
async function checkFormWithErrors(page: Page, route: Route, label: string): Promise<string | null> {
  const name = route.path === "/thanks" ? "/thanks address form with errors" : "store form with errors";
  const form = page.locator("main form").first();
  if (!(await form.count())) {
    return route.path === "/thanks"
      ? `${name}: pending, the address form needs a stubbed paid session (task 5.16)`
      : `${name}: pending, no form in <main> (the store renders it only with a store environment)`;
  }
  const submit = form.locator('button[type="submit"], input[type="submit"]').first();
  if (!(await submit.count())) return `${name}: pending, the form has no submit button`;
  // An empty form never reaches the server; blocking /api/ makes sure nothing can be ordered.
  await page.route("**/api/**", (r) => r.abort("blockedbyclient"));
  const before = page.url();
  await submit.scrollIntoViewIfNeeded();
  await submit.click();
  await page.waitForTimeout(500);
  if (page.url() !== before) {
    if (PARITY_TARGET === "mockup") return `${name}: self-test, the mockup's form has no validators (it navigated)`;
    expect(page.url(), `${label}: submitting the empty form left the page instead of showing its errors`).toBe(before);
  }
  const errors = page.locator('main [aria-invalid="true"], main [role="alert"], main .kh-field--error');
  await errors.first().waitFor({ state: "attached", timeout: 3000 }).catch(() => undefined);
  expect(await errors.count(), `${label}: submitting the empty form showed no error`).toBeGreaterThan(0);
  await check(page, `${label} ${name}`);
  return null;
}

async function exerciseStates(page: Page, route: Route, vp: Viewport, label: string): Promise<void> {
  const notes: string[] = [];
  await checkTextFieldSizes(page, route, label, notes);

  const menu = page.locator("[data-open-menu], button[aria-controls][aria-expanded]").first();
  if (vp.isMobile && (await menu.isVisible().catch(() => false))) {
    await menu.click();
    await check(page, `${label} drawer open`);
    await page.keyboard.press("Escape");
  } else if (vp.isMobile && route.chrome) {
    notes.push("drawer open: no visible menu button");
  }

  const faq = page.locator("main details > summary").first();
  if (await faq.count()) {
    await faq.scrollIntoViewIfNeeded();
    await faq.click();
    await check(page, `${label} FAQ open`);
  } else {
    notes.push("FAQ open: no FAQ on this page");
  }

  const play = page.locator('main button[aria-label^="Play:"]').first();
  if (await play.count()) {
    await play.scrollIntoViewIfNeeded();
    await play.click();
    await page.locator("main video").first().waitFor({ state: "attached", timeout: 5000 });
    await check(page, `${label} film playing`);
  } else {
    notes.push("film playing: no film on this page");
  }

  if (route.buybar && vp.width < BUYBAR_MAX_WIDTH) {
    if (!(await page.locator(".kh-buybar").count())) notes.push("sticky bar shown: pending, no .kh-buybar on this page yet");
    else if (await showStickyBar(page)) await check(page, `${label} sticky bar shown`);
    else notes.push("sticky bar shown: pending, the bar never showed while scrolling to the end");
  }

  if (route.template === "store") {
    const note = await checkFormWithErrors(page, route, label);
    if (note) notes.push(note);
  }

  reportNotExercised(label, notes);
}

/** Reduced motion off: one pass at 390, the loaded page (test plan §4.5, "reduced motion on and off"). */
const MOTION_ON_VIEWPORT = AXE_VIEWPORTS.find((v) => v.width === 390) ?? AXE_VIEWPORTS[0];

for (const route of sweepRoutes()) {
  const viewports = route.template === "article" || route.template === "legal" ? [...AXE_VIEWPORTS, AXE_TEMPLATE_EXTRA] : AXE_VIEWPORTS;
  test.describe(`axe: ${route.id}`, () => {
    gateRouteGroup(route);

    for (const vp of viewports) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        await forceMotionEnd(page);
        await settle(page);
        const label = `${route.id} ${vp.name}`;
        await check(page, label);
        await exerciseStates(page, route, vp, label);
      });
    }

    test(`motion on, ${MOTION_ON_VIEWPORT.name}`, async ({ harness }) => {
      const { page } = await harness.open(route, MOTION_ON_VIEWPORT, { reducedMotion: "no-preference" });
      await forceMotionEnd(page);
      await settle(page);
      await check(page, `${route.id} ${MOTION_ON_VIEWPORT.name} motion on`);
    });
  });
}

test.describe("axe: store tier pages (/e/<tier>, /ideabaaz)", () => {
  test("form, text field sizes and errors", () => {
    test.skip(
      true,
      "pending: /e/<tier> and /ideabaaz render their form only with a store environment and a signed tier " +
        "(D051: none locally or on beta); add them to this sweep when the store restyle (5.15) provides a stub",
    );
  });
});
