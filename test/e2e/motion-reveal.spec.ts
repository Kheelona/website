import type { BrowserContext, Page } from "@playwright/test";
import { expect, test, type OpenOptions } from "./support/fixtures";
import { APPROVED_WIDTHS, VIEWPORTS, type Viewport } from "./support/viewports";

/* D049 pick 1A (and the observer half of 3B) on the MotionController demo story (task 2.8; architecture
 * §11.2 rows 1 and 3, §11.3; test plan §4.7). Runs in the Playwright "storybook" project against
 * `npm run build-storybook` output. The re-arm after a client navigation is checked on built pages by
 * motion.spec.ts at wave 5 close; the doodle's draw timing and stagger are motion-doodle.spec.ts (task 2.3).
 *
 * Motion on:
 *   - the blocks on screen at load are marked is-in before html.js-motion arrives and never fade
 *     (no transition starts on them), at the three approved widths;
 *   - a block below the fold waits hidden (opacity 0, translateY(--space-4)), then fades and rises over
 *     --duration-enter as it enters, once: scrolling away and back starts nothing more;
 *   - one IntersectionObserver watches every [data-reveal] and [data-draw], and unobserves each once
 *     revealed; after a full scroll everything is is-in;
 *   - a doodle on screen at load is shown drawn (its draw finished at once), while one that enters later
 *     draws itself;
 *   - a block added after arming (task 2.12) follows the same rules: on screen it shows on the first frame with
 *     no fade running, below the fold it waits for the same observer and reveals as it enters;
 *   - no layout shift: block positions equal those with motion off, and no layout-shift entry after arming.
 * Reduced motion: no js-motion, no is-in, nothing starts while the page scrolls, everything visible.
 */

const STORY_ID = "ui-motioncontroller--demo";
const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;

type Probe = {
  /** Class lists in mutation order: "<data-testid | html | tag>: <classes after the change>". */
  classes: string[];
  /** Transitions and animations as they start, by the nearest data-testid. */
  motion: Array<{ type: string; name: string; who: string }>;
  shifts: Array<{ at: number; value: number }>;
  armedAt: number | null;
  observers: Array<{ observed: number; unobserved: number; motionTargets: number }>;
};

declare global {
  interface Window {
    __khProbe?: Probe;
  }
}

/* Runs before the story's scripts: records class changes in order, every transition and animation that
   starts, layout shifts, when js-motion arrives, and each IntersectionObserver's observe and unobserve calls. */
function installProbe(): void {
  const probe: Probe = { classes: [], motion: [], shifts: [], armedAt: null, observers: [] };
  window.__khProbe = probe;
  const who = (el: Element | null): string => {
    if (!el) return "?";
    if (el === document.documentElement) return "html";
    const tagged = el.closest("[data-testid]");
    return tagged ? tagged.getAttribute("data-testid")! : el.tagName.toLowerCase();
  };
  new MutationObserver((records) => {
    records.forEach((r, i) => {
      const el = r.target as Element;
      const later = records.slice(i + 1).find((n) => n.target === el);
      const after = later ? (later.oldValue ?? "") : (el.getAttribute("class") ?? "");
      const name = el === document.documentElement ? "html" : (el.getAttribute("data-testid") ?? el.tagName.toLowerCase());
      probe.classes.push(`${name}: ${after}`);
      if (name === "html" && probe.armedAt === null && after.split(/\s+/).includes("js-motion")) probe.armedAt = performance.now();
    });
  }).observe(document, { attributes: true, attributeFilter: ["class"], attributeOldValue: true, subtree: true });
  for (const type of ["transitionrun", "animationstart"] as const) {
    document.addEventListener(
      type,
      (e) => {
        // The story only: Storybook's own loading spinner (sb-rotate360) turns outside #storybook-root.
        if (!(e.target instanceof Element) || !e.target.closest("#storybook-root")) return;
        const name = e instanceof TransitionEvent ? e.propertyName : (e as AnimationEvent).animationName;
        probe.motion.push({ type, name, who: who(e.target) });
      },
      true,
    );
  }
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) probe.shifts.push({ at: entry.startTime, value: (entry as unknown as { value: number }).value });
  }).observe({ type: "layout-shift", buffered: true });
  const Native = window.IntersectionObserver;
  window.IntersectionObserver = class extends Native {
    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
      super(callback, options);
      const record = { observed: 0, unobserved: 0, motionTargets: 0 };
      probe.observers.push(record);
      const observe = this.observe.bind(this);
      const unobserve = this.unobserve.bind(this);
      this.observe = (el: Element) => {
        record.observed++;
        if (el.matches("[data-reveal], [data-draw]")) record.motionTargets++;
        observe(el);
      };
      this.unobserve = (el: Element) => {
        record.unobserved++;
        unobserve(el);
      };
    }
  };
}

const storyUrl = () => `${test.info().project.use.baseURL}/iframe.html?id=${STORY_ID}&viewMode=story`;

async function openStory(
  harness: { context(vp: Viewport, opts?: OpenOptions): Promise<BrowserContext> },
  vp: Viewport,
  reducedMotion: "reduce" | "no-preference",
): Promise<Page> {
  const context = await harness.context(vp, { reducedMotion });
  await context.addInitScript(installProbe);
  const page = await context.newPage();
  await page.goto(storyUrl(), { waitUntil: "load" });
  await page.locator('[data-testid="reveal-last"]').waitFor({ state: "attached" });
  if (reducedMotion === "no-preference") await page.waitForFunction(() => document.documentElement.classList.contains("js-motion"));
  else await frames(page, 3);
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

const probe = (page: Page) => page.evaluate(() => window.__khProbe!);

/** Index of the first class change where `who` carries `cls`. */
const firstWith = (log: string[], who: string, cls: string) =>
  log.findIndex((line) => line.startsWith(`${who}: `) && line.slice(who.length + 2).split(/\s+/).includes(cls));

async function scrollThrough(page: Page, vp: Viewport): Promise<void> {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += vp.height / 2) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
}

/** Each [data-reveal] block's layout top in the document (offsetTop chain: transforms do not count). */
const layoutTops = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).map((el) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return { id: el.dataset.testid, y, h: el.offsetHeight };
    }),
  );

const msOf = (css: string) => (css.trim().endsWith("ms") ? parseFloat(css) : parseFloat(css) * 1000);

/** The [data-reveal] blocks as the page stands: test id, is-in, and the top edge in the viewport. */
const blocks = (page: Page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).map((el) => ({
      id: el.dataset.testid!,
      shown: el.classList.contains("is-in"),
      top: el.getBoundingClientRect().top,
    })),
  );

/** Waits until nothing in the story is running (js-motion's arrival sends the off-screen blocks to their hidden
 *  state; a drawn doodle's finished animation stays listed, filling, so only running ones count). */
const settled = (page: Page) =>
  page.waitForFunction(() =>
    document
      .querySelector("#storybook-root")!
      .getAnimations({ subtree: true })
      .every((a) => a.playState !== "running"),
  );

const transitionsOn = async (page: Page, id: string) =>
  (await probe(page)).motion.filter((m) => m.who === id && m.type === "transitionrun").map((m) => m.name);

test.describe("motion-reveal (pick 1A): motion on", () => {
  for (const vp of APPROVED_WIDTHS) {
    test(`${vp.name}: blocks on screen at load are is-in before js-motion and never fade`, async ({ harness }) => {
      const page = await openStory(harness, vp, "no-preference");
      await settled(page);
      const { classes, motion } = await probe(page);
      const armed = firstWith(classes, "html", "js-motion");
      expect(armed, classes.join("\n")).toBeGreaterThan(-1);

      // Nothing has scrolled: the blocks marked at arming are exactly those on screen, the first block always among them.
      const now = await blocks(page);
      const onScreen = now.filter((b) => b.shown);
      expect(onScreen.map((b) => b.id)).toContain("reveal-top");
      expect(now.filter((b) => !b.shown).length, "the demo needs blocks below the fold").toBeGreaterThan(0);
      for (const b of now) expect(b.shown, `${b.id} (top ${b.top}, screen ${vp.height}) marked as on screen`).toBe(b.top < vp.height);
      for (const b of onScreen) {
        const marked = firstWith(classes, b.id, "is-in");
        expect(marked, `${b.id} is-in after js-motion:\n${classes.join("\n")}`).toBeGreaterThan(-1);
        expect(marked, `${b.id} is-in after js-motion:\n${classes.join("\n")}`).toBeLessThan(armed);
        expect(motion.filter((m) => m.who === b.id), `${b.id}: a transition started on a block in view at load`).toEqual([]);
        const style = await page.getByTestId(b.id).evaluate((el) => [getComputedStyle(el).opacity, getComputedStyle(el).transform]);
        expect(style, b.id).toEqual(["1", "none"]);
      }

      // Below the fold: waiting hidden, one --space-4 down.
      const low = await page.getByTestId("reveal-last").evaluate((el) => ({
        opacity: getComputedStyle(el).opacity,
        transform: getComputedStyle(el).transform,
        space4: getComputedStyle(document.documentElement).getPropertyValue("--space-4").trim(),
      }));
      expect(low.opacity).toBe("0");
      expect(low.transform).toBe(`matrix(1, 0, 0, 1, 0, ${parseFloat(low.space4)})`);
    });
  }

  test("a block below the fold fades and rises over --duration-enter as it enters, once", async ({ harness }) => {
    const page = await openStory(harness, phone, "no-preference");
    await settled(page);
    const id = (await blocks(page)).find((b) => !b.shown)!.id;
    const block = page.getByTestId(id);
    const timing = await block.evaluate((el) => ({
      duration: getComputedStyle(el).transitionDuration,
      property: getComputedStyle(el).transitionProperty,
      token: getComputedStyle(document.documentElement).getPropertyValue("--duration-enter"),
    }));
    expect(timing.property).toBe("opacity, transform");
    for (const d of timing.duration.split(",")) expect(msOf(d)).toBe(msOf(timing.token));
    const before = (await transitionsOn(page, id)).length;

    await block.scrollIntoViewIfNeeded();
    await expect(block).toHaveClass(/\bis-in\b/);
    await settled(page);
    expect(await block.evaluate((el) => [getComputedStyle(el).opacity, getComputedStyle(el).transform])).toEqual(["1", "none"]);
    expect((await transitionsOn(page, id)).slice(before).sort(), `${id}: the reveal`).toEqual(["opacity", "transform"]);

    // Once: away and back again starts nothing more and keeps the block shown.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(msOf(timing.token) + 200);
    await expect(block).toHaveClass(/\bis-in\b/);
    expect((await transitionsOn(page, id)).length, `${id}: moved again on a second visit`).toBe(before + 2);
  });

  test("one observer for every [data-reveal] and [data-draw]; each unobserved once revealed; all shown after a full scroll", async ({ harness }) => {
    const page = await openStory(harness, phone, "no-preference");
    const before = (await probe(page)).observers.filter((o) => o.motionTargets > 0);
    expect(before, "IntersectionObservers watching motion targets").toHaveLength(1);
    const pending = await page.evaluate(() => document.querySelectorAll("[data-reveal]:not(.is-in), [data-draw]:not(.is-in)").length);
    expect(before[0].observed).toBe(pending);
    expect(before[0].motionTargets).toBe(pending);

    await scrollThrough(page, phone);
    await page.waitForTimeout(300);
    const missing = await page.evaluate(() =>
      Array.from(document.querySelectorAll("[data-reveal], [data-draw]"))
        .filter((el) => !el.classList.contains("is-in"))
        .map((el) => el.getAttribute("data-testid") ?? el.tagName),
    );
    expect(missing, "blocks or doodles left hidden after a full scroll").toEqual([]);
    const after = (await probe(page)).observers.filter((o) => o.motionTargets > 0);
    expect(after).toHaveLength(1);
    expect(after[0].unobserved, "each target unobserved after its reveal").toBe(after[0].observed);
  });

  test("a doodle on screen at load is shown drawn; one that enters later draws itself", async ({ harness }) => {
    // How tall a laptop screen must be for the first board to be on screen at load (measured with motion off).
    const measure = await openStory(harness, laptop, "reduce");
    const bottom = await measure.getByTestId("draw-doodles-2").evaluate((el) => el.getBoundingClientRect().bottom + window.scrollY);
    const tall: Viewport = { ...laptop, name: "laptop-tall", height: Math.ceil(bottom) + 40 };

    const page = await openStory(harness, tall, "no-preference");
    const shown = await page.getByTestId("draw-doodles-1").evaluate((svg) => ({
      cls: svg.classList.contains("is-in"),
      states: svg.getAnimations({ subtree: true }).map((a) => a.playState),
      offsets: Array.from(svg.querySelectorAll("path:not(.ks-doodle__fill)")).map((p) => getComputedStyle(p).strokeDashoffset),
    }));
    expect(shown.cls).toBe(true);
    expect(shown.states.length, "the draw animation exists (motion.css) and was finished").toBeGreaterThan(0);
    expect(shown.states.every((s) => s === "finished"), `animations on a doodle in view at load: ${shown.states.join(", ")}`).toBe(true);
    expect(new Set(shown.offsets)).toEqual(new Set(["0px"]));

    // Below the fold on a phone: the doodle waits undrawn, then its draw runs when it enters.
    const phonePage = await openStory(harness, phone, "no-preference");
    const doodle = phonePage.getByTestId("draw-more-doodles-1");
    expect(await doodle.evaluate((svg) => getComputedStyle(svg.querySelector("path:not(.ks-doodle__fill)")!).strokeDashoffset)).toBe("1px");
    await doodle.scrollIntoViewIfNeeded();
    await expect(doodle).toHaveClass(/\bis-in\b/);
    await expect
      .poll(async () => (await probe(phonePage)).motion.filter((m) => m.who === "draw-more-doodles-1" && m.name === "ks-draw").length)
      .toBeGreaterThan(0);
  });

  /* Task 2.12: a client-only island or a streamed block lands after the controller armed. Without the controller's
     MutationObserver it would wait at opacity 0 for good. */
  test("a block added after arming: on screen it shows at once, without a fade; below the fold it reveals as it enters", async ({ harness }) => {
    const page = await openStory(harness, phone, "no-preference");
    await settled(page);
    const watching = () => probe(page).then((p) => p.observers.filter((o) => o.motionTargets > 0));
    const before = await watching();
    expect(before, "IntersectionObservers watching motion targets").toHaveLength(1);

    // Both inserted in one task, as a client render commits them; read on the first frame after it.
    const first = await page.evaluate(
      () =>
        new Promise<Record<"top" | "low", { shown: boolean; opacity: string; transform: string; running: number }>>((done) => {
          const block = (id: string) => {
            const el = document.createElement("div");
            el.className = "kh-card kh-card--tint kh-tone-sun";
            el.setAttribute("data-reveal", "");
            el.setAttribute("data-testid", id);
            el.textContent = "Added after the controller armed.";
            return el;
          };
          const main = document.querySelector("#storybook-root main")!;
          const top = block("added-top");
          const low = block("added-low");
          main.prepend(top);
          // Before the last section, not at the very end: a short block on the last line of a page never rises past
          // the observer's bottom margin (a tenth of the screen), so it could not be scrolled far enough to enter.
          main.querySelector("section:last-of-type")!.before(low);
          const read = (el: HTMLElement) => ({
            shown: el.classList.contains("is-in"),
            opacity: getComputedStyle(el).opacity,
            transform: getComputedStyle(el).transform,
            running: el.getAnimations().filter((a) => a.playState === "running").length,
          });
          requestAnimationFrame(() => done({ top: read(top), low: read(low) }));
        }),
    );
    expect(first.top, "on screen: shown on the first frame, nothing fading").toEqual({ shown: true, opacity: "1", transform: "none", running: 0 });
    expect(first.low.shown, "below the fold: waiting").toBe(false);
    expect(first.low.opacity).toBe("0");

    const after = await watching();
    expect(after, "still the one IntersectionObserver").toHaveLength(1);
    expect(after[0].observed, "the block below the fold handed to it").toBe(before[0].observed + 1);

    const low = page.getByTestId("added-low");
    await low.scrollIntoViewIfNeeded();
    await expect(low).toHaveClass(/\bis-in\b/);
    await settled(page);
    expect(await low.evaluate((el) => [getComputedStyle(el).opacity, getComputedStyle(el).transform])).toEqual(["1", "none"]);
    expect(await transitionsOn(page, "added-low"), "it fades and rises as it enters").toEqual(expect.arrayContaining(["opacity", "transform"]));
  });

  test("no layout shift: positions equal motion off, and no layout-shift entry after arming", async ({ harness }) => {
    const still = await openStory(harness, phone, "reduce");
    const reference = await layoutTops(still);

    const page = await openStory(harness, phone, "no-preference");
    expect(await layoutTops(page)).toEqual(reference);
    await scrollThrough(page, phone);
    await page.waitForTimeout(400);
    expect(await layoutTops(page)).toEqual(reference);
    const { shifts, armedAt } = await probe(page);
    expect(armedAt).not.toBeNull();
    expect(shifts.filter((s) => s.at >= armedAt!), "layout shifts after js-motion arrived").toEqual([]);
  });
});

test.describe("motion-reveal (pick 1A): reduced motion", () => {
  for (const vp of [phone, laptop]) {
    test(`${vp.name}: nothing armed, nothing moves, everything visible`, async ({ harness }) => {
      const page = await openStory(harness, vp, "reduce");
      await scrollThrough(page, vp);
      await page.waitForTimeout(400);
      const state = await page.evaluate(() => ({
        armed: document.documentElement.classList.contains("js-motion"),
        marked: document.querySelectorAll(".is-in").length,
        hidden: Array.from(document.querySelectorAll("[data-reveal]"))
          .filter((el) => getComputedStyle(el).opacity !== "1" || getComputedStyle(el).transform !== "none")
          .map((el) => el.getAttribute("data-testid")),
        undrawn: Array.from(document.querySelectorAll("[data-draw] path"))
          .map((p) => getComputedStyle(p).strokeDashoffset)
          .filter((v) => v !== "0px"),
      }));
      expect(state).toEqual({ armed: false, marked: 0, hidden: [], undrawn: [] });
      const { motion, observers } = await probe(page);
      expect(motion, "transitions or animations started under reduced motion").toEqual([]);
      expect(observers.filter((o) => o.motionTargets > 0), "observers watching motion targets").toEqual([]);
    });
  }
});
