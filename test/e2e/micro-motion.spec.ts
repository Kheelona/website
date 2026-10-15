import type { Locator, Page } from "@playwright/test";
import { expect, motionStarted, requiresServer, test } from "./support/fixtures";
import { mockupRoute } from "./support/routes";
import { VIEWPORTS, type Viewport } from "./support/viewports";

/* Line drawing, the micro-interactions and the sticky laptop nav (task Q2.5; D064 item 10, main-session ruling 2 of the
 * selling update; architecture §11), on built pages:
 *   - line drawing: a section heading's one accent (an h2's or h3's Hand or Mark) below the first screen waits (the Hand
 *     unseen, the Mark's stroke at no width), then writes or draws itself once as it enters, and ends on the DS's own
 *     look (the Hand on the DS tilt, as the hero's never-moving Hand has it); the first screen's accents never move;
 *   - reduced motion: no accent waits or draws, every accent shows;
 *   - a card with a link lifts one DS step with the DS lift shadow, and its arrow nudges, on hover with a fine pointer
 *     and on keyboard focus of its link; never on a phone; with reduced motion it does not move;
 *   - a tag that is a link presses half a DS step;
 *   - the nav link's hover line slides in on a laptop; the current page's ink line stays;
 *   - from 900 px the nav sticks to the top with its "Pre-order Kheelu" button (899 px: neither, as before), with no
 *     sideways scroll; an in-page jump lands below it.
 * Not a story spec (its name does not start with "motion-"): it needs the pages' real headings, cards and nav.
 */

requiresServer();

const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;
const wide = (width: number): Viewport => ({ name: `laptop-${width}x800`, width, height: 800, isMobile: false, group: "laptop" });
const HOME = mockupRoute("home");
const STORIES = mockupRoute("stories");
const SAFETY = mockupRoute("safety");
const ACCENT = ":is(h2, h3) :is(.kh-hand, .kh-mark)";
/** The DS stroke before it draws: scaleX(0). */
const NO_WIDTH = "matrix(0, 0, 0, 1, 0, 0)";

const armed = (page: Page) => page.waitForFunction(() => document.documentElement.classList.contains("js-motion"));

type Accent = { i: number; kind: "hand" | "mark"; onScreen: boolean; shown: boolean; running: number; opacity: string; stroke: string };

/** Every heading accent on the page, numbered (data-kh-accent) so a locator can find it again. */
function readAccents(page: Page): Promise<Accent[]> {
  return page.evaluate((selector) =>
    Array.from(document.querySelectorAll(selector)).map((el, i) => {
      el.setAttribute("data-kh-accent", String(i));
      const r = el.getBoundingClientRect();
      return {
        i,
        kind: el.classList.contains("kh-hand") ? ("hand" as const) : ("mark" as const),
        onScreen: r.top < window.innerHeight && r.bottom > 0,
        shown: el.classList.contains("is-in"),
        running: el.getAnimations({ subtree: true }).filter((a) => a.playState === "running").length,
        opacity: getComputedStyle(el).opacity,
        stroke: getComputedStyle(el, "::after").transform,
      };
    }),
  ACCENT);
}

/** Counts the animations that start on `el` (its ::after's included) from now on. */
const countStarts = (el: Locator) =>
  el.evaluate((node) => {
    const starts: string[] = [];
    (node as unknown as { __khStarts: string[] }).__khStarts = starts;
    node.addEventListener("animationstart", (e) => starts.push((e as AnimationEvent).animationName));
  });
const startsOf = (el: Locator) => el.evaluate((node) => (node as unknown as { __khStarts: string[] }).__khStarts);

for (const vp of [phone, laptop]) {
  test(`line drawing: a heading's accent below the first screen waits, then writes or draws once; the first screen's never moves ${vp.name}`, async ({ harness }) => {
    const { page } = await harness.open(HOME, vp, { reducedMotion: "no-preference" });
    await armed(page);
    const accents = await readAccents(page);
    const first = accents.filter((a) => a.onScreen);
    const later = accents.filter((a) => !a.onScreen);
    expect(later.length, "accents below the first screen").toBeGreaterThan(0);
    for (const a of first) expect(a, `accent ${a.i} on the first screen: shown, not moving`).toMatchObject({ shown: true, running: 0, opacity: "1" });
    for (const a of later) {
      expect(a.shown, `accent ${a.i} waits`).toBe(false);
      if (a.kind === "hand") expect(a.opacity, `hand ${a.i} unseen while it waits`).toBe("0");
      else expect(a.stroke, `mark ${a.i}'s stroke at no width while it waits`).toBe(NO_WIDTH);
    }

    // The hero's Hand (an h1's) never moves: its transform is the DS's own tilt, the end of every Hand's writing.
    const tilt = await page.locator("h1 .kh-hand").first().evaluate((el) => getComputedStyle(el).transform);
    expect(tilt).not.toBe("none");

    for (const kind of ["hand", "mark"] as const) {
      const target = later.find((a) => a.kind === kind);
      if (!target) continue;
      const el = page.locator(`[data-kh-accent="${target.i}"]`);
      await countStarts(el);
      await el.evaluate((node) => node.scrollIntoView({ block: "center" }));
      await expect(el).toHaveClass(/(^|\s)is-in(\s|$)/);
      // It waits for the block's entrance (--duration-enter, 240 ms), then draws over --duration-draw (800 ms).
      await page.waitForTimeout(1400);
      expect(await startsOf(el), `${kind} ${target.i} drew once`).toEqual([kind === "hand" ? "ks-write" : "ks-stroke"]);
      const end = await el.evaluate((node) => ({ opacity: getComputedStyle(node).opacity, transform: getComputedStyle(node).transform, stroke: getComputedStyle(node, "::after").transform }));
      if (kind === "hand") expect(end).toMatchObject({ opacity: "1", transform: tilt });
      else expect(end.stroke).toBe("none");
      // Scrolling away and back draws nothing more.
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(200);
      await el.evaluate((node) => node.scrollIntoView({ block: "center" }));
      await page.waitForTimeout(1400);
      expect(await startsOf(el), `${kind} ${target.i} drew once only`).toHaveLength(1);
    }
  });
}

test("reduced motion: no accent waits or draws, every accent shows", async ({ harness }) => {
  const { page } = await harness.open(HOME, phone, { reducedMotion: "reduce", recordMotion: true });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += phone.height / 2) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  const accents = await readAccents(page);
  expect(accents.length).toBeGreaterThan(1);
  for (const a of accents) {
    expect(a.opacity, `accent ${a.i}`).toBe("1");
    if (a.kind === "mark") expect(a.stroke, `mark ${a.i}`).toBe("none");
  }
  const drawn = (await motionStarted(page)).filter((m) => m.name === "ks-write" || m.name === "ks-stroke");
  expect(drawn).toEqual([]);
});

/** The first card with a link on the stories hub, scrolled into view and settled (its block revealed). */
async function linkedCard(page: Page): Promise<{ card: Locator; link: Locator; arrow: Locator }> {
  const card = page.locator(".kh-card:has(.kh-card__link)").first();
  await card.evaluate((node) => node.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(600);
  const link = card.locator(".kh-card__link").first();
  return { card, link, arrow: link.locator(".kh-icon").first() };
}
const transformOf = (el: Locator) => el.evaluate((node) => getComputedStyle(node).transform);

test("a card with a link lifts and its arrow nudges on hover with a fine pointer, and on keyboard focus of its link", async ({ harness }) => {
  const { page } = await harness.open(STORIES, laptop, { reducedMotion: "no-preference" });
  await armed(page);
  expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(true);
  const { card, link, arrow } = await linkedCard(page);
  expect(await transformOf(card)).toBe("none");
  await card.hover();
  await page.waitForTimeout(400);
  expect(await transformOf(card), "lifted one DS step").toBe("matrix(1, 0, 0, 1, 0, -4)");
  expect(await transformOf(arrow), "the arrow nudged").toBe("matrix(1, 0, 0, 1, 5, 0)");
  expect(await card.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe("none");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(400);
  expect(await transformOf(card)).toBe("none");

  await link.focus();
  expect(await link.evaluate((node) => node.matches(":focus-visible")), "keyboard-style focus").toBe(true);
  await page.waitForTimeout(400);
  expect(await transformOf(card), "lifted on keyboard focus").toBe("matrix(1, 0, 0, 1, 0, -4)");
  expect(await transformOf(arrow)).toBe("matrix(1, 0, 0, 1, 5, 0)");
});

test("a card never lifts on a phone (no hover there), and does not move with reduced motion", async ({ harness }) => {
  const onPhone = await harness.open(STORIES, phone, { reducedMotion: "no-preference" });
  await armed(onPhone.page);
  expect(await onPhone.page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(false);
  const tapped = await linkedCard(onPhone.page);
  await tapped.card.hover();
  await onPhone.page.waitForTimeout(400);
  expect(await transformOf(tapped.card)).toBe("none");
  expect(await tapped.card.evaluate((node) => getComputedStyle(node).boxShadow)).toBe("none");

  const reduced = await harness.open(STORIES, laptop, { reducedMotion: "reduce" });
  const still = await linkedCard(reduced.page);
  await still.card.hover();
  await reduced.page.waitForTimeout(400);
  expect(await transformOf(still.card), "no lift under reduced motion").toBe("none");
  expect(await transformOf(still.arrow), "no nudge under reduced motion").toBe("none");
  expect(await still.card.evaluate((node) => getComputedStyle(node).boxShadow), "the lifted look shows, without moving").not.toBe("none");
});

test("a tag that is a link presses half a DS step", async ({ harness }) => {
  const { page } = await harness.open(STORIES, laptop, { reducedMotion: "no-preference" });
  const tag = page.locator("a.kh-tag").first();
  await tag.scrollIntoViewIfNeeded();
  const box = (await tag.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(300);
  expect(await transformOf(tag)).toBe("matrix(1, 0, 0, 1, 0, 2)");
  await page.mouse.up({ button: "left" }).catch(() => undefined);
});

test("the nav link's hover line slides in on a laptop; the current page's ink line stays", async ({ harness }) => {
  const { page } = await harness.open(SAFETY, laptop, { reducedMotion: "no-preference" });
  const other = page.locator("nav.kh-nav .kh-nav__link:not([aria-current])").first();
  const line = () => other.evaluate((node) => getComputedStyle(node, "::after").transform);
  expect(await line()).toBe(NO_WIDTH);
  await other.hover();
  await page.waitForTimeout(300);
  expect(await line()).toBe("none");
  const current = page.locator('nav.kh-nav .kh-nav__link[aria-current="page"]');
  expect(await current.evaluate((node) => getComputedStyle(node, "::after").content)).toBe("none");
  expect(await current.evaluate((node) => getComputedStyle(node).borderBottomColor)).toBe(await current.evaluate((node) => getComputedStyle(node).color));
});

for (const [width, sticks] of [[899, false], [900, true], [1023, true], [1440, true]] as const) {
  test(`the nav ${sticks ? "sticks to the top with its buy button" : "scrolls away, without its button, as before"} at ${width} px`, async ({ harness }) => {
    const { page } = await harness.open(HOME, wide(width), { reducedMotion: "reduce" });
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(200);
    const nav = await page.locator("nav.kh-nav").evaluate((node) => {
      const cta = node.querySelector<HTMLElement>(".ks-nav-cta")!.getBoundingClientRect();
      return {
        top: Math.round(node.getBoundingClientRect().top),
        // The button in view: drawn (not display: none) and inside the screen.
        cta: cta.height > 0 && cta.top >= 0 && cta.right <= document.documentElement.clientWidth,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(nav.overflow, "no sideways scroll").toBeLessThanOrEqual(0);
    if (sticks) expect(nav).toMatchObject({ top: 0, cta: true });
    else {
      expect(nav.top).toBeLessThan(0);
      expect(nav.cta).toBe(false);
    }
  });
}

test("an in-page jump lands below the sticky nav on a laptop", async ({ harness }) => {
  const { page } = await harness.open({ ...mockupRoute("meet-kheelu"), path: "/products/kheelu#faq" }, laptop, { reducedMotion: "reduce" });
  await page.waitForTimeout(800);
  const where = await page.evaluate(() => ({
    faq: Math.round(document.getElementById("faq")!.getBoundingClientRect().top),
    nav: Math.round(document.querySelector("nav.kh-nav")!.getBoundingClientRect().bottom),
  }));
  expect(where.nav).toBe(72);
  expect(Math.abs(where.faq - where.nav), "the questions' heading just below the bar").toBeLessThanOrEqual(2);
});

/* A page's own sticky element sits below the stuck bar (Q2.5 review): the legal contents panel sticks from 1024 px
 * (legal-template.css), a DS gap below the bar's room (--ks-nav-clearance), so the bar never covers its top or its
 * "Contents" heading; the reference pages' scrolling list still ends inside the screen. */
for (const width of [1024, 1440]) {
  test(`a legal page's sticky contents sit below the sticky nav at ${width} px`, async ({ harness }) => {
    for (const slug of ["privacy", "terms", "refund", "shipping"] as const) {
      const { page } = await harness.open(mockupRoute(slug), wide(width), { reducedMotion: "reduce" });
      await page.evaluate(() => window.scrollTo(0, 1500));
      await page.waitForTimeout(200);
      const where = await page.evaluate(() => {
        const toc = document.querySelector<HTMLElement>(".ks-toc")!;
        const box = toc.getBoundingClientRect();
        const title = toc.querySelector<HTMLElement>("#toc-title")!.getBoundingClientRect();
        return {
          nav: Math.round(document.querySelector("nav.kh-nav")!.getBoundingClientRect().bottom),
          top: Math.round(box.top),
          bottom: Math.round(box.bottom),
          reference: toc.closest(".ks-doc--reference") !== null,
          // What a visitor sees at the middle of the "Contents" heading: the heading, not the bar.
          titleSeen: toc.contains(document.elementFromPoint(title.left + title.width / 2, title.top + title.height / 2)),
          screen: window.innerHeight,
        };
      });
      expect(where.nav, `${slug}: the bar is stuck`).toBe(72);
      expect(where.top, `${slug}: the contents panel's top below the bar`).toBeGreaterThanOrEqual(where.nav);
      expect(where.titleSeen, `${slug}: the "Contents" heading is not under the bar`).toBe(true);
      if (where.reference) expect(where.bottom, `${slug}: the scrolling list ends inside the screen`).toBeLessThanOrEqual(where.screen);
    }
  });
}
