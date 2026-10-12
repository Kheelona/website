/* The Playwright projects (task 1.1, WebKit added by 1.1b; test plan §1.2, §3, §4.1).
 *
 *   site           Chromium, every spec except the story specs, against the local build.
 *   storybook      Chromium, the per-pick specs of waves 2 and 3 against a static Storybook build.
 *   webkit-iphone  opt-in (KH_WEBKIT=1): WebKit with iPhone emulation (iOS Safari user agent,
 *                  touch, mobile viewport, pixel ratio 3) for the layout specs at the PHONE
 *                  viewports of the matrix; laptop viewports are skipped.
 *   webkit-laptop  opt-in (KH_WEBKIT=1): desktop WebKit (Safari's engine and user agent) for the
 *                  layout specs at the LAPTOP sizes; phone viewports are skipped.
 * The harness sets each context's viewport itself (viewports.ts), so a project's descriptor gives
 * the engine, the user agent and, for the iPhone, the pixel ratio; viewportOffProject() skips a
 * viewport the project does not run. WebKit needs its browser once: `npx playwright install
 * webkit` (approved 2026-10-12: the browser for the pinned Playwright 1.63.0, no npm change).
 */
import { devices, type PlaywrightTestProject } from "@playwright/test";
import type { Viewport } from "./viewports";

/** Specs whose result depends on the engine's layout: sideways scroll, the first screen and tap
 *  targets, CTA placement, axe, and the chrome (sticky bar safe area, drawer, bubble; task 3.1). */
export const LAYOUT_SPECS = /(?:^|[\\/])(?:no-sideways|first-screen|cta|axe|chrome)\.spec\.ts$/;
/** Per-pick motion specs and the films spec run on stories (waves 2 and 3). */
export const STORY_SPECS = /(?:^|[\\/])(?:motion-[a-z]+|films)\.spec\.ts$/;

/** The iPhone emulated: 402 px wide like the matrix's 402 x 714 (test plan §3), iOS 18 Safari. */
export const IPHONE = "iPhone 16 Pro";
const DESKTOP_SAFARI = "Desktop Safari";

/** What a project tells the harness (in its `metadata`). */
export type ProjectMeta = {
  /** Only these viewport groups run; absent: every viewport. */
  viewportGroups?: readonly Viewport["group"][];
  /** The pixel ratio a context gets when the spec asks for none (default 1). */
  deviceScaleFactor?: number;
};

/** A device descriptor as project options: browserName overrides the config's Chromium default. */
const webkitUse = (descriptor: (typeof devices)[string], baseURL: string) => ({ ...descriptor, browserName: "webkit" as const, baseURL });

/** Test titles that name a viewport of the given group ("laptop-1440x900"; viewports.ts names
 *  them), left out of a project that runs the other group. A title without a viewport name (the
 *  cta spec's) stays listed and viewportOffProject() skips it when it opens the wrong viewport. */
const titledFor = (group: Viewport["group"]) => new RegExp(`\\b${group}-\\d+x\\d+\\b`);

export function e2eProjects(env: { KH_WEBKIT?: string }, urls: { site: string; storybook: string }): PlaywrightTestProject[] {
  const projects: PlaywrightTestProject[] = [
    { name: "site", testIgnore: STORY_SPECS, use: { baseURL: urls.site } },
    { name: "storybook", testMatch: STORY_SPECS, use: { baseURL: urls.storybook } },
  ];
  if (env.KH_WEBKIT !== "1") return projects;
  const iphone = devices[IPHONE];
  const phoneMeta: ProjectMeta = { viewportGroups: ["phone"], deviceScaleFactor: iphone.deviceScaleFactor };
  const laptopMeta: ProjectMeta = { viewportGroups: ["laptop"] };
  return [
    ...projects,
    { name: "webkit-iphone", testMatch: LAYOUT_SPECS, grepInvert: titledFor("laptop"), use: webkitUse(iphone, urls.site), metadata: phoneMeta },
    {
      name: "webkit-laptop",
      testMatch: LAYOUT_SPECS,
      grepInvert: titledFor("phone"),
      use: webkitUse(devices[DESKTOP_SAFARI], urls.site),
      metadata: laptopMeta,
    },
  ];
}

/** Why a viewport does not run in this project, or null when it does. */
export function viewportOffProject(vp: Viewport, project: string, meta: ProjectMeta): string | null {
  const groups = meta.viewportGroups;
  if (!groups || groups.includes(vp.group)) return null;
  return `${project} runs ${groups.join(" and ")} viewports only (${vp.name} is a ${vp.group} viewport)`;
}

/** The pixel ratio for a context whose spec did not ask for one. */
export function projectDeviceScaleFactor(meta: ProjectMeta): number {
  return meta.deviceScaleFactor ?? 1;
}
