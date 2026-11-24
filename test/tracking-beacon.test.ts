import { DEFAULT_BLOCKED_UA_STRS } from "@posthog/core";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BEACON_URL,
  BOT_UA_SOURCE,
  POSTHOG_PERSISTENCE_NAME,
  STORE_ARRIVAL_HOSTS,
  beaconCapture,
  campaignUrl,
  freshSessionId,
  isInternalDevice,
  isLikelyBot,
  readPostHogCookie,
  storeArrivalScript,
} from "@/lib/tracking/beacon";
import { POSTHOG_KEY } from "@/config/site";
import { registerPostHog, resetPostHogForTests } from "@/lib/posthog";

/**
 * The two early PostHog signals of D070 / B7c (K-174): the inline `store_arrived` script and `beaconCapture`.
 *
 * Nothing here reaches a network: `sendBeacon`, `fetch` and `Blob` are stand-ins that record what they are given, and
 * the inline script's TEXT is evaluated in jsdom with its globals (window, location, document, navigator, ...) passed in
 * as fakes, so each case states exactly the page it runs on. Every expectation is a literal from the spec
 * (output/2026-W48/engineering/B7c-spec.md), not computed by the code under test.
 */

const STORE = "store.kheelona.com";
const BETA_STORE = "betastore.kheelona.com";
const CHROME_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";

class FakeBlob {
  constructor(
    readonly parts: string[],
    readonly options: { type: string },
  ) {}
}

type Sent = { url: string; type: string; payload: { api_key: string; batch: { event: string; properties: Record<string, unknown>; timestamp?: string }[]; sent_at?: string } };

/** What a beacon body carries: `data=<url-encoded base64 of JSON>` (posthog-js's own sendBeacon format). */
function decode(url: string, blob: FakeBlob): Sent {
  const body = blob.parts.join("");
  expect(body.startsWith("data=")).toBe(true);
  const json = Buffer.from(decodeURIComponent(body.slice("data=".length)), "base64").toString("utf8");
  return { url, type: blob.options.type, payload: JSON.parse(json) };
}

const cookieFor = (value: unknown) => `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent(JSON.stringify(value))}`;

type Page = {
  host?: string;
  path?: string;
  search?: string;
  cookie?: string;
  referrer?: string;
  userAgent?: string;
  webdriver?: boolean;
  persistence?: string | null;
  beacon?: "accepts" | "refuses" | "missing";
};

/** Runs the inline script's text as the page `page` describes, returns what it sent. */
function runScript(page: Page = {}) {
  const host = page.host ?? STORE;
  const sent: Sent[] = [];
  const fetched: Sent[] = [];
  const win: Record<string, unknown> = {};
  const location = { hostname: host, host, pathname: page.path ?? "/", search: page.search ?? "", origin: `https://${host}` };
  const doc = { cookie: page.cookie ?? "", referrer: page.referrer ?? "" };
  const mode = page.beacon ?? "accepts";
  const navigator = {
    userAgent: page.userAgent ?? CHROME_UA,
    webdriver: page.webdriver,
    ...(mode === "missing"
      ? {}
      : {
          sendBeacon: (url: string, blob: FakeBlob) => {
            if (mode === "refuses") return false;
            sent.push(decode(url, blob));
            return true;
          },
        }),
  };
  const fetchStub = (url: string, init: { body: FakeBlob; keepalive: boolean; method: string }) => {
    fetched.push(decode(url, init.body));
    expect(init.keepalive).toBe(true);
    expect(init.method).toBe("POST");
    return Promise.resolve();
  };
  const storage = { getItem: (key: string) => (key === POSTHOG_PERSISTENCE_NAME ? (page.persistence ?? null) : null) };
  const run = new Function("window", "location", "document", "navigator", "Blob", "fetch", "localStorage", storeArrivalScript());
  run(win, location, doc, navigator, FakeBlob, fetchStub, storage);
  return { sent, fetched, win };
}

describe("storeArrivalScript: what the inline script sends (D070 / B7c)", () => {
  it("on the production store sends exactly one store_arrived, by beacon, in posthog-js's own body format", () => {
    const { sent } = runScript({ path: "/", referrer: "https://www.instagram.com/some/post?x=1" });
    expect(sent).toHaveLength(1);
    const [one] = sent;
    expect(one.url).toBe("/ingest/e/?compression=base64");
    expect(one.type).toBe("application/x-www-form-urlencoded");
    expect(one.payload.api_key).toBe("phc_ute69SyrVALLjx3bW8xUNVqiALe7RRNbJp9KuZDd9726");
    expect(one.payload.batch).toHaveLength(1);
    const [event] = one.payload.batch;
    expect(event.event).toBe("store_arrived");
    // Sent at once, so PostHog's receipt time is the event time: no client clock in the body.
    expect(event).not.toHaveProperty("timestamp");
    expect(one.payload).not.toHaveProperty("sent_at");
    // No cookie, no team flag, not beta: exactly these keys, nothing else.
    expect(Object.keys(event.properties).sort()).toEqual(
      ["$current_url", "$host", "$lib", "$pathname", "$process_person_profile", "$referring_domain", "distinct_id", "token"].sort(),
    );
    expect(event.properties).toMatchObject({
      token: "phc_ute69SyrVALLjx3bW8xUNVqiALe7RRNbJp9KuZDd9726",
      $current_url: "https://store.kheelona.com/",
      $host: "store.kheelona.com",
      $pathname: "/",
      $referring_domain: "www.instagram.com",
      $lib: "kh-early",
      $process_person_profile: false,
    });
    // No PostHog cookie: a random v4 UUID, so the event is only a count.
    expect(event.properties.distinct_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it("sends one beacon per run, and the run is once per page load (a script in the server HTML runs once per document)", () => {
    const { sent, fetched } = runScript();
    expect(sent).toHaveLength(1);
    expect(fetched).toEqual([]);
    expect(storeArrivalScript().match(/store_arrived/g)).toHaveLength(1);
  });

  it.each([
    ["localhost", "localhost"],
    ["the local store host", "store.localhost"],
    ["a Vercel preview", "website-hdn2.vercel.app"],
    ["the marketing host", "kheelona.com"],
    ["www", "www.kheelona.com"],
    ["the beta marketing host", "betawebsite.kheelona.com"],
    ["a look-alike host", "store.kheelona.com.evil.example"],
  ])("sends nothing on %s", (_name, host) => {
    const { sent, fetched } = runScript({ host });
    expect(sent).toEqual([]);
    expect(fetched).toEqual([]);
  });

  it.each(["/thanks", "/thanks/", "/thanks/anything", "/store/thanks", "/store/thanks/x"])("sends nothing on %s", (path) => {
    expect(runScript({ path }).sent).toEqual([]);
  });

  it("still sends on other store pages, and on a path that only starts like /thanks", () => {
    expect(runScript({ path: "/thanksgiving" }).sent).toHaveLength(1);
    expect(runScript({ path: "/events/diwali" }).sent).toHaveLength(1);
  });

  it("keeps only the campaign keys of the URL: every other parameter is dropped, whatever it holds", () => {
    const search =
      "?utm_source=x&foo=y&email=a%40b.c&phone=9000000000&ref=KH-AAAA-BBBB&placement=Feed&t=1.token&utm_id=123&utm_medium=cpc&utm_campaign=c1&utm_content=a&utm_term=t";
    const { sent } = runScript({ search, path: "/" });
    const url = sent[0].payload.batch[0].properties.$current_url as string;
    expect(url).toBe(
      "https://store.kheelona.com/?utm_source=x&utm_medium=cpc&utm_campaign=c1&utm_content=a&utm_term=t&utm_id=123&placement=Feed",
    );
    expect(url).not.toMatch(/foo|email|phone|ref=|t=1/);
    expect(JSON.stringify(sent[0].payload)).not.toMatch(/a%40b|9000000000|KH-AAAA|token"?:"1\.token/);
  });

  it("a URL with utm_source=x&foo=y keeps utm_source only", () => {
    const { sent } = runScript({ search: "?utm_source=x&foo=y" });
    expect(sent[0].payload.batch[0].properties.$current_url).toBe("https://store.kheelona.com/?utm_source=x");
  });

  it("caps a campaign value at 120 characters and drops an empty one", () => {
    const { sent } = runScript({ search: `?utm_source=${"a".repeat(300)}&utm_medium=` });
    const url = sent[0].payload.batch[0].properties.$current_url as string;
    expect(url).toBe(`https://store.kheelona.com/?utm_source=${"a".repeat(120)}`);
  });

  it("uses the PostHog cookie's distinct_id when there is one, so the event joins the visitor's funnel", () => {
    const { sent } = runScript({ cookie: `a=1; ${cookieFor({ distinct_id: "019-device-id", $device_id: "other" })}; b=2` });
    expect(sent[0].payload.batch[0].properties.distinct_id).toBe("019-device-id");
  });

  it("falls back to a random id when the cookie is malformed", () => {
    for (const cookie of [`${POSTHOG_PERSISTENCE_NAME}=%7Bnot-json`, `${POSTHOG_PERSISTENCE_NAME}=null`, `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent('"text"')}`, `${POSTHOG_PERSISTENCE_NAME}=${encodeURIComponent('[1]')}`]) {
      const { sent } = runScript({ cookie });
      expect(sent).toHaveLength(1);
      expect(sent[0].payload.batch[0].properties.distinct_id).toMatch(/^[0-9a-f-]{36}$/);
    }
  });

  it("carries the session id while the cookie's session is fresh, and leaves an idle one out", () => {
    const now = Date.now();
    const fresh = runScript({ cookie: cookieFor({ distinct_id: "d", $sesid: [now - 60_000, "019-session", now - 120_000] }) });
    expect(fresh.sent[0].payload.batch[0].properties.$session_id).toBe("019-session");
    const idle = runScript({ cookie: cookieFor({ distinct_id: "d", $sesid: [now - 31 * 60_000, "019-session", now - 40 * 60_000] }) });
    expect(idle.sent[0].payload.batch[0].properties).not.toHaveProperty("$session_id");
    const none = runScript({ cookie: cookieFor({ distinct_id: "d" }) });
    expect(none.sent[0].payload.batch[0].properties).not.toHaveProperty("$session_id");
  });

  it("carries the team flag when this host's PostHog storage holds it, and not otherwise", () => {
    const flagged = runScript({ persistence: JSON.stringify({ internal: true, distinct_id: "d" }) });
    expect(flagged.sent[0].payload.batch[0].properties.internal).toBe(true);
    for (const persistence of [null, "{}", JSON.stringify({ internal: false }), JSON.stringify({ internal: "yes" }), "not json"]) {
      expect(runScript({ persistence }).sent[0].payload.batch[0].properties).not.toHaveProperty("internal");
    }
  });

  it("a device flagged with ?internal=1 is counted as a team device from its next load: this load's beacon is sent before posthog-js stores the flag", () => {
    const first = runScript({ search: "?internal=1" });
    expect(first.sent[0].payload.batch[0].properties).not.toHaveProperty("internal");
    expect(first.sent[0].payload.batch[0].properties.$current_url).toBe("https://store.kheelona.com/");
    const next = runScript({ persistence: JSON.stringify({ internal: true }) });
    expect(next.sent[0].payload.batch[0].properties.internal).toBe(true);
  });

  it("stamps env: beta on the beta store only (what before_send gives the SDK's events)", () => {
    const beta = runScript({ host: BETA_STORE });
    expect(beta.sent).toHaveLength(1);
    expect(beta.sent[0].payload.batch[0].properties.env).toBe("beta");
    expect(beta.sent[0].payload.batch[0].properties.$host).toBe(BETA_STORE);
    expect(runScript({ host: STORE }).sent[0].payload.batch[0].properties).not.toHaveProperty("env");
  });

  it("uses $direct when there is no referrer or it is not a URL", () => {
    expect(runScript({ referrer: "" }).sent[0].payload.batch[0].properties.$referring_domain).toBe("$direct");
    expect(runScript({ referrer: "not a url" }).sent[0].payload.batch[0].properties.$referring_domain).toBe("$direct");
    expect(runScript({ referrer: "https://kheelona.com/products/kheelu?utm_source=x" }).sent[0].payload.batch[0].properties.$referring_domain).toBe("kheelona.com");
  });

  it("does not send for a crawler or an automated browser, as posthog-js would not", () => {
    expect(runScript({ userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" }).sent).toEqual([]);
    expect(runScript({ userAgent: "Mozilla/5.0 HeadlessChrome/130.0.0.0 Safari/537.36" }).sent).toEqual([]);
    expect(runScript({ webdriver: true }).sent).toEqual([]);
  });

  it("has no fetch fallback (size): a browser without a beacon, or one that refuses it, sends nothing and stays silent", () => {
    for (const beacon of ["missing", "refuses"] as const) {
      const { sent, fetched } = runScript({ beacon });
      expect(sent).toEqual([]);
      expect(fetched).toEqual([]);
    }
  });

  it("never throws, whatever the page does: a hostile document and storage send nothing and stay silent", () => {
    const run = new Function("window", "location", "document", "navigator", "Blob", "fetch", "localStorage", storeArrivalScript());
    const location = { hostname: STORE, host: STORE, pathname: "/", search: "", origin: `https://${STORE}` };
    const hostileDoc = {
      get cookie(): string {
        throw new Error("cookies blocked");
      },
      referrer: "",
    };
    const hostileStorage = {
      getItem(): string {
        throw new Error("storage blocked");
      },
    };
    expect(() => run({}, location, hostileDoc, { userAgent: CHROME_UA, sendBeacon: () => true }, FakeBlob, () => Promise.resolve(), hostileStorage)).not.toThrow();
    expect(() => run({}, location, { cookie: "", referrer: "" }, { userAgent: CHROME_UA, sendBeacon: () => true }, FakeBlob, () => Promise.resolve(), hostileStorage)).not.toThrow();
    expect(() => run({}, location, { cookie: "", referrer: "" }, { userAgent: CHROME_UA, sendBeacon: () => { throw new Error("boom"); } }, FakeBlob, () => Promise.resolve(), { getItem: () => null })).not.toThrow();
  });
});

describe("storeArrivalScript: the text itself", () => {
  const text = storeArrivalScript();

  it("is small (under 1.5 KB), ASCII, and cannot close its own <script> tag or open an HTML comment", () => {
    console.info(`storeArrivalScript: ${Buffer.byteLength(text)} bytes`);
    expect(Buffer.byteLength(text)).toBeLessThan(1500);
    expect(/^[\x20-\x7e]*$/.test(text), "printable ASCII only").toBe(true);
    expect(text).not.toMatch(/<\/script/i);
    expect(text).not.toContain("<!--");
    expect(text).not.toContain("\n");
  });

  it("is built from the same constants the rest of the tracking code uses", () => {
    expect(text).toContain(JSON.stringify(POSTHOG_KEY));
    expect(text).toContain('"/ingest"');
    expect(text).toContain('["/thanks","/store/thanks"]');
    expect(text).toContain('["utm_source","utm_medium","utm_campaign","utm_content","utm_term","utm_id","placement"]');
    expect(text).toContain('"internal"');
    expect(STORE_ARRIVAL_HOSTS).toEqual(["store.kheelona.com", "betastore.kheelona.com"]);
    expect(text).toContain('["store.kheelona.com","betastore.kheelona.com"]');
    expect(text).toContain('["betastore.kheelona.com"]');
  });

  it("the PostHog persistence name is the one posthog-js 1.434.2 uses: ph_<token>_posthog", () => {
    expect(POSTHOG_PERSISTENCE_NAME).toBe("ph_phc_ute69SyrVALLjx3bW8xUNVqiALe7RRNbJp9KuZDd9726_posthog");
    // The script builds it as "ph_" + key + "_posthog": equal only while the key has none of the characters the SDK escapes.
    expect(POSTHOG_KEY).toMatch(/^[A-Za-z0-9_]+$/);
    expect(`ph_${POSTHOG_KEY}_posthog`).toBe(POSTHOG_PERSISTENCE_NAME);
  });
});

describe("the bot rule follows posthog-js's own blocked user agents", () => {
  /** The scanners and testing tools of the SDK's list that the short rule leaves out: they do not browse a store page. */
  const LEFT_OUT = [
    "ahrefssiteaudit",
    "app.hypefactors.com",
    "chatgpt-user",
    "cypress",
    "deepscan",
    "facebookcatalog",
    "hubspot",
    "ia_archiver",
    "nessus",
    "prerender",
    "screaming frog",
    "sitebulb",
    "slurp",
    "turnitin",
    "vercel-screenshot",
    "yahoo! slurp",
  ];

  it("covers every entry of the installed SDK's default list but the few scanners it names as left out", () => {
    expect(DEFAULT_BLOCKED_UA_STRS.length).toBeGreaterThan(50);
    const missed = DEFAULT_BLOCKED_UA_STRS.filter((entry) => !isLikelyBot(`Mozilla/5.0 (X11) ${entry} AppleWebKit/537.36`));
    expect(missed.sort()).toEqual(LEFT_OUT);
  });

  it("does not catch ordinary phones and desktops", () => {
    for (const ua of [
      CHROME_UA,
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
      "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36 Instagram 350.0.0.0.0 Android",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/470.0.0]",
    ]) {
      expect(isLikelyBot(ua), ua).toBe(false);
    }
    expect(isLikelyBot(CHROME_UA, true)).toBe(true);
    expect(BOT_UA_SOURCE).not.toMatch(/[\\/]/);
  });
});

describe("the helpers read what posthog-js wrote", () => {
  it("readPostHogCookie finds the cookie among others, and returns {} for anything unusable", () => {
    expect(readPostHogCookie(`x=1; ${cookieFor({ distinct_id: "d" })}; y=2`)).toEqual({ distinct_id: "d" });
    expect(readPostHogCookie("")).toEqual({});
    expect(readPostHogCookie(`xph_phc_${POSTHOG_KEY.slice(4)}_posthog=%7B%7D`)).toEqual({});
    expect(readPostHogCookie(`${POSTHOG_PERSISTENCE_NAME}=%`)).toEqual({});
  });

  it("freshSessionId follows posthog-js's 30 minute idle limit", () => {
    const now = 1_800_000_000_000;
    expect(freshSessionId([now - 1000, "s", now - 5000], now)).toBe("s");
    expect(freshSessionId([now - 30 * 60_000, "s", now - 31 * 60_000], now)).toBeUndefined();
    expect(freshSessionId([now, null, now], now)).toBeUndefined();
    expect(freshSessionId("s", now)).toBeUndefined();
    expect(freshSessionId(undefined, now)).toBeUndefined();
  });

  it("campaignUrl keeps campaign keys only", () => {
    expect(campaignUrl({ origin: "https://store.kheelona.com", pathname: "/x", search: "?a=1&utm_source=s&placement=p&b=2" })).toBe(
      "https://store.kheelona.com/x?utm_source=s&placement=p",
    );
    expect(campaignUrl({ origin: "https://store.kheelona.com", pathname: "/", search: "" })).toBe("https://store.kheelona.com/");
  });

  it("isInternalDevice reads the flag applyInternalFlag registers, only when it is exactly true", () => {
    expect(isInternalDevice('{"internal":true}')).toBe(true);
    expect(isInternalDevice('{"internal":false}')).toBe(false);
    expect(isInternalDevice('{"internal":"true"}')).toBe(false);
    expect(isInternalDevice("{}")).toBe(false);
    expect(isInternalDevice(null)).toBe(false);
    expect(isInternalDevice("garbage")).toBe(false);
  });
});

describe("beaconCapture (D070 / B7c): one documented way to send a PostHog event that must not wait", () => {
  let beacons: Sent[];
  let fetched: Sent[];
  let sendBeacon: ReturnType<typeof vi.fn> | undefined;

  function page(host: string, over: { path?: string; search?: string } = {}) {
    vi.stubGlobal("location", {
      hostname: host,
      host,
      pathname: over.path ?? "/",
      search: over.search ?? "",
      origin: `https://${host}`,
      href: `https://${host}${over.path ?? "/"}${over.search ?? ""}`,
    });
  }

  beforeEach(() => {
    beacons = [];
    fetched = [];
    vi.stubGlobal("Blob", FakeBlob);
    sendBeacon = vi.fn((url: string, blob: FakeBlob) => {
      beacons.push(decode(url, blob));
      return true;
    });
    Object.defineProperty(navigator, "sendBeacon", { value: sendBeacon, configurable: true, writable: true });
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string, init: { body: FakeBlob }) => {
        fetched.push(decode(url, init.body));
        return Promise.resolve(new Response(null, { status: 204 }));
      }),
    );
    document.cookie = `${POSTHOG_PERSISTENCE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    localStorage.clear();
    page(STORE);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    resetPostHogForTests();
    delete (navigator as unknown as { sendBeacon?: unknown }).sendBeacon;
    document.cookie = `${POSTHOG_PERSISTENCE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    localStorage.clear();
  });

  it("sends the event at once by sendBeacon to the same-origin proxy, in posthog-js's body format", () => {
    expect(beaconCapture("preorder_payment_window_hidden", { tier: "launch" })).toBe(true);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(fetched).toEqual([]);
    const [one] = beacons;
    expect(BEACON_URL).toBe("/ingest/e/?compression=base64");
    expect(one.url).toBe(BEACON_URL);
    expect(one.type).toBe("application/x-www-form-urlencoded");
    expect(one.payload.api_key).toBe(POSTHOG_KEY);
    const [event] = one.payload.batch;
    expect(event.event).toBe("preorder_payment_window_hidden");
    expect(event.properties).toMatchObject({
      token: POSTHOG_KEY,
      tier: "launch",
      $current_url: "https://store.kheelona.com/",
      $host: STORE,
      $pathname: "/",
      $lib: "kh-beacon",
      $process_person_profile: false,
    });
    expect(Object.keys(event.properties).sort()).toEqual(
      ["$current_url", "$host", "$lib", "$pathname", "$process_person_profile", "distinct_id", "tier", "token"].sort(),
    );
  });

  it("uses the live SDK's distinct id first, then the cookie's, then a random one", () => {
    document.cookie = `${cookieFor({ distinct_id: "cookie-id" })}; path=/`;
    registerPostHog({ capture: vi.fn(), startSessionRecording: vi.fn(), stopSessionRecording: vi.fn(), get_distinct_id: () => "live-id" });
    beaconCapture("e1");
    resetPostHogForTests();
    beaconCapture("e2");
    document.cookie = `${POSTHOG_PERSISTENCE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    beaconCapture("e3");
    expect(beacons.map((b) => b.payload.batch[0].properties.distinct_id)).toEqual([
      "live-id",
      "cookie-id",
      expect.stringMatching(/^[0-9a-f-]{36}$/),
    ]);
  });

  it("adds the fresh session id, the team flag and the beta stamp where they apply", () => {
    const now = Date.now();
    document.cookie = `${cookieFor({ distinct_id: "d", $sesid: [now - 1000, "019-session", now - 9000] })}; path=/`;
    localStorage.setItem(POSTHOG_PERSISTENCE_NAME, JSON.stringify({ internal: true }));
    beaconCapture("e1");
    const props = beacons[0].payload.batch[0].properties;
    expect(props.$session_id).toBe("019-session");
    expect(props.internal).toBe(true);
    expect(props).not.toHaveProperty("env");

    page(BETA_STORE);
    beaconCapture("e2");
    expect(beacons[1].payload.batch[0].properties.env).toBe("beta");
  });

  it("keeps campaign keys in $current_url and drops every other query parameter", () => {
    page(STORE, { path: "/", search: "?utm_source=meta&ref=KH-1&email=a%40b.c" });
    beaconCapture("e1");
    expect(beacons[0].payload.batch[0].properties.$current_url).toBe("https://store.kheelona.com/?utm_source=meta");
  });

  it("does not let a caller override token or distinct_id, but lets it set its own properties", () => {
    beaconCapture("e1", { token: "evil", distinct_id: "evil", tier: "full", $lib: "custom" });
    const props = beacons[0].payload.batch[0].properties;
    expect(props.token).toBe(POSTHOG_KEY);
    expect(props.distinct_id).not.toBe("evil");
    expect(props.tier).toBe("full");
    expect(props.$lib).toBe("custom");
  });

  it.each(["localhost", "store.localhost", "website-hdn2.vercel.app", "evil.example"])("sends nothing off the PostHog hosts (%s)", (host) => {
    page(host);
    expect(beaconCapture("e1", { tier: "launch" })).toBe(false);
    expect(sendBeacon).not.toHaveBeenCalled();
    expect(fetched).toEqual([]);
  });

  it("is on for the marketing host too (B5 uses it there)", () => {
    page("kheelona.com");
    expect(beaconCapture("e1")).toBe(true);
    expect(beacons).toHaveLength(1);
  });

  it("falls back to fetch with keepalive when the beacon is refused or missing", () => {
    sendBeacon!.mockReturnValueOnce(false);
    expect(beaconCapture("e1")).toBe(true);
    expect(fetched).toHaveLength(1);
    expect(fetched[0].payload.batch[0].event).toBe("e1");
    expect(vi.mocked(fetch)).toHaveBeenCalledWith(BEACON_URL, expect.objectContaining({ method: "POST", keepalive: true }));

    Object.defineProperty(navigator, "sendBeacon", { value: undefined, configurable: true, writable: true });
    expect(beaconCapture("e2")).toBe(true);
    expect(fetched).toHaveLength(2);
  });

  it("never throws: a beacon that throws, a fetch that rejects or throws, and unreadable storage all return quietly", async () => {
    sendBeacon!.mockImplementation(() => {
      throw new Error("beacon boom");
    });
    expect(() => beaconCapture("e1")).not.toThrow();
    expect(beaconCapture("e1")).toBe(false);

    sendBeacon!.mockReturnValue(false);
    vi.stubGlobal("fetch", vi.fn(() => Promise.reject(new Error("offline"))));
    expect(() => beaconCapture("e2")).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();

    vi.stubGlobal("fetch", vi.fn(() => {
      throw new Error("sync boom");
    }));
    expect(() => beaconCapture("e3")).not.toThrow();

    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    sendBeacon!.mockReturnValue(true);
    expect(beaconCapture("e4")).toBe(true);
  });

  it("does not send for a crawler or an automated browser", () => {
    const original = navigator.userAgent;
    Object.defineProperty(navigator, "userAgent", { value: "Mozilla/5.0 (compatible; bingbot/2.0)", configurable: true });
    try {
      expect(beaconCapture("e1")).toBe(false);
      expect(sendBeacon).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(navigator, "userAgent", { value: original, configurable: true });
    }
  });

  it("sends the same keys as the inline script on the same page, apart from what is theirs alone", () => {
    const now = Date.now();
    const cookie = cookieFor({ distinct_id: "d", $sesid: [now - 1000, "019-session", now - 9000] });
    const persistence = JSON.stringify({ internal: true });
    page(BETA_STORE, { path: "/", search: "?utm_source=x&foo=y" });
    document.cookie = `${cookie}; path=/`;
    localStorage.setItem(POSTHOG_PERSISTENCE_NAME, persistence);
    beaconCapture("store_arrived");
    const fromCode = beacons[0].payload.batch[0].properties;

    const fromScript = runScript({ host: BETA_STORE, search: "?utm_source=x&foo=y", cookie, persistence }).sent[0].payload.batch[0].properties;
    const strip = (p: Record<string, unknown>) => Object.keys(p).filter((k) => !["$lib", "$referring_domain"].includes(k)).sort();
    expect(strip(fromCode)).toEqual(strip(fromScript));
    for (const key of strip(fromScript)) expect(fromCode[key], key).toEqual(fromScript[key]);
  });
});
