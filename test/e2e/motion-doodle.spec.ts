import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { BrowserContext, Page } from "@playwright/test";
import { expect, test, type OpenOptions } from "./support/fixtures";
import { ROOT } from "./support/repo";
import { VIEWPORTS, type Viewport } from "./support/viewports";

/* D049 pick 3B, "doodles draw themselves" (task 2.3; architecture §11.2 row 3 and §11.3; test plan §4.7), on the
 * Doodle, ArtBoard and ImaginationFrame stories, in the Playwright "storybook" project against
 * `npm run build-storybook` output.
 *
 * A story has no MotionController (task 2.8 builds it; the site shell mounts it, task 3.1), so this spec plays the
 * controller's half of the class contract (architecture §11.3) itself, as the controller does it: anything on screen
 * is marked is-in, then html.js-motion is added, then one IntersectionObserver marks each doodle is-in once it is a
 * tenth of the screen above the bottom edge. Under test are the doodle's markup (Doodle: the generated inline SVG,
 * data-draw, data-draw-order, ks-doodle__fill) and the presets in src/motion/motion.css that act on it.
 *
 * Below the fold, motion on (390 x 844 and 1440 x 900):
 *   - waiting: every stroke is one dash long and hidden (stroke-dasharray 1, stroke-dashoffset 1), the fill hidden;
 *   - each stroke draws by the ks-draw animation over --duration-draw, delayed --duration-base x 2(n - 1) for order n
 *     (400 ms steps), and the fill fades in over --duration-fast as its stroke ends;
 *   - sampled every frame from the moment the doodles enter: a stroke's offset stays 1 until its order's step, then
 *     falls to 0 within --duration-draw and never rises, order after order; the fill shows only once drawn.
 * Reduced motion, even with motion armed: nothing animates; every stroke is drawn and every fill shown, before and
 * after the doodles enter.
 * Without JavaScript: the story's rendered markup, served to a browser with JavaScript off, shows every doodle drawn.
 * Heroes (pick 2): the hero boards and the hero imagination frame hold no drawing doodle, only the DS doodle files as
 * plain images (eager, fetchpriority low), and nothing in them animates.
 */

const BELOW_THE_FOLD = "ui-doodle--below-the-fold";
const HERO_STORIES = [
  "ui-artboard--home-hero",
  "ui-artboard--product-hero-with-sticker",
  "ui-artboard--guide-hero-clamped",
  "ui-artboard--ratio",
  "ui-imaginationframe--hero-still",
] as const;

const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;

/** Frame-timing slack: under one 400 ms step, so the order of the steps is still proven. */
const SLACK_MS = 150;
const BOARD = '[data-testid="board"]';
const STROKES = "path:not(.ks-doodle__fill)";

type Sample = { t: number; doodles: Array<{ min: number; max: number; offsets: number[]; fill: number | null }> };

declare global {
  interface Window {
    /** When each drawing doodle (by its place among the page's [data-draw] elements) was marked is-in. */
    __khIn?: Record<string, number>;
    /** Every animation that started in the story, as it started. */
    __khStarted?: Array<{ name: string; order: string | null }>;
    __khSamples?: Sample[];
  }
}

/* Runs before the story's scripts: records when each doodle is marked is-in and every animation that starts inside
   the story (Storybook's own loading spinner turns outside #storybook-root). */
function installRecorder(): void {
  window.__khIn = {};
  window.__khStarted = [];
  new MutationObserver((records) => {
    for (const r of records) {
      const el = r.target as Element;
      if (!el.matches("[data-draw].is-in")) continue;
      const place = String(Array.from(document.querySelectorAll("[data-draw]")).indexOf(el));
      if (!(place in window.__khIn!)) window.__khIn![place] = performance.now();
    }
  }).observe(document, { attributes: true, attributeFilter: ["class"], subtree: true });
  document.addEventListener(
    "animationstart",
    (e) => {
      if (!(e.target instanceof Element) || !e.target.closest("#storybook-root")) return;
      window.__khStarted!.push({ name: e.animationName, order: e.target.closest("[data-draw-order]")?.getAttribute("data-draw-order") ?? null });
    },
    true,
  );
}

/* The controller's half of the class contract (architecture §11.3; mockup/mockup.js §1). `force` arms even under
   reduced motion, which MotionController never does: it proves motion.css still keeps every doodle drawn. */
function armMotion(force: boolean): boolean {
  if (!force && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const targets = Array.from(document.querySelectorAll("[data-draw]:not(.is-in)"));
  const later = targets.filter((el) => el.getBoundingClientRect().top >= window.innerHeight);
  for (const el of targets) if (!later.includes(el)) el.classList.add("is-in");
  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  later.forEach((el) => observer.observe(el));
  return true;
}

const storyUrl = (id: string) => `${test.info().project.use.baseURL}/iframe.html?id=${id}&viewMode=story`;

async function openStory(
  harness: { context(vp: Viewport, opts?: OpenOptions): Promise<BrowserContext> },
  id: string,
  vp: Viewport,
  opts: OpenOptions,
): Promise<Page> {
  const context = await harness.context(vp, opts);
  await context.addInitScript(installRecorder);
  const page = await context.newPage();
  await page.goto(storyUrl(id), { waitUntil: "load" });
  await page.locator("#storybook-root > *").first().waitFor({ state: "attached" });
  return page;
}

const frames = (page: Page, n: number) =>
  page.evaluate(
    (count) =>
      new Promise<void>((done) => {
        const step = (left: number) => (left === 0 ? done() : requestAnimationFrame(() => step(left - 1)));
        step(count);
      }),
    n,
  );

/** The DS motion tokens in milliseconds, as the page computes them. */
const tokens = (page: Page) =>
  page.evaluate(() => {
    const ms = (name: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
    };
    return { draw: ms("--duration-draw"), base: ms("--duration-base"), fast: ms("--duration-fast") };
  });

/** Each doodle of the board, by draw order: its strokes' offset and dash array, its fill's opacity, its animations. */
const doodleState = (page: Page) =>
  page.evaluate(
    ({ board, strokes }) =>
      Array.from(document.querySelectorAll(`${board} svg.ks-doodle`)).map((svg) => {
        const paths = Array.from(svg.querySelectorAll(strokes));
        const fill = svg.querySelector(".ks-doodle__fill");
        return {
          order: Number(svg.getAttribute("data-draw-order")),
          drawn: svg.matches(".ks-doodle[data-draw]"),
          strokes: paths.length,
          offsets: paths.map((p) => parseFloat(getComputedStyle(p).strokeDashoffset)),
          dashes: paths.map((p) => getComputedStyle(p).strokeDasharray),
          fill: fill ? parseFloat(getComputedStyle(fill).opacity) : null,
          animations: svg.getAnimations({ subtree: true }).map((a) => {
            const t = a.effect!.getComputedTiming();
            const target = (a.effect as KeyframeEffect).target as Element;
            return {
              name: (a as CSSAnimation).animationName,
              on: target.classList.contains("ks-doodle__fill") ? "fill" : target.tagName.toLowerCase(),
              delay: Number(t.delay),
              duration: Number(t.duration),
              state: a.playState,
            };
          }),
        };
      }),
    { board: BOARD, strokes: STROKES },
  );

/** An animation's timing to the microsecond: calc(var(--duration-base) * 6) computes to 1200.0000000000002 ms. */
const rounded = <T extends { delay: number; duration: number }>(a: T): T => ({
  ...a,
  delay: Math.round(a.delay * 1000) / 1000,
  duration: Math.round(a.duration * 1000) / 1000,
});

/** The DS doodle files' text, whitespace and quotes normalised as Vite does when it inlines an SVG as a data URI. */
const squash = (svg: string) => svg.trim().replace(/>\s+</g, "><").replace(/"/g, "'").replace(/\s+/g, " ");
const DS_DOODLES = (() => {
  const dir = join(ROOT, "design-system/project/assets/Doodles");
  return new Set(readdirSync(dir).filter((f) => f.endsWith(".svg")).map((f) => squash(readFileSync(join(dir, f), "utf8"))));
})();

/** Scrolls the board's top to the top of the screen in one step, so all five doodles enter together. */
const scrollBoardIn = (page: Page) =>
  page.evaluate((board) => {
    const el = document.querySelector<HTMLElement>(board)!;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
  }, BOARD);

test.describe("motion-doodle (pick 3B): below the fold, motion on", () => {
  for (const vp of [phone, laptop]) {
    test(`${vp.name}: each doodle waits undrawn, then draws over --duration-draw, staggered by its order`, async ({ harness }) => {
      const page = await openStory(harness, BELOW_THE_FOLD, vp, { reducedMotion: "no-preference" });
      const { draw, base, fast } = await tokens(page);
      expect([draw, base, fast], "DS tokens --duration-draw, -base, -fast").toEqual([800, 200, 120]);
      expect(await page.evaluate(armMotion, false), "motion arms with reduced motion off").toBe(true);
      await frames(page, 2);

      // Waiting below the fold: nothing marked, every stroke one dash long and hidden, every fill hidden.
      const waiting = await doodleState(page);
      expect(waiting.map((d) => d.order)).toEqual([1, 2, 3, 4, 5]);
      for (const d of waiting) {
        expect(d.drawn, `order ${d.order} is a drawing doodle`).toBe(true);
        expect(d.strokes, `order ${d.order} has strokes`).toBeGreaterThan(0);
        expect(new Set(d.dashes), `order ${d.order} stroke-dasharray`).toEqual(new Set(["1px"]));
        expect(new Set(d.offsets), `order ${d.order} waits undrawn`).toEqual(new Set([1]));
        if (d.fill !== null) expect(d.fill, `order ${d.order} fill hidden`).toBe(0);
      }
      expect(waiting.some((d) => d.fill !== null), "the story has a doodle with a filled dot").toBe(true);
      expect(await page.evaluate(() => Object.keys(window.__khIn!)), "nothing is marked before it enters").toEqual([]);

      // Sample every frame from just before the board enters until all five have drawn.
      await page.evaluate(
        ({ board, strokes, until }) => {
          const svgs = Array.from(document.querySelectorAll(`${board} svg.ks-doodle`));
          const samples: Sample[] = [];
          window.__khSamples = samples;
          const t0 = performance.now();
          const tick = () => {
            const now = performance.now();
            samples.push({
              t: now,
              doodles: svgs.map((svg) => {
                const offsets = Array.from(svg.querySelectorAll(strokes)).map((p) => parseFloat(getComputedStyle(p).strokeDashoffset));
                const fill = svg.querySelector(".ks-doodle__fill");
                return { min: Math.min(...offsets), max: Math.max(...offsets), offsets, fill: fill ? parseFloat(getComputedStyle(fill).opacity) : null };
              }),
            });
            if (now - t0 < until) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        { board: BOARD, strokes: STROKES, until: base * 2 * 4 + draw + fast + 1000 },
      );
      await frames(page, 3);
      await scrollBoardIn(page);
      await page.waitForFunction(() => Object.keys(window.__khIn!).length === 5, undefined, { timeout: 10_000 });
      await page.waitForFunction(
        (board) =>
          document
            .querySelector(board)!
            .getAnimations({ subtree: true })
            .every((a) => a.playState === "finished"),
        BOARD,
        { timeout: 10_000 },
      );
      await frames(page, 2);

      // The animations motion.css gives each doodle: exact token timings.
      for (const d of await doodleState(page)) {
        const step = base * 2 * (d.order - 1);
        const strokes = d.animations.filter((a) => a.on === "path");
        expect(strokes.length, `order ${d.order}: one draw per stroke`).toBe(d.strokes);
        for (const a of strokes) expect(rounded(a), `order ${d.order} stroke`).toMatchObject({ name: "ks-draw", delay: step, duration: draw, state: "finished" });
        const fills = d.animations.filter((a) => a.on === "fill");
        expect(fills.length, `order ${d.order}: the fill fades in`).toBe(d.fill === null ? 0 : 1);
        for (const a of fills) expect(rounded(a), `order ${d.order} fill`).toMatchObject({ name: "ks-fade-in", delay: step + draw, duration: fast });
        expect(new Set(d.offsets), `order ${d.order} drawn at the end`).toEqual(new Set([0]));
        if (d.fill !== null) expect(d.fill, `order ${d.order} fill shown at the end`).toBe(1);
      }

      // What was painted, frame by frame.
      const inAt = await page.evaluate(() => window.__khIn!);
      const times = Object.values(inAt);
      expect(Math.max(...times) - Math.min(...times), "the five doodles enter together").toBeLessThan(50);
      const samples = await page.evaluate(() => window.__khSamples!);
      expect(samples.length, "frames sampled").toBeGreaterThan(60);
      for (let i = 0; i < 5; i++) {
        const order = waiting[i].order;
        const entered = inAt[String(i)];
        const step = base * 2 * (order - 1);
        const mine = samples.map((s) => ({ t: s.t - entered, ...s.doodles[i] }));
        const before = mine.filter((s) => s.t < 0);
        expect(before.length, `order ${order}: sampled before it entered`).toBeGreaterThan(0);
        for (const s of before) expect([s.min, s.max], `order ${order} at ${s.t.toFixed(0)} ms: undrawn before it enters`).toEqual([1, 1]);
        const started = mine.find((s) => s.t >= 0 && s.min < 0.999);
        const done = mine.find((s) => s.t >= 0 && s.max <= 0.001);
        expect(started, `order ${order}: started drawing`).toBeDefined();
        expect(done, `order ${order}: finished drawing`).toBeDefined();
        expect(started!.t, `order ${order}: starts at its step (${step} ms)`).toBeGreaterThanOrEqual(step - SLACK_MS);
        expect(started!.t, `order ${order}: starts at its step (${step} ms)`).toBeLessThanOrEqual(step + SLACK_MS);
        expect(done!.t - step, `order ${order}: 1 -> 0 within --duration-draw (${draw} ms)`).toBeLessThanOrEqual(draw + SLACK_MS);
        expect(done!.t - step, `order ${order}: drawn over --duration-draw, not at once`).toBeGreaterThanOrEqual(draw - SLACK_MS);
        for (let k = 1; k < mine.length; k++) {
          mine[k].offsets.forEach((o, p) => expect(o, `order ${order} path ${p}: never rises`).toBeLessThanOrEqual(mine[k - 1].offsets[p] + 1e-6));
        }
        if (mine[0].fill !== null) {
          for (const s of mine.filter((x) => x.t < step + draw - SLACK_MS)) expect(s.fill, `order ${order} fill at ${s.t.toFixed(0)} ms`).toBe(0);
          expect(mine.at(-1)!.fill, `order ${order} fill at the end`).toBe(1);
        }
      }
    });
  }
});

test.describe("motion-doodle (pick 3B): reduced motion", () => {
  test(`${phone.name}: drawn at once, before and after entering, even with motion armed`, async ({ harness }) => {
    const page = await openStory(harness, BELOW_THE_FOLD, phone, { reducedMotion: "reduce" });
    expect(await page.evaluate(armMotion, true)).toBe(true);
    await frames(page, 2);
    for (const d of await doodleState(page)) {
      expect(new Set(d.offsets), `order ${d.order} drawn while waiting`).toEqual(new Set([0]));
      if (d.fill !== null) expect(d.fill, `order ${d.order} fill shown while waiting`).toBe(1);
      expect(d.animations, `order ${d.order} animations while waiting`).toEqual([]);
    }
    await scrollBoardIn(page);
    await page.waitForFunction(() => Object.keys(window.__khIn!).length === 5, undefined, { timeout: 10_000 });
    await frames(page, 3);
    for (const d of await doodleState(page)) {
      expect(new Set(d.offsets), `order ${d.order} drawn after entering`).toEqual(new Set([0]));
      if (d.fill !== null) expect(d.fill, `order ${d.order} fill shown after entering`).toBe(1);
      expect(d.animations, `order ${d.order} animations after entering`).toEqual([]);
    }
    expect(await page.evaluate(() => window.__khStarted!), "no animation started").toEqual([]);
  });
});

test.describe("motion-doodle (pick 3B): without JavaScript", () => {
  test(`${phone.name}: the rendered markup shows every doodle drawn`, async ({ harness }) => {
    const rendered = await openStory(harness, BELOW_THE_FOLD, phone, { reducedMotion: "no-preference" });
    await rendered.locator(`${BOARD} svg.ks-doodle`).nth(4).waitFor({ state: "attached" });
    const html = await rendered.evaluate(() => `<!doctype html>${document.documentElement.outerHTML}`);

    const context = await harness.context(phone, { reducedMotion: "no-preference", javaScriptEnabled: false });
    const url = `${test.info().project.use.baseURL}/kh-no-js-capture.html`;
    await context.route(url, (route) => route.fulfill({ status: 200, contentType: "text/html", body: html }));
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load" });
    expect(await page.evaluate(() => document.documentElement.classList.contains("js-motion")), "no js-motion without JavaScript").toBe(false);
    await page.locator(BOARD).scrollIntoViewIfNeeded();
    const doodles = await doodleState(page);
    expect(doodles.map((d) => d.order)).toEqual([1, 2, 3, 4, 5]);
    for (const d of doodles) {
      expect(new Set(d.dashes), `order ${d.order}: no dash without JavaScript`).toEqual(new Set(["none"]));
      expect(new Set(d.offsets), `order ${d.order}: drawn`).toEqual(new Set([0]));
      if (d.fill !== null) expect(d.fill, `order ${d.order}: fill shown`).toBe(1);
      expect(d.animations, `order ${d.order}: nothing animates`).toEqual([]);
    }
    const boxes = await page.locator(`${BOARD} svg.ks-doodle`).evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
    for (const w of boxes) expect(w, "each doodle is laid out").toBeGreaterThan(0);
  });
});

test.describe("motion-doodle (pick 2): hero doodles stay still", () => {
  for (const id of HERO_STORIES) {
    test(`${id}: no drawing doodle, the DS files as plain images, nothing animates`, async ({ harness }) => {
      const page = await openStory(harness, id, phone, { reducedMotion: "no-preference" });
      await page.evaluate(armMotion, false);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await frames(page, 3);
      await page.evaluate(() => window.scrollTo(0, 0));
      await frames(page, 3);
      const root = page.locator("#storybook-root");
      expect(await root.locator("[data-draw], svg.ks-doodle").count(), "no inline drawing doodle in a hero").toBe(0);
      // Every plain SVG image of the hero (shapes and doodles; rasters carry a srcset), with its served text.
      const plain = await root.locator("img:not([srcset])").evaluateAll((imgs) =>
        Promise.all(
          imgs.map(async (img) => ({
            alt: img.getAttribute("alt"),
            loading: img.getAttribute("loading"),
            fetchPriority: img.getAttribute("fetchpriority"),
            text: await fetch((img as HTMLImageElement).src).then((r) => r.text()),
          })),
        ),
      );
      const doodles = plain.filter((img) => DS_DOODLES.has(squash(img.text)));
      expect(doodles.length, "the hero's doodle is a DS doodle file as a plain image").toBeGreaterThan(0);
      // Eager as in the mockup, at low priority: React's server renderer preloads every eager <img> that is not
      // fetchpriority low, and these must not compete with the page's LCP image (tasks.md 2.3).
      for (const img of plain) {
        expect({ alt: img.alt, loading: img.loading, fetchPriority: img.fetchPriority }, "decorative, eager, low priority").toEqual({ alt: "", loading: null, fetchPriority: "low" });
      }
      expect(await page.evaluate(() => window.__khStarted!), "nothing animates in a hero").toEqual([]);
    });
  }
});
