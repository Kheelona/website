import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import { describeFindings, runAxe } from "./support/axe";
import { CLAIM_FIXES, editsBeforeClaimFixes } from "./support/deviations";
import { expect, forceMotionEnd, hideForParity, test, type OpenOptions } from "./support/fixtures";
import type { FactEdit } from "./support/page-facts";
import { CHUNK_MAX_DIFF_RATIO } from "./support/parity";
import { mockupUrl } from "./support/routes";
import { APPROVED_WIDTHS, AXE_VIEWPORTS, VIEWPORTS, type Viewport } from "./support/viewports";

/* Product details tabs (task 3.5; architecture §5.2; tasks.md 3.5), on the Tabs and ProductDetails stories of the
 * static Storybook build (`npm run build-storybook`), as the approved product page behaves
 * (mockup/pages/meet-kheelu.html:277-330 markup, :397-439 the page's own tab script):
 *
 *   - with JavaScript: the keyboard path (Tab reaches the selected tab only; ArrowLeft and ArrowRight wrap, Home and
 *     End; each selects and focuses; Tab moves on to the shown panel) and the ARIA states at each step; axe at 360,
 *     390, 1440 and 1920 with the first and the last tab selected;
 *   - without JavaScript (the served HTML of the WithoutJavaScript stories, captured and given to a browser with
 *     JavaScript off): the three panels stacked under their visible headings, the tab row not shown and no tab
 *     reachable; the product's stacked panels spaced as the approved page's; axe;
 *   - no layout shift inside the first screen: the product fold served below the first screen, painted, then
 *     hydrated as Next does: no layout shift at all and no scroll while the island makes tabs; and, so the probe is
 *     known to see one, the same fold hydrated at the top of the screen records the switch's shift;
 *   - with JavaScript the product fold matches the approved page's tabbed fold at 360, 390 and 1440: section#specs of
 *     mockup/meet-kheelu.html (its script run) is the golden for each tab selected, and the story's section may
 *     differ in at most CHUNK_MAX_DIFF_RATIO of its pixels (the visual-parity standard, SPA 1).
 *
 * The ProductDetails stories print the product page's own fold 7 (task 8b.1d), so wherever the approved page is the
 * golden it is opened with the route's accepted changes applied first (`withRouteFixes`), as the route's unit tests
 * apply them to the frozen mockup (D046): the founder's page facts and task 7.1b's copy fixes, then task 8b.1's claim
 * fixes (D058; deviations.md V16, V17, V27).
 *
 * It runs in the "storybook" project (STORY_SPECS) and opens stories from that project's baseURL. To run it alone on
 * a static build:
 *   npm run build-storybook && node test/e2e/support/static-server.mjs storybook-static 6118 &
 *   KH_NO_SERVER=1 KH_STORYBOOK_PORT=6118 npx playwright test test/e2e/tabs.spec.ts
 */

const UI = { id: "ui-tabs", tabs: ["First", "Second", "Third"] } as const;
const DETAILS = { id: "sections-productdetails", tabs: ["Specs", "In the box", "Safety"] } as const;
const phone = VIEWPORTS.find((v) => v.width === 390)!;
const laptop = VIEWPORTS.find((v) => v.width === 1440 && v.height === 900)!;
const smallPhone = APPROVED_WIDTHS.find((v) => v.width === 360)!;

type Harness = { context(vp: Viewport, opts?: OpenOptions): Promise<BrowserContext> };

/** The static Storybook's origin: this spec's project is "storybook" (STORY_SPECS), as motion-doodle.spec.ts reads it. */
function storybook(info: TestInfo): string {
  const base = info.project.use.baseURL;
  if (!base) throw new Error("tabs.spec opens stories: run it in the storybook project (STORY_SPECS)");
  return base;
}

const storyUrl = (story: string) => `${storybook(test.info())}/iframe.html?id=${story}&viewMode=story`;

/** The product page's accepted changes since Gate A, in the two passes its unit test applies them (page.test.tsx): its
 *  earlier rules (page facts, copy fixes), then its claim fixes. */
const PRODUCT_FIXES: readonly (readonly FactEdit[])[] = [editsBeforeClaimFixes("meet-kheelu"), CLAIM_FIXES["meet-kheelu"].edits];

/**
 * Applies PRODUCT_FIXES to the open approved page's <main>, in the browser, as test/support/mockup-facts.ts `withFacts`
 * applies an edit list to a clone (one pass per list): each edit takes the first element its selector matches whose
 * words are its `was` and that no earlier edit of its pass used, then changes it, or the element around it that `scope`
 * names. An edit that finds nothing fails the test, so the golden is never the frozen page by accident.
 */
async function withRouteFixes(page: Page): Promise<void> {
  await page.evaluate((passes) => {
    const main = document.querySelector("main");
    if (!main) throw new Error("the approved page has no <main>");
    const words = (el: Element) => (el.textContent ?? "").replace(/\s+/g, " ").trim();
    const markup = (html: string) => {
      const template = document.createElement("template");
      template.innerHTML = html;
      return Array.from(template.content.childNodes);
    };
    for (const edits of passes) {
      const used = new Set<Element>();
      for (const edit of edits) {
        const match = Array.from(main.querySelectorAll(edit.at)).find((el) => !used.has(el) && words(el) === edit.was);
        if (!match) throw new Error(`no unused ${edit.at} reads "${edit.was}" on the approved page`);
        used.add(match);
        const target = edit.scope ? match.closest(edit.scope) : match;
        if (!target) throw new Error(`"${edit.was}" sits in no ${edit.scope}`);
        if (edit.now === null) target.remove();
        else if (edit.inner) target.replaceChildren(...markup(edit.now));
        else if (edit.now === "") {
          const before = target.previousSibling;
          if (before?.nodeType === Node.TEXT_NODE) before.textContent = (before.textContent ?? "").replace(/\s+$/, "");
          target.remove();
        } else target.replaceWith(...markup(edit.now));
      }
    }
  }, PRODUCT_FIXES);
}

async function frames(page: Page, n: number): Promise<void> {
  await page.evaluate((count) => new Promise<void>((done) => {
    const step = (left: number) => (left === 0 ? done() : requestAnimationFrame(() => step(left - 1)));
    step(count);
  }), n);
}

async function openStory(harness: Harness, story: string, vp: Viewport, opts: OpenOptions = {}, init?: () => void): Promise<Page> {
  const context = await harness.context(vp, opts);
  if (init) await context.addInitScript(init);
  const page = await context.newPage();
  await page.goto(storyUrl(story), { waitUntil: "load" });
  await page.locator("#storybook-root > *").first().waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

/** Each tab and panel as the page has them: selection, Tab order, what shows, the panel's name. */
async function tabState(page: Page) {
  return page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll<HTMLElement>('#storybook-root [role="tab"]'));
    return {
      selected: tabs.filter((t) => t.getAttribute("aria-selected") === "true").map((t) => t.textContent),
      tabbable: tabs.filter((t) => t.tabIndex === 0).map((t) => t.textContent),
      shown: Array.from(document.querySelectorAll<HTMLElement>("#storybook-root .kh-tabs__panel"))
        .filter((p) => p.getBoundingClientRect().height > 0)
        .map((p) => (p.getAttribute("role") === "tabpanel" ? document.getElementById(p.getAttribute("aria-labelledby")!)?.textContent : p.id)),
      focus: document.activeElement?.getAttribute("role") === "tab" ? `tab ${document.activeElement.textContent}` : document.activeElement?.getAttribute("role") ?? document.activeElement?.tagName,
    };
  });
}

test.describe("tabs: with JavaScript", () => {
  for (const set of [UI, DETAILS]) {
    for (const vp of [phone, laptop]) {
      test(`${set.id} ${vp.name}: keyboard path and ARIA states`, async ({ harness }) => {
        const page = await openStory(harness, `${set.id}--default`, vp);
        await page.locator(".kh-tabs.is-tabs").waitFor({ state: "attached" });
        const [a, b, c] = set.tabs;
        const list = page.locator('[role="tablist"]');
        expect(await list.evaluate((el) => getComputedStyle(el).display), "the tab row shows").toBe("flex");
        expect(await page.locator('[role="tabpanel"]').count(), "every panel is a tabpanel").toBe(3);
        for (const heading of await page.locator("[data-tab-heading]").all()) {
          expect(await heading.evaluate((h) => h.getBoundingClientRect().width <= 1 && getComputedStyle(h).position === "absolute"), "headings hidden, still read").toBe(true);
        }
        expect(await tabState(page)).toEqual({ selected: [a], tabbable: [a], shown: [a], focus: "BODY" });

        await page.keyboard.press("Tab");
        expect(await tabState(page), "Tab reaches the selected tab").toEqual({ selected: [a], tabbable: [a], shown: [a], focus: `tab ${a}` });
        await page.keyboard.press("ArrowRight");
        expect(await tabState(page)).toEqual({ selected: [b], tabbable: [b], shown: [b], focus: `tab ${b}` });
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        expect(await tabState(page), "ArrowRight wraps").toEqual({ selected: [a], tabbable: [a], shown: [a], focus: `tab ${a}` });
        await page.keyboard.press("ArrowLeft");
        expect(await tabState(page), "ArrowLeft wraps").toEqual({ selected: [c], tabbable: [c], shown: [c], focus: `tab ${c}` });
        await page.keyboard.press("Home");
        expect(await tabState(page), "Home").toEqual({ selected: [a], tabbable: [a], shown: [a], focus: `tab ${a}` });
        await page.keyboard.press("End");
        expect(await tabState(page), "End").toEqual({ selected: [c], tabbable: [c], shown: [c], focus: `tab ${c}` });
        await page.keyboard.press("Tab");
        expect((await tabState(page)).focus, "Tab moves on to the shown panel").toBe("tabpanel");
        await page.keyboard.press("Shift+Tab");
        expect((await tabState(page)).focus).toBe(`tab ${c}`);
        await page.keyboard.press("Shift+Tab");
        expect((await tabState(page)).focus, "Shift+Tab leaves the row: no other tab is in the Tab order").not.toMatch(/^tab /);
        await page.getByRole("tab", { name: b }).click();
        expect(await tabState(page), "a click selects").toMatchObject({ selected: [b], tabbable: [b], shown: [b] });
      });
    }
  }

  for (const set of [UI, DETAILS]) {
    for (const vp of AXE_VIEWPORTS) {
      test(`${set.id} ${vp.name}: axe with JavaScript, first and last tab`, async ({ harness }) => {
        const page = await openStory(harness, `${set.id}--default`, vp);
        await page.locator(".kh-tabs.is-tabs").waitFor({ state: "attached" });
        for (const name of [set.tabs[0], set.tabs[2]]) {
          await page.getByRole("tab", { name }).click();
          const { blocking, accepted } = await runAxe(page);
          if (accepted.length) console.log(`[tabs] ${set.id} ${vp.name} ${name}: accepted\n${describeFindings(accepted)}`);
          expect(blocking, `${set.id} ${vp.name} ${name}\n${describeFindings(blocking)}`).toEqual([]);
        }
      });
    }
  }
});

/** The served HTML of a WithoutJavaScript story, given to a browser with JavaScript off. */
async function servedWithoutJs(harness: Harness, story: string, vp: Viewport): Promise<{ page: Page; html: string }> {
  const rendered = await openStory(harness, story, vp);
  await rendered.locator('[data-testid="served"] .kh-tabs').waitFor({ state: "attached" });
  const html = await rendered.evaluate(() => `<!doctype html>${document.documentElement.outerHTML}`);
  return { page: await openCaptured(harness, html, vp, false), html };
}

/** Captured HTML served from the Storybook origin (so its stylesheets load), JavaScript on or off. */
async function openCaptured(harness: Harness, html: string, vp: Viewport, javaScriptEnabled: boolean): Promise<Page> {
  const context = await harness.context(vp, { javaScriptEnabled });
  const url = `${storybook(test.info())}/kh-no-js-capture.html`;
  await context.route(url, (route) => route.fulfill({ status: 200, contentType: "text/html", body: html }));
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  return page;
}

/* axe needs the page's own timers, which a context with JavaScript off never runs (it hangs there), so the no-script
   pass gives axe the same captured HTML with every script element removed: the same DOM and CSS as without JavaScript. */
const withoutScripts = (html: string) => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

/** The panels of the first DS Tabs box: where each sits relative to the first, and how tall each is. */
async function stackedPanels(page: Page) {
  return page.locator(".kh-tabs").first().evaluate((box) => {
    const panels = Array.from(box.querySelectorAll(":scope > .kh-tabs__panel")).map((p) => p.getBoundingClientRect());
    return panels.map((r) => ({ top: Math.round(r.top - panels[0].top), height: Math.round(r.height) }));
  });
}

test.describe("tabs: without JavaScript", () => {
  for (const set of [UI, DETAILS]) {
    for (const vp of [smallPhone, laptop]) {
      test(`${set.id} ${vp.name}: the panels stacked under their headings, no tab row, axe`, async ({ harness }) => {
        const { page, html } = await servedWithoutJs(harness, `${set.id}--without-java-script`, vp);
        const box = page.locator(".kh-tabs");
        expect(await box.getAttribute("class"), "no is-tabs without JavaScript").toBe("kh-tabs");
        expect(await page.locator(".kh-tabs__list").evaluate((el) => getComputedStyle(el).display), "the tab row does not show").toBe("none");
        for (const name of set.tabs) await expect(page.getByRole("tab", { name, includeHidden: true })).toBeHidden();
        const headings = await page.locator("[data-tab-heading]").evaluateAll((hs) => hs.map((h) => ({ text: h.textContent, height: h.getBoundingClientRect().height })));
        expect(headings.map((h) => h.text), "every panel under its heading").toEqual([...set.tabs]);
        for (const h of headings) expect(h.height, `${h.text}: heading shows`).toBeGreaterThan(0);
        const panels = await stackedPanels(page);
        expect(panels).toHaveLength(3);
        for (let i = 1; i < panels.length; i++) expect(panels[i].top, "stacked, one under the other").toBeGreaterThanOrEqual(panels[i - 1].top + panels[i - 1].height);
        for (let i = 0; i < 4; i++) {
          await page.keyboard.press("Tab");
          expect(await page.evaluate(() => document.activeElement?.getAttribute("role")), "no tab in the Tab order").not.toBe("tab");
        }
        const still = await openCaptured(harness, withoutScripts(html), vp, true);
        expect(await still.locator(".kh-tabs").getAttribute("class"), "the axe copy is the served state").toBe("kh-tabs");
        const { blocking } = await runAxe(still);
        expect(blocking, `${set.id} ${vp.name} without JavaScript\n${describeFindings(blocking)}`).toEqual([]);
      });
    }
  }

  for (const vp of APPROVED_WIDTHS) {
    test(`${DETAILS.id} ${vp.name}: the stacked panels sit as the approved page's do without JavaScript`, async ({ harness }) => {
      const { page } = await servedWithoutJs(harness, `${DETAILS.id}--without-java-script`, vp);
      const context = await harness.context(vp, { javaScriptEnabled: false });
      const mockup = await context.newPage();
      await mockup.goto(mockupUrl("meet-kheelu"), { waitUntil: "load" });
      await withRouteFixes(mockup);
      await mockup.evaluate(() => document.fonts.ready.then(() => undefined));
      // The approved page shows its tab row above the stacked panels here (the DS display rule beats `hidden`); the build
      // hides it (tabs.css). Every panel moves down by the same amount, so their places relative to the first are compared.
      expect(await stackedPanels(page)).toEqual(await stackedPanels(mockup));
    });
  }
});

declare global {
  interface Window {
    /** Every layout shift since the page began loading: its value, when, and whether it moved anything in the tabs. */
    __khShifts?: Array<{ value: number; startTime: number; inTabs: boolean }>;
    /** Adds the shifts the observer holds but has not delivered yet (its callback comes late, as a low-priority task). */
    __khFlushShifts?: () => void;
  }
}

/* Runs before the story's scripts: records each layout shift (Layout Instability API) as the page reports it. */
function installShiftRecorder(): void {
  type Shift = PerformanceEntry & { value: number; sources: Array<{ node: Node | null }> };
  window.__khShifts = [];
  const record = (entries: PerformanceEntryList) => {
    // Every shift counts, those flagged hadRecentInput too (stricter than CLS): the automated browser reports an input
    // at about 11 ms after navigation, so CLS's own filter would hide a switch in the first half second (probe, 2026-10-12).
    for (const entry of entries as Shift[]) {
      const inTabs = entry.sources.some((s) => {
        const el = s.node instanceof Element ? s.node : (s.node?.parentElement ?? null);
        return !!el?.closest(".kh-tabs");
      });
      window.__khShifts!.push({ value: entry.value, startTime: entry.startTime, inTabs });
    }
  };
  const observer = new PerformanceObserver((list) => record(list.getEntries()));
  observer.observe({ type: "layout-shift", buffered: true });
  window.__khFlushShifts = () => record(observer.takeRecords());
}

/** Waits for the island's tabs and four more frames, then reads every shift so far (pending ones flushed). */
async function shiftsAfterTabs(page: Page) {
  await page.locator(".kh-tabs.is-tabs").waitFor({ state: "attached" });
  await frames(page, 4);
  return page.evaluate(() => {
    window.__khFlushShifts!();
    return {
      shifts: window.__khShifts ?? [],
      hydrated: performance.getEntriesByName("kh-hydrate")[0]?.startTime ?? null,
      scrollY: window.scrollY,
    };
  });
}

test.describe("tabs: no layout shift inside the first screen", () => {
  for (const vp of APPROVED_WIDTHS) {
    test(`${vp.name}: the fold below the first screen, served then hydrated: nothing shifts, nothing scrolls`, async ({ harness }) => {
      const page = await openStory(harness, `${DETAILS.id}--below-the-first-screen`, vp, {}, installShiftRecorder);
      const { shifts, hydrated, scrollY } = await shiftsAfterTabs(page);
      expect(hydrated, "the served fold was hydrated").not.toBeNull();
      expect(shifts, "no layout shift while the island makes tabs").toEqual([]);
      expect(scrollY, "the page did not move (no focus on load)").toBe(0);
    });
  }

  test(`${smallPhone.name}: the probe sees the switch when the fold is inside the first screen`, async ({ harness }) => {
    const page = await openStory(harness, `${DETAILS.id}--hydrated`, smallPhone, {}, installShiftRecorder);
    const { shifts, hydrated } = await shiftsAfterTabs(page);
    const switched = shifts.filter((s) => hydrated !== null && s.startTime >= hydrated && s.inTabs);
    expect(switched.reduce((sum, s) => sum + s.value, 0), "the stacked-to-tabs switch, on screen, is a layout shift").toBeGreaterThan(0);
  });
});

/** Every part of section#specs as a box relative to the section (top, left, width, height, to the hundredth of a px). */
async function foldBoxes(page: Page) {
  return page.locator("section#specs").evaluate((sec) => {
    const s = sec.getBoundingClientRect();
    const r2 = (n: number) => Math.round(n * 100) / 100;
    const box = (el: Element) => {
      const r = el.getBoundingClientRect();
      return [r2(r.top - s.top), r2(r.left - s.left), r2(r.width), r2(r.height)];
    };
    const all = (selector: string) => Array.from(sec.querySelectorAll(selector)).map(box);
    return {
      section: [r2(s.width), r2(s.height)],
      head: all(".kh-section__head"),
      tabRow: all(".kh-tabs__list"),
      tabs: all(".kh-tab"),
      panel: all(".kh-tabs__panel:not([hidden])"),
      lines: all(".kh-tabs__panel:not([hidden]) :is(dl > div, li)"),
      card: all(".kh-card"),
      cardRows: all(".kh-card dl > div"),
      actions: all(".kh-section__actions"),
    };
  });
}

test.describe("tabs: the product fold matches the approved tabbed fold", () => {
  for (const vp of APPROVED_WIDTHS) {
    test(`${vp.name}: each tab selected, every box equal and section#specs within the visual-parity standard`, async ({ harness }, testInfo) => {
      expect(["all", "changed"].includes(testInfo.config.updateSnapshots), "never update snapshots: the approved page is the golden").toBe(false);
      const mockupContext = await harness.context(vp);
      const mockup = await mockupContext.newPage();
      await mockup.goto(mockupUrl("meet-kheelu"), { waitUntil: "load" });
      await mockup.locator("#specs .kh-tabs.is-tabs").waitFor({ state: "attached" });
      await withRouteFixes(mockup);
      await hideForParity(mockup);
      await forceMotionEnd(mockup);
      await mockup.addStyleTag({ content: ".kh-buybar { display: none !important; }" });
      await mockup.evaluate(() => document.fonts.ready.then(() => undefined));
      const page = await openStory(harness, `${DETAILS.id}--default`, vp);
      await page.locator(".kh-tabs.is-tabs").waitFor({ state: "attached" });
      // The approved fold sits at a fractional page offset (9100.59 px at 360 x 640), the story's at 0: the same section
      // on another sub-pixel phase rasterises differently and spans one more pixel row. The story's root takes the same
      // fraction on top, so both captures sample the section on the same pixel grid (harness only; nothing in the fold).
      const phase = await mockup.locator("section#specs").evaluate((el) => {
        const y = el.getBoundingClientRect().top + window.scrollY;
        return y - Math.floor(y);
      });
      await page.evaluate((p) => {
        document.getElementById("storybook-root")!.style.paddingTop = `${p}px`;
      }, phase);

      for (const name of DETAILS.tabs) {
        for (const p of [mockup, page]) await p.locator("#specs").getByRole("tab", { name }).click();
        expect.soft(await foldBoxes(page), `${vp.name} ${name}: the fold's boxes`).toEqual(await foldBoxes(mockup));
        const shot = (p: Page) => p.locator("section#specs").screenshot({ animations: "disabled", caret: "hide", scale: "css" });
        const file = `product-details-${vp.name}-${name.replace(/\s+/g, "-").toLowerCase()}.png`;
        const golden = testInfo.snapshotPath(file, { kind: "snapshot" });
        mkdirSync(dirname(golden), { recursive: true });
        writeFileSync(golden, await shot(mockup));
        expect.soft(await shot(page), `${vp.name} ${name}`).toMatchSnapshot(file, { maxDiffPixelRatio: CHUNK_MAX_DIFF_RATIO });
      }
    });
  }
});
