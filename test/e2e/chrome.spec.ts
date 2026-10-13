import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { expect, hideForParity, motionStarted, requiresServer, test, type OpenOptions } from "./support/fixtures";
import { ORIGINS, REAL_ORIGINS, STORYBOOK_PORT, TARGET } from "./support/env";
import { CHUNK_MAX_DIFF_RATIO } from "./support/parity";
import { builtUrl } from "./support/routes";
import { APPROVED_WIDTHS, VIEWPORTS, type Viewport } from "./support/viewports";

/* The chrome on a built route (task 3.1; tasks.md 3.1 "Test", architecture §5.2, §5.3, §11.2 rows 4, 5 and D050, §13).
 *
 * The chrome is the shells', so it runs on any built marketing route: "/" here, the new Home since wave 5 (5.1; the
 * gate of the page specs is not used: the chrome is new on every route). The store's chrome runs on the store host's
 * own route.
 *
 *   - Element pixel parity (the first pixel proof of the visual layer): the nav, the footer, the open drawer's panel
 *     and the shown buy bar against the same elements of mockup/home.html at the approved widths (the drawer and the
 *     bar at the two phone widths, where they exist), and the store header and footer against mockup/store.html. The
 *     mockup's element screenshot is the golden (git-ignored, D039); at most 2 percent of pixels may differ, as SPA 1.
 *   - Sticky bar (G-09, pick 4): hidden while the hero CTA is on screen, shown past it, aside while an inline chilli
 *     button is on screen, inert while hidden, data-buybar and --ks-buybar-h on <html>, gone from 900 px, sliding up
 *     with motion on and only fading with reduced motion. The page's own hero CTA (#hero-cta) is on screen at first
 *     paint, so every case scrolls past it before it expects the bar shown (task 4.6: the legacy Home had no hero CTA,
 *     so its bar showed from first paint). For the scroll positions, two screens of space, an inline chilli button
 *     and two more screens are added right after the hero, so each view holds exactly one chilli button whatever the
 *     page has below; the bar watches buttons added after it armed.
 *   - One chilli button per phone view at each of those scroll positions.
 *   - Drawer keyboard path (pick 5): the skip link first, then the logo and the menu button; Enter opens the modal
 *     dialog with focus inside, Tab stays inside, Escape closes it and returns focus; the backdrop closes it; the
 *     panel slides with motion on and not with reduced motion.
 *   - WhatsApp bubble (D050): the D050 link; at 360 x 590 never over the bar, a price, a form field or the pay button
 *     on the first screen or at the end of the page (where the store page renders its bubble too), nor the footer's
 *     lines; lifts by the bar's height while the bar shows and drops when it steps aside; hidden with the drawer open;
 *     its laptop label on hover and focus; reached by keyboard after the page content; nothing moves with reduced
 *     motion. On a phone it steps aside: from the store's form (task 4.7), and from the prices of Home and the product
 *     page, lifted or not, and the paid /thanks address step (task 4.9); each swept top to bottom at every phone size.
 *   - The layouts as served: lang, the smooth-scroll hook, the body classes, the three font preloads, the mockup's
 *     viewport with viewport-fit=cover (the safe areas) on both hosts, noindex, nofollow on beta and no robots meta
 *     elsewhere; the store layout noindex, its policy links on the marketing site of the target.
 *
 * KH_E2E_TARGET=beta (task 7.2) runs the same cases on the two beta hosts: the robots and policy-link cases read the
 * target (support/env.ts).
 */

type Built = { host: "marketing" | "store"; path: string };
const HOME: Built = { host: "marketing", path: "/" };
const STORE: Built = { host: "store", path: "/" };
const phone390 = VIEWPORTS.find((v) => v.width === 390)!;
const phone360short = VIEWPORTS.find((v) => v.width === 360 && v.height === 590)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;
const SITE_TEXT = "Hi Kheelona! I have a question about Kheelu.";

requiresServer();

/** The two harness entries this spec uses (support/fixtures.ts). */
type Harness = {
  context(vp: Viewport, opts?: OpenOptions): Promise<BrowserContext>;
  openMockup(slug: "home" | "store", vp: Viewport, opts?: OpenOptions): Promise<{ page: Page; context: BrowserContext }>;
};

/** Opens a built route in a guarded context and waits until the shell's islands have armed (data-buybar is set on
 *  every page that carries the bar, at every width). */
async function openBuilt(harness: Harness, vp: Viewport, opts: OpenOptions = {}, route: Built = HOME): Promise<Page> {
  const context = await harness.context(vp, opts);
  const page = await context.newPage();
  await page.goto(builtUrl(route), { waitUntil: "load" });
  await page.waitForFunction(() => !document.querySelector(".kh-buybar") || document.documentElement.dataset.buybar !== undefined);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

async function openMockup(harness: Harness, slug: "home" | "store", vp: Viewport): Promise<Page> {
  const { page } = await harness.openMockup(slug, vp);
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  await hideForParity(page);
  return page;
}

/** An element's screenshot, scrolled into view, motion off. */
async function shot(page: Page, selector: string): Promise<Buffer> {
  const el = page.locator(selector).first();
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  return el.screenshot({ animations: "disabled", caret: "hide", scale: "css" });
}

/** The mockup's screenshot becomes the golden; the build's is compared with it (never the reverse, see -u). */
function compare(testInfo: TestInfo, name: string, golden: Buffer, built: Buffer): void {
  expect(
    ["all", "changed"].includes(testInfo.config.updateSnapshots),
    "chrome parity never updates snapshots: the mockup is the golden. Run without -u / --update-snapshots.",
  ).toBe(false);
  const file = testInfo.snapshotPath(name, { kind: "snapshot" });
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, golden);
  expect.soft(built, name).toMatchSnapshot(name, { maxDiffPixelRatio: CHUNK_MAX_DIFF_RATIO });
}

/** The footer follows <main>, whose content differs (the build's is still legacy) and whose height may end on a
 *  fraction of a pixel, which shifts the footer's screenshot by one pixel row. Without <main> the footer sits right
 *  under the header in both pages, so its own pixels are what is compared. */
const WITHOUT_MAIN = "main { display: none !important; }";

/** Makes the bar show in both pages for its screenshot (the mockup ships it hidden until its hero CTA leaves). */
const SHOW_BAR = ".kh-buybar.is-hidden { opacity: 1 !important; transform: none !important; }";

/** What the bar and the bubble say about themselves. */
function barState(page: Page) {
  return page.evaluate(() => {
    const bar = document.querySelector<HTMLElement>(".kh-buybar");
    const root = document.documentElement;
    return {
      published: root.dataset.buybar ?? null,
      height: root.style.getPropertyValue("--ks-buybar-h"),
      barHeight: bar?.offsetHeight ?? null,
      hidden: bar?.classList.contains("is-hidden") ?? null,
      inert: bar?.hasAttribute("inert") ?? null,
      display: bar ? getComputedStyle(bar).display : null,
    };
  });
}

/** Chilli buttons a visitor can see in the current view (opacity and visibility included, closed dialogs out). */
function visibleChilliButtons(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>(".kh-btn--cta")).filter((el) => {
      if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
    }).length,
  );
}

/** Adds, right after the fold that holds the page's own hero CTA (#hero-cta), two screens of space, an inline chilli
 *  button and two more screens of space, so each position below has exactly one chilli button in view whatever the
 *  page holds further down. Returns the scroll positions: the hero CTA on screen (the top), past it, the inline
 *  button on screen, past that. The legacy Home had no hero CTA, so this used to plant one too (task 4.6). */
async function plantInlineAfterHero(page: Page): Promise<{ top: number; between: number; inline: number; after: number }> {
  return page.evaluate(() => {
    const hero = document.getElementById("hero-cta");
    if (!hero) throw new Error("the page has no #hero-cta");
    const main = document.querySelector("main")!;
    const fold = Array.from(main.children).find((c) => c.contains(hero));
    if (!fold) throw new Error("#hero-cta is not inside <main>");
    const vh = innerHeight;
    const inline = document.createElement("a");
    inline.className = "kh-btn kh-btn--cta";
    inline.href = "#";
    inline.textContent = "Planted";
    const space = () => {
      const d = document.createElement("div");
      d.style.height = `${vh * 2}px`;
      return d;
    };
    const first = space();
    fold.after(first, inline, space());
    const top = (el: Element) => el.getBoundingClientRect().top + scrollY;
    return {
      top: 0,
      between: top(first) + vh / 2,
      inline: top(inline) - vh / 2,
      after: top(inline) + vh,
    };
  });
}

/** Scrolls until the page's own hero CTA has just left the top of the view: the bar shows once it has (G-09). */
async function scrollPastHero(page: Page): Promise<void> {
  const y = await page.locator("#hero-cta").evaluate((el) => Math.ceil(el.getBoundingClientRect().bottom + scrollY) + 1);
  await scrollToY(page, y);
}

/** The key that moves focus to the next link: Tab, except in WebKit, where Tab reaches only form controls unless the
 *  visitor turns on full keyboard access, and Option-Tab (Alt+Tab) reaches every link, as in Safari. */
function tab(page: Page, back = false): string {
  const webkit = page.context().browser()?.browserType().name() === "webkit";
  return `${webkit ? "Alt+" : ""}${back ? "Shift+" : ""}Tab`;
}

async function scrollToY(page: Page, y: number): Promise<void> {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
}

/* ── Element parity with the mockup ─────────────────────────────────────────────────────────────────────────── */

test.describe("chrome: element parity with mockup/home.html", () => {
  for (const vp of APPROVED_WIDTHS) {
    test(`nav and footer ${vp.name}`, async ({ harness }, testInfo) => {
      const ref = await openMockup(harness, "home", vp);
      const page = await openBuilt(harness, vp);
      await hideForParity(page);
      compare(testInfo, `chrome-nav-${vp.name}.png`, await shot(ref, "nav.kh-nav"), await shot(page, "nav.kh-nav"));
      for (const p of [ref, page]) await p.addStyleTag({ content: WITHOUT_MAIN });
      compare(testInfo, `chrome-footer-${vp.name}.png`, await shot(ref, "footer.kh-footer"), await shot(page, "footer.kh-footer"));
    });

    if (!vp.isMobile) continue;

    test(`open drawer and shown buy bar ${vp.name}`, async ({ harness }, testInfo) => {
      const ref = await openMockup(harness, "home", vp);
      const page = await openBuilt(harness, vp);
      await hideForParity(page);
      for (const p of [ref, page]) await p.addStyleTag({ content: SHOW_BAR });
      compare(testInfo, `chrome-buybar-${vp.name}.png`, await shot(ref, ".kh-buybar"), await shot(page, ".kh-buybar"));

      await ref.locator("[data-open-menu]").click();
      await page.locator(".kh-nav__menu").click();
      for (const p of [ref, page]) await expect(p.locator("dialog.kh-drawer")).toHaveAttribute("open", "");
      compare(testInfo, `chrome-drawer-${vp.name}.png`, await shot(ref, ".kh-drawer__panel"), await shot(page, ".kh-drawer__panel"));
    });
  }
});

test.describe("chrome: store header and footer parity with mockup/store.html", () => {
  for (const vp of APPROVED_WIDTHS) {
    test(`store chrome ${vp.name}`, async ({ harness }, testInfo) => {
      const ref = await openMockup(harness, "store", vp);
      // Approved deviation V1 (wiki/qa/deviations.md): the payments line and its chargeback link render as the last
      // line of the store page's main (task 5.15), not in the footer, because the never-edited store-layout contract
      // lists five policy links and refund#chargeback would be a sixth. So the footer golden leaves it out.
      await ref.evaluate(() => {
        Array.from(document.querySelectorAll(".mk-store-foot p.kh-body-s"))
          .find((p) => /Payments by Razorpay/.test(p.textContent ?? ""))
          ?.remove();
      });
      const page = await openBuilt(harness, vp, {}, STORE);
      await hideForParity(page);
      compare(testInfo, `chrome-store-header-${vp.name}.png`, await shot(ref, "header.mk-store-head"), await shot(page, "header.ks-store-head"));
      for (const p of [ref, page]) await p.addStyleTag({ content: WITHOUT_MAIN });
      compare(testInfo, `chrome-store-footer-${vp.name}.png`, await shot(ref, "footer.mk-store-foot"), await shot(page, "footer.ks-store-foot"));
    });
  }
});

/* ── Sticky bar ────────────────────────────────────────────────────────────────────────────────────────────────── */

test.describe("chrome: sticky bar", () => {
  for (const vp of [phone390, phone360short]) {
    test(`state at each scroll position, one chilli button per view ${vp.name}`, async ({ harness }) => {
      const page = await openBuilt(harness, vp);
      // Home's own hero CTA is on screen at first paint: the bar waits, hidden and inert, with its height published.
      await expect.poll(async () => (await barState(page)).published).toBe("hidden");
      expect(await barState(page)).toMatchObject({ published: "hidden", hidden: true, inert: true });
      const s0 = await barState(page);
      expect(s0.height).toBe(`${s0.barHeight}px`);
      expect(s0.barHeight).toBeGreaterThan(0);
      expect(await visibleChilliButtons(page)).toBe(1);

      // Past the hero CTA it shows, from the real page's first screen below the hero.
      await scrollPastHero(page);
      await expect.poll(async () => (await barState(page)).published, { message: "past #hero-cta" }).toBe("shown");
      await scrollToY(page, 0);
      await expect.poll(async () => (await barState(page)).published, { message: "the hero CTA on screen again" }).toBe("hidden");

      const at = await plantInlineAfterHero(page);
      const expectations: Array<[string, number, string]> = [
        ["the hero CTA on screen", at.top, "hidden"],
        ["past the hero, no inline button", at.between, "shown"],
        ["an inline chilli button on screen", at.inline, "aside"],
        ["past the inline button", at.after, "shown"],
        ["back at the top", at.top, "hidden"],
      ];
      for (const [where, y, published] of expectations) {
        await scrollToY(page, y);
        await expect.poll(async () => (await barState(page)).published, { message: where }).toBe(published);
        await page.waitForTimeout(300); // the bar's fade (--duration-base) ends before anything is counted
        const s = await barState(page);
        expect(s.hidden, `${where}: is-hidden`).toBe(published !== "shown");
        expect(s.inert, `${where}: inert while hidden`).toBe(published !== "shown");
        expect(await visibleChilliButtons(page), `${where}: one chilli button in view`).toBe(1);
      }
    });
  }

  test("gone from 900 px: no room taken, the bubble never lifted", async ({ harness }) => {
    const page = await openBuilt(harness, laptop);
    expect(await barState(page)).toMatchObject({ published: "hidden", height: "0px", display: "none" });
    const lift = await page.locator(".ks-wa").evaluate((el) => getComputedStyle(el).transform);
    expect(lift).toBe("none");
  });

  test("slides up when it first shows (pick 4); with reduced motion it only fades", async ({ harness }) => {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const page = await openBuilt(harness, phone390, { reducedMotion, recordMotion: true });
      // Home opens with its hero CTA on screen, so the bar first shows once that has left the view.
      await scrollPastHero(page);
      await expect.poll(async () => (await barState(page)).published).toBe("shown");
      await page.waitForTimeout(400);
      const bar = (await motionStarted(page)).filter((m) => m.type === "transition" && /^<div\.kh-buybar/.test(m.target)).map((m) => m.name);
      if (reducedMotion === "no-preference") expect(bar, "motion on: the bar moves up and fades in").toEqual(expect.arrayContaining(["transform", "opacity"]));
      else expect([...new Set(bar)], "reduced motion: a fade, no movement").toEqual(["opacity"]);
    }
  });
});

/* ── Drawer ────────────────────────────────────────────────────────────────────────────────────────────────────── */

test.describe("chrome: drawer", () => {
  test("keyboard path: skip link, logo, menu; Enter opens with focus inside; Tab stays; Escape closes and returns focus", async ({ harness }) => {
    const page = await openBuilt(harness, phone390);
    await page.keyboard.press(tab(page));
    await expect(page.locator(".ks-skip")).toBeFocused();
    expect(await page.locator(".ks-skip").evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
    await page.keyboard.press(tab(page));
    await expect(page.locator("nav.kh-nav .kh-logo-link")).toBeFocused();
    await page.keyboard.press(tab(page));
    const menu = page.locator(".kh-nav__menu");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Enter");
    const dialog = page.locator("dialog.kh-drawer");
    await expect(dialog).toHaveAttribute("open", "");
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    expect(await page.evaluate(() => document.activeElement?.closest("dialog.kh-drawer") !== null)).toBe(true);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press(tab(page));
      expect(await page.evaluate(() => document.activeElement === document.body || document.activeElement?.closest("dialog.kh-drawer") !== null), `Tab ${i + 1} stays in the drawer`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).not.toHaveAttribute("open", "");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  test("the backdrop and the close button close it", async ({ harness }) => {
    const page = await openBuilt(harness, phone390);
    const dialog = page.locator("dialog.kh-drawer");
    await page.locator(".kh-nav__menu").click();
    await page.mouse.click(10, 300); // left of the panel: the dialog itself
    await expect(dialog).not.toHaveAttribute("open", "");
    await page.locator(".kh-nav__menu").click();
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("the panel slides in with motion on and simply appears with reduced motion (pick 5)", async ({ harness }) => {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const page = await openBuilt(harness, phone390, { reducedMotion, recordMotion: true });
      await page.locator(".kh-nav__menu").click();
      await page.waitForTimeout(400);
      const names = (await motionStarted(page)).filter((m) => m.type === "animation").map((m) => m.name);
      if (reducedMotion === "no-preference") expect(names).toContain("ks-drawer-in");
      else expect(names, "reduced motion: no animation").toEqual([]);
    }
  });
});

/* ── WhatsApp bubble ───────────────────────────────────────────────────────────────────────────────────────────── */

/** The bubble's distance from the bottom of the viewport. */
const bubbleGap = (page: Page) => page.locator(".ks-wa").evaluate((el) => innerHeight - el.getBoundingClientRect().bottom);

/** What the bubble must never cover (D050, architecture §5.3): the bar, a price, a form field, the pay button. On
 *  Home the bar and the hero's price sentence match (5.1); the store's form and pay button join with 5.15; the offer
 *  card's split and fine print, which print prices too, with 4.9. */
const NEVER_COVERED = [
  ".kh-buybar",
  ".kh-buybar__price",
  ".ks-price",
  ".ks-store-top__price",
  ".kh-offer__prices",
  ".kh-offer__split",
  ".kh-offer__fine",
  "input:not([type=hidden])",
  "select",
  "textarea",
  "button[type=submit]",
].join(", ");

/** The elements matching `selector` that a visitor can see and that the bubble covers, by tag and class. */
function coveredByBubble(page: Page, selector: string): Promise<string[]> {
  return page.evaluate((sel) => {
    const b = document.querySelector(".ks-wa")!.getBoundingClientRect();
    return Array.from(document.querySelectorAll<HTMLElement>(sel))
      .filter((el) => {
        if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return false;
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1 && r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top;
      })
      .map((el) => `<${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).trim().split(/\s+/).join(".")}` : ""}>`);
  }, selector);
}

test.describe("chrome: WhatsApp bubble (D050)", () => {
  test("is the D050 link, after the page content in the tab order", async ({ harness }) => {
    const page = await openBuilt(harness, phone390);
    const bubble = page.getByRole("link", { name: "Chat with us on WhatsApp" });
    await expect(bubble).toHaveAttribute("href", `https://wa.me/919187546483?text=${encodeURIComponent(SITE_TEXT)}`);
    await expect(bubble).toHaveAttribute("target", "_blank");
    await expect(bubble).toHaveAttribute("rel", "noopener");
    await expect(bubble).toHaveAttribute("data-ph-capture-attribute-cta", "whatsapp-float");
    const order = await page.evaluate(() => {
      const focusable = Array.from(document.querySelectorAll<HTMLElement>("a[href], button")).filter((el) => el.checkVisibility() && !el.closest("[inert], dialog:not([open])"));
      let lastFooterLink = -1;
      focusable.forEach((el, i) => {
        if (el.closest("footer")) lastFooterLink = i;
      });
      return { bubble: focusable.findIndex((el) => el.matches(".ks-wa")), lastFooterLink };
    });
    expect(order.bubble).toBeGreaterThan(order.lastFooterLink);
  });

  test("at 360 x 590 it never covers the bar, a price, a field or the pay button, nor at the end the footer's lines", async ({ harness }) => {
    const page = await openBuilt(harness, phone360short);
    await page.waitForTimeout(300);
    // First screen: Home's hero CTA is on screen, so the bar waits and the bubble rests beside the hero's price.
    expect((await barState(page)).published).toBe("hidden");
    expect(await coveredByBubble(page, NEVER_COVERED), "first screen: bubble over a price, a field or the pay button").toEqual([]);
    // Past the hero CTA the bar shows and the bubble rises above it.
    await scrollPastHero(page);
    await expect.poll(async () => (await barState(page)).published).toBe("shown");
    await page.waitForTimeout(300);
    expect(await coveredByBubble(page, ".kh-buybar"), "the bar is there to be checked").toEqual([]);
    expect(await coveredByBubble(page, NEVER_COVERED), "past the hero: bubble over the bar, a price, a field or the pay button").toEqual([]);
    await scrollToY(page, 1e7);
    await page.waitForTimeout(300);
    expect(await coveredByBubble(page, NEVER_COVERED), "end of the page: bubble over the bar, a price, a field or the pay button").toEqual([]);
    expect(await coveredByBubble(page, ".kh-footer__legal span, .kh-footer__legal a, .kh-footer__col a, .kh-footer p"), "bubble over the footer").toEqual([]);
  });

  test("the cover check sees a price, a field and a pay button placed under the bubble (it is not vacuous)", async ({ harness }) => {
    // A page with no price and no bar (/privacy): the bubble never arms its step aside (task 4.9; it arms only where its
    // context's regions exist at mount) and never lifts, so it holds still under the plant. On Home the bar shows a few
    // milliseconds after a jump, which lifts the bubble and makes it re-read the prices, the planted one included.
    const page = await openBuilt(harness, phone360short, {}, { host: "marketing", path: "/privacy" });
    expect(await page.locator(`${PRICES}, .kh-buybar`).count(), "a page with no price and no bar").toBe(0);
    expect(await bubbleAside(page)).toEqual(AT_REST);
    await page.evaluate(() => {
      const b = document.querySelector(".ks-wa")!.getBoundingClientRect();
      const form = document.createElement("form");
      form.innerHTML = '<p class="ks-price">price</p><input name="planted"><button type="submit">Pay</button>';
      for (const el of Array.from(form.children) as HTMLElement[]) el.style.cssText = `position: fixed; margin: 0; left: ${b.left}px; top: ${b.top}px;`;
      document.querySelector("main")!.append(form);
    });
    expect(await coveredByBubble(page, NEVER_COVERED)).toEqual(expect.arrayContaining(["<p.ks-price>", "<input>", "<button>"]));
  });

  test("on the store at 360 x 590 it never covers a price, a field or the pay button (once the store page renders it)", async ({ harness }) => {
    const page = await openBuilt(harness, phone360short, {}, STORE);
    // Each store page renders its own bubble (D050; StoreShell cannot know its page): the store page's from 5.15.
    test.skip((await page.locator(".ks-wa").count()) === 0, "the store page renders its WhatsApp bubble from task 5.15");
    expect(await coveredByBubble(page, NEVER_COVERED), "first screen").toEqual([]);
    await scrollToY(page, 1e7);
    await page.waitForTimeout(300);
    expect(await coveredByBubble(page, NEVER_COVERED), "end of the page").toEqual([]);
  });

  test("lifts by the bar's height while the bar shows and drops when it steps aside (motion on)", async ({ harness }) => {
    const page = await openBuilt(harness, phone390, { reducedMotion: "no-preference" });
    const at = await plantInlineAfterHero(page);
    const settle = () => page.waitForTimeout(400);
    await scrollToY(page, at.between);
    await expect.poll(async () => (await barState(page)).published).toBe("shown");
    await settle();
    const barHeight = (await barState(page)).barHeight!;
    expect(await bubbleGap(page)).toBeCloseTo(16 + barHeight, 0);
    await scrollToY(page, at.inline);
    await expect.poll(async () => (await barState(page)).published).toBe("aside");
    await settle();
    expect(await bubbleGap(page)).toBeCloseTo(16, 0);
    await scrollToY(page, at.top);
    await expect.poll(async () => (await barState(page)).published).toBe("hidden");
    await settle();
    expect(await bubbleGap(page)).toBeCloseTo(16, 0);
  });

  test("moves nothing with reduced motion, yet still clears the bar", async ({ harness }) => {
    const page = await openBuilt(harness, phone390, { reducedMotion: "reduce", recordMotion: true });
    const at = await plantInlineAfterHero(page);
    for (const [y, state] of [[at.top, "hidden"], [at.between, "shown"], [at.inline, "aside"]] as const) {
      await scrollToY(page, y);
      await expect.poll(async () => (await barState(page)).published).toBe(state);
    }
    await scrollToY(page, at.between);
    await expect.poll(async () => (await barState(page)).published).toBe("shown");
    expect(await bubbleGap(page)).toBeCloseTo(16 + (await barState(page)).barHeight!, 0);
    const bubbleMotion = (await motionStarted(page)).filter((m) => /ks-wa/.test(m.target));
    expect(bubbleMotion).toEqual([]);
  });

  test("is hidden while the drawer is open", async ({ harness }) => {
    const page = await openBuilt(harness, phone390);
    await expect(page.locator(".ks-wa")).toBeVisible();
    await page.locator(".kh-nav__menu").click();
    await expect(page.locator(".ks-wa")).toBeHidden();
    await page.keyboard.press("Escape");
    await expect(page.locator(".ks-wa")).toBeVisible();
  });

  test("shows its label on laptops on hover and keyboard focus, never on phones", async ({ harness }) => {
    const page = await openBuilt(harness, laptop, { reducedMotion: "no-preference" });
    const label = page.locator(".ks-wa__label");
    // The label reads the link's own name, both from content (seller.chat; P13 default, WCAG 2.5.3; task 3.6).
    const name = await page.locator(".ks-wa").getAttribute("aria-label");
    expect(name).toBe("Chat with us on WhatsApp");
    await expect(label).toHaveText(name!);
    expect(await label.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await page.locator(".ks-wa").hover();
    await expect.poll(() => label.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
    await page.mouse.move(10, 10);
    await expect.poll(() => label.evaluate((el) => getComputedStyle(el).opacity)).toBe("0");
    await page.locator(".ks-wa").focus();
    await page.keyboard.press(tab(page, true));
    await page.keyboard.press(tab(page));
    await expect(page.locator(".ks-wa")).toBeFocused();
    await expect.poll(() => label.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");

    const phone = await openBuilt(harness, phone390);
    expect(await phone.locator(".ks-wa__label").evaluate((el) => getComputedStyle(el).display)).toBe("none");
  });
});

/* ── WhatsApp bubble beside the store's form (task 4.7 item 3) ─────────────────────────────────────────────────────

   D050: the bubble never covers a store form field on a phone. Below 900 px it steps aside (fades and slides off the
   right edge, `.is-hidden` and `inert`) while a field of the form's section, #details, has focus or the section crosses
   the bubble's band, and comes back once the section has passed (WhatsAppFloat.client.tsx, motion.css). The case
   above (the store at 360 x 590, first screen and end) stays as it is; these sweep the whole store page at every phone
   size of the audit matrix, and prove the sweep is not vacuous, the focus rule, the motion and the laptop. */

const PHONES = VIEWPORTS.filter((v) => v.group === "phone");

/** What the bubble says about stepping aside: its class, inert, and whether its box has left the screen. */
function bubbleAside(page: Page) {
  return page.locator(".ks-wa").evaluate((el) => ({
    hidden: el.classList.contains("is-hidden"),
    inert: el.hasAttribute("inert"),
    offScreen: el.getBoundingClientRect().left >= innerWidth,
  }));
}
const ASIDE = { hidden: true, inert: true, offScreen: true };
const AT_REST = { hidden: false, inert: false, offScreen: false };

/** What the bubble would cover at its resting place, measured with its step aside switched off for the read. */
function coveredAtRest(page: Page, selector: string): Promise<string[]> {
  return page.evaluate((sel) => {
    const bubble = document.querySelector<HTMLElement>(".ks-wa")!;
    bubble.style.transition = "none";
    bubble.style.transform = "none";
    const b = bubble.getBoundingClientRect();
    bubble.style.transform = "";
    bubble.style.transition = "";
    return Array.from(document.querySelectorAll<HTMLElement>(sel))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return el.checkVisibility() && r.width > 1 && r.height > 1 && r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top;
      })
      .map((el) => `<${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).trim().split(/\s+/).join(".")}` : ""}>`);
  }, selector);
}

/** Scrolls so that the first field of #details sits in the bubble's band: the place where it would cover the field. */
async function scrollFieldIntoBand(page: Page): Promise<void> {
  const y = await page.evaluate(() => {
    const field = document.querySelector("#details input:not([type=hidden])")!.getBoundingClientRect();
    const bubble = document.querySelector(".ks-wa")!.getBoundingClientRect();
    return Math.round(field.top + scrollY - (bubble.top + bubble.height / 2 - field.height / 2));
  });
  await scrollToY(page, y);
}

/** Sweeps the page top to bottom in quarter screens: at each stop the bubble covers nothing of NEVER_COVERED, is aside
 *  in full or at rest, and the page never scrolls sideways (off the right edge it must not widen the page). Returns the
 *  states it met, "aside" and "rest". */
async function sweepBubble(page: Page): Promise<string[]> {
  const { height, step } = await page.evaluate(() => ({ height: document.documentElement.scrollHeight - innerHeight, step: Math.round(innerHeight / 4) }));
  const seen = new Set<string>();
  for (let y = 0; y < height + step; y += step) {
    await scrollToY(page, Math.min(y, height));
    await expect.poll(() => coveredByBubble(page, NEVER_COVERED), `scrolled to ${Math.min(y, height)}`).toEqual([]);
    const state = await bubbleAside(page);
    expect([ASIDE, AT_REST], `scrolled to ${Math.min(y, height)}: aside in full or at rest`).toContainEqual(state);
    seen.add(state.hidden ? "aside" : "rest");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
  return [...seen].sort();
}

test.describe("chrome: WhatsApp bubble beside the store's form (task 4.7; D050)", () => {
  for (const vp of PHONES) {
    test(`on the store it never covers a field, a price or the pay button, top to bottom ${vp.name}`, async ({ harness }) => {
      const page = await openBuilt(harness, vp, {}, STORE);
      // The sweep met both states: aside beside the form, at rest once the form had passed.
      expect(await sweepBubble(page)).toEqual(["aside", "rest"]);
    });
  }

  test("the step aside is not vacuous: at rest the bubble would cover a field of the form (360 x 590)", async ({ harness }) => {
    const page = await openBuilt(harness, phone360short, {}, STORE);
    await scrollFieldIntoBand(page);
    await expect.poll(() => bubbleAside(page)).toEqual(ASIDE);
    expect(await coveredAtRest(page, NEVER_COVERED)).toEqual(expect.arrayContaining([expect.stringMatching(/^<input/)]));
    expect(await coveredByBubble(page, NEVER_COVERED)).toEqual([]);
  });

  test("a field with focus sends it aside, and it returns when focus leaves (390 x 844)", async ({ harness }) => {
    const page = await openBuilt(harness, phone390, {}, STORE);
    // At the end of the page the form has passed: the bubble rests.
    await scrollToY(page, 1e7);
    await expect.poll(() => bubbleAside(page)).toEqual(AT_REST);
    const field = page.locator("#details input:not([type=hidden])").first();
    await field.evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
    await expect.poll(() => bubbleAside(page)).toEqual(ASIDE);
    await field.evaluate((el: HTMLElement) => el.blur());
    await expect.poll(() => bubbleAside(page)).toEqual(AT_REST);
  });

  test("with motion on it fades and slides aside; with reduced motion it leaves and returns without moving there", async ({ harness }) => {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const page = await openBuilt(harness, phone390, { reducedMotion, recordMotion: true }, STORE);
      await scrollToY(page, 1e7);
      await expect.poll(() => bubbleAside(page)).toEqual(AT_REST);
      await scrollFieldIntoBand(page);
      await expect.poll(() => bubbleAside(page)).toEqual(ASIDE);
      await page.waitForTimeout(400);
      const moved = (await motionStarted(page)).filter((m) => m.type === "transition" && /ks-wa/.test(m.target)).map((m) => m.name);
      if (reducedMotion === "no-preference") expect(moved, "motion on").toEqual(expect.arrayContaining(["transform", "opacity"]));
      else expect(moved, "reduced motion: nothing moves").toEqual([]);
    }
  });

  test("from 900 px it keeps its place: never aside beside the form, nor with a field focused (1440 x 900)", async ({ harness }) => {
    const page = await openBuilt(harness, laptop, {}, STORE);
    const { height, step } = await page.evaluate(() => ({ height: document.documentElement.scrollHeight - innerHeight, step: Math.round(innerHeight / 2) }));
    for (let y = 0; y < height + step; y += step) {
      await scrollToY(page, Math.min(y, height));
      await page.waitForTimeout(100);
      expect(await bubbleAside(page), `scrolled to ${Math.min(y, height)}`).toEqual(AT_REST);
    }
    await page.locator("#details input:not([type=hidden])").first().focus();
    await page.waitForTimeout(200);
    expect(await bubbleAside(page)).toEqual(AT_REST);
  });
});

/* ── WhatsApp bubble beside the prices on Home and the product page, and the paid /thanks address step (task 4.9) ──

   D050: the bubble never covers the price. 4.7 found that it could on the marketing pages: at 324 x 566 the resting
   bubble sat over the hero's price sentence on Home and the product page, and mid-page over a price sentence while the
   bar had stepped aside, and over the offer card's prices while the bar lifted it. So below 900 px the site's bubble
   steps aside as the store's does from its form, while a price sentence (`.ks-price`) or the offer card's prices
   (`.kh-offer__prices`) cross its band, the band re-measured whenever the bar lifts or drops it (lifted and aside, it
   keeps its height, off the right edge). These sweep Home and the product page at every phone size of the audit matrix,
   as 4.7's cases sweep the store; prove the step aside is not vacuous where 4.7 found the gap (324 x 566, the hero) and
   with the bar lifting the bubble, motion on and reduced; and prove the paid /thanks address step (item 2) on the
   ThanksPaid story (Storybook, which Playwright serves beside the site; `npm run build-storybook` first). */

const PRODUCT: Built = { host: "marketing", path: "/products/kheelu" };
const phone324 = VIEWPORTS.find((v) => v.width === 324)!;
const THANKS_PAID_STORY = `http://localhost:${STORYBOOK_PORT}/iframe.html?id=layouts-storeshell--thanks-paid&viewMode=story`;
/** The prices the site's bubble steps aside from: WhatsAppFloat's STEP_ASIDE_FROM `site`, written here because the
 *  harness does not load components (WhatsAppFloat.test.tsx holds that selector to the prices the components print). */
const PRICES = ".ks-price, .kh-offer__prices, .kh-offer__split, .kh-offer__fine";

/** Puts each visible price of the page right under the bubble, where the bubble sits once the bar has settled at that
 *  scroll position (lifted or not), and checks that it covers none; returns how many times it stood aside. A quarter-
 *  screen sweep can step over a price; this cannot. */
async function placePricesUnderBubble(page: Page): Promise<number> {
  let aside = 0;
  const count = await page.locator(PRICES).count();
  for (let i = 0; i < count; i++) {
    let placed = false;
    // Twice: the first placement can show or hide the bar, which lifts or drops the bubble.
    for (let pass = 0; pass < 2; pass++) {
      const y = await page.evaluate(
        ({ sel, n }) => {
          const el = document.querySelectorAll(sel)[n];
          if (!el.checkVisibility()) return null;
          const r = el.getBoundingClientRect();
          const b = document.querySelector(".ks-wa")!.getBoundingClientRect();
          return Math.max(0, Math.round(r.top + scrollY + r.height / 2 - (b.top + b.height / 2)));
        },
        { sel: PRICES, n: i },
      );
      if (y === null) break;
      await scrollToY(page, y);
      await page.waitForTimeout(250);
      placed = true;
    }
    if (!placed) continue;
    await expect.poll(() => coveredByBubble(page, NEVER_COVERED), `price ${i} under the bubble`).toEqual([]);
    const state = await bubbleAside(page);
    expect([ASIDE, AT_REST], `price ${i}: aside in full or at rest`).toContainEqual(state);
    if (state.hidden) aside++;
  }
  return aside;
}

test.describe("chrome: WhatsApp bubble beside the prices (task 4.9; D050)", () => {
  for (const route of [HOME, PRODUCT]) {
    for (const vp of PHONES) {
      test(`on ${route.path} it never covers a price, the bar or a field, top to bottom ${vp.name}`, async ({ harness }) => {
        const page = await openBuilt(harness, vp, {}, route);
        expect(await sweepBubble(page)).toContain("rest");
        // Each price placed under the bubble: never covered, and the bubble stood aside for them.
        expect(await placePricesUnderBubble(page)).toBeGreaterThan(0);
      });
    }

    test(`the step aside is not vacuous on ${route.path}: at rest at 324 x 566 the bubble would cover the hero's price`, async ({ harness }) => {
      const page = await openBuilt(harness, phone324, {}, route);
      await expect.poll(() => bubbleAside(page)).toEqual(ASIDE);
      expect(await coveredAtRest(page, NEVER_COVERED)).toEqual(expect.arrayContaining([expect.stringMatching(/^<p\.(?:.*\.)?ks-price(?:\.|>)/)]));
      expect(await coveredByBubble(page, NEVER_COVERED)).toEqual([]);
    });
  }

  test("while the bar lifts it, it steps aside from a price in its lifted band, and rests again once the bar has gone (motion on and reduced)", async ({ harness }) => {
    for (const reducedMotion of ["no-preference", "reduce"] as const) {
      const page = await openBuilt(harness, phone390, { reducedMotion }, HOME);
      const lift = async (state: "shown" | "hidden") => {
        if (state === "shown") await scrollPastHero(page);
        else await scrollToY(page, 0);
        await expect.poll(async () => (await barState(page)).published).toBe(state);
      };
      // The control: just past the hero, lifted by the bar, the bubble covers no price of the page, so it rests.
      await expect.poll(() => bubbleAside(page)).toEqual(AT_REST);
      await lift("shown");
      await page.waitForTimeout(400);
      await expect.poll(() => bubbleAside(page), `${reducedMotion}: lifted, nothing to clear`).toEqual(AT_REST);
      await lift("hidden");
      await expect.poll(() => bubbleGap(page), `${reducedMotion}: back at rest`).toBeCloseTo(16, 0);
      // A price fixed in the rows the lifted bubble covers (the bar's height above its resting band), clear of the
      // resting band; planted after the bubble armed, so the bubble reads it when the bar's next move re-measures its band.
      const planted = await page.evaluate(() => {
        const b = document.querySelector(".ks-wa")!.getBoundingClientRect();
        const bar = document.querySelector<HTMLElement>(".kh-buybar")!.offsetHeight;
        const price = document.createElement("p");
        price.className = "ks-price";
        price.textContent = "price";
        price.style.cssText = `position: fixed; margin: 0; left: 0; right: 0; top: ${b.top - bar}px; height: ${b.height}px;`;
        document.querySelector("main")!.append(price);
        return { clearOfRest: b.top - bar + b.height <= b.top };
      });
      expect(planted.clearOfRest).toBe(true);
      await expect.poll(() => bubbleAside(page), `${reducedMotion}: at rest below the planted price`).toEqual(AT_REST);
      await lift("shown");
      await expect.poll(() => bubbleAside(page), `${reducedMotion}: lifted beside the price`).toEqual(ASIDE);
      await expect.poll(() => coveredByBubble(page, NEVER_COVERED), reducedMotion).toEqual([]);
      await lift("hidden");
      await expect.poll(() => bubbleAside(page), `${reducedMotion}: dropped below the price`).toEqual(AT_REST);
      // With reduced motion the bar fades out in place (pick 4) while the bubble drops at once: clear once it has gone.
      await expect.poll(() => coveredByBubble(page, NEVER_COVERED), reducedMotion).toEqual([]);
    }
  });

  test("on the paid /thanks (the ThanksPaid story) it steps aside from the address step on a phone, and rests below it (item 2)", async ({ harness }) => {
    const context = await harness.context(phone360short);
    const page = await context.newPage();
    await page.goto(THANKS_PAID_STORY, { waitUntil: "load" });
    await page.locator("#storybook-root main h1").waitFor();
    await scrollToY(page, 1e7);
    await expect.poll(() => bubbleAside(page)).toEqual(AT_REST);
    const field = page.locator("#address input:not([type=hidden])").first();
    await field.evaluate((el: HTMLElement) => el.focus({ preventScroll: true }));
    await expect.poll(() => bubbleAside(page), "a field of the address step has focus").toEqual(ASIDE);
    await field.evaluate((el: HTMLElement) => el.blur());
    await expect.poll(() => bubbleAside(page)).toEqual(AT_REST);
    expect(await sweepBubble(page)).toEqual(["aside", "rest"]);
  });
});

/* ── Layouts as served ─────────────────────────────────────────────────────────────────────────────────────────── */

test.describe("chrome: the layouts as served", () => {
  test("root layout: lang, smooth scrolling, body classes, three font preloads, the viewport, robots only on beta", async ({ harness }) => {
    const page = await openBuilt(harness, phone390);
    expect(await page.evaluate(() => document.documentElement.lang)).toBe("en-IN");
    expect(await page.evaluate(() => document.documentElement.dataset.scrollBehavior)).toBe("smooth");
    expect(await page.evaluate(() => [...document.body.classList].filter((c) => c.startsWith("k")))).toEqual(["kh-page", "ks-has-float"]);
    const preloads = await page.evaluate(() => Array.from(document.querySelectorAll('link[rel="preload"][as="font"]')).map((l) => new URL((l as HTMLLinkElement).href).pathname));
    expect(preloads.sort()).toEqual(["/fonts/baloo2-variable-latin.woff2", "/fonts/kalam-bold-latin.woff2", "/fonts/nunito-variable-latin.woff2"]);
    // The approved mockup's viewport: without viewport-fit=cover, env(safe-area-inset-*) is 0 on notched phones.
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /(^|,\s*)viewport-fit=cover(\s*,|$)/);
    if (TARGET === "beta") await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    else expect(await page.locator('meta[name="robots"]').count()).toBe(0);
    const graphs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).filter((s) => (s.textContent ?? "").includes('"@type":"WebSite"')).length,
    );
    expect(graphs, "the site graph (Organization and WebSite) once").toBe(1);
  });

  test("store layout: noindex, the viewport, its own chrome, no site navigation, no bar", async ({ harness }) => {
    const page = await openBuilt(harness, phone390, {}, STORE);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute("content", /(^|,\s*)viewport-fit=cover(\s*,|$)/);
    await expect(page.locator("header.ks-store-head")).toBeVisible();
    await expect(page.locator("footer.ks-store-foot")).toBeVisible();
    expect(await page.locator("nav.kh-nav, .kh-buybar").count()).toBe(0);
    const policies = await page.getByRole("navigation", { name: "Policies" }).getByRole("link").evaluateAll((links) => links.map((a) => a.getAttribute("href")));
    // MARKETING_ORIGIN: the beta site on beta, the production site in every other build (a local build included).
    const marketing = TARGET === "beta" ? ORIGINS.marketing : REAL_ORIGINS.marketing;
    expect(policies).toEqual(["terms", "refund", "shipping", "privacy", "contact"].map((p) => `${marketing}/${p}`));
  });
});
