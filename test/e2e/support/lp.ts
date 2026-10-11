/* LP, the local tracking probe (task 1.1; test plan §1.1 and §5.1, lessons §5).
 *
 * Chrome is not pointed at http://kheelona.com:3456 (Secure cookies would be refused over plain
 * HTTP). Playwright routes every request for https://kheelona.com/* and https://store.kheelona.com/*
 * to the local server instead, passing the original hostname as the Host header, and fulfils the
 * response, so the page runs on the real HTTPS origin, the host gates open, cookies behave as on
 * production, and nothing leaves the machine except the tags' script and config downloads.
 * Every measurement request is recorded and answered locally (204); /ingest/** is answered before
 * it reaches the local server, whose rewrite would forward it to PostHog.
 */
import http from "node:http";
import { gunzipSync } from "node:zlib";
import type { BrowserContext, Request, Route } from "@playwright/test";
import { PORT } from "./env";

export type Recorded = { destination: "ga4" | "meta" | "posthog" | "ahrefs" | "vercel"; url: string; body: string };

/** Script and config downloads the tags need; everything else third-party is aborted. */
const DOWNLOADS = [
  /^https:\/\/www\.googletagmanager\.com\/gtag\/js/,
  /^https:\/\/connect\.facebook\.net\/(?:[^/]+\/fbevents|signals\/(?:config|plugins)\/)/,
  /^https:\/\/analytics\.ahrefs\.com\/analytics\.js/,
];
/** Beacons: recorded, answered 204, never delivered. */
const BEACONS: { destination: Recorded["destination"]; pattern: RegExp }[] = [
  { destination: "ga4", pattern: /^https:\/\/(?:[a-z0-9-]+\.)?(?:google-analytics\.com|analytics\.google\.com)\/g\/collect/ },
  { destination: "meta", pattern: /^https:\/\/(?:www\.)?facebook\.com\/tr/ },
  { destination: "ahrefs", pattern: /^https:\/\/analytics\.ahrefs\.com\/api\// },
];
const REAL_ORIGIN = /^https:\/\/(?:store\.)?kheelona\.com\//;

function decodeBody(req: Request): string {
  const buf = req.postDataBuffer();
  if (!buf) return "";
  try {
    return gunzipSync(buf).toString("utf8");
  } catch {
    return buf.toString("utf8");
  }
}

function localFetch(req: Request, url: URL): Promise<{ status: number; headers: Record<string, string>; body: Buffer }> {
  const headers: Record<string, string> = { ...req.headers(), host: url.host, "x-forwarded-proto": "https" };
  delete headers["accept-encoding"];
  return new Promise((resolve, reject) => {
    const r = http.request(
      { host: "127.0.0.1", port: PORT, path: `${url.pathname}${url.search}`, method: req.method(), headers },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => {
          const out: Record<string, string> = {};
          for (const [k, v] of Object.entries(res.headers)) if (v !== undefined) out[k] = Array.isArray(v) ? v.join("\n") : String(v);
          resolve({ status: res.statusCode ?? 0, headers: out, body: Buffer.concat(chunks) });
        });
      },
    );
    r.on("error", reject);
    const body = req.postDataBuffer();
    if (body) r.write(body);
    r.end();
  });
}

/** Serves the real origins from the local build and records every measurement request. */
export async function serveRealOriginsLocally(context: BrowserContext): Promise<Recorded[]> {
  const recorded: Recorded[] = [];
  await context.route("**/*", async (route: Route) => {
    const req = route.request();
    const href = req.url();
    const url = new URL(href);
    if (REAL_ORIGIN.test(href)) {
      if (url.pathname.startsWith("/ingest/") || url.pathname.startsWith("/ingest-assets/")) {
        if (/^\/ingest\/(?:e|i|s|batch|capture|engage|track)\b/.test(url.pathname)) {
          recorded.push({ destination: "posthog", url: href, body: decodeBody(req) });
          return route.fulfill({ status: 200, contentType: "application/json", body: '{"status":1}' });
        }
        // Config, flags and SDK assets are allowed (test plan §5.1): the local server's rewrite fetches them.
      }
      if (url.pathname.startsWith("/_vercel/") || /\/insights\//.test(url.pathname)) {
        recorded.push({ destination: "vercel", url: href, body: decodeBody(req) });
        return route.fulfill({ status: 204, body: "" });
      }
      const res = await localFetch(req, url);
      return route.fulfill({ status: res.status, headers: res.headers, body: res.body });
    }
    const beacon = BEACONS.find((b) => b.pattern.test(href));
    if (beacon) {
      recorded.push({ destination: beacon.destination, url: href, body: decodeBody(req) });
      return route.fulfill({ status: 204, body: "" });
    }
    if (DOWNLOADS.some((d) => d.test(href)) || url.protocol === "data:" || url.protocol === "blob:") return route.continue();
    return route.abort("blockedbyclient");
  });
  return recorded;
}

/** The Meta pixel beacons through `new Image().src` (lessons §5): hook the setter itself. */
export const IMAGE_SRC_HOOK = `
  (() => {
    const seen = (window.__khImageBeacons = []);
    const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true,
      get() { return desc.get.call(this); },
      set(v) { if (/facebook\\.com\\/tr/.test(String(v))) seen.push(String(v)); return desc.set.call(this, v); },
    });
  })();`;

/** A real desktop Chrome user agent: Meta drops headless Chrome as a bot (lessons §5). */
export const REAL_DESKTOP_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
