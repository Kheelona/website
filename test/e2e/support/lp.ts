/* LP, the local tracking probe (task 1.1; isolation rebuilt by task 7.1e for QA-001 and QA-002; test plan §1.1
 * and §5.1, lessons §5 and §7).
 *
 * The page runs on the real HTTPS origins (https://kheelona.com, https://store.kheelona.com), so the host gates
 * open and cookies behave as on production, while every response comes from the local build. Two lines keep the
 * probe off production:
 *
 *   1. Playwright routing (`newContext`). A request to a real origin is fetched from the local build by Node with
 *      its original Host header and fulfilled; every measurement request is recorded and answered here; the tags'
 *      script and config downloads are fetched by Node (GET only) and served from a cache; anything else is aborted.
 *   2. The browser's DNS. Routing never sees a redirect hop (Chromium follows a fulfilled 3xx itself) or a beacon
 *      sent while a page closes (QA-001). So Chromium is launched with every host mapped to a local TLS proxy
 *      (`startLpProxy`: a throwaway self-signed certificate made at start, its key pinned in Chromium), and resolves
 *      nothing else. The proxy hands the two real origins to the local build and answers everything else itself:
 *      PostHog and Vercel paths (the local build's rewrite would forward /ingest to PostHog), every other host,
 *      Chromium's own background requests to Google included. It forwards nothing off the machine. What reaches it
 *      unrouted is in `log.escaped`, recorded and answered, never delivered.
 *
 * PostHog: posthog-js drops every event from a browser reporting `navigator.webdriver` true, and Playwright's does,
 * so the probe's pages report false, as a parent's browser does (QA-002). Full Chromium (`channel: "chromium"`),
 * not the headless shell: PostHog sent nothing from the shell even with webdriver false.
 *
 * Off the machine, only ever: the tags' script and config downloads (Node, GET), and with `downloads` PostHog's
 * config and SDK files through the local build's rewrite, without cookies (test plan §5.1). With `downloads: false`
 * (the method controls) not even those.
 */
import { createHash, generateKeyPairSync, randomBytes, sign } from "node:crypto";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { gunzipSync, inflateSync } from "node:zlib";
import type { Browser, BrowserContext, BrowserContextOptions, BrowserType, Route } from "@playwright/test";
import { POSTHOG_ASSET_PROXY_PATH, POSTHOG_PROXY_PATH, isPostHogProxyPath } from "@/config/site";
import { PORT, REAL_ORIGINS } from "./env";

export type Destination = "ga4" | "meta" | "posthog" | "ahrefs" | "vercel";
/** What the probe does with one request; both lines ask the same question. */
export type Verdict =
  | { kind: "site" | "posthog-download" | "download" | "pass" | "refuse" }
  | { kind: "measurement"; destination: Destination };
/** A measurement request, recorded and answered locally by routing or by the proxy, never delivered. */
export type Recorded = { destination: Destination; via: "route" | "proxy"; url: string; body: string };
/** A request handed to the local build. */
export type Forwarded = { via: "route" | "proxy"; method: string; host: string; path: string };
/** A request that skipped routing and that the proxy answered itself. */
export type Escaped = { method: string; host: string; path: string; body: string };
export type LpLog = {
  /** "METHOD url" of every request routing saw. */
  routed: string[];
  forwarded: Forwarded[];
  escaped: Escaped[];
  recorded: Recorded[];
  /** Tag downloads fetched by Node. */
  downloads: string[];
  /** "METHOD url" of every request routing aborted. */
  refused: string[];
};
export const newLpLog = (): LpLog => ({ routed: [], forwarded: [], escaped: [], recorded: [], downloads: [], refused: [] });

/** Script and config downloads the tags need (GET); everything else third-party is refused. */
const DOWNLOADS = [
  /^https:\/\/www\.googletagmanager\.com\/gtag\/js/,
  /^https:\/\/connect\.facebook\.net\/(?:[^/]+\/fbevents|signals\/(?:config|plugins)\/)/,
  /^https:\/\/analytics\.ahrefs\.com\/analytics\.js/,
];
/** Beacons: recorded, answered, never delivered. */
const BEACONS: { destination: Destination; pattern: RegExp }[] = [
  { destination: "ga4", pattern: /^https:\/\/(?:[a-z0-9-]+\.)?(?:google-analytics\.com|analytics\.google\.com)\/g\/collect/ },
  { destination: "ga4", pattern: /^https:\/\/www\.google\.com\/g\/collect/ },
  { destination: "meta", pattern: /^https:\/\/(?:www\.)?facebook\.com\/tr/ },
  { destination: "ahrefs", pattern: /^https:\/\/analytics\.ahrefs\.com\/api\// },
];
const REAL_HOSTS = new Set([new URL(REAL_ORIGINS.marketing).host, new URL(REAL_ORIGINS.store).host]);
const isPostHogDownload = (path: string): boolean =>
  path.startsWith(`${POSTHOG_PROXY_PATH}/array/`) || path.startsWith(`${POSTHOG_ASSET_PROXY_PATH}/`);

export function classify(method: string, href: string): Verdict {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return { kind: "refuse" };
  }
  if (url.protocol === "data:" || url.protocol === "blob:") return { kind: "pass" };
  if (url.protocol === "https:" && REAL_HOSTS.has(url.host)) {
    if (isPostHogProxyPath(url.pathname)) {
      return method === "GET" && isPostHogDownload(url.pathname) ? { kind: "posthog-download" } : { kind: "measurement", destination: "posthog" };
    }
    if (url.pathname.startsWith("/_vercel/") || /\/insights\//.test(url.pathname)) return { kind: "measurement", destination: "vercel" };
    return { kind: "site" };
  }
  const beacon = BEACONS.find((b) => b.pattern.test(href));
  if (beacon) return { kind: "measurement", destination: beacon.destination };
  if (method === "GET" && DOWNLOADS.some((d) => d.test(href))) return { kind: "download" };
  return { kind: "refuse" };
}

/** A request body as text: plain, gzip (posthog-js `gzip-js`), deflate, or a base64 `data=` form. */
export function decodeBody(buf: Buffer | null | undefined): string {
  if (!buf || buf.length === 0) return "";
  for (const unzip of [gunzipSync, inflateSync]) {
    try {
      return unzip(buf).toString("utf8");
    } catch {
      // not this encoding
    }
  }
  const text = buf.toString("utf8");
  const form = /(?:^|&)data=([^&]+)/.exec(text);
  if (!form) return text;
  const raw = Buffer.from(decodeURIComponent(form[1]), "base64");
  try {
    return gunzipSync(raw).toString("utf8");
  } catch {
    return raw.toString("utf8");
  }
}

const NO_FLAGS = JSON.stringify({ featureFlags: {}, featureFlagPayloads: {}, errorsWhileComputingFlags: false });
type Answer = { status: number; contentType?: string; body: string };
/** What either line answers, locally, for a request it does not hand to the local build. */
function localAnswer(verdict: Verdict, pathname: string): Answer {
  if (verdict.kind === "measurement" && verdict.destination === "posthog") {
    const flags = /^\/ingest\/(?:flags|decide)\b/.test(pathname);
    return { status: 200, contentType: "application/json", body: flags ? NO_FLAGS : '{"status":1}' };
  }
  if (verdict.kind === "posthog-download") {
    return pathname.endsWith(".js") ? { status: 200, contentType: "text/javascript", body: "" } : { status: 200, contentType: "application/json", body: "{}" };
  }
  return { status: 204, body: "" };
}

const HOP_BY_HOP = new Set(["connection", "keep-alive", "transfer-encoding"]);
type LocalResponse = { status: number; headers: http.IncomingHttpHeaders; body: Buffer };
/** One request to the local build, as the real origin's HTTPS request (Host kept). Without `cookies` (PostHog's
 *  downloads, which the build's rewrite sends on to PostHog) the browser's cookies stay here. */
function toLocalBuild(
  port: number,
  req: { method: string; host: string; path: string; headers: Record<string, string | string[] | undefined>; body?: Buffer | null },
  { cookies }: { cookies: boolean },
): Promise<LocalResponse> {
  const headers: Record<string, string | string[] | undefined> = {};
  for (const [k, v] of Object.entries(req.headers)) if (!k.startsWith(":") && !HOP_BY_HOP.has(k.toLowerCase())) headers[k.toLowerCase()] = v;
  headers.host = req.host;
  headers["x-forwarded-proto"] = "https";
  delete headers["accept-encoding"];
  if (!cookies) delete headers.cookie;
  return new Promise((resolve, reject) => {
    const r = http.request({ host: "127.0.0.1", port, path: req.path, method: req.method, headers }, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (c: Buffer) => chunks.push(c));
      res.on("end", () => {
        const out: http.IncomingHttpHeaders = {};
        for (const [k, v] of Object.entries(res.headers)) if (!HOP_BY_HOP.has(k)) out[k] = v;
        resolve({ status: res.statusCode ?? 502, headers: out, body: Buffer.concat(chunks) });
      });
    });
    r.on("error", reject);
    if (req.body?.length) r.write(req.body);
    r.end();
  });
}

/* ── The throwaway certificate: DER by hand from node:crypto, so no key is ever written or committed ─────────── */
const derLength = (n: number): Buffer =>
  n < 0x80 ? Buffer.from([n]) : n < 0x100 ? Buffer.from([0x81, n]) : Buffer.from([0x82, n >> 8, n & 0xff]);
const der = (tag: number, ...body: Buffer[]): Buffer => {
  const content = Buffer.concat(body);
  return Buffer.concat([Buffer.from([tag]), derLength(content.length), content]);
};
const derOid = (dotted: string): Buffer => {
  const [a, b, ...rest] = dotted.split(".").map(Number);
  const bytes = [40 * a + b];
  for (let v of rest) {
    const groups = [v & 0x7f];
    while ((v >>= 7)) groups.unshift((v & 0x7f) | 0x80);
    bytes.push(...groups);
  }
  return der(0x06, Buffer.from(bytes));
};
const derTime = (d: Date): Buffer => der(0x17, Buffer.from(`${d.toISOString().replace(/[-:T]/g, "").slice(2, 14)}Z`));
const derName = (cn: string): Buffer => der(0x30, der(0x31, der(0x30, derOid("2.5.4.3"), der(0x0c, Buffer.from(cn)))));

/** A self-signed P-256 certificate for `names`, valid from a day ago to a day ahead, made fresh on every call, and
 *  the base64 SHA-256 of its public key (`spki`), which the probe's Chromium pins; it is trusted nowhere else. */
export function throwawayCertificate(names: string[]): { cert: string; key: string; spki: string } {
  const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
  const spki = publicKey.export({ type: "spki", format: "der" });
  const ecdsaSha256 = der(0x30, derOid("1.2.840.10045.4.3.2"));
  const serial = randomBytes(8);
  // A minimal, positive DER INTEGER: a first byte of 0x00 is illegal padding to OpenSSL and BoringSSL, 0x80 and up negative.
  serial[0] = 0x40 | (serial[0] & 0x3f);
  const day = 24 * 60 * 60 * 1000;
  const subjectAltName = der(0x30, ...names.map((n) => der(0x82, Buffer.from(n))));
  const tbs = der(
    0x30,
    der(0xa0, der(0x02, Buffer.from([2]))),
    der(0x02, serial),
    ecdsaSha256,
    derName("kh-lp-probe"),
    der(0x30, derTime(new Date(Date.now() - day)), derTime(new Date(Date.now() + day))),
    derName("kh-lp-probe"),
    spki,
    der(0xa3, der(0x30, der(0x30, derOid("2.5.29.17"), der(0x04, subjectAltName)))),
  );
  const certificate = der(0x30, tbs, ecdsaSha256, der(0x03, Buffer.from([0]), sign("sha256", tbs, privateKey)));
  const pem = certificate.toString("base64").match(/.{1,64}/g)!.join("\n");
  return {
    cert: `-----BEGIN CERTIFICATE-----\n${pem}\n-----END CERTIFICATE-----\n`,
    key: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    spki: createHash("sha256").update(spki).digest("base64"),
  };
}

/* ── The proxy ───────────────────────────────────────────────────────────────────────────────────────────── */
type Listener = { port: number; close(): Promise<void> };
/** `spki` is the pin of the proxy's certificate. */
export type LpProxy = Listener & { spki: string };

/** The local TLS proxy every host resolves to. Hands the real origins to the local build on `upstreamPort` (and,
 *  with `downloads`, PostHog's config and SDK paths, without cookies); answers everything else itself. */
export async function startLpProxy({ upstreamPort, downloads, log }: { upstreamPort: number; downloads: boolean; log: LpLog }): Promise<LpProxy> {
  const { cert, key, spki } = throwawayCertificate([...REAL_HOSTS]);
  const server = https.createServer({ cert, key }, (req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", async () => {
      const method = req.method ?? "GET";
      const host = String(req.headers.host ?? "");
      const path = req.url ?? "/";
      const body = Buffer.concat(chunks);
      const verdict = classify(method, `https://${host}${path}`);
      if (verdict.kind === "site" || (verdict.kind === "posthog-download" && downloads)) {
        log.forwarded.push({ via: "proxy", method, host, path });
        try {
          const local = await toLocalBuild(upstreamPort, { method, host, path, headers: req.headers, body }, { cookies: verdict.kind === "site" });
          res.writeHead(local.status, local.headers);
          res.end(local.body);
        } catch (error) {
          res.writeHead(502, { "content-type": "text/plain" });
          res.end(`LP proxy: the local build on port ${upstreamPort} did not answer (${String(error)})`);
        }
        return;
      }
      const text = decodeBody(body);
      log.escaped.push({ method, host, path, body: text });
      if (verdict.kind === "measurement") log.recorded.push({ destination: verdict.destination, via: "proxy", url: `https://${host}${path}`, body: text });
      const answer = localAnswer(verdict, path.split("?")[0]);
      res.writeHead(answer.status, answer.contentType ? { "content-type": answer.contentType } : {});
      res.end(answer.body);
    });
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  return {
    port: (server.address() as net.AddressInfo).port,
    spki,
    close: () =>
      new Promise<void>((done) => {
        server.closeAllConnections();
        server.close(() => done());
      }),
  };
}

/** A loopback port that resets every connection (the routing-only plant's DNS target). */
async function startSink(): Promise<Listener> {
  const server = net.createServer((socket) => socket.destroy());
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  return { port: (server.address() as net.AddressInfo).port, close: () => new Promise<void>((done) => server.close(() => done())) };
}

/* ── The browser ─────────────────────────────────────────────────────────────────────────────────────────── */

/** Planted violations that prove the controls red (lessons §7), set with KH_LP_PLANT; neither can leak:
 *    routing-only  the browser's DNS leads to a sink that resets every connection instead of the proxy, so routing is
 *                  the only line, as before task 7.1e, and what skips it dies at the sink instead of reaching production;
 *    webdriver     the pages keep Playwright's navigator.webdriver (true), so posthog-js drops every event (QA-002). */
export const LP_PLANTS = ["routing-only", "webdriver"] as const;

const HIDE_WEBDRIVER = `Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false, configurable: true });`;

export type LpSession = {
  log: LpLog;
  browser: Browser;
  /** A context on the real origins: routing installed, navigator.webdriver false. */
  newContext(options?: BrowserContextOptions): Promise<BrowserContext>;
  close(): Promise<void>;
};

type Download = { status: number; contentType: string; body: Buffer };

/** Starts the proxy and launches full Chromium with every host resolving to it. `browserType` is
 *  `chromium` from @playwright/test (the pinned version's browser). */
export async function launchLp(browserType: BrowserType, { downloads }: { downloads: boolean }): Promise<LpSession> {
  const plant = process.env.KH_LP_PLANT;
  if (plant && !(LP_PLANTS as readonly string[]).includes(plant)) throw new Error(`KH_LP_PLANT=${plant}: choose one of ${LP_PLANTS.join(", ")}`);
  const log = newLpLog();
  const proxy = await startLpProxy({ upstreamPort: PORT, downloads, log });
  const sink = plant === "routing-only" ? await startSink() : null;
  const closeListeners = async () => {
    await proxy.close();
    await sink?.close();
  };
  let browser: Browser;
  try {
    browser = await browserType.launch({
      channel: "chromium",
      args: [
        `--host-resolver-rules=MAP * 127.0.0.1:${(sink ?? proxy).port}`,
        // The proxy's key, accepted by the network stack itself: a context's ignoreHTTPSErrors does not reach a
        // beacon whose page has closed, which then dies in the handshake, unseen.
        `--ignore-certificate-errors-spki-list=${proxy.spki}`,
        // An Alt-Svc answer must never move a request off the mapped TCP port.
        "--disable-quic",
      ],
    });
  } catch (error) {
    await closeListeners();
    throw error;
  }
  const cache = new Map<string, Promise<Download>>();
  const download = (href: string): Promise<Download> => {
    if (!cache.has(href)) {
      cache.set(
        href,
        fetch(href, { headers: { "user-agent": REAL_DESKTOP_UA } }).then(async (r) => ({
          status: r.status,
          contentType: r.headers.get("content-type") ?? "text/javascript",
          body: Buffer.from(await r.arrayBuffer()),
        })),
      );
    }
    return cache.get(href)!;
  };

  const routeRequest = async (route: Route): Promise<void> => {
    const req = route.request();
    const method = req.method();
    const href = req.url();
    log.routed.push(`${method} ${href}`);
    const verdict = classify(method, href);
    const fulfil = (a: Answer) => route.fulfill({ status: a.status, ...(a.contentType ? { contentType: a.contentType } : {}), body: a.body });
    switch (verdict.kind) {
      case "pass":
        return route.continue();
      case "measurement":
        log.recorded.push({ destination: verdict.destination, via: "route", url: href, body: decodeBody(req.postDataBuffer()) });
        return fulfil(localAnswer(verdict, new URL(href).pathname));
      case "site":
      case "posthog-download": {
        const url = new URL(href);
        if (verdict.kind === "posthog-download" && !downloads) return fulfil(localAnswer(verdict, url.pathname));
        const path = `${url.pathname}${url.search}`;
        log.forwarded.push({ via: "route", method, host: url.host, path });
        const local = await toLocalBuild(
          PORT,
          { method, host: url.host, path, headers: await req.allHeaders(), body: req.postDataBuffer() },
          { cookies: verdict.kind === "site" },
        );
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(local.headers)) if (v !== undefined) headers[k] = Array.isArray(v) ? v.join("\n") : String(v);
        return route.fulfill({ status: local.status, headers, body: local.body });
      }
      case "download":
        if (downloads) {
          log.downloads.push(href);
          const d = await download(href);
          return route.fulfill({ status: d.status, contentType: d.contentType, body: d.body });
        }
        break;
    }
    log.refused.push(`${method} ${href}`);
    return route.abort("blockedbyclient");
  };

  return {
    log,
    browser,
    async newContext(options = {}) {
      const context = await browser.newContext(options);
      if (plant !== "webdriver") await context.addInitScript(HIDE_WEBDRIVER);
      await context.route("**/*", (route) =>
        routeRequest(route).catch((error: unknown) => {
          // A request still in flight when its page or context closes: nothing left to answer.
          if (!/closed|destroyed/i.test(String(error))) throw error;
        }),
      );
      return context;
    },
    async close() {
      await browser.close();
      await closeListeners();
    },
  };
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
