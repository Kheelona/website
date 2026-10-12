import { describe, expect, it, vi } from "vitest";
import { LAYOUT_SPECS, STORY_SPECS, WEBKIT_STORY_SPECS, e2eProjects, projectDeviceScaleFactor, viewportOffProject } from "./e2e/support/projects";
import { VIEWPORTS } from "./e2e/support/viewports";

/* The Playwright projects (task 1.1b item 2; test plan §1.2, §3, §4.1).
 *
 * Chromium runs every spec (site) and the per-pick story specs (storybook). KH_WEBKIT=1 adds two
 * opt-in WebKit projects for the layout specs: iPhone emulation at the phone viewports and desktop
 * WebKit at the laptop sizes, each skipping the other group's viewports.
 */

const URLS = { site: "http://localhost:3456", storybook: "http://localhost:6007" };
const names = (env: { KH_WEBKIT?: string }) => e2eProjects(env, URLS).map((p) => p.name);
const phone = VIEWPORTS.find((v) => v.group === "phone")!;
const laptop = VIEWPORTS.find((v) => v.group === "laptop")!;

describe("Playwright projects", () => {
  it("run Chromium only unless KH_WEBKIT=1", () => {
    expect(names({})).toEqual(["site", "storybook"]);
    expect(names({ KH_WEBKIT: "0" })).toEqual(["site", "storybook"]);
  });

  it("add WebKit with iPhone emulation for the phones and WebKit at the laptop sizes on KH_WEBKIT=1", () => {
    expect(names({ KH_WEBKIT: "1" })).toEqual(["site", "storybook", "webkit-iphone", "webkit-laptop", "webkit-storybook"]);
    const [iphone, mac] = e2eProjects({ KH_WEBKIT: "1" }, URLS).slice(2);
    expect(iphone).toMatchObject({ use: { browserName: "webkit", isMobile: true, hasTouch: true, baseURL: URLS.site }, metadata: { viewportGroups: ["phone"] } });
    expect(iphone.use?.userAgent).toMatch(/\(iPhone; CPU iPhone OS \d+/);
    expect(mac).toMatchObject({ use: { browserName: "webkit", isMobile: false, baseURL: URLS.site }, metadata: { viewportGroups: ["laptop"] } });
    expect(mac.use?.userAgent).toMatch(/Macintosh.*Version\/[\d.]+ Safari/);
  });

  /* Task 3.6 item 11: the story specs that run in WebKit too get their engine from a project, as the layout specs do,
     instead of launching WebKit themselves (motion-faq.spec.ts did, task 2.12). */
  it("add WebKit on the static Storybook for the story specs verified in WebKit on KH_WEBKIT=1", () => {
    const storybook = e2eProjects({ KH_WEBKIT: "1" }, URLS).find((p) => p.name === "webkit-storybook")!;
    expect(storybook).toMatchObject({ testMatch: WEBKIT_STORY_SPECS, use: { browserName: "webkit", baseURL: URLS.storybook } });
    expect(storybook.use?.userAgent).toMatch(/Macintosh.*Version\/[\d.]+ Safari/);
    expect(WEBKIT_STORY_SPECS.test("test/e2e/motion-faq.spec.ts")).toBe(true);
    for (const spec of ["no-sideways", "axe", "chrome", "visual-parity"]) expect(WEBKIT_STORY_SPECS.test(`test/e2e/${spec}.spec.ts`), spec).toBe(false);
    // Every spec it takes is a story spec (it runs against Storybook, not the site).
    for (const spec of ["motion-faq", "motion-reveal", "motion-doodle", "motion-button", "motion-hero", "motion-films", "films"]) {
      if (WEBKIT_STORY_SPECS.test(`test/e2e/${spec}.spec.ts`)) expect(STORY_SPECS.test(`test/e2e/${spec}.spec.ts`), spec).toBe(true);
    }
    expect(names({})).not.toContain("webkit-storybook");
  });

  it("give the WebKit layout projects the layout specs only", () => {
    const webkit = e2eProjects({ KH_WEBKIT: "1" }, URLS).filter((p) => p.name === "webkit-iphone" || p.name === "webkit-laptop");
    for (const p of webkit) expect(p.testMatch).toBe(LAYOUT_SPECS);
    for (const spec of ["no-sideways", "first-screen", "cta", "axe", "chrome"]) expect(LAYOUT_SPECS.test(`test/e2e/${spec}.spec.ts`), spec).toBe(true);
    for (const spec of ["visual-parity", "text-parity", "no-js", "motion", "motion-faq", "films", "perf-budget", "links", "tracking-probe", "redirects", "content-integrity"]) {
      expect(LAYOUT_SPECS.test(`test/e2e/${spec}.spec.ts`), spec).toBe(false);
    }
  });

  it("leave out, by title, the tests named for the other group's viewports", () => {
    const [iphone, mac] = e2eProjects({ KH_WEBKIT: "1" }, URLS).slice(2);
    const drops = (p: typeof iphone, title: string) => (p.grepInvert as RegExp).test(title);
    expect(drops(iphone, "no sideways scroll: home > laptop-1440x900")).toBe(true);
    expect(drops(iphone, "no sideways scroll: home > phone-402x714")).toBe(false);
    expect(drops(mac, "axe: home > phone-360x640")).toBe(true);
    expect(drops(mac, "axe: home > laptop-1920x1080")).toBe(false);
    expect(drops(mac, "cta values: home")).toBe(false);
  });

  it("skip a viewport outside the project's group; Chromium runs every viewport", () => {
    expect(viewportOffProject(phone, "webkit-iphone", { viewportGroups: ["phone"] })).toBeNull();
    expect(viewportOffProject(laptop, "webkit-iphone", { viewportGroups: ["phone"] })).toMatch(/webkit-iphone runs phone viewports only/);
    expect(viewportOffProject(phone, "webkit-laptop", { viewportGroups: ["laptop"] })).toMatch(/laptop viewports only/);
    expect(viewportOffProject(laptop, "site", {})).toBeNull();
  });

  it("emulate the iPhone's pixel ratio where a spec asks for none", () => {
    const [iphone, mac] = e2eProjects({ KH_WEBKIT: "1" }, URLS).slice(2);
    expect(projectDeviceScaleFactor(iphone.metadata ?? {})).toBe(3);
    expect(projectDeviceScaleFactor(mac.metadata ?? {})).toBe(1);
    expect(projectDeviceScaleFactor({})).toBe(1);
  });

  it("are the ones playwright.config.ts uses, WebKit included on KH_WEBKIT=1", async () => {
    const before = process.env.KH_WEBKIT;
    try {
      for (const flag of ["1", "0"]) {
        process.env.KH_WEBKIT = flag;
        vi.resetModules();
        const config = (await import("../playwright.config")).default;
        expect(config.projects?.map((p) => p.name), `KH_WEBKIT=${flag}`).toEqual(names({ KH_WEBKIT: flag }));
      }
    } finally {
      if (before === undefined) delete process.env.KH_WEBKIT;
      else process.env.KH_WEBKIT = before;
    }
  });
});
