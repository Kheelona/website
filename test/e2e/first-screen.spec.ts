import type { Page } from "@playwright/test";
import { HERO_CROPS, MASTER_SIZE, subjectsIn } from "../../scripts/assets/hero-crops.mjs";
import { expect, forceMotionEnd, gateRouteGroup, hideForParity, test } from "./support/fixtures";
import { PARITY_TARGET } from "./support/env";
import { MOCKUP_SLUGS } from "./support/mockup-text";
import { mockupRoute, sweepRoutes } from "./support/routes";
import { FIRST_SCREEN_VIEWPORTS, VIEWPORTS, type Viewport } from "./support/viewports";

/* The first phone screen and tap targets (task 1.1; test plan §4.1 and §4.6, tasks.md SPA 4).
 *
 * Home and product: the h1, the chilli button, the price sentence and the delivery line all end
 * inside the first screen at 360 x 590 (short in-app browser) and 360 x 640 (D045 measured 584 px);
 * at 390 x 844 and 412 x 915 they do, and Kheelu with them (D061 item 1, task 8c.1: below).
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

/* D061 item 1 (task 8c.1): Kheelu on the first phone screen, Home and the product page. At 390 x 844 and 412 x 915 the
 * h1, the chilli button, the price sentence and the delivery line end inside the first screen, as at 360 (D045), and
 * Kheelu (the hero board's own Kheelu sticker, in the board that shows) lies wholly inside it and inside its board. At
 * the three phone sizes the D050 WhatsApp bubble covers neither Kheelu nor the word sticker ("It asks. They think."),
 * and at every phone of the matrix no hero link (task 8c.5: the help line's "call +91 …" at 412 x 915).
 * Home's hero picture is the Kabir photo since task Q2.1 (D064 item 4), its 16:10 crop under the trust line on phones:
 * there Kheelu and the boy's head are their boxes in the crop that shows (PHOTO_CROPS), and a photo has no word sticker.
 * At 360 x 590 the DS phone hero (the words, the full-width button, the trust line, then the board: design-system
 * 10-pages.md "Phones") leaves 82 px under the price sentence, so the board starts below the fold there: Kheelu's box
 * is printed, not asserted (the task 8c.1 report lists the options for the founder). Build only: the approved mockup
 * predates D061, so the calibration blocks never measure Kheelu. */
const kheeluPhone = (width: number, height: number): Viewport => ({ name: `phone-${width}x${height}`, width, height, isMobile: true, group: "phone" });
const KHEELU_VIEWPORTS: readonly Viewport[] = [kheeluPhone(390, 844), kheeluPhone(412, 915)];
/* The bubble also at every phone of the audit matrix (test plan §3): a phone's screen ends at any height, and wherever
   it ends the bubble sits in the board's right-hand column, so the word sticker, Kheelu and the child's head stay out of
   that column. The child's head is the top half of the cast sticker: never cover a face (design-system 10-pages.md, the
   scrapbook board; CMO V2), and Advik's eyes sit at 37 % of his sticker, below its top third. */
const BUBBLE_VIEWPORTS: readonly Viewport[] = [kheeluPhone(360, 590), ...KHEELU_VIEWPORTS, ...VIEWPORTS.filter((v) => v.group === "phone")].filter(
  (v, i, all) => all.findIndex((w) => w.name === v.name) === i,
);

type Box = { top: number; bottom: number; left: number; right: number };

/* Task Q2.1 (D064 item 4): Home's hero photo, in its two crops (scripts/assets/hero-crops.mjs). Where Kheelu and the
   boy's head sit in each, as shares of the crop, [left, top, right, bottom]: the script's subject boxes, which it holds
   whole and off the edge of every crop (test/guards/generated-hero-crops.test.ts). Each crop shows whole in its frame
   (its own ratio), so a box in the crop is that share of the image's box on screen. */
const PHOTO_CROPS = HERO_CROPS.map((crop) => {
  const { kheelu, head } = subjectsIn(crop, MASTER_SIZE);
  return { file: crop.path.split("/").pop()!.replace(/\.jpg$/, ""), kheelu, head };
});

/** The hero picture that shows (the phone board or the phone crop under 720 px), its Kheelu, the child's head and the
 *  word sticker (a board's; a photo has none), the hero's links and the WhatsApp bubble. */
async function heroArt(page: Page) {
  // The bubble rises above the buy bar while the bar shows (D050): measure once the bar has settled on its state.
  await page.waitForFunction(() => document.documentElement.hasAttribute("data-buybar"), undefined, { timeout: 5_000 }).catch(() => undefined);
  return page.evaluate((crops) => {
    const box = (el: Element | null | undefined) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right) };
    };
    const board = [...document.querySelectorAll("main .ks-hero .kh-art, main .ks-hero .kh-photo")].find((el) => el.checkVisibility());
    let kheelu: Box | null = null;
    let head: Box | null = null;
    if (board?.classList.contains("kh-photo")) {
      // A photo: the crop that shows, by its file name in the rendition's address, and its subjects' shares of it.
      const img = board.querySelector("img");
      const crop = img && crops.find((c) => decodeURIComponent(img.currentSrc || img.src).includes(c.file));
      const at = (share: readonly number[]) => {
        const r = img!.getBoundingClientRect();
        const [l, t, rt, b] = share;
        return { top: Math.round(r.top + t * r.height), bottom: Math.round(r.top + b * r.height), left: Math.round(r.left + l * r.width), right: Math.round(r.left + rt * r.width) };
      };
      kheelu = crop ? at(crop.kheelu) : null;
      head = crop ? at(crop.head) : null;
    } else {
      const layers = [...(board?.querySelectorAll("img") ?? [])];
      kheelu = box(layers.find((img) => /kheelu-front-sticker/.test(img.currentSrc || img.src)));
      const castBox = box(layers.find((img) => /(advik|myra)-sticker/.test(img.currentSrc || img.src)));
      head = castBox && { ...castBox, bottom: Math.round((castBox.top + castBox.bottom) / 2) };
    }
    const bubble = document.querySelector(".ks-wa");
    return {
      board: box(board),
      photo: !!board?.classList.contains("kh-photo"),
      kheelu,
      head,
      sticker: box(board?.querySelector(".kh-sticker")),
      links: [...document.querySelectorAll("main .ks-hero a")]
        .filter((a) => a.checkVisibility())
        .map((a) => ({ name: (a.textContent ?? "").trim(), box: box(a)! })),
      bubble: bubble?.checkVisibility() ? box(bubble) : null,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }, PHOTO_CROPS);
}

const inside = (inner: Box, outer: Box) => inner.top >= outer.top && inner.bottom <= outer.bottom && inner.left >= outer.left && inner.right <= outer.right;
const overlap = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
const fmt = (b: Box | null) => (b ? `${b.top}-${b.bottom} x ${b.left}-${b.right}` : "none");

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

for (const slug of FIRST_SCREEN_PAGES) {
  const route = mockupRoute(slug);
  test.describe(`first screen, Kheelu (D061 item 1): ${route.id}`, () => {
    test.skip(PARITY_TARGET === "mockup", "self-test: the approved mockup predates D061");
    gateRouteGroup(route);
    for (const vp of KHEELU_VIEWPORTS) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        const art = await heroArt(page);
        const words = await firstScreenBottoms(page);
        console.log(`[first-screen] ${route.id} ${vp.name}: board ${fmt(art.board)}, Kheelu ${fmt(art.kheelu)}, sticker ${fmt(art.sticker)}, h1 ${words.h1}, cta ${words.cta}, price ${words.price}, delivery ${words.delivery}`);
        assertFirstScreen(words, `${route.id} ${vp.name}`);
        expect(art.board, `${route.id} ${vp.name}: no hero board or photo shows`).not.toBeNull();
        expect(art.kheelu, `${route.id} ${vp.name}: no Kheelu in the hero picture that shows`).not.toBeNull();
        const screen = { top: 0, bottom: art.height, left: 0, right: art.width };
        expect(inside(art.kheelu!, screen), `${route.id} ${vp.name}: Kheelu ${fmt(art.kheelu)} is not wholly inside the first screen (${art.width} x ${art.height})`).toBe(true);
        expect(inside(art.kheelu!, art.board!), `${route.id} ${vp.name}: Kheelu ${fmt(art.kheelu)} runs off its board ${fmt(art.board)}`).toBe(true);
      });
    }
  });

  test.describe(`first screen, the WhatsApp bubble clear of the hero art (D050, D061 item 1): ${route.id}`, () => {
    test.skip(PARITY_TARGET === "mockup", "self-test: the approved mockup has no bubble");
    gateRouteGroup(route);
    for (const vp of BUBBLE_VIEWPORTS) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        const art = await heroArt(page);
        console.log(`[first-screen] ${route.id} ${vp.name}: bubble ${fmt(art.bubble)}, Kheelu ${fmt(art.kheelu)}, sticker ${fmt(art.sticker)}, child's head ${fmt(art.head)}`);
        expect(art.bubble, `${route.id} ${vp.name}: the WhatsApp bubble does not show`).not.toBeNull();
        // A board carries Kheelu, the cast sticker and the word sticker; Home's photo (task Q2.1) Kheelu and the boy, no sticker.
        expect(art.kheelu && art.head && (art.photo || art.sticker), `${route.id} ${vp.name}: no Kheelu, word sticker or child in the hero picture that shows`).toBeTruthy();
        expect(overlap(art.bubble!, art.kheelu!), `${route.id} ${vp.name}: the bubble ${fmt(art.bubble)} covers Kheelu ${fmt(art.kheelu)}`).toBe(false);
        if (art.sticker) expect(overlap(art.bubble!, art.sticker), `${route.id} ${vp.name}: the bubble ${fmt(art.bubble)} covers the word sticker ${fmt(art.sticker)}`).toBe(false);
        expect(overlap(art.bubble!, art.head!), `${route.id} ${vp.name}: the bubble ${fmt(art.bubble)} covers the child's head ${fmt(art.head)}`).toBe(false);
        // No hero link under the bubble at rest (task 8c.5, the 8c merge's follow-up: at 412 x 915 it sat over "call +91
        // …"). The hero's help line keeps out of the bubble's column on phones (hero-section.css), so its phone link wraps
        // to a line of its own wherever the line would reach that column (390 px and wider, as at 360 px already).
        const covered = art.links.filter((link) => overlap(art.bubble!, link.box));
        console.log(`[first-screen] ${route.id} ${vp.name}: hero links under the bubble: ${covered.map((link) => `"${link.name}" ${fmt(link.box)}`).join("; ") || "none"}`);
        expect(art.links.length, `${route.id} ${vp.name}: the instrument found no hero links`).toBeGreaterThan(0);
        expect(
          covered.map((link) => `"${link.name}" ${fmt(link.box)}`),
          `${route.id} ${vp.name}: the bubble ${fmt(art.bubble)} covers a hero link`,
        ).toEqual([]);
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

/* Task Q2.10 (the D2C plan v2 §3.0, the CMO's m12; the selling update): the product page's first phone screen as the plan
 * measures it. The eyebrow, the H1, the lead, the button, the price line (a block of its own, C1) and both trust rows
 * (the risk-reversal line, then the delivery line) end inside the first screen at 360 x 590, 390 x 844 and 412 x 915
 * (at 360 x 590 the board starts below it, D061 item 14; at the two larger phones Kheelu is wholly in view, the block
 * above). The hero carries no help line (plan §1.1: the closes and the store) and no link but its button and the trust
 * line's. Build only: the approved mockup predates the plan. */
{
  const route = mockupRoute("meet-kheelu");
  test.describe(`first screen, the selling update (task Q2.10): ${route.id}`, () => {
    test.skip(PARITY_TARGET === "mockup", "self-test: the approved mockup predates the D2C plan");
    gateRouteGroup(route);
    for (const vp of [kheeluPhone(360, 590), ...KHEELU_VIEWPORTS]) {
      test(vp.name, async ({ harness }) => {
        const { page } = await harness.open(route, vp);
        const m = await page.evaluate(() => {
          const hero = document.querySelector("main .ks-hero")!;
          const bottom = (el: Element | null) => (el ? Math.round(el.getBoundingClientRect().bottom) : null);
          const button = hero.querySelector(".kh-btn--cta");
          return {
            words: {
              eyebrow: bottom(hero.querySelector(".kh-eyebrow")),
              h1: bottom(hero.querySelector("h1")),
              lead: bottom(hero.querySelector(".kh-heading__lead")),
              button: bottom(button),
              price: bottom(hero.querySelector(".ks-price")),
            },
            trust: [...hero.querySelectorAll(".ks-trust li")].map(bottom),
            priceIsOwnBlock: hero.querySelector(".ks-price")?.tagName === "P" && !button?.closest(".kh-section__actions")?.contains(hero.querySelector(".ks-price")),
            help: hero.querySelectorAll(".ks-help").length,
            links: [...hero.querySelectorAll("a")].filter((a) => !a.closest(".ks-trust") && !a.classList.contains("kh-btn--cta")).map((a) => a.textContent?.trim()),
            height: window.innerHeight,
          };
        });
        console.log(`[first-screen] ${route.id} ${vp.name} (Q2.10): ${JSON.stringify(m.words)} trust ${JSON.stringify(m.trust)}`);
        for (const [key, at] of Object.entries(m.words)) {
          expect(at, `${route.id} ${vp.name}: no ${key}`).not.toBeNull();
          expect(at!, `${route.id} ${vp.name}: the ${key} ends at ${at} px, below the first screen (${m.height} px)`).toBeLessThanOrEqual(m.height);
        }
        expect(m.trust, `${route.id} ${vp.name}: the risk-reversal row and the delivery row`).toHaveLength(2);
        for (const at of m.trust) expect(at!, `${route.id} ${vp.name}: a trust row ends at ${at} px, below the first screen`).toBeLessThanOrEqual(m.height);
        expect(m.priceIsOwnBlock, "the price line is a block of its own after the button (C1)").toBe(true);
        expect(m.help, "no help line in the hero (plan §1.1)").toBe(0);
        expect(m.links, "no hero link but the button and the trust line's").toEqual([]);
      });
    }
  });
}
