import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { describeFindings, runAxe } from "./support/axe";
import { expect, newGuardedContext, test } from "./support/fixtures";
import { VIEWPORTS, type Viewport } from "./support/viewports";

/* The parent films strip (task 3.3; D040; mockup.js sections 4 and 5; architecture §10, §13), on the FilmsStrip
 * stories in the static Storybook build (the Playwright "storybook" project; `npm run build-storybook`).
 *
 *   - at rest: no <video> (axe video-caption), seven play buttons labelled "Play: {chip}. {caption}" (D040, the
 *     PostHog "Play:" measure), the line "1 of 7" on a phone and "1–3 of 7" on a laptop, Previous disabled;
 *   - Previous and Next scroll one film each and stop at the ends (the line follows: "7 of 7", "5–7 of 7");
 *   - keyboard: Tab reaches the first play button; Enter swaps the poster for the film, which takes focus, with native
 *     controls; one film at a time;
 *   - the film pauses once less than half of it is on screen; when it ends the poster comes back and focus returns to
 *     its play button;
 *   - axe: no critical or serious finding with the film mounted or unmounted (the accepted exceptions of
 *     support/axe.ts are printed apart).
 * Playback is observed, not watched: an init script stands in for HTMLMediaElement play() and pause() (the Chromium
 * Playwright ships may not decode H.264), recording each call; the element, its attributes and its events are real.
 */

const HOME = "sections-filmsstrip--home";
const PRODUCT = "sections-filmsstrip--product";
const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;

declare global {
  interface Window {
    __khMedia?: { play: string[]; pause: string[] };
  }
}

/** Stands in for media playback before the story's scripts run, recording which film was played or paused. */
function stubMedia(): void {
  const log = { play: [] as string[], pause: [] as string[] };
  window.__khMedia = log;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
    log.play.push(this.getAttribute("src") ?? "");
    return Promise.resolve();
  };
  HTMLMediaElement.prototype.pause = function (this: HTMLMediaElement) {
    log.pause.push(this.getAttribute("src") ?? "");
  };
}

async function openStory(context: BrowserContext, info: TestInfo, story: string): Promise<Page> {
  const baseURL = info.project.use.baseURL;
  if (!baseURL) throw new Error("films.spec runs in the storybook project (playwright.config.ts)");
  await context.addInitScript(stubMedia);
  const page = await context.newPage();
  await page.goto(`${baseURL}/iframe.html?id=${story}&viewMode=story`);
  await page.locator("#storybook-root [data-films]").waitFor();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

const position = (page: Page) => page.locator("[data-films-pos]");
const prev = (page: Page) => page.getByRole("button", { name: "Previous video" });
const next = (page: Page) => page.getByRole("button", { name: "Next video" });

async function withStory(browser: import("@playwright/test").Browser, info: TestInfo, vp: Viewport, story: string, run: (page: Page) => Promise<void>) {
  const context = await newGuardedContext(browser, vp);
  try {
    await run(await openStory(context, info, story));
  } finally {
    await context.close();
  }
}

test.describe("films strip: at rest", () => {
  test(`phone ${phone.name}: no video, seven named play buttons, "1 of 7", Previous disabled`, async ({ browser }, info) => {
    await withStory(browser, info, phone, HOME, async (page) => {
      await expect(page.locator("video")).toHaveCount(0);
      const labels = await page.locator(".ks-film__play").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
      expect(labels).toHaveLength(7);
      for (const label of labels) expect(label).toMatch(/^Play: [^.]+\. .+/);
      expect(labels[0]).toBe("Play: Learning by asking. Kheelu asks her to explain carrom, and thanks her for the reminder.");
      await expect(position(page)).toHaveText("1 of 7");
      await expect(prev(page)).toBeDisabled();
      await expect(next(page)).toBeEnabled();
    });
  });

  test(`laptop ${laptop.name}: three films at rest, "1–3 of 7"`, async ({ browser }, info) => {
    await withStory(browser, info, laptop, HOME, async (page) => {
      await expect(position(page)).toHaveText("1–3 of 7");
      await expect(prev(page)).toBeDisabled();
    });
  });
});

test.describe("films strip: Previous and Next", () => {
  for (const [vp, steps, last] of [
    [phone, 6, "7 of 7"],
    [laptop, 4, "5–7 of 7"],
  ] as const) {
    test(`${vp.name}: each press moves one film and the ends stop the buttons`, async ({ browser }, info) => {
      await withStory(browser, info, vp, PRODUCT, async (page) => {
        const shown = vp === phone ? (i: number) => `${i} of 7` : (i: number) => `${i}–${i + 2} of 7`;
        for (let i = 1; i <= steps; i++) {
          await next(page).click();
          await expect(position(page)).toHaveText(i === steps ? last : shown(i + 1));
        }
        await expect(next(page)).toBeDisabled();
        await expect(prev(page)).toBeEnabled();
        for (let i = steps; i >= 1; i--) {
          await prev(page).click();
          await expect(position(page)).toHaveText(shown(i));
        }
        await expect(prev(page)).toBeDisabled();
      });
    });
  }
});

test.describe("films strip: playback", () => {
  test("keyboard: Tab reaches the first play button, Enter plays that film with native controls, focused", async ({ browser }, info) => {
    await withStory(browser, info, phone, PRODUCT, async (page) => {
      await page.keyboard.press("Tab");
      const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
      expect(focused).toBe("Play: Learning by asking. Kheelu asks her to explain carrom, and thanks her for the reminder.");
      await page.keyboard.press("Enter");
      const video = page.locator("video");
      await expect(video).toHaveCount(1);
      await expect(video).toHaveAttribute("src", "/video/moments/learning-by-asking.mp4");
      await expect(video).toHaveAttribute("controls", "");
      await expect(video).toHaveAttribute("playsinline", "");
      await expect(video).toHaveAttribute("preload", "none");
      await expect(video).toHaveAttribute("aria-label", "Learning by asking. Kheelu asks her to explain carrom, and thanks her for the reminder.");
      await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe("VIDEO");
      expect(await page.evaluate(() => window.__khMedia?.play)).toEqual(["/video/moments/learning-by-asking.mp4"]);
      await expect(page.locator('[data-video-id="learning-by-asking"] .ks-film__play')).toBeHidden();
    });
  });

  test("one film at a time: playing another removes the first and brings its poster back", async ({ browser }, info) => {
    await withStory(browser, info, laptop, PRODUCT, async (page) => {
      await page.locator('[data-video-id="learning-by-asking"] .ks-film__play').click();
      await page.locator('[data-video-id="first-conversations"] .ks-film__play').click();
      await expect(page.locator("video")).toHaveCount(1);
      await expect(page.locator("video")).toHaveAttribute("src", "/video/moments/first-conversations.mp4");
      await expect(page.locator('[data-video-id="learning-by-asking"] .ks-film__play')).toBeVisible();
    });
  });

  test("pauses once less than half the film is on screen", async ({ browser }, info) => {
    await withStory(browser, info, phone, PRODUCT, async (page) => {
      await page.locator('[data-video-id="learning-by-asking"] .ks-film__play').click();
      await expect(page.locator("video")).toHaveCount(1);
      // Scroll the film itself out of the strip (and so off screen), as a swipe to the next films does.
      await page.locator("[data-films]").evaluate((t) => t.scrollTo({ left: t.scrollWidth, behavior: "instant" }));
      await expect.poll(() => page.evaluate(() => window.__khMedia?.pause.length ?? 0)).toBeGreaterThan(0);
      expect(await page.evaluate(() => window.__khMedia?.pause[0])).toBe("/video/moments/learning-by-asking.mp4");
    });
  });

  test("on end: the poster comes back and focus returns to its play button", async ({ browser }, info) => {
    await withStory(browser, info, phone, PRODUCT, async (page) => {
      const button = page.locator('[data-video-id="learning-by-asking"] .ks-film__play');
      await button.click();
      await page.locator("video").dispatchEvent("ended");
      await expect(page.locator("video")).toHaveCount(0);
      await expect(button).toBeVisible();
      await expect(button).toBeFocused();
    });
  });
});

test.describe("films strip: axe", () => {
  for (const vp of [phone, laptop]) {
    test(`${vp.name}: no critical or serious finding with the film unmounted, then mounted`, async ({ browser }, info) => {
      await withStory(browser, info, vp, HOME, async (page) => {
        for (const state of ["unmounted", "mounted"] as const) {
          if (state === "mounted") {
            await page.locator(".ks-film__play").first().click();
            await expect(page.locator("video")).toHaveCount(1);
          }
          const { blocking, accepted, apart } = await runAxe(page);
          if (accepted.length || apart.length) console.log(`[films axe ${vp.name} ${state}] accepted or apart:\n${describeFindings([...accepted, ...apart])}`);
          expect(blocking, `${state}:\n${describeFindings(blocking)}`).toEqual([]);
        }
      });
    });
  }
});
