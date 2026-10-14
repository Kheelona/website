import { chromium } from "@playwright/test";
import { isPostHogProxyPath } from "@/config/site";
import { IMAGE_SRC_HOOK, REAL_DESKTOP_UA, launchLp, type LpSession } from "./support/lp";
import { expect, guardNetwork, requiresServer, test } from "./support/fixtures";
import { ORIGINS, TARGET } from "./support/env";
import { VIEWPORTS, contextFor } from "./support/viewports";

/* Tracking probe, LP (task 1.1 builds the instrument, task 7.1e isolates it; QA runs it in Phase 6: test plan
 * §5.1-5.2, tracking inventory parity checklist, lessons §5 and §7).
 *
 * The real origins are served from the local production build (support/lp.ts): routing fulfils them from the local
 * build and records and answers every measurement request, and the browser's DNS sends every host to a local TLS
 * proxy that forwards nothing off the machine, so a request that skips routing is answered locally too (QA-001). The
 * pages report navigator.webdriver false in full Chromium, so PostHog records (QA-002). Controls prove the method
 * before any row is trusted:
 *   - the store host reaches the store routes (the Host header arrived) and a tagged landing keeps its kh_utm
 *     cookie (Set-Cookie from a fulfilled response is honoured);
 *   - a redirect hop, which routing never sees, still lands on the local build through the proxy (QA-001);
 *   - a beacon sent as the page closes, which routing never sees, is answered by the proxy and never handed to the
 *     local build, whose /ingest rewrite would forward it to PostHog (QA-001);
 *   - PostHog's $pageview reaches the instrument (QA-002);
 *   - a control host run on http://localhost:<port> loads no gtag, no fbq and no /ingest request.
 * Each of those routing controls fails under its plant, and no plant can leak (support/lp.ts LP_PLANTS):
 *   KH_LP_PLANT=routing-only npx playwright test test/e2e/tracking-probe.spec.ts   (the two QA-001 controls)
 *   KH_LP_PLANT=webdriver npx playwright test test/e2e/tracking-probe.spec.ts      (the QA-002 control)
 *
 * The controls need no tag, so they run offline in every e2e run: every download refused and every PostHog path
 * answered without the local build. The rows need the tags' own scripts, so they run only on request:
 *   KH_TRACKING_PROBE=1 npx playwright test test/e2e/tracking-probe.spec.ts
 * Row evidence (payloads) is attached to the report; IDs and names come from the inventory.
 */

const ENABLED = process.env.KH_TRACKING_PROBE === "1";
const GA4_ID = "G-7LMKSFEXZ9";
const PIXEL_ID = "1051265191046395";
const vp = VIEWPORTS[0];

/** One LP session (proxy and browser) per test, always closed. */
async function withLp(downloads: boolean, run: (lp: LpSession) => Promise<void>): Promise<void> {
  const lp = await launchLp(chromium, { downloads });
  try {
    await run(lp);
  } finally {
    await lp.close();
  }
}
const lpContext = (lp: LpSession) => lp.newContext({ ...contextFor(vp), userAgent: REAL_DESKTOP_UA });
/** PostHog paths handed to the local build, whose rewrite forwards them to PostHog. */
const posthogForwarded = (lp: LpSession) => lp.log.forwarded.filter((f) => isPostHogProxyPath(f.path.split("?")[0]));

test.describe("tracking probe (LP): method controls, offline", () => {
  requiresServer();
  test.skip(TARGET === "beta", "LP serves the local build; the beta hosts have their own capture (task 7.2)");

  test("control: the store host reaches the store and a tagged landing keeps kh_utm", async () => {
    await withLp(false, async (lp) => {
      const page = await (await lpContext(lp)).newPage();
      const store = await page.goto("https://store.kheelona.com/");
      expect(store?.status()).toBe(200);
      // The store layout is noindex and the marketing home is not: a lost Host header would serve the home.
      // Read at once: a locator would wait the whole test timeout for a tag the home page lacks.
      const robots = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? null);
      expect(robots ?? "", "the store host did not reach the store routes (Host header lost)").toMatch(/noindex/);
      await page.goto("https://kheelona.com/?utm_source=qa-probe&utm_medium=test&utm_campaign=lp");
      const cookies = await page.context().cookies("https://kheelona.com");
      expect(cookies.some((c) => c.name === "kh_utm"), "kh_utm was not set: Set-Cookie from a fulfilled response is not honoured").toBe(true);
      // Offline means offline: the local server's PostHog rewrite would forward any /ingest path.
      await page.waitForTimeout(2000);
      expect(posthogForwarded(lp), "a PostHog path reached the local server, whose rewrite forwards it to PostHog").toEqual([]);
    });
  });

  test("control (QA-001): a redirect hop skips routing and still lands on the local build, through the proxy", async () => {
    await withLp(false, async (lp) => {
      const page = await (await lpContext(lp)).newPage();
      // src/proxy.ts 308s a trailing slash away, keeping the query.
      const response = await page.goto("https://kheelona.com/team/?utm_source=qa-lp-redirect");
      expect(response?.status()).toBe(200);
      expect(page.url()).toBe("https://kheelona.com/team?utm_source=qa-lp-redirect");
      const mine = (s: string) => s.includes("utm_source=qa-lp-redirect");
      // Routing saw the first request only: Chromium followed the 308 itself, past routing (before task 7.1e, to production).
      expect(lp.log.routed.filter(mine)).toEqual(["GET https://kheelona.com/team/?utm_source=qa-lp-redirect"]);
      expect(lp.log.forwarded.filter((f) => mine(f.path))).toEqual([
        { via: "route", method: "GET", host: "kheelona.com", path: "/team/?utm_source=qa-lp-redirect" },
        { via: "proxy", method: "GET", host: "kheelona.com", path: "/team?utm_source=qa-lp-redirect" },
      ]);
    });
  });

  test("control (QA-001): a beacon sent as the page closes skips routing, and the proxy answers it without forwarding it", async () => {
    await withLp(false, async (lp) => {
      const page = await (await lpContext(lp)).newPage();
      await page.goto("https://kheelona.com/safety");
      await page.evaluate(() =>
        window.addEventListener("pagehide", () =>
          navigator.sendBeacon("/ingest/i/v0/e/?kh_lp_control=page-close", JSON.stringify([{ event: "kh_lp_control" }])),
        ),
      );
      await page.close();
      const mine = (s: string) => s.includes("kh_lp_control=page-close");
      await expect
        .poll(() => lp.log.escaped.filter((e) => mine(e.path)), { message: "the page-close beacon never reached the proxy", timeout: 10_000 })
        .toEqual([{ method: "POST", host: "kheelona.com", path: "/ingest/i/v0/e/?kh_lp_control=page-close", body: '[{"event":"kh_lp_control"}]' }]);
      // Routing never saw it (before task 7.1e it went to production, whose /ingest rewrite forwards to PostHog).
      expect(lp.log.routed.filter(mine)).toEqual([]);
      expect(posthogForwarded(lp), "a PostHog path reached the local server, whose rewrite forwards it to PostHog").toEqual([]);
    });
  });

  test("control (QA-002): PostHog records in the probe's browser", async () => {
    await withLp(false, async (lp) => {
      const page = await (await lpContext(lp)).newPage();
      await page.goto("https://kheelona.com/safety");
      await expect
        .poll(() => lp.log.recorded.some((r) => r.destination === "posthog" && r.body.includes('"$pageview"')), {
          message: "no PostHog $pageview reached the instrument (posthog-js drops navigator.webdriver browsers)",
          timeout: 15_000,
        })
        .toBe(true);
      expect(await page.evaluate(() => navigator.webdriver), "a parent's browser reports navigator.webdriver false").toBe(false);
      expect(posthogForwarded(lp)).toEqual([]);
    });
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
});

test.describe("tracking probe (LP): parity rows", () => {
  requiresServer();
  test.skip(!ENABLED || TARGET === "beta", "QA instrument: set KH_TRACKING_PROBE=1 (needs the tags' script downloads)");

  for (const [path, viewContent] of [
    ["/", true],
    ["/products/kheelu", true],
    ["/safety", false],
  ] as const) {
    test(`rows 4, 11, 12, 14 on ${path}`, async () => {
      const testInfo = test.info();
      await withLp(true, async (lp) => {
        const context = await lpContext(lp);
        await context.addInitScript(IMAGE_SRC_HOOK);
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
        await page.close();
        const { recorded, escaped, downloads, refused } = lp.log;
        await testInfo.attach("recorded.json", {
          body: JSON.stringify({ state, recorded, escaped, downloads, refused, forwardedPostHog: posthogForwarded(lp) }, null, 2),
          contentType: "application/json",
        });
        console.log(
          `[tracking-probe] ${path}: ${recorded.length} measurement request(s) recorded, none delivered: ` +
            recorded.map((r) => `${r.destination} ${new URL(r.url).pathname} (${r.via})`).join(", ") +
            `; answered by the proxy: ${escaped.length}; downloads: ${downloads.length}; refused: ${refused.length}`,
        );
        expect(state.dataLayer.some((e) => e[0] === "config" && e[1] === GA4_ID), `row 4: dataLayer config ${GA4_ID}`).toBe(true);
        const pixel = state.pixels.find((p) => p.id === PIXEL_ID);
        expect(pixel, `row 11: Meta pixel ${PIXEL_ID} initialised`).toBeTruthy();
        expect(pixel!.eventCount, `rows 11-12: Meta eventCount on ${path}`).toBe(viewContent ? 2 : 1);
        expect(recorded.some((r) => r.destination === "posthog" && r.body.includes('"$pageview"')), "row 14: PostHog $pageview recorded").toBe(true);
        // Test plan §5.1: PostHog reaches the local build's rewrite only for its config and SDK downloads.
        expect(
          posthogForwarded(lp).filter((f) => f.method !== "GET" || !/^\/ingest(?:\/array\/|-assets\/)/.test(f.path)),
          "a PostHog request other than a config or SDK download reached the local server's rewrite",
        ).toEqual([]);
      });
    });
  }
});
