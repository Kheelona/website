import { expect, gateRouteGroup, requiresServer, test } from "./support/fixtures";
import { builtUrl, sweepRoutes } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* Performance bytes per route (task 1.1; architecture §12, test plan §4.4, tasks.md SPA 8).
 *
 * At 390 x 844 (device pixel ratio 2, as most of the audit's phones), CPU slowed 4x and a 4G
 * profile, every built route is loaded without scrolling (so lazy images stay out of first load)
 * and the TRANSFERRED bytes of each response are summed per resource type from the network
 * itself (Network.loadingFinished encodedDataLength), never from attributes (lessons §2).
 * Budgets, marketing / store: HTML document 60 / 45 KB, JavaScript 130 / 150 KB, CSS 35 / 35 KB,
 * fonts 130 / 130 KB, images above the fold 250 / 120 KB, images on first load 400 / 200 KB, the
 * LCP image 200 KB. No film is requested before play.
 */

const KB = 1024;
const BUDGETS = {
  marketing: { document: 60, script: 130, stylesheet: 35, font: 130, imagesAboveFold: 250, images: 400, lcp: 200 },
  store: { document: 45, script: 150, stylesheet: 35, font: 130, imagesAboveFold: 120, images: 200, lcp: 200 },
} as const;
const vp = VIEWPORTS.find((v) => v.width === 390)!;

for (const route of sweepRoutes()) {
  test.describe(`perf budget: ${route.id}`, () => {
    requiresServer();
    gateRouteGroup(route);

    test("transferred bytes within budget", async ({ harness }) => {
      const context = await harness.context(vp, { deviceScaleFactor: 2 });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send("Network.enable");
      await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: (1.6 * 1024 * 1024) / 8,
        uploadThroughput: (750 * 1024) / 8,
      });
      const requests = new Map<string, { url: string; type: string }>();
      const bytes = new Map<string, number>();
      cdp.on("Network.responseReceived", (e) => requests.set(e.requestId, { url: e.response.url, type: e.type }));
      cdp.on("Network.loadingFinished", (e) => bytes.set(e.requestId, e.encodedDataLength));

      await page.goto(builtUrl(route), { waitUntil: "load" });
      await page.waitForLoadState("networkidle");
      const lcpUrl = await page.evaluate(
        () =>
          new Promise<string>((done) => {
            new PerformanceObserver((list) => {
              const entries = list.getEntries() as (PerformanceEntry & { url?: string })[];
              done(entries.at(-1)?.url ?? "");
            }).observe({ type: "largest-contentful-paint", buffered: true });
            setTimeout(() => done(""), 3000);
          }),
      );
      const aboveFold = new Set(
        await page.evaluate(() =>
          Array.from(document.images)
            .filter((img) => img.getBoundingClientRect().top < window.innerHeight && img.currentSrc)
            .map((img) => img.currentSrc),
        ),
      );

      const totals: Record<string, number> = {};
      let imagesAboveFold = 0;
      let lcpBytes = 0;
      const films: string[] = [];
      for (const [id, req] of requests) {
        const size = bytes.get(id) ?? 0;
        const type = req.type.toLowerCase();
        totals[type] = (totals[type] ?? 0) + size;
        if (type === "image" && aboveFold.has(req.url)) imagesAboveFold += size;
        if (lcpUrl && req.url === lcpUrl) lcpBytes = size;
        if (type === "media" || /\.mp4(?:$|\?)/.test(req.url)) films.push(req.url);
      }
      const budget = BUDGETS[route.host];
      const measured = {
        document: (totals.document ?? 0) / KB,
        script: (totals.script ?? 0) / KB,
        stylesheet: (totals.stylesheet ?? 0) / KB,
        font: (totals.font ?? 0) / KB,
        images: (totals.image ?? 0) / KB,
        imagesAboveFold: imagesAboveFold / KB,
        lcp: lcpBytes / KB,
      };
      console.log(`[perf-budget] ${route.id} (KB): ${JSON.stringify(Object.fromEntries(Object.entries(measured).map(([k, v]) => [k, Math.round(v * 10) / 10])))}`);
      for (const key of Object.keys(measured) as (keyof typeof measured)[]) {
        expect.soft(measured[key], `${route.id}: ${key} ${measured[key].toFixed(1)} KB over its ${budget[key]} KB budget`).toBeLessThanOrEqual(budget[key]);
      }
      expect(films, `${route.id}: films requested before play`).toEqual([]);
    });
  });
}
