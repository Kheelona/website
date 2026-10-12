import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { expect, hideForParity, motionStarted, requiresServer, test, type OpenOptions } from "./support/fixtures";
import { ORIGINS, REAL_ORIGINS, TARGET } from "./support/env";
import { CHUNK_MAX_DIFF_RATIO } from "./support/parity";
import { builtUrl } from "./support/routes";
import { APPROVED_WIDTHS, VIEWPORTS, type Viewport } from "./support/viewports";

/* The chrome on a built route (task 3.1; tasks.md 3.1 "Test", architecture §5.2, §5.3, §11.2 rows 4, 5 and D050, §13).
 *
 * The chrome is the shells', so it runs on any built marketing route: "/" here, whose page content is still the
 * legacy one until wave 5 (the gate of the page specs is not used: the chrome is new on every route). The store's
 * chrome runs on the store host's own route.
 *
 *   - Element pixel parity (the first pixel proof of the visual layer): the nav, the footer, the open drawer's panel
 *     and the shown buy bar against the same elements of mockup/home.html at the approved widths (the drawer and the
 *     bar at the two phone widths, where they exist), and the store header and footer against mockup/store.html. The
 *     mockup's element screenshot is the golden (git-ignored, D039); at most 2 percent of pixels may differ, as SPA 1.
 *   - Sticky bar (G-09, pick 4): hidden while the hero CTA is on screen, shown past it, aside while an inline chilli
 *     button is on screen, inert while hidden, data-buybar and --ks-buybar-h on <html>, gone from 900 px, sliding up
 *     with motion on and only fading with reduced motion. A hero and an inline chilli button are added to <main>
 *     after the page loads (the legacy content has neither); the bar watches buttons added after it armed.
 *   - One chilli button per phone view at each of those scroll positions.
 *   - Drawer keyboard path (pick 5): the skip link first, then the logo and the menu button; Enter opens the modal
 *     dialog with focus inside, Tab stays inside, Escape closes it and returns focus; the backdrop closes it; the
 *     panel slides with motion on and not with reduced motion.
 *   - WhatsApp bubble (D050): the D050 link; at 360 x 590 never over the bar, a price, a form field or the pay button
 *     on the first screen or at the end of the page (where the store page renders its bubble too), nor the footer's
 *     lines; lifts by the bar's height while the bar shows and drops when it steps aside; hidden with the drawer open;
 *     its laptop label on hover and focus; reached by keyboard after the page content; nothing moves with reduced
 *     motion.
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
  if (route === HOME) await page.waitForFunction(() => document.documentElement.dataset.buybar !== undefined);
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

/** Adds what the legacy content lacks: a hero CTA at the top of <main>, then two screens of space, an inline chilli
 *  button, and two more screens of space. Returns their scroll positions. */
async function plantHeroAndInline(page: Page): Promise<{ top: number; between: number; inline: number; after: number }> {
  return page.evaluate(() => {
    const main = document.querySelector("main")!;
    const vh = innerHeight;
    const button = (id: string | null) => {
      const a = document.createElement("a");
      if (id) a.id = id;
      a.className = "kh-btn kh-btn--cta";
      a.href = "#";
      a.textContent = "Planted";
      return a;
    };
    const space = () => {
      const d = document.createElement("div");
      d.style.height = `${vh * 2}px`;
      return d;
    };
    const hero = button("hero-cta");
    const inline = button(null);
    main.prepend(hero, space(), inline, space());
    const top = (el: Element) => el.getBoundingClientRect().top + scrollY;
    return {
      top: 0,
      between: top(hero) + vh,
      inline: top(inline) - vh / 2,
      after: top(inline) + vh,
    };
  });
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
      // The payments line is held back from the build for the main session's ruling (the never-edited store-layout
      // contract lists five policy links; the line's chargeback link would be a sixth): left out of the golden too.
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
      // No hero and no inline button in the legacy content: the bar shows from first paint.
      expect(await barState(page)).toMatchObject({ published: "shown", hidden: false, inert: false });
      const s0 = await barState(page);
      expect(s0.height).toBe(`${s0.barHeight}px`);
      expect(s0.barHeight).toBeGreaterThan(0);
      expect(await visibleChilliButtons(page)).toBe(1);

      const at = await plantHeroAndInline(page);
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
 *  today's legacy content only the bar matches; the case enforces itself as wave 5 lands the hero price (5.1) and the
 *  store's form and pay button (5.15). */
const NEVER_COVERED = [
  ".kh-buybar",
  ".kh-buybar__price",
  ".ks-price",
  ".ks-store-top__price",
  ".kh-offer__prices",
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
    expect((await barState(page)).published).toBe("shown");
    expect(await coveredByBubble(page, ".kh-buybar"), "the bar is there to be checked").toEqual([]);
    expect(await coveredByBubble(page, NEVER_COVERED), "first screen: bubble over the bar, a price, a field or the pay button").toEqual([]);
    await scrollToY(page, 1e7);
    await page.waitForTimeout(300);
    expect(await coveredByBubble(page, NEVER_COVERED), "end of the page: bubble over the bar, a price, a field or the pay button").toEqual([]);
    expect(await coveredByBubble(page, ".kh-footer__legal span, .kh-footer__legal a, .kh-footer__col a, .kh-footer p"), "bubble over the footer").toEqual([]);
  });

  test("the cover check sees a price, a field and a pay button placed under the bubble (it is not vacuous)", async ({ harness }) => {
    const page = await openBuilt(harness, phone360short);
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
    const at = await plantHeroAndInline(page);
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
    const at = await plantHeroAndInline(page);
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
    await expect(label).toHaveText("Chat on WhatsApp");
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
