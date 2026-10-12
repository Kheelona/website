import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { expect, newGuardedContext, test } from "./support/fixtures";
import { VIEWPORTS } from "./support/viewports";

/* D049 pick 7, "FAQ answers: B smooth open" (task 2.4; architecture §11.2 row 7, §11.3; test plan §4.7), on the
 * FaqList story in the static Storybook build (the Playwright "storybook" project; `npm run build-storybook`).
 *
 *   - motion on, in a browser with ::details-content (Chromium): opening an answer runs one grid-template-rows
 *     transition on the details' content slot over --duration-enter with --ease-standard; part-way through, the
 *     answer's clip (.ks-faq__clip) is taller than nothing and shorter than the answer, so the row grows 0fr → 1fr
 *     and the DS padding never shows above it; at the end the clip is the answer's full height, and the plus sign
 *     has turned 45 degrees (the DS's own transition, bundle.css .kh-faq__sign);
 *   - a browser without ::details-content (older iOS Safari; pick 7A): the answer opens at once. The Chromium build
 *     Playwright ships cannot switch the feature off (--disable-blink-features=DetailsStyling leaves
 *     CSS.supports("selector(::details-content)") true, probe 2026-10-12, Chrome 153), so the run serves the same
 *     stylesheet with that one @supports condition made false, which is what such a browser does with the block;
 *   - reduced motion: the answer opens at once and nothing transitions.
 * Each transition is paused and stepped through with the Web Animations API, so no assertion depends on timing.
 */

const vp = VIEWPORTS.find((v) => v.width === 390)!;
const STORY = "ui-faqlist--default";
const SUPPORTS = "selector(::details-content)";

type Opened = {
  supports: boolean;
  /** Every transition the click started, by property. */
  transitions: { property: string; duration: number; easing: string; pseudo: string | null; target: string }[];
  /** The clip's height at 0 %, 50 % and 100 % of the grid-template-rows transition (null when there is none). */
  steps: [number, number, number] | null;
  /** The clip's and the answer's heights once everything has finished. */
  clip: number;
  answer: number;
  /** The plus sign's rotation in degrees, once everything has finished. */
  signDeg: number;
  /** --duration-enter, --duration-base (ms) and --ease-standard as the page resolves them. */
  enter: number;
  base: number;
  ease: string;
};

async function openStory(context: BrowserContext, info: TestInfo): Promise<Page> {
  const baseURL = info.project.use.baseURL;
  if (!baseURL) throw new Error("motion-faq runs in the storybook project (playwright.config.ts)");
  const page = await context.newPage();
  await page.goto(`${baseURL}/iframe.html?id=${STORY}&viewMode=story`);
  await page.locator("#storybook-root .kh-faq__q").first().waitFor();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

/** Clicks the first question, then reads everything the pick promises, stepping each transition by hand. */
async function openFirstAnswer(page: Page): Promise<Opened> {
  const item = page.locator(".kh-faq__item").first();
  expect(await item.evaluate((d) => (d as HTMLDetailsElement).open), "the story starts with every answer closed").toBe(false);
  await item.locator(".kh-faq__q").click();
  return page.evaluate((supports) => {
    const details = document.querySelector<HTMLDetailsElement>(".kh-faq__item")!;
    const clip = details.querySelector<HTMLElement>(".ks-faq__clip")!;
    const answer = details.querySelector<HTMLElement>(".kh-faq__a")!;
    const sign = details.querySelector<HTMLElement>(".kh-faq__sign")!;
    const ms = (v: string) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
    const root = getComputedStyle(document.documentElement);
    const transitions = document.getAnimations().filter((a): a is CSSTransition => a instanceof CSSTransition);
    const describe = transitions.map((t) => {
      const effect = t.effect as KeyframeEffect;
      return {
        property: t.transitionProperty,
        duration: Number(effect.getComputedTiming().duration),
        easing: effect.getTiming().easing ?? "",
        pseudo: effect.pseudoElement,
        target: (effect.target as Element | null)?.className ?? "",
      };
    });
    const rows = transitions.find((t) => t.transitionProperty === "grid-template-rows");
    let steps: [number, number, number] | null = null;
    if (rows) {
      const total = Number(rows.effect!.getComputedTiming().duration);
      rows.pause();
      const at = (fraction: number) => {
        rows.currentTime = total * fraction;
        return clip.getBoundingClientRect().height;
      };
      steps = [at(0), at(0.5), at(1)];
    }
    document.getAnimations().forEach((a) => a.finish());
    const m = new DOMMatrix(getComputedStyle(sign).transform);
    return {
      supports: CSS.supports(supports),
      transitions: describe,
      steps,
      clip: clip.getBoundingClientRect().height,
      answer: answer.getBoundingClientRect().height,
      signDeg: Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI),
      enter: ms(root.getPropertyValue("--duration-enter")),
      base: ms(root.getPropertyValue("--duration-base")),
      ease: root.getPropertyValue("--ease-standard").trim(),
    };
  }, SUPPORTS);
}

test.describe("motion: FAQ answers open smoothly (D049 pick 7)", () => {
  test("with ::details-content: the answer's row grows 0fr → 1fr over --duration-enter, the sign turns 45°", async ({ browser }, info) => {
    const context = await newGuardedContext(browser, vp, { reducedMotion: "no-preference" });
    try {
      const page = await openStory(context, info);
      const o = await openFirstAnswer(page);
      expect(o.supports, "this Chromium has ::details-content").toBe(true);
      expect(o.enter, "--duration-enter resolves").toBeGreaterThan(0);

      const rows = o.transitions.filter((t) => t.property === "grid-template-rows");
      expect(rows, JSON.stringify(o.transitions)).toHaveLength(1);
      expect(rows[0].pseudo).toBe("::details-content");
      expect(rows[0].target).toBe("kh-faq__item");
      expect(rows[0].duration).toBe(o.enter);
      expect(rows[0].easing.replace(/\s/g, "")).toBe(o.ease.replace(/\s/g, ""));

      const [start, middle, end] = o.steps!;
      expect(start, "at 0 % the answer row is closed (0fr): no DS padding shows").toBeLessThan(1);
      expect(middle, "half-way the row is growing").toBeGreaterThan(start + 1);
      expect(middle, "half-way the row is still short of the answer").toBeLessThan(o.answer - 1);
      expect(Math.abs(end - o.answer), "at 100 % the row holds the whole answer (1fr)").toBeLessThan(1);
      expect(Math.abs(o.clip - o.answer), "open: the clip is the answer's height").toBeLessThan(1);

      const sign = o.transitions.filter((t) => t.property === "transform" && t.target.includes("kh-faq__sign"));
      expect(sign, "the sign turns with the DS's own transition (bundle.css)").toHaveLength(1);
      expect(sign[0].duration).toBe(o.base);
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
      expect(o.transitions.filter((t) => t.property === "grid-template-rows" || t.property === "content-visibility")).toEqual([]);
      expect(o.steps).toBeNull();
      expect(Math.abs(o.clip - o.answer), "open at once: the clip is the answer's height").toBeLessThan(1);
      expect(o.answer).toBeGreaterThan(0);
    } finally {
      await context.close();
    }
  });

  test("reduced motion: the answer opens at once and nothing transitions", async ({ browser }, info) => {
    const context = await newGuardedContext(browser, vp, { reducedMotion: "reduce" });
    try {
      const page = await openStory(context, info);
      const o = await openFirstAnswer(page);
      expect(o.supports).toBe(true);
      expect(o.transitions, JSON.stringify(o.transitions)).toEqual([]);
      expect(o.steps).toBeNull();
      expect(Math.abs(o.clip - o.answer)).toBeLessThan(1);
      expect(o.answer).toBeGreaterThan(0);
      expect(o.signDeg, "the sign shows the open state at once").toBe(45);
    } finally {
      await context.close();
    }
  });
});
