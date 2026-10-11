import { defineConfig } from "@playwright/test";

/* Playwright (task 1.1; ADR-011, architecture §14, test plan §1.2).
 *
 * Two projects:
 *   site       every spec in test/e2e against the local production build: `next start` on port
 *              3456, the marketing host on http://localhost:3456 and the store host on
 *              http://store.localhost:3456 (test/e2e/support/env.ts);
 *   storybook  the per-pick specs of waves 2 and 3 (motion-*.spec.ts, films.spec.ts) against a
 *              static Storybook build, so components are tested on their stories before any page
 *              exists (`npm run build-storybook` writes storybook-static/).
 * `npm run verify:e2e` builds both, then runs this config. Screenshots, traces, reports and the
 * parity goldens stay local and git-ignored (D039).
 *
 *   KH_PARITY_TARGET=mockup (or --calibrate)   compare the mockup with itself; no server started
 *   KH_E2E_TARGET=beta                         the beta hosts (task 7.2); no server started
 */

const PORT = Number(process.env.KH_E2E_PORT ?? 3456);
const STORYBOOK_PORT = Number(process.env.KH_STORYBOOK_PORT ?? 6007);
const noServer =
  process.env.KH_NO_SERVER === "1" || process.env.KH_PARITY_TARGET === "mockup" || process.env.KH_E2E_TARGET === "beta";

const STORY_SPECS = /(?:^|[\\/])(?:motion-[a-z]+|films)\.spec\.ts$/;

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
  projects: [
    { name: "site", testIgnore: STORY_SPECS, use: { baseURL: `http://localhost:${PORT}` } },
    { name: "storybook", testMatch: STORY_SPECS, use: { baseURL: `http://localhost:${STORYBOOK_PORT}` } },
  ],
  webServer: noServer
    ? undefined
    : [
        {
          command: `npx next start -p ${PORT}`,
          url: `http://localhost:${PORT}/robots.txt`,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          stdout: "ignore",
          stderr: "pipe",
        },
        {
          command: `node test/e2e/support/static-server.mjs storybook-static ${STORYBOOK_PORT}`,
          url: `http://localhost:${STORYBOOK_PORT}/`,
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
        },
      ],
});
