import type { BrowserContext, Page } from "@playwright/test";
import { expect, requiresServer, test, type OpenOptions } from "./support/fixtures";
import { builtUrl } from "./support/routes";
import { VIEWPORTS, type Viewport } from "./support/viewports";

/* Landing on a part of a page (task 7.1a; CMO built-page review A, M1 and M2; review C, m8; QA-005, 2026-10-14).
 *
 *   - M1: a page opened at a #fragment (a direct link, the /faq redirect) jumps there. Smooth scrolling (motion.css,
 *     keyed on <html data-scroll-behavior="smooth">) starts only once the page has loaded, so the browser's own jump to
 *     the fragment never glides through ten thousand pixels of half-revealed blocks; an in-page link still glides
 *     afterwards (the mockup's anchor scrolling), and Next 16 still reads the attribute to jump on route changes.
 *   - M2: Home's "See all questions" (a client navigation to /products/kheelu#faq) lands at the questions' heading,
 *     with motion on and reduced, on a phone and a laptop. It stopped 464 px (phone) or 394 px (laptop) past it: the
 *     product details tabs collapsed after Next had scrolled.
 *   - m8: every trust item links to the part of its terms page it promises (returns, the warranty, paying, when and
 *     where deliveries go), and that part exists on the page.
 *   - QA-005: the footer's "Grievance officer" opens the grievance officer's block on /contact.
 */

requiresServer();

const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;
const PRODUCT_FAQ = "/products/kheelu#faq";

/** Records the page's scroll position on every frame from before its first script (an init script). */
function recordScroll(): void {
  const log: number[] = [];
  (window as unknown as { __khScroll: number[] }).__khScroll = log;
  const tick = () => {
    log.push(Math.round(window.scrollY));
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** The scroll positions recorded so far, each run of equal frames once. */
async function positions(page: Page): Promise<number[]> {
  const log = await page.evaluate(() => (window as unknown as { __khScroll: number[] }).__khScroll);
  return log.filter((y, i) => i === 0 || y !== log[i - 1]);
}

/** The positions a scroll passed through on its way between its first and its last (from 5 to 90 percent of the
 *  way): a glide shows a frame at nearly every row; a jump none (the browser's own adjustments, such as scroll anchoring
 *  when a block above changes height, land near the end). */
function glided(path: readonly number[]): number[] {
  if (path.length < 2) return [];
  const from = path[0];
  const to = path[path.length - 1];
  const span = to - from;
  return path.filter((y) => {
    const done = (y - from) / span;
    return done > 0.05 && done < 0.9;
  });
}

/** Waits until the scroll position has held for half a second. */
async function settled(page: Page): Promise<void> {
  await page.waitForFunction(
    () => {
      const w = window as unknown as { __khScroll: number[] };
      const log = w.__khScroll;
      const now = Math.round(window.scrollY);
      return log.length > 30 && log.slice(-30).every((y) => y === now);
    },
    undefined,
    { timeout: 10_000 },
  );
}

/** Where an element's top sits in the view, in whole pixels. */
const topOf = (page: Page, selector: string) => page.locator(selector).evaluate((el) => Math.round(el.getBoundingClientRect().top));

/** The harness entry this spec uses (support/fixtures.ts). */
type Harness = { context(vp: Viewport, opts?: OpenOptions): Promise<BrowserContext> };

/** Opens a marketing path with the scroll recorder installed. */
async function openAt(harness: Harness, vp: Viewport, path: string, reducedMotion: "reduce" | "no-preference"): Promise<Page> {
  const context = await harness.context(vp, { reducedMotion });
  await context.addInitScript(recordScroll);
  const page = await context.newPage();
  await page.goto(builtUrl({ host: "marketing", path }), { waitUntil: "load" });
  return page;
}

test.describe("anchors: a page opened at a fragment (M1)", () => {
  for (const path of [PRODUCT_FAQ, "/faq"]) {
    test(`${path} jumps to the questions with motion on, then in-page links glide`, async ({ harness }) => {
      const page = await openAt(harness, phone, path, "no-preference");
      await settled(page);
      expect(new URL(page.url()).hash).toBe("#faq");
      expect(glided(await positions(page)), "the landing glided").toEqual([]);
      // A glide also ended 464 px past the heading: it aimed where the questions were before the details tabs collapsed.
      expect(Math.abs(await topOf(page, "#faq")), "the questions' heading sits at the top of the screen").toBeLessThanOrEqual(2);
      // Loaded: the mockup's smooth anchor scrolling is on, and an in-page link glides.
      await expect.poll(() => page.evaluate(() => document.documentElement.dataset.scrollBehavior ?? null)).toBe("smooth");
      expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("smooth");
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await settled(page);
      const before = (await positions(page)).length;
      // scrollIntoView() with no behaviour follows the page's scroll-behavior, as an in-page link does.
      await page.locator("#faq").evaluate((el) => el.scrollIntoView());
      // The glide starts on the next frame: wait for it to arrive before waiting for it to stop.
      await page.waitForFunction(() => Math.abs(document.getElementById("faq")!.getBoundingClientRect().top) <= 2, undefined, { timeout: 10_000 });
      await settled(page);
      // At least one frame on the way (the browser times the glide, so a busy machine shows fewer frames, never none).
      expect(glided((await positions(page)).slice(before)).length, "an in-page scroll glides").toBeGreaterThan(0);
      expect(Math.abs(await topOf(page, "#faq"))).toBeLessThanOrEqual(2);
    });
  }

  test("with reduced motion it jumps, and in-page links jump too", async ({ harness }) => {
    const page = await openAt(harness, phone, PRODUCT_FAQ, "reduce");
    await settled(page);
    expect(Math.abs(await topOf(page, "#faq"))).toBeLessThanOrEqual(2);
    expect(glided(await positions(page)), "the landing glided").toEqual([]);
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.scrollBehavior ?? null)).toBe("smooth");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  });

  test("the server's page carries no smooth scrolling: it starts once the page has loaded", async ({ harness }) => {
    const context = await harness.context(phone, { javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(builtUrl({ host: "marketing", path: "/" }), { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.hasAttribute("data-scroll-behavior"))).toBe(false);
  });
});

test.describe("anchors: Home's “See all questions” lands at the questions (M2)", () => {
  for (const vp of [phone, laptop]) {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      test(`${vp.name}, motion ${reducedMotion}`, async ({ harness }) => {
        const page = await openAt(harness, vp, "/", reducedMotion);
        const link = page.locator(`main a[href="${PRODUCT_FAQ}"]`);
        await expect(link).toHaveCount(1);
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await page.waitForURL(`**${PRODUCT_FAQ}`);
        await page.locator("#faq").waitFor();
        await settled(page);
        expect(Math.abs(await topOf(page, "#faq")), "the questions' heading sits at the top of the screen").toBeLessThanOrEqual(2);
      });
    }
  }
});

test.describe("anchors: links that promise a part of a page land on it (m8, QA-005)", () => {
  test("each trust item opens its own part of its terms page, and the part is there", async ({ harness }) => {
    const context = await harness.context(phone);
    const page = await context.newPage();
    await page.goto(builtUrl({ host: "marketing", path: "/" }), { waitUntil: "load" });
    const hrefs = [...new Set(await page.locator(".ks-trust a[href]").evaluateAll((links) => links.map((a) => a.getAttribute("href")!)))].sort();
    // Since task Q2.8 and its review (D065 item 3; the D2C plan v2 §1.1) Home's trust lines are the risk-reversal line,
    // the delivery line and the offer card's third row; the returns and delivery-included items are the store's full
    // row's (trust.test.ts holds every item's part on its legal page).
    expect(hrefs).toEqual(["/refund#before-dispatch", "/refund#faulty", "/shipping#when", "/terms#payment"]);
    for (const href of hrefs) {
      const [path, id] = href.split("#");
      await page.goto(builtUrl({ host: "marketing", path }), { waitUntil: "load" });
      await expect(page.locator(`[id="${id}"]`), href).toHaveCount(1);
    }
  });

  test("the footer's “Grievance officer” opens the grievance officer's block on /contact", async ({ harness }) => {
    const context = await harness.context(phone);
    const page = await context.newPage();
    await page.goto(builtUrl({ host: "marketing", path: "/" }), { waitUntil: "load" });
    const link = page.locator(".kh-footer__legal a", { hasText: "Grievance officer" });
    await expect(link).toHaveAttribute("href", "/contact#grievance");
    await page.goto(builtUrl({ host: "marketing", path: "/contact" }), { waitUntil: "load" });
    await expect(page.locator("#grievance")).toHaveCount(1);
  });
});
