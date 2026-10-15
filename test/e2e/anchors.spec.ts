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
 *   - M2: a client navigation from Home to a part of the product page lands on it, with motion on and reduced, on a
 *     phone and a laptop. Home's "See all questions" (to /products/kheelu#faq) stopped 464 px (phone) or 394 px
 *     (laptop) past the questions' heading: the product details tabs collapsed after Next had scrolled. Since task Q2.9
 *     Home has no "See all questions" (`faq-more` stops firing on Home: the D2C plan v2 §2 fold 10, ruling 1), so the
 *     check follows Home's one remaining link into a part of the product page: the sticky scroll's "See how it works"
 *     (`home-asks-learn`, to /products/kheelu#modes). On a laptop the part lands just below the nav, which sticks from
 *     900 px (task Q2.5; the page's scroll padding is the bar's height); on a phone, at the top. The check still crosses
 *     a collapsing tabs box (task Q2.13): the sample chats' DS Tabs (task Q2.10) sit above #modes and collapse to one
 *     panel once the page's script runs, after Next has scrolled, as the details tabs did above the questions.
 *   - m8: every trust item links to the part of its terms page it promises (returns, the warranty, paying, when and
 *     where deliveries go), and that part exists on the page.
 *   - QA-005: the footer's "Grievance officer" opens the grievance officer's block on /contact.
 */

requiresServer();

const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;
const PRODUCT_FAQ = "/products/kheelu#faq";
/** Home's link into a part of the product page (M2): the sticky scroll's "See how it works" (task Q2.9). */
const HOME_TO_MODES = { cta: "home-asks-learn", href: "/products/kheelu#modes", id: "modes" } as const;

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

test.describe("anchors: Home's “See how it works” lands at the product page's modes (M2)", () => {
  for (const vp of [phone, laptop]) {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      test(`${vp.name}, motion ${reducedMotion}`, async ({ harness }) => {
        const page = await openAt(harness, vp, "/", reducedMotion);
        const link = page.locator(`main a[data-ph-capture-attribute-cta="${HOME_TO_MODES.cta}"]`);
        await expect(link).toHaveCount(1);
        await expect(link).toHaveAttribute("href", HOME_TO_MODES.href);
        // Home no longer links to the product page's questions (task Q2.9; plan §2 fold 10).
        await expect(page.locator(`main a[href="${PRODUCT_FAQ}"]`)).toHaveCount(0);
        await link.scrollIntoViewIfNeeded();
        await link.click();
        await page.waitForURL(`**${HOME_TO_MODES.href}`);
        await page.locator(`#${HOME_TO_MODES.id}`).waitFor();
        await settled(page);
        const bar = vp.width >= 900 ? await page.locator("nav.kh-nav").evaluate((n) => Math.round(n.getBoundingClientRect().bottom)) : 0;
        expect(Math.abs((await topOf(page, `#${HOME_TO_MODES.id}`)) - bar), "the modes sit at the top of the screen, below the sticky nav on a laptop").toBeLessThanOrEqual(2);
        // The landing crossed a tabs box that collapsed on the way (task Q2.13): the sample chats' tabs, above #modes,
        // enhanced to one shown panel (enhance-tabs.ts: `is-tabs`, the others `hidden`). Were they to move below the part,
        // this case would stop proving M2, and a case reaching a fragment below a tabs box would have to replace it.
        const crossed = await page.evaluate((id) => {
          const target = document.getElementById(id)!;
          return Array.from(document.querySelectorAll(".kh-tabs[data-tabs]"))
            .filter((box) => box.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)
            .map((box) => ({
              fold: box.closest("section")?.getAttribute("aria-labelledby") ?? null,
              tabs: box.classList.contains("is-tabs"),
              shown: box.querySelectorAll(":scope > .kh-tabs__panel:not([hidden])").length,
            }));
        }, HOME_TO_MODES.id);
        expect(crossed, "a collapsing tabs box sits above the part the link lands on").toEqual([{ fold: "example-title", tabs: true, shown: 1 }]);
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
