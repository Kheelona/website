import { createHash, X509Certificate } from "node:crypto";
import http from "node:http";
import https from "node:https";
import type { TLSSocket } from "node:tls";
import { gzipSync } from "node:zlib";
import { afterEach, beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import type { BrowserType } from "@playwright/test";
import { classify, decodeBody, launchLp, newLpLog, startLpProxy, throwawayCertificate, type LpLog, type LpProxy } from "./e2e/support/lp";

/* The LP harness's network rules (task 7.1e: QA-001, QA-002), where they can be read without a browser.
 *
 * QA-001: a redirect hop and a page-close beacon skip Playwright's routing, so routing alone cannot keep the
 * probe off production. The browser's DNS now sends every host to a local TLS proxy (startLpProxy), which hands
 * the two real origins to the local build and answers everything else itself: it forwards nothing off the
 * machine. These tests drive that proxy over real TLS against a stand-in local build; the browser half (the
 * hop and the beacon reaching it) is proven by the controls in test/e2e/tracking-probe.spec.ts. */

describe("classify: what the probe does with each request", () => {
  const cases: [method: string, href: string, want: ReturnType<typeof classify>][] = [
    // The two real origins are the local build's, page or asset, either host.
    ["GET", "https://kheelona.com/", { kind: "site" }],
    ["GET", "https://store.kheelona.com/thanks", { kind: "site" }],
    ["POST", "https://store.kheelona.com/api/preorder/create-order", { kind: "site" }],
    ["GET", "https://kheelona.com/ingestion-report", { kind: "site" }],
    // PostHog's config and SDK downloads (GET only) go through the local rewrite, as test plan §5.1 allows.
    ["GET", "https://kheelona.com/ingest/array/phc_x/config.js", { kind: "posthog-download" }],
    ["GET", "https://store.kheelona.com/ingest-assets/static/recorder.js", { kind: "posthog-download" }],
    // Every other PostHog path is measurement: recorded and answered here, flags included.
    ["POST", "https://kheelona.com/ingest/i/v0/e/?ip=0", { kind: "measurement", destination: "posthog" }],
    ["POST", "https://store.kheelona.com/ingest/s/?compression=gzip-js", { kind: "measurement", destination: "posthog" }],
    ["POST", "https://kheelona.com/ingest/flags/?v=2", { kind: "measurement", destination: "posthog" }],
    ["GET", "https://kheelona.com/ingest/e/", { kind: "measurement", destination: "posthog" }],
    ["POST", "https://kheelona.com/ingest/array/phc_x/config", { kind: "measurement", destination: "posthog" }],
    ["GET", "https://kheelona.com/_vercel/insights/script.js", { kind: "measurement", destination: "vercel" }],
    // Beacons.
    ["POST", "https://region1.google-analytics.com/g/collect?v=2&tid=G-7LMKSFEXZ9", { kind: "measurement", destination: "ga4" }],
    ["POST", "https://www.google.com/g/collect?v=2&tid=G-7LMKSFEXZ9", { kind: "measurement", destination: "ga4" }],
    ["GET", "https://www.facebook.com/tr?id=1051265191046395&ev=PageView", { kind: "measurement", destination: "meta" }],
    ["POST", "https://analytics.ahrefs.com/api/event", { kind: "measurement", destination: "ahrefs" }],
    // The tags' script and config downloads, GET only.
    ["GET", "https://www.googletagmanager.com/gtag/js?id=G-7LMKSFEXZ9", { kind: "download" }],
    ["GET", "https://connect.facebook.net/en_US/fbevents.js", { kind: "download" }],
    ["GET", "https://connect.facebook.net/signals/config/1051265191046395?v=2.9.200", { kind: "download" }],
    ["GET", "https://analytics.ahrefs.com/analytics.js", { kind: "download" }],
    ["POST", "https://www.googletagmanager.com/gtag/js?id=G-7LMKSFEXZ9", { kind: "refuse" }],
    // Anything else is refused: the vendors' diagnostics (QA-003), look-alike hosts, plain HTTP, another port.
    ["GET", "https://www.googletagmanager.com/td?id=G-7LMKSFEXZ9", { kind: "refuse" }],
    ["GET", "https://connect.facebook.net//log/error?p=capig_pixel", { kind: "refuse" }],
    ["GET", "https://kheelona.com.example/", { kind: "refuse" }],
    ["GET", "http://kheelona.com/", { kind: "refuse" }],
    ["GET", "https://kheelona.com:8443/", { kind: "refuse" }],
    ["GET", "https://us.i.posthog.com/e/", { kind: "refuse" }],
    ["GET", "data:image/gif;base64,R0lGODlhAQABAAAAACw=", { kind: "pass" }],
  ];
  it.each(cases)("%s %s", (method, href, want) => {
    expect(classify(method, href)).toEqual(want);
  });
});

describe("decodeBody: a recorded body as text", () => {
  const json = '{"event":"$pageview"}';
  it("reads plain, gzip (posthog-js gzip-js) and base64 form bodies (data=…)", () => {
    expect(decodeBody(Buffer.from(json))).toBe(json);
    expect(decodeBody(gzipSync(json))).toBe(json);
    expect(decodeBody(Buffer.from(`data=${encodeURIComponent(Buffer.from(json).toString("base64"))}&compression=base64`))).toBe(json);
    expect(decodeBody(null)).toBe("");
  });
});

/* A stand-in for the local build: records what reaches it, redirects /team/ like src/proxy.ts. */
type Seen = { method: string; url: string; headers: http.IncomingHttpHeaders; body: string };
let upstream: http.Server;
let upstreamPort = 0;
const seen: Seen[] = [];
beforeAll(async () => {
  upstream = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      seen.push({ method: req.method ?? "", url: req.url ?? "", headers: req.headers, body: Buffer.concat(chunks).toString("utf8") });
      if (req.url === "/team/") {
        res.writeHead(308, { location: "/team", "set-cookie": "kh_utm=x; Path=/; Domain=.kheelona.com; Secure; HttpOnly" });
        return res.end();
      }
      res.writeHead(200, { "content-type": "text/plain" });
      res.end(`local build: ${req.headers.host}${req.url}`);
    });
  });
  await new Promise<void>((done) => upstream.listen(0, "127.0.0.1", done));
  upstreamPort = (upstream.address() as { port: number }).port;
});
afterAll(() => new Promise<void>((done) => upstream.close(() => done())));

type Answer = { status: number; headers: http.IncomingHttpHeaders; body: string; cert: ReturnType<TLSSocket["getPeerCertificate"]> };
/** One HTTPS request to the proxy, the way the browser makes it after its DNS sent `host` there. */
function viaProxy(proxy: LpProxy, host: string, path: string, opts: { method?: string; headers?: Record<string, string>; body?: Buffer } = {}): Promise<Answer> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { host: "127.0.0.1", port: proxy.port, servername: host, path, method: opts.method ?? "GET", headers: { host, ...opts.headers }, rejectUnauthorized: false, agent: false },
      (res) => {
        const cert = (res.socket as TLSSocket).getPeerCertificate();
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString("utf8"), cert }));
      },
    );
    req.on("error", reject);
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

describe("launchLp", () => {
  it("closes its proxy again when the browser cannot launch", async () => {
    const servers = () => process.getActiveResourcesInfo().filter((r) => r === "TCPServerWrap").length;
    const before = servers();
    const noBrowser = { launch: () => Promise.reject(new Error("no browser here")) } as unknown as BrowserType;
    await expect(launchLp(noBrowser, { downloads: false })).rejects.toThrow("no browser here");
    // libuv drops a closed listener a few milliseconds after its close callback; one left open never goes.
    await vi.waitFor(() => expect(servers()).toBe(before), { timeout: 2000 });
  });
});

describe("startLpProxy: the browser's only way out, and it leads to the local build alone", () => {
  let proxies: LpProxy[] = [];
  const start = async (downloads: boolean): Promise<{ proxy: LpProxy; log: LpLog }> => {
    const log = newLpLog();
    const proxy = await startLpProxy({ upstreamPort, downloads, log });
    proxies.push(proxy);
    return { proxy, log };
  };
  afterEach(async () => {
    await Promise.all(proxies.map((p) => p.close()));
    proxies = [];
    seen.length = 0;
  });

  it("hands a page request for either real origin to the local build, Host kept, marked HTTPS", async () => {
    const { proxy, log } = await start(false);
    const home = await viaProxy(proxy, "kheelona.com", "/?utm_source=qa");
    const store = await viaProxy(proxy, "store.kheelona.com", "/thanks");
    expect(home.body).toBe("local build: kheelona.com/?utm_source=qa");
    expect(store.body).toBe("local build: store.kheelona.com/thanks");
    expect(seen.map((s) => [s.headers.host, s.headers["x-forwarded-proto"]])).toEqual([
      ["kheelona.com", "https"],
      ["store.kheelona.com", "https"],
    ]);
    expect(log.forwarded).toEqual([
      { via: "proxy", method: "GET", host: "kheelona.com", path: "/?utm_source=qa" },
      { via: "proxy", method: "GET", host: "store.kheelona.com", path: "/thanks" },
    ]);
    expect(log.escaped).toEqual([]);
  });

  it("answers 502 itself when the local build is down, and tries nowhere else", async () => {
    const gone = http.createServer();
    await new Promise<void>((done) => gone.listen(0, "127.0.0.1", done));
    const closedPort = (gone.address() as { port: number }).port;
    await new Promise<void>((done) => gone.close(() => done()));
    const log = newLpLog();
    const proxy = await startLpProxy({ upstreamPort: closedPort, downloads: false, log });
    proxies.push(proxy);
    const res = await viaProxy(proxy, "kheelona.com", "/");
    expect(res.status).toBe(502);
    expect(res.body).toContain(`the local build on port ${closedPort} did not answer`);
    expect(log.forwarded).toEqual([{ via: "proxy", method: "GET", host: "kheelona.com", path: "/" }]);
  });

  it("returns a redirect exactly as the local build sent it, cookie included, and follows nothing itself", async () => {
    const { proxy } = await start(false);
    const res = await viaProxy(proxy, "kheelona.com", "/team/");
    expect(res.status).toBe(308);
    expect(res.headers.location).toBe("/team");
    expect(String(res.headers["set-cookie"])).toMatch(/^kh_utm=x; Path=\/; Domain=\.kheelona\.com/);
    expect(seen.map((s) => s.url)).toEqual(["/team/"]);
  });

  it("answers a PostHog capture itself, records its decoded body, and never hands it to the local build (whose rewrite forwards to PostHog)", async () => {
    const { proxy, log } = await start(true);
    const res = await viaProxy(proxy, "kheelona.com", "/ingest/i/v0/e/?ip=0&compression=gzip-js", {
      method: "POST",
      body: gzipSync('[{"event":"$pageleave"}]'),
    });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ status: 1 });
    expect(seen).toEqual([]);
    expect(log.forwarded).toEqual([]);
    expect(log.escaped).toEqual([{ method: "POST", host: "kheelona.com", path: "/ingest/i/v0/e/?ip=0&compression=gzip-js", body: '[{"event":"$pageleave"}]' }]);
    expect(log.recorded).toEqual([
      { destination: "posthog", via: "proxy", url: "https://kheelona.com/ingest/i/v0/e/?ip=0&compression=gzip-js", body: '[{"event":"$pageleave"}]' },
    ]);
  });

  it("answers PostHog's flags itself, with no flags", async () => {
    const { proxy } = await start(true);
    const res = await viaProxy(proxy, "store.kheelona.com", "/ingest/flags/?v=2", { method: "POST", body: Buffer.from('{"distinct_id":"x"}') });
    expect(res.status).toBe(200);
    expect(JSON.parse(res.body)).toMatchObject({ featureFlags: {}, featureFlagPayloads: {} });
    expect(seen).toEqual([]);
  });

  it("offline, answers PostHog's config and SDK downloads empty; with downloads, hands them to the local build without cookies", async () => {
    const offline = await start(false);
    const config = await viaProxy(offline.proxy, "kheelona.com", "/ingest/array/phc_x/config.js", { headers: { cookie: "ph_x=1" } });
    expect([config.status, config.body]).toEqual([200, ""]);
    expect(seen).toEqual([]);

    const online = await start(true);
    const fetched = await viaProxy(online.proxy, "kheelona.com", "/ingest-assets/static/recorder.js", { headers: { cookie: "ph_x=1; kh_utm=y" } });
    expect(fetched.body).toBe("local build: kheelona.com/ingest-assets/static/recorder.js");
    expect(seen).toHaveLength(1);
    expect(seen[0].headers.cookie).toBeUndefined();
  });

  it("answers Vercel's paths itself", async () => {
    const { proxy, log } = await start(true);
    const res = await viaProxy(proxy, "kheelona.com", "/_vercel/insights/view", { method: "POST", body: Buffer.from("{}") });
    expect(res.status).toBe(204);
    expect(seen).toEqual([]);
    expect(log.recorded.map((r) => r.destination)).toEqual(["vercel"]);
  });

  it("answers every other host itself with 204, a beacon or a tag download alike, and forwards nothing", async () => {
    const { proxy, log } = await start(true);
    const answers = await Promise.all([
      viaProxy(proxy, "www.google-analytics.com", "/g/collect?v=2&en=page_view", { method: "POST", body: Buffer.from("en=page_view") }),
      viaProxy(proxy, "www.googletagmanager.com", "/gtag/js?id=G-7LMKSFEXZ9"),
      viaProxy(proxy, "us.i.posthog.com", "/e/", { method: "POST", body: Buffer.from("{}") }),
      viaProxy(proxy, "example.com", "/"),
    ]);
    expect(answers.map((a) => [a.status, a.body])).toEqual([
      [204, ""],
      [204, ""],
      [204, ""],
      [204, ""],
    ]);
    expect(seen).toEqual([]);
    expect(log.forwarded).toEqual([]);
    expect(log.escaped.map((e) => e.host).sort()).toEqual(["example.com", "us.i.posthog.com", "www.google-analytics.com", "www.googletagmanager.com"]);
    expect(log.recorded.map((r) => r.destination)).toEqual(["ga4"]);
  });

  it("speaks TLS with a throwaway certificate made at start (never a key in the repo), valid now, naming both real origins", async () => {
    const a = await viaProxy((await start(false)).proxy, "kheelona.com", "/");
    const b = await viaProxy((await start(false)).proxy, "store.kheelona.com", "/");
    expect(a.cert.subjectaltname).toBe("DNS:kheelona.com, DNS:store.kheelona.com");
    expect(Date.parse(a.cert.valid_from)).toBeLessThan(Date.now());
    expect(Date.parse(a.cert.valid_to)).toBeGreaterThan(Date.now());
    expect(a.cert.fingerprint256).not.toBe(b.cert.fingerprint256);
  });

  /* The browser must accept this certificate at the network level, not per page: a beacon sent as its page closes
     opens a fresh connection with no page left to wave a certificate error through, and dies in the handshake
     (proven in Chromium, 2026-10-14). Chromium pins exactly this key with --ignore-certificate-errors-spki-list. */
  /* OpenSSL ("illegal padding") and BoringSSL refuse a non-minimal DER INTEGER: a random serial whose first byte came
     out 0x00 would fail 1 proxy start in 128. With that bug, 2000 certificates hold about 15 such serials. */
  it("gives every certificate a serial that is a minimal, positive DER INTEGER", () => {
    const header = (buf: Buffer, at: number) => {
      const first = buf[at + 1];
      const size = first < 0x80 ? 0 : first & 0x7f;
      const length = size === 0 ? first : buf.readUIntBE(at + 2, size);
      return { tag: buf[at], body: at + 2 + size, length };
    };
    const bad: string[] = [];
    for (let i = 0; i < 2000; i++) {
      let raw: Buffer;
      try {
        raw = new X509Certificate(throwawayCertificate(["kheelona.com"]).cert).raw;
      } catch (error) {
        bad.push(`unparseable: ${String(error)}`);
        continue;
      }
      const tbs = header(raw, header(raw, 0).body); // Certificate > TBSCertificate
      const version = header(raw, tbs.body); // [0] EXPLICIT version
      const serial = header(raw, version.body + version.length);
      const bytes = raw.subarray(serial.body, serial.body + serial.length);
      if (serial.tag !== 0x02 || bytes[0] >= 0x80 || (bytes[0] === 0 && bytes.length > 1 && bytes[1] < 0x80)) bad.push(bytes.toString("hex"));
    }
    expect(bad).toEqual([]);
  });

  it("publishes the SHA-256 of its certificate's public key, the value Chromium pins", async () => {
    const { proxy } = await start(false);
    const { cert } = await viaProxy(proxy, "kheelona.com", "/");
    const served = new X509Certificate(cert.raw).publicKey.export({ type: "spki", format: "der" });
    expect(proxy.spki).toBe(createHash("sha256").update(served).digest("base64"));
  });
});
