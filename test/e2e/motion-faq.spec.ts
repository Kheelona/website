import type { Browser, BrowserContext, Page, TestInfo } from "@playwright/test";
import { expect, newGuardedContext, test } from "./support/fixtures";
import { VIEWPORTS } from "./support/viewports";

/* D049 pick 7, "FAQ answers: B smooth open" (task 2.4; architecture §11.2 row 7, §11.3; test plan §4.7), on the
 * FaqList story in the static Storybook build (the Playwright "storybook" project; `npm run build-storybook`).
 *
 *   - motion on, in a browser with ::details-content (Chromium): the details' content slot carries one
 *     grid-template-rows transition over --duration-enter with --ease-standard; after a real click the answer's
 *     clip (.ks-faq__clip) grows frame by frame from nothing to the answer's full height (0fr → 1fr), never
 *     showing the DS padding first, and takes about --duration-enter to get there; the plus sign turns 45 degrees
 *     with the DS's own rule (bundle.css .kh-faq__sign, --duration-base);
 *   - a browser without ::details-content (older iOS Safari; pick 7A): the answer opens at once. The Chromium build
 *     Playwright ships cannot switch the feature off (--disable-blink-features=DetailsStyling leaves
 *     CSS.supports("selector(::details-content)") true, probe 2026-10-12, Chrome 153), so the run serves the same
 *     stylesheet with that one @supports condition made false, which is what such a browser does with the block;
 *   - reduced motion: the answer opens at once and nothing turns or grows.
 *   - the question is a native summary: Enter and Space open it.
 *
 * WebKit (task 2.12). With KH_WEBKIT=1 the same four cases also run in WebKit, the engine of Safari on iPhones, in the
 * webkit-storybook project (test/e2e/support/projects.ts, task 3.6: the engine comes from the project, as for the
 * layout specs; this spec launches no browser of its own). The WebKit that the pinned Playwright 1.63.0 installs
 * (Safari 26.6, `npx playwright install webkit`) HAS ::details-content (probe 2026-10-12: CSS.supports true, the slot's
 * computed transition "grid-template-rows, content-visibility"), so there the smooth open is checked natively, like
 * Chromium. The 7A case runs there as well, with the same stylesheet rewrite: WebKit without that @supports block is
 * what an older iOS Safari does with it. Run it with
 *   KH_WEBKIT=1 npx playwright test --project=webkit-storybook test/e2e/motion-faq.spec.ts
 *
 * How it is measured. Chromium 153 runs the ::details-content transition but does not list it in
 * document.getAnimations() (probe 2026-10-12: only the sign's transform appears), so the transition is read from the
 * pseudo-element's computed style and its effect is sampled: the clip's height on every animation frame from the
 * click until it has held still for six frames. The sign's transition is an ordinary CSSTransition and is read from
 * getAnimations().
 */

const vp = VIEWPORTS.find((v) => v.width === 390)!;
const STORY = "ui-faqlist--default";
const SUPPORTS = "selector(::details-content)";

type Opened = {
  supports: boolean;
  /** The content slot's computed transition, before the click: one entry per listed property. */
  slot: { property: string; duration: number; easing: string }[];
  /** The clip's height before the click (the closed answer). */
  closed: number;
  /** The clip's height on each animation frame after the click, with milliseconds since the click. */
  frames: { t: number; h: number }[];
  /** The clip's and the answer's heights once everything has settled. */
  clip: number;
  answer: number;
  /** Transitions the click started on the plus sign, with their durations (ms). */
  sign: number[];
  /** The plus sign's rotation in degrees, once everything has settled. */
  signDeg: number;
  /** --duration-enter, --duration-base (ms) and --ease-standard as the page resolves them. */
  enter: number;
  base: number;
  ease: string;
};

const norm = (v: string) => v.replace(/\s/g, "");

async function openStory(context: BrowserContext, info: TestInfo): Promise<Page> {
  const baseURL = info.project.use.baseURL;
  if (!baseURL) throw new Error("motion-faq runs in the storybook and webkit-storybook projects (playwright.config.ts)");
  const page = await context.newPage();
  await page.goto(`${baseURL}/iframe.html?id=${STORY}&viewMode=story`);
  await page.locator("#storybook-root .kh-faq__q").first().waitFor();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

/** Clicks the first question for real, sampling the clip on every frame from that click until it is still. */
async function openFirstAnswer(page: Page): Promise<Opened> {
  const item = page.locator(".kh-faq__item").first();
  expect(await item.evaluate((d) => (d as HTMLDetailsElement).open), "the story starts with every answer closed").toBe(false);

  const before = await page.evaluate((supports) => {
    const details = document.querySelector<HTMLDetailsElement>(".kh-faq__item")!;
    const clip = details.querySelector<HTMLElement>(".ks-faq__clip")!;
    const sign = details.querySelector<HTMLElement>(".kh-faq__sign")!;
    const ms = (v: string) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
    const slotStyle = getComputedStyle(details, "::details-content");
    const list = (v: string) => v.split(/,(?![^(]*\))/).map((s) => s.trim());
    const properties = list(slotStyle.transitionProperty);
    const durations = list(slotStyle.transitionDuration).map(ms);
    const easings = list(slotStyle.transitionTimingFunction);
    const slot = properties.map((property, i) => ({
      property,
      duration: durations[i % durations.length],
      easing: easings[i % easings.length],
    }));
    const root = getComputedStyle(document.documentElement);

    // The recorder: starts on the click itself (capture phase), samples every frame until six still frames
    // after the answer has opened, or two seconds.
    const record = { frames: [] as { t: number; h: number }[], sign: [] as number[], done: false };
    (window as unknown as { __faq: typeof record }).__faq = record;
    details.querySelector(".kh-faq__q")!.addEventListener(
      "click",
      () => {
        const t0 = performance.now();
        requestAnimationFrame(() => {
          record.sign = document
            .getAnimations()
            .filter((a): a is CSSTransition => a instanceof CSSTransition && (a.effect as KeyframeEffect).target === sign)
            .map((a) => Number(a.effect!.getComputedTiming().duration));
        });
        let still = 0;
        let last = -1;
        const tick = (now: number) => {
          const h = clip.getBoundingClientRect().height;
          record.frames.push({ t: now - t0, h });
          still = Math.abs(h - last) < 0.01 && h > 0 ? still + 1 : 0;
          last = h;
          if (still >= 6 || now - t0 > 2000) record.done = true;
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { capture: true, once: true },
    );

    return {
      supports: CSS.supports(supports),
      slot,
      closed: clip.getBoundingClientRect().height,
      enter: ms(root.getPropertyValue("--duration-enter")),
      base: ms(root.getPropertyValue("--duration-base")),
      ease: root.getPropertyValue("--ease-standard").trim(),
    };
  }, SUPPORTS);

  await item.locator(".kh-faq__q").click();
  await page.waitForFunction(() => (window as unknown as { __faq: { done: boolean } }).__faq.done);

  const after = await page.evaluate(() => {
    const record = (window as unknown as { __faq: { frames: { t: number; h: number }[]; sign: number[] } }).__faq;
    const details = document.querySelector<HTMLDetailsElement>(".kh-faq__item")!;
    document.getAnimations().forEach((a) => a.finish());
    const m = new DOMMatrix(getComputedStyle(details.querySelector<HTMLElement>(".kh-faq__sign")!).transform);
    return {
      frames: record.frames,
      sign: record.sign,
      clip: details.querySelector<HTMLElement>(".ks-faq__clip")!.getBoundingClientRect().height,
      answer: details.querySelector<HTMLElement>(".kh-faq__a")!.getBoundingClientRect().height,
      signDeg: Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI),
    };
  });
  return { ...before, ...after };
}

/** Frames strictly between closed and open: the answer was seen growing. */
const growing = (o: Opened) => o.frames.filter((f) => f.h > 1 && f.h < o.answer - 1);

/** The engine of this run, from its project: Chromium (storybook) or WebKit (webkit-storybook, KH_WEBKIT=1). */
const engineOf = (browser: Browser) => (browser.browserType().name() === "webkit" ? "WebKit" : "Chromium");

test.describe("motion: FAQ answers open smoothly (D049 pick 7)", () => {
  test("runs in the engine its project names", ({ browser }, info) => {
    expect(browser.browserType().name()).toBe(info.project.use.browserName ?? "chromium");
  });

  test("with ::details-content: the answer's row grows 0fr → 1fr over --duration-enter, the sign turns 45°", async ({ browser }, info) => {
    const context = await newGuardedContext(browser, vp, { reducedMotion: "no-preference" });
    try {
      const page = await openStory(context, info);
      const o = await openFirstAnswer(page);
      expect(o.supports, `this ${engineOf(browser)} has ::details-content`).toBe(true);
      expect(o.enter, "--duration-enter resolves").toBeGreaterThan(0);

      const rows = o.slot.filter((s) => s.property === "grid-template-rows");
      expect(rows, JSON.stringify(o.slot)).toHaveLength(1);
      expect(rows[0].duration, "over --duration-enter").toBe(o.enter);
      expect(norm(rows[0].easing), "with --ease-standard").toBe(norm(o.ease));
      expect(o.slot.map((s) => s.property).sort(), "and nothing else moves but the discrete content-visibility switch").toEqual([
        "content-visibility",
        "grid-template-rows",
      ]);

      const frames = JSON.stringify(o.frames.map((f) => [Math.round(f.t), Math.round(f.h)]));
      expect(o.closed, "closed: the clip holds nothing, so no DS padding shows").toBeLessThan(1);
      expect(o.frames[0].h, `the first frame after the click is not yet open: ${frames}`).toBeLessThan(o.answer - 1);
      expect(growing(o).length, `the row is seen growing: ${frames}`).toBeGreaterThan(1);
      for (let i = 1; i < o.frames.length; i++) {
        expect(o.frames[i].h, `the row only grows: ${frames}`).toBeGreaterThanOrEqual(o.frames[i - 1].h - 0.5);
      }
      const full = o.frames.find((f) => f.h >= o.answer - 0.5);
      expect(full, `the row reaches the whole answer: ${frames}`).toBeDefined();
      expect(full!.t, `it takes about --duration-enter (${o.enter} ms), not an instant: ${frames}`).toBeGreaterThanOrEqual(o.enter * 0.5);
      expect(full!.t, `and is done soon after --duration-enter: ${frames}`).toBeLessThanOrEqual(o.enter + 750);
      expect(Math.abs(o.clip - o.answer), "open: the clip is the answer's height (1fr)").toBeLessThan(1);

      expect(o.sign, "the sign turns with the DS's own rule (bundle.css)").toEqual([o.base]);
      expect(o.signDeg).toBe(45);
    } finally {
      await context.close();
    }
  });

  test("without ::details-content: the answer opens at once (pick 7A)", async ({ browser }, info) => {
    const context = await newGuardedContext(browser, vp, { reducedMotion: "no-preference" });
    try {
      let rewritten = 0;
      await context.route("**/assets/*.css", async (route) => {
        const response = await route.fetch();
        const css = await response.text();
        if (css.includes(SUPPORTS)) rewritten++;
        await route.fulfill({ response, body: css.split(SUPPORTS).join("selector(::ks-unsupported-pseudo)") });
      });
      const page = await openStory(context, info);
      const o = await openFirstAnswer(page);
      expect(rewritten, "the stylesheet carrying the @supports block was served").toBeGreaterThan(0);
      expect(o.slot.filter((s) => s.property === "grid-template-rows"), JSON.stringify(o.slot)).toEqual([]);
      const frames = JSON.stringify(o.frames.map((f) => [Math.round(f.t), Math.round(f.h)]));
      expect(o.answer).toBeGreaterThan(0);
      expect(Math.abs(o.frames[0].h - o.answer), `open on the first frame: ${frames}`).toBeLessThan(1);
      expect(growing(o), frames).toEqual([]);
      expect(Math.abs(o.clip - o.answer), "open at once: the clip is the answer's height").toBeLessThan(1);
    } finally {
      await context.close();
    }
  });

  test("reduced motion: the answer opens at once and nothing turns or grows", async ({ browser }, info) => {
    const context = await newGuardedContext(browser, vp, { reducedMotion: "reduce" });
    try {
      const page = await openStory(context, info);
      const o = await openFirstAnswer(page);
      expect(o.supports).toBe(true);
      expect(o.slot.every((s) => s.duration === 0), JSON.stringify(o.slot)).toBe(true);
      const frames = JSON.stringify(o.frames.map((f) => [Math.round(f.t), Math.round(f.h)]));
      expect(o.answer).toBeGreaterThan(0);
      expect(Math.abs(o.frames[0].h - o.answer), `open on the first frame: ${frames}`).toBeLessThan(1);
      expect(growing(o), frames).toEqual([]);
      expect(o.sign, "the sign does not turn: it shows the open state at once").toEqual([]);
      expect(o.signDeg).toBe(45);
    } finally {
      await context.close();
    }
  });

  test("the question is a native summary: Enter and Space open it from the keyboard", async ({ browser }, info) => {
    const context = await newGuardedContext(browser, vp, { reducedMotion: "reduce" });
    try {
      const page = await openStory(context, info);
      const questions = page.locator(".kh-faq__q");
      const items = page.locator(".kh-faq__item");
      await questions.nth(0).focus();
      await page.keyboard.press("Enter");
      await expect.poll(() => items.nth(0).evaluate((d) => (d as HTMLDetailsElement).open)).toBe(true);
      await questions.nth(1).focus();
      await page.keyboard.press("Space");
      await expect.poll(() => items.nth(1).evaluate((d) => (d as HTMLDetailsElement).open)).toBe(true);
      await page.keyboard.press("Space");
      await expect.poll(() => items.nth(1).evaluate((d) => (d as HTMLDetailsElement).open), "and close it again").toBe(false);
    } finally {
      await context.close();
    }
  });
});
