import { IMAGE_SRC_HOOK, REAL_DESKTOP_UA, serveRealOriginsLocally } from "./support/lp";
import { expect, guardNetwork, test } from "./support/fixtures";
import { ORIGINS } from "./support/env";
import { VIEWPORTS, contextFor } from "./support/viewports";

/* Tracking probe, LP (task 1.1 builds the instrument; QA runs it in Phase 6: test plan §5.1-5.2,
 * tracking inventory parity checklist, lessons §5).
 *
 * The real origins are served from the local production build through Playwright routing, every
 * measurement request is recorded and answered locally (nothing is delivered), and the tags'
 * scripts are the only downloads. Two controls prove the method before any row is trusted: the
 * store host reaches the store routes (so the Host header arrived), and a tagged landing leaves
 * its kh_utm cookie in the browser (so Set-Cookie from a fulfilled response is honoured). A control
 * host run on http://localhost:3456 must load no gtag, no fbq and no /ingest request.
 *
 * Needs the network for the tags' own scripts, so it runs only on request:
 *   KH_TRACKING_PROBE=1 npx playwright test test/e2e/tracking-probe.spec.ts
 * Row evidence (payloads) is attached to the report; IDs and names come from the inventory.
 */

const ENABLED = process.env.KH_TRACKING_PROBE === "1";
const GA4_ID = "G-7LMKSFEXZ9";
const PIXEL_ID = "1051265191046395";
const vp = VIEWPORTS[0];

test.describe("tracking probe (LP)", () => {
  test.skip(!ENABLED, "QA instrument: set KH_TRACKING_PROBE=1 (needs the tags' script downloads)");

  test("control: the store host reaches the store and a tagged landing keeps kh_utm", async ({ browser }) => {
    const context = await browser.newContext({ ...contextFor(vp), userAgent: REAL_DESKTOP_UA });
    await serveRealOriginsLocally(context);
    const page = await context.newPage();
    const store = await page.goto("https://store.kheelona.com/");
    expect(store?.status()).toBe(200);
    // The store layout is noindex and the marketing home is not: a lost Host header would serve the home.
    const robots = await page.locator('meta[name="robots"]').getAttribute("content").catch(() => null);
    expect(robots ?? "", "the store host did not reach the store routes (Host header lost)").toMatch(/noindex/);
    await page.goto("https://kheelona.com/?utm_source=qa-probe&utm_medium=test&utm_campaign=lp");
    const cookies = await context.cookies("https://kheelona.com");
    expect(cookies.some((c) => c.name === "kh_utm"), "kh_utm was not set: Set-Cookie from a fulfilled response is not honoured").toBe(true);
    await context.close();
  });

  test("control host: localhost loads no tag", async ({ browser }) => {
    const context = await browser.newContext(contextFor(vp));
    await guardNetwork(context);
    const page = await context.newPage();
    const ingest: string[] = [];
    page.on("request", (r) => {
      if (/\/ingest\//.test(r.url())) ingest.push(r.url());
    });
    await page.goto(`${ORIGINS.marketing}/`);
    await page.waitForTimeout(3000);
    const tags = await page.evaluate(() => ({
      gtag: typeof (window as unknown as { gtag?: unknown }).gtag,
      fbq: typeof (window as unknown as { fbq?: unknown }).fbq,
    }));
    expect(tags).toEqual({ gtag: "undefined", fbq: "undefined" });
    expect(ingest).toEqual([]);
    await context.close();
  });

  for (const [path, viewContent] of [
    ["/", true],
    ["/products/kheelu", true],
    ["/safety", false],
  ] as const) {
    test(`rows 4, 11, 12, 14 on ${path}`, async ({ browser }, testInfo) => {
      const context = await browser.newContext({ ...contextFor(vp), userAgent: REAL_DESKTOP_UA });
      await context.addInitScript(IMAGE_SRC_HOOK);
      const recorded = await serveRealOriginsLocally(context);
      const page = await context.newPage();
      await page.goto(`https://kheelona.com${path}`);
      await page.waitForTimeout(6000);
      const state = await page.evaluate(() => {
        const w = window as unknown as {
          dataLayer?: unknown[][];
          fbq?: { getState?: () => { pixels: { id: string; eventCount: number }[] } };
          __khImageBeacons?: string[];
        };
        return {
          dataLayer: (w.dataLayer ?? []).map((e) => Array.from(e as ArrayLike<unknown>).map(String)),
          pixels: w.fbq?.getState?.().pixels ?? [],
          beacons: w.__khImageBeacons ?? [],
        };
      });
      await testInfo.attach("recorded.json", { body: JSON.stringify({ state, recorded }, null, 2), contentType: "application/json" });
      console.log(
        `[tracking-probe] ${path}: ${recorded.length} measurement request(s) recorded, none delivered: ` +
          recorded.map((r) => `${r.destination} ${new URL(r.url).pathname}`).join(", "),
      );
      expect(state.dataLayer.some((e) => e[0] === "config" && e[1] === GA4_ID), `row 4: dataLayer config ${GA4_ID}`).toBe(true);
      const pixel = state.pixels.find((p) => p.id === PIXEL_ID);
      expect(pixel, `row 11: Meta pixel ${PIXEL_ID} initialised`).toBeTruthy();
      expect(pixel!.eventCount, `rows 11-12: Meta eventCount on ${path}`).toBe(viewContent ? 2 : 1);
      expect(recorded.some((r) => r.destination === "posthog" && /\$pageview/.test(r.body)), "row 14: PostHog $pageview recorded").toBe(true);
      await context.close();
    });
  }
});
