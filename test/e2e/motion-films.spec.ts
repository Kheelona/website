import type { Browser, BrowserContext, Page, TestInfo } from "@playwright/test";
import { expect, motionStarted, newGuardedContext, test, type OpenOptions } from "./support/fixtures";
import { SIDEWAYS_VIEWPORTS, VIEWPORTS, type Viewport } from "./support/viewports";

/* D049 pick 8, "parent films strip: B focus grows" (task 3.3; architecture §11.2 row 8, §11.3; test plan §4.7), on the
 * FilmsStrip stories in the static Storybook build (the Playwright "storybook" project).
 *
 *   - motion on: the film most inside the strip's central band carries is-focus and its frame scales to
 *     --ks-film-focus by a transform transition over --duration-base with --ease-standard; every other film stays at 1;
 *     the scaled frame stays inside the strip (never clipped by it), at rest and at the strip's end;
 *   - nothing scrolls the document sideways at either end of the strip, on the whole viewport matrix (test plan §3,
 *     320 px included; scrollWidth against clientWidth, lessons §2);
 *   - reduced motion: the focus is still marked, but nothing scales and nothing transitions.
 */

const STORY = "sections-filmsstrip--product";
const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;

async function openStory(context: BrowserContext, info: TestInfo): Promise<Page> {
  const baseURL = info.project.use.baseURL;
  if (!baseURL) throw new Error("motion-films runs in the storybook project (playwright.config.ts)");
  const page = await context.newPage();
  await page.goto(`${baseURL}/iframe.html?id=${STORY}&viewMode=story`);
  await page.locator("#storybook-root [data-films]").waitFor();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

async function withStory(browser: Browser, info: TestInfo, vp: Viewport, opts: OpenOptions, run: (page: Page) => Promise<void>) {
  const context = await newGuardedContext(browser, vp, opts);
  try {
    await run(await openStory(context, info));
  } finally {
    await context.close();
  }
}

type Focus = {
  /** Films marked is-focus. */
  focused: string[];
  /** Each film's frame scale, as its computed transform's x scale (1 without a transform). */
  scales: Record<string, number>;
  /** The focused frame's transition (computed), and the tokens it should use. */
  transition: { property: string; duration: string; easing: string };
  tokens: { focus: number; base: string; ease: string };
  /** The focused frame's box against the strip's box (px), once its transition has finished. */
  inside: { left: number; right: number; top: number; bottom: number } | null;
};

/** Waits for one film to take the focus, finishes the running transitions, and reads the strip. */
async function readFocus(page: Page): Promise<Focus> {
  await page.locator(".ks-film.is-focus").first().waitFor();
  return page.evaluate(() => {
    document.getAnimations().forEach((a) => a.finish());
    const root = getComputedStyle(document.documentElement);
    const track = document.querySelector<HTMLElement>("[data-films]")!;
    const tiles = [...track.querySelectorAll<HTMLElement>(".ks-film")];
    const scaleOf = (el: Element) => {
      const t = getComputedStyle(el).transform;
      return t === "none" ? 1 : new DOMMatrix(t).a;
    };
    const focusedTile = tiles.find((t) => t.classList.contains("is-focus"));
    const frame = focusedTile?.querySelector<HTMLElement>(".ks-film__frame");
    const style = frame ? getComputedStyle(frame) : null;
    const box = frame?.getBoundingClientRect();
    const strip = track.getBoundingClientRect();
    return {
      focused: tiles.filter((t) => t.classList.contains("is-focus")).map((t) => t.dataset.videoId!),
      scales: Object.fromEntries(tiles.map((t) => [t.dataset.videoId!, scaleOf(t.querySelector(".ks-film__frame")!)])),
      transition: { property: style?.transitionProperty ?? "", duration: style?.transitionDuration ?? "", easing: style?.transitionTimingFunction ?? "" },
      tokens: {
        focus: Number(root.getPropertyValue("--ks-film-focus")),
        base: root.getPropertyValue("--duration-base").trim(),
        ease: root.getPropertyValue("--ease-standard").trim(),
      },
      inside: box ? { left: box.left - strip.left, right: strip.right - box.right, top: box.top - strip.top, bottom: strip.bottom - box.bottom } : null,
    };
  });
}

/** Scrolls the strip to its far end at once and waits for the focus to settle on a film there. */
async function toTheEnd(page: Page): Promise<void> {
  await page.locator("[data-films]").evaluate((t) => t.scrollTo({ left: t.scrollWidth, behavior: "instant" }));
  await expect(page.getByRole("button", { name: "Next video" })).toBeDisabled();
  await page.waitForTimeout(100);
}

const ms = (v: string) => (v.trim().endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000);
const norm = (v: string) => v.replace(/\s/g, "");

test.describe("motion: the film in focus grows (D049 pick 8)", () => {
  for (const [vp, atRest] of [
    [phone, "learning-by-asking"],
    [laptop, "first-conversations"],
  ] as const) {
    test(`${vp.name}: one film scales to --ks-film-focus over --duration-base, the others stay at 1, inside the strip`, async ({ browser }, info) => {
      await withStory(browser, info, vp, { reducedMotion: "no-preference", recordMotion: true }, async (page) => {
        const rest = await readFocus(page);
        expect(rest.focused, "the film in the central band: the first on a phone, the centre one of three on a laptop").toEqual([atRest]);
        expect(rest.tokens.focus).toBeGreaterThanOrEqual(1.04);
        expect(rest.tokens.focus).toBeLessThanOrEqual(1.1);
        expect(rest.scales[atRest]).toBeCloseTo(rest.tokens.focus, 3);
        for (const [id, scale] of Object.entries(rest.scales)) if (id !== atRest) expect(scale, id).toBe(1);

        expect(rest.transition.property).toBe("transform");
        expect(ms(rest.transition.duration)).toBe(ms(rest.tokens.base));
        expect(norm(rest.transition.easing)).toBe(norm(rest.tokens.ease));
        const started = (await motionStarted(page)).filter((m) => m.target.includes("ks-film__frame"));
        expect(started.map((m) => `${m.type} ${m.name}`), "the scale is a transition of transform alone").toContain("transition transform");
        expect(started.every((m) => m.name === "transform")).toBe(true);

        for (const [side, gap] of Object.entries(rest.inside!)) expect(gap, `at rest the scaled film stays inside the strip (${side})`).toBeGreaterThanOrEqual(-0.5);

        await toTheEnd(page);
        const end = await readFocus(page);
        expect(end.focused).toHaveLength(1);
        expect(end.scales[end.focused[0]]).toBeCloseTo(end.tokens.focus, 3);
        for (const [side, gap] of Object.entries(end.inside!)) expect(gap, `at the end the scaled film stays inside the strip (${side})`).toBeGreaterThanOrEqual(-0.5);
      });
    });
  }

  test("reduced motion: the focus is marked but nothing scales and nothing transitions", async ({ browser }, info) => {
    for (const vp of [phone, laptop]) {
      await withStory(browser, info, vp, { reducedMotion: "reduce", recordMotion: true }, async (page) => {
        const f = await readFocus(page);
        expect(f.focused).toHaveLength(1);
        expect(Object.values(f.scales).every((s) => s === 1), JSON.stringify(f.scales)).toBe(true);
        expect((await motionStarted(page)).filter((m) => m.target.includes("ks-film"))).toEqual([]);
      });
    }
  });
});

test.describe("motion: the films strip never scrolls the page sideways, and the scaled film stays in the strip", () => {
  for (const vp of SIDEWAYS_VIEWPORTS) {
    test(`${vp.name}: at the start and at the end of the strip`, async ({ browser }, info) => {
      await withStory(browser, info, vp, { reducedMotion: "no-preference" }, async (page) => {
        const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        for (const at of ["start", "end"] as const) {
          if (at === "end") await toTheEnd(page);
          const f = await readFocus(page);
          expect(await overflow(), `no sideways scroll at the ${at}`).toBeLessThanOrEqual(0);
          expect(f.scales[f.focused[0]]).toBeCloseTo(f.tokens.focus, 3);
          for (const [side, gap] of Object.entries(f.inside!)) expect(gap, `${at}: the scaled film inside the strip (${side})`).toBeGreaterThanOrEqual(-0.5);
        }
      });
    });
  }
});
