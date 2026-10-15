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
 *     support/axe.ts are printed apart);
 *   - the single film (task 8c.6, the product page's expert clip, story Expert): at rest no <video> and no request for
 *     the film, the poster, the chip and one named play control; Tab and Enter play it focused, with sound; focus
 *     returns at the end; axe at 360, 390 and 1440 with the film unmounted and mounted.
 * Playback is observed, not watched: an init script stands in for HTMLMediaElement play() and pause() (the Chromium
 * Playwright ships may not decode H.264), recording each call; the element, its attributes and its events are real.
 */

const HOME = "sections-filmsstrip--home";
const PRODUCT = "sections-filmsstrip--product";
/** The single film (task 8c.6): the product page's expert clip, FilmsStrip's `single` layout. */
const EXPERT = "sections-filmsstrip--expert";
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
  await page.locator(story === EXPERT ? "#storybook-root .ks-clip" : "#storybook-root [data-films]").waitFor();
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

/** Storybook's a11y addon runs its own axe in the preview when a story renders; ours waits until that run is over. */
async function axeWhenIdle(page: Page): ReturnType<typeof runAxe> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await runAxe(page);
    } catch (error) {
      if (attempt >= 20 || !/Axe is already running/.test(String(error))) throw error;
      await page.waitForTimeout(250);
    }
  }
}

/* The single film (task 8c.6; D061 items 12-13): the expert clip as the product page shows it (the Expert story is the
   page's own fold from content). At rest: no <video>, no request for the film (resource timing names every fetch), the
   poster, the chip hidden from screen readers and one play control named as the plan says. Keyboard: Tab reaches the
   play control, Enter plays the film with sound and native controls, focused; at the end the poster comes back and focus
   returns. axe below. */
const CLIP = "/video/expert/expert-clip.mp4";
const CLIP_PLAY = "Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds.";

test.describe("the single film: the expert clip (task 8c.6)", () => {
  for (const vp of [phone, laptop]) {
    test(`${vp.name}: at rest, no video and no byte of the film; the poster, the chip and one named play control`, async ({ browser }, info) => {
      await withStory(browser, info, vp, EXPERT, async (page) => {
        await expect(page.locator("video")).toHaveCount(0);
        await expect(page.locator(".ks-clip__frame img")).toBeVisible();
        await expect(page.getByRole("button", { name: CLIP_PLAY })).toBeVisible();
        await expect(page.getByRole("button")).toHaveCount(1);
        await expect(page.locator(".ks-clip__chip")).toHaveAttribute("aria-hidden", "true");
        await expect(page.locator(".ks-clip__chip")).toHaveText("0:34 · With captions");
        await expect(page.locator(".ks-clip__credit")).toHaveText(/Chaitra, therapist and developmental coach\s*Kheelona made this video with Chaitra and compensated her for it\./);
        const fetched = await page.evaluate(() => performance.getEntriesByType("resource").map((e) => e.name));
        expect(fetched.filter((url) => url.includes("expert-clip.mp4"))).toEqual([]);
        // The frame is the film's 16:9 and the credit sits under it.
        const frame = (await page.locator(".ks-clip__frame").boundingBox())!;
        expect(frame.width / frame.height).toBeCloseTo(16 / 9, 1);
        expect((await page.locator(".ks-clip__credit").boundingBox())!.y).toBeGreaterThanOrEqual(frame.y + frame.height);
      });
    });
  }

  test("keyboard: Tab reaches the play control, Enter plays the film with sound and native controls, focused; on end focus returns", async ({ browser }, info) => {
    await withStory(browser, info, phone, EXPERT, async (page) => {
      await page.keyboard.press("Tab");
      expect(await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))).toBe(CLIP_PLAY);
      await page.keyboard.press("Enter");
      const video = page.locator("video");
      await expect(video).toHaveCount(1);
      await expect(video).toHaveAttribute("src", CLIP);
      await expect(video).toHaveAttribute("controls", "");
      await expect(video).toHaveAttribute("playsinline", "");
      await expect(video).toHaveAttribute("preload", "none");
      await expect(video).not.toHaveAttribute("muted", "");
      await expect(video).not.toHaveAttribute("autoplay", "");
      await expect(video).not.toHaveAttribute("loop", "");
      await expect(video).toHaveAttribute("aria-label", "The video from an expert: Chaitra, therapist and developmental coach");
      await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe("VIDEO");
      expect(await page.evaluate(() => window.__khMedia?.play)).toEqual([CLIP]);
      await expect(page.locator(".ks-film__play")).toBeHidden();
      await video.dispatchEvent("ended");
      await expect(video).toHaveCount(0);
      await expect(page.getByRole("button", { name: CLIP_PLAY })).toBeFocused();
    });
  });

  for (const vp of [VIEWPORTS.find((v) => v.width === 360)!, phone, laptop]) {
    test(`${vp.name}: axe, no critical or serious finding with the film unmounted, then mounted`, async ({ browser }, info) => {
      await withStory(browser, info, vp, EXPERT, async (page) => {
        for (const state of ["unmounted", "mounted"] as const) {
          if (state === "mounted") {
            await page.locator(".ks-film__play").click();
            await expect(page.locator("video")).toHaveCount(1);
          }
          const { blocking, accepted, apart } = await axeWhenIdle(page);
          if (accepted.length || apart.length) console.log(`[expert clip axe ${vp.name} ${state}] accepted or apart:\n${describeFindings([...accepted, ...apart])}`);
          expect(blocking, `${state}:\n${describeFindings(blocking)}`).toEqual([]);
        }
      });
    });
  }
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
          const { blocking, accepted, apart } = await axeWhenIdle(page);
          if (accepted.length || apart.length) console.log(`[films axe ${vp.name} ${state}] accepted or apart:\n${describeFindings([...accepted, ...apart])}`);
          expect(blocking, `${state}:\n${describeFindings(blocking)}`).toEqual([]);
        }
      });
    });
  }
});
