import { defineConfig } from "@playwright/test";
import { e2eProjects } from "./test/e2e/support/projects";

/* Playwright (task 1.1, WebKit projects added by 1.1b and 3.6; ADR-011, architecture §14, test plan §1.2, §3).
 *
 * Projects (test/e2e/support/projects.ts):
 *   site           Chromium, every spec in test/e2e against the local production build: `next start`
 *                  on port 3456, the marketing host on http://localhost:3456 and the store host on
 *                  http://store.localhost:3456 (test/e2e/support/env.ts);
 *   storybook      Chromium, the story specs (STORY_SPECS: motion-*.spec.ts, films.spec.ts, tabs.spec.ts)
 *                  against a static Storybook build, so components are tested on their stories before
 *                  any page exists (`npm run build-storybook` writes storybook-static/);
 *   webkit-iphone  only with KH_WEBKIT=1: WebKit with iPhone emulation for the layout specs
 *                  (no-sideways, first-screen, cta, axe, chrome) at the phone viewports;
 *   webkit-laptop  only with KH_WEBKIT=1: WebKit (Safari's engine) for the same specs at the laptop sizes;
 *   webkit-storybook  only with KH_WEBKIT=1: desktop WebKit on the static Storybook, for the story specs
 *                  verified in WebKit (WEBKIT_STORY_SPECS: motion-faq.spec.ts, D049 pick 7; task 3.6).
 * WebKit is opt-in because its browser is not installed by default. Install it once for the pinned
 * Playwright 1.63.0 (approved 2026-10-12; a browser binary only, no npm change):
 *   npx playwright install webkit
 * then, for example:
 *   KH_WEBKIT=1 npx playwright test --project=webkit-iphone test/e2e/no-sideways.spec.ts
 *   KH_WEBKIT=1 KH_PARITY_TARGET=mockup KH_NO_SERVER=1 npx playwright test --project=webkit-laptop test/e2e/axe.spec.ts
 * `npm run verify:e2e` builds both, then runs this config. Screenshots, traces, reports and the
 * parity goldens stay local and git-ignored (D039).
 *
 *   KH_PARITY_TARGET=mockup (or --calibrate)   compare the mockup with itself; no server started
 *   KH_E2E_TARGET=beta                         the beta hosts (task 7.2); no server started
 *   KH_REUSE_SERVER=1                          use a server already listening on the port
 *   KH_WEBKIT=1                                add the two WebKit projects
 *
 * A server already on the port is NOT reused by default: `verify:e2e` builds first, and a stale
 * `next start` keeps serving the old build (and `public/` as it was at build time), so the run
 * would test the wrong thing (lessons §1). Playwright stops with "already used" instead; kill the
 * listener by PID (`lsof -nP -iTCP:3456 -sTCP:LISTEN`) or opt in when iterating on one build.
 */

const PORT = Number(process.env.KH_E2E_PORT ?? 3456);
const STORYBOOK_PORT = Number(process.env.KH_STORYBOOK_PORT ?? 6007);
const REUSE = process.env.KH_REUSE_SERVER === "1";
const noServer =
  process.env.KH_NO_SERVER === "1" || process.env.KH_PARITY_TARGET === "mockup" || process.env.KH_E2E_TARGET === "beta";

export default defineConfig({
  testDir: "test/e2e",
  testMatch: /\.spec\.ts$/,
  outputDir: "test-results",
  snapshotPathTemplate: "{testDir}/.goldens/{projectName}/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  timeout: 180_000,
  expect: { timeout: 10_000 },
  use: {
    browserName: "chromium",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: e2eProjects({ KH_WEBKIT: process.env.KH_WEBKIT }, { site: `http://localhost:${PORT}`, storybook: `http://localhost:${STORYBOOK_PORT}` }),
  webServer: noServer
    ? undefined
    : [
        {
          command: `npx next start -p ${PORT}`,
          url: `http://localhost:${PORT}/robots.txt`,
          reuseExistingServer: REUSE,
          timeout: 120_000,
          stdout: "ignore",
          stderr: "pipe",
        },
        {
          command: `node test/e2e/support/static-server.mjs storybook-static ${STORYBOOK_PORT}`,
          url: `http://localhost:${STORYBOOK_PORT}/`,
          reuseExistingServer: REUSE,
          timeout: 30_000,
        },
      ],
});
