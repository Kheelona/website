import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";
import { TARGET } from "./support/env";
import { expect, gateRouteGroup, requiresServer, test } from "./support/fixtures";
import { ROOT } from "./support/repo";
import { builtUrl, sweepRoutes } from "./support/routes";
import { VIEWPORTS } from "./support/viewports";

/* Performance bytes per route (task 1.1; architecture §12, test plan §4.4, tasks.md SPA 8).
 *
 * At 390 x 844 (device pixel ratio 2, as most of the audit's phones), CPU slowed 4x and a 4G
 * profile, every built route is loaded without scrolling (so lazy images stay out of first load)
 * and the TRANSFERRED bytes of each response are summed per resource type from the network
 * itself (Network.loadingFinished encodedDataLength), never from attributes (lessons §2).
 * Budgets, marketing / store: HTML document 60 / 45 KB, JavaScript 175 / 185 KB (re-based at M1, below), CSS 35 / 35 KB,
 * fonts 130 / 130 KB, images above the fold 250 / 120 KB, images on first load 400 / 200 KB, the
 * LCP image 200 KB; on marketing pages at most 25 KB of JavaScript beyond the shared chunks (the
 * framework chunks and every layout's chunks, read from the local build: see sharedChunks; local
 * runs only, as the manifests describe the local build). No film is requested before play. Then every film poster on the
 * page is scrolled into view and each must arrive in at most 40 KB (posters are recognised by
 * their source, public/video/moments/*, directly or through /_next/image).
 */

const KB = 1024;
/* JavaScript, re-based at milestone M1 (main session, 2026-10-14; architecture §12): the plan's 130 / 150 KB were set
 * before measuring Next 16.3 with React 19.2, whose root chunks alone are 127.4 KB gzip (build-manifest rootMainFiles),
 * so no page could meet them. Measured at M1: shared framework and layouts 148.5 KB on every marketing route; total
 * 162.9-171.1 KB on marketing pages, 175.4 KB on the store. The page's own code stays the controllable budget
 * (ROUTE_SCRIPT_BUDGET, unchanged), and Lighthouse mobile >= 90 (scripts/qa/lighthouse.mjs) is the outcome that gates. */
const BUDGETS = {
  marketing: { document: 60, script: 175, stylesheet: 35, font: 130, imagesAboveFold: 250, images: 400, lcp: 200 },
  store: { document: 45, script: 185, stylesheet: 35, font: 130, imagesAboveFold: 120, images: 200, lcp: 200 },
} as const;
const ROUTE_SCRIPT_BUDGET = 25;
const POSTER_BUDGET = 40;
const vp = VIEWPORTS.find((v) => v.width === 390)!;

/** The chunks a route shares with its siblings, from the local build (architecture §12): the
 *  framework chunks (build-manifest rootMainFiles and polyfillFiles) plus every layout's chunks
 *  (entryJSFiles of each "…/layout" entry in the client reference manifests), so what is left is
 *  what the page itself adds. If Next changes these internal files, fewer chunks count as shared
 *  and the budget fails loudly rather than passing. */
function sharedChunks(): Set<string> | null {
  if (TARGET !== "local") return null;
  const next = join(ROOT, ".next");
  const file = join(next, "build-manifest.json");
  if (!existsSync(file)) throw new Error("perf-budget: .next/build-manifest.json is missing; run npm run build first");
  const manifest = JSON.parse(readFileSync(file, "utf8")) as { rootMainFiles?: string[]; polyfillFiles?: string[] };
  const shared = new Set([...(manifest.rootMainFiles ?? []), ...(manifest.polyfillFiles ?? [])]);
  const appDir = join(next, "server/app");
  const manifests = existsSync(appDir)
    ? readdirSync(appDir, { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith("_client-reference-manifest.js"))
    : [];
  for (const rel of manifests) {
    const sandbox = vm.createContext({});
    vm.runInContext(readFileSync(join(appDir, rel), "utf8"), sandbox);
    const routes = (sandbox as { __RSC_MANIFEST?: Record<string, { entryJSFiles?: Record<string, string[]> }> }).__RSC_MANIFEST ?? {};
    for (const route of Object.values(routes)) {
      for (const [entry, files] of Object.entries(route.entryJSFiles ?? {})) {
        if (/\/layout$/.test(entry)) files.forEach((f) => shared.add(f));
      }
    }
  }
  return new Set([...shared].map((f) => `/_next/${f}`));
}

/** A film poster: public/video/moments/<id>.<image>, served directly or through /_next/image. */
function isPoster(url: string): boolean {
  const u = new URL(url);
  const source = u.pathname === "/_next/image" ? (u.searchParams.get("url") ?? "") : u.pathname;
  return /\/video\/moments\/[^/?#]+\.(?:jpe?g|png|webp|avif)$/i.test(source);
}

for (const route of sweepRoutes()) {
  test.describe(`perf budget: ${route.id}`, () => {
    requiresServer();
    gateRouteGroup(route);

    test("transferred bytes within budget", async ({ harness }) => {
      const shared = sharedChunks();
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
      let routeScript = 0;
      const routeChunks: string[] = [];
      const films: string[] = [];
      for (const [id, req] of requests) {
        const size = bytes.get(id) ?? 0;
        const type = req.type.toLowerCase();
        totals[type] = (totals[type] ?? 0) + size;
        if (type === "image" && aboveFold.has(req.url)) imagesAboveFold += size;
        if (lcpUrl && req.url === lcpUrl) lcpBytes = size;
        if (type === "media" || /\.mp4(?:$|\?)/.test(req.url)) films.push(req.url);
        if (type === "script" && shared && !shared.has(new URL(req.url).pathname)) {
          routeScript += size;
          routeChunks.push(`${new URL(req.url).pathname} ${(size / KB).toFixed(1)}`);
        }
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
      const routeScriptKB = routeScript / KB;
      console.log(
        `[perf-budget] ${route.id} (KB): ${JSON.stringify(Object.fromEntries(Object.entries(measured).map(([k, v]) => [k, Math.round(v * 10) / 10])))}` +
          (shared ? ` route-specific script ${routeScriptKB.toFixed(1)}${routeChunks.length ? ` (${routeChunks.join(", ")})` : ""}` : " route-specific script not measured (no local build manifest)"),
      );
      for (const key of Object.keys(measured) as (keyof typeof measured)[]) {
        expect.soft(measured[key], `${route.id}: ${key} ${measured[key].toFixed(1)} KB over its ${budget[key]} KB budget`).toBeLessThanOrEqual(budget[key]);
      }
      if (shared && route.host === "marketing") {
        expect
          .soft(routeScriptKB, `${route.id}: ${routeScriptKB.toFixed(1)} KB of route-specific JavaScript beyond the shared framework chunks (budget ${ROUTE_SCRIPT_BUDGET} KB)`)
          .toBeLessThanOrEqual(ROUTE_SCRIPT_BUDGET);
      }
      expect.soft(films, `${route.id}: films requested before play`).toEqual([]);

      // Posters: bring every one into view (lazy ones too, inside a sideways strip), then weigh each.
      const posterCount = await page.evaluate(() => {
        const posters = Array.from(document.images).filter((img) => /\/video\/moments\//.test(decodeURIComponent(img.currentSrc || img.src)));
        return posters.length;
      });
      for (let i = 0; i < posterCount; i++) {
        await page.evaluate((n) => {
          const posters = Array.from(document.images).filter((img) => /\/video\/moments\//.test(decodeURIComponent(img.currentSrc || img.src)));
          posters[n]?.scrollIntoView({ block: "center", inline: "center" });
        }, i);
        await page.waitForTimeout(150);
      }
      // waitForLoadState("networkidle") would return at once (the page reached it before the
      // scroll), so wait for the poster images themselves, then let the last byte counts arrive.
      const postersLoaded = await page
        .waitForFunction(
          () => Array.from(document.images).filter((img) => /\/video\/moments\//.test(decodeURIComponent(img.currentSrc || img.src))).every((img) => img.complete),
          null,
          { timeout: 20_000 },
        )
        .then(() => true)
        .catch(() => false);
      expect
        .soft(postersLoaded, `${route.id}: a poster never finished loading after being scrolled into view (a strip moved by transform, not native scroll-snap as architecture §11.2 asks, never loads its lazy posters)`)
        .toBe(true);
      await page.waitForTimeout(500);
      const posters = [...requests].filter(([, req]) => req.type.toLowerCase() === "image" && isPoster(req.url));
      if (posterCount || posters.length) {
        const sizes = posters.map(([id, req]) => `${decodeURIComponent(new URL(req.url).search || new URL(req.url).pathname).replace(/^\?/, "")} ${((bytes.get(id) ?? 0) / KB).toFixed(1)}`);
        console.log(`[perf-budget] ${route.id}: ${posters.length} poster response(s) for ${posterCount} poster image(s) (KB): ${sizes.join("; ")}`);
      }
      for (const [id, req] of posters) {
        const kb = (bytes.get(id) ?? 0) / KB;
        expect.soft(kb, `${route.id}: poster ${req.url} is ${kb.toFixed(1)} KB (budget ${POSTER_BUDGET} KB at tile size)`).toBeLessThanOrEqual(POSTER_BUDGET);
      }
    });
  });
}
