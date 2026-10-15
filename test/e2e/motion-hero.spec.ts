import type { Browser, Page, TestInfo } from "@playwright/test";
import { expect, newGuardedContext, test } from "./support/fixtures";
import { VIEWPORTS } from "./support/viewports";

/* D049 pick 2, "hero picture: A still" (task 3.3; architecture §11.2 row 2, §11.3; test plan §4.7), on every
 * HeroSection story in the static Storybook build (the Playwright "storybook" project).
 *
 * For each hero layout, with motion on and with reduced motion, and with motion armed as MotionController arms it
 * (anything on screen marked is-in, then html.js-motion):
 *   - nothing in the hero animates: no transition or animation starts inside it from the first paint on, and none is
 *     running (getAnimations() empty);
 *   - the hero, its heading, h1, lead, board and CTA are at opacity 1 with no transform;
 *   - no block reveals and no doodle draws: no data-reveal, no data-draw, no inline drawing doodle; the board's doodles
 *     are the DS files as plain images.
 */

const STORIES = ["home-photo", "home-art", "product", "answer-photo", "answer-art", "answer-team", "answer-words", "contact", "hub"].map(
  (s) => `sections-herosection--${s}`,
);
const viewports = [VIEWPORTS.find((v) => v.width === 390)!, VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!];

declare global {
  interface Window {
    __khHeroMotion?: EventTarget[];
  }
}

/** Before the story's scripts: keeps every element a transition or an animation starts on. */
function recordTargets(): void {
  const targets: EventTarget[] = [];
  window.__khHeroMotion = targets;
  for (const type of ["transitionrun", "animationstart"]) {
    document.addEventListener(type, (e) => e.target && targets.push(e.target), true);
  }
}

type Still = {
  started: string[];
  running: string[];
  moved: string[];
  drawing: number;
  layers: string[];
};

async function readHero(page: Page): Promise<Still> {
  return page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>("#storybook-root section")!;
    const name = (el: Element) => `<${el.tagName.toLowerCase()}${el.getAttribute("class") ? `.${el.getAttribute("class")!.trim().split(/\s+/).join(".")}` : ""}>`;
    const inside = (t: EventTarget | null) => t instanceof Element && hero.contains(t);
    const watched = [hero, ...hero.querySelectorAll(".kh-heading, h1, .kh-heading__lead, .kh-art, .kh-photo, .kh-btn--cta")];
    return {
      started: (window.__khHeroMotion ?? []).filter(inside).map((t) => name(t as Element)),
      running: document.getAnimations().filter((a) => inside((a.effect as KeyframeEffect | null)?.target ?? null)).map((a) => a.constructor.name),
      moved: watched
        .filter((el) => {
          const s = getComputedStyle(el);
          return s.opacity !== "1" || s.transform !== "none";
        })
        .map(name),
      drawing: hero.querySelectorAll("[data-reveal], [data-draw], svg.ks-doodle").length,
      layers: [...hero.querySelectorAll(".kh-art > .kh-art__layer")].map((l) => l.tagName.toLowerCase()),
    };
  });
}

async function openHero(browser: Browser, info: TestInfo, story: string, vp: (typeof viewports)[number], reducedMotion: "reduce" | "no-preference") {
  const baseURL = info.project.use.baseURL;
  if (!baseURL) throw new Error("motion-hero runs in the storybook project (playwright.config.ts)");
  const context = await newGuardedContext(browser, vp, { reducedMotion });
  await context.addInitScript(recordTargets);
  const page = await context.newPage();
  await page.goto(`${baseURL}/iframe.html?id=${story}&viewMode=story`);
  await page.locator("#storybook-root section h1").waitFor();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  // Arm motion as MotionController does: what is on screen is marked first, then html.js-motion.
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal], [data-draw]").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in");
    });
    document.documentElement.classList.add("js-motion");
  });
  await page.waitForTimeout(400);
  return { context, page };
}

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test.describe(`motion: the hero is still (D049 pick 2), reduced motion ${reducedMotion}`, () => {
    for (const story of STORIES) {
      test(story, async ({ browser }, info) => {
        for (const vp of viewports) {
          const { context, page } = await openHero(browser, info, story, vp, reducedMotion);
          try {
            const hero = await readHero(page);
            expect(hero.started, `${vp.name}: nothing starts moving in the hero`).toEqual([]);
            expect(hero.running, `${vp.name}: nothing is running in the hero`).toEqual([]);
            expect(hero.moved, `${vp.name}: opacity 1 and no transform`).toEqual([]);
            expect(hero.drawing, `${vp.name}: no reveal, no drawing doodle`).toBe(0);
            expect(hero.layers.every((tag) => tag === "img"), `${vp.name}: the board's layers, doodles included, are plain images: ${hero.layers}`).toBe(true);
          } finally {
            await context.close();
          }
        }
      });
    }
  });
}
