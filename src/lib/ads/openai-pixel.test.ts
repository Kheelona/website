import { afterEach, describe, expect, it, vi } from "vitest";
import { POSTHOG_KEY } from "@/config/site";
import {
  OPENAI_AAM_POLICY,
  OPENAI_PIXEL_PAGES,
  clearOpenAiCookies,
  currentOppref,
  isInternalDevice,
  isOpenAiPixelPage,
  loadOpenAiPixel,
  oaiqMeasure,
  rememberOppref,
  shouldLoadOpenAiPixel,
  startOpenAiAttribution,
} from "./openai-pixel";

/* The browser loader. Everything it decides is tested through plain objects (a fake location, a fake storage,
   a recording cookie jar, the jsdom document for script insertion), so no browser and no network is involved. */

type Oaiq = ((...args: unknown[]) => void) & { q?: unknown[] };

/** A cookie jar that records writes the way a browser would receive them. */
function jar() {
  const writes: string[] = [];
  return {
    writes,
    doc: {
      get cookie() {
        return "";
      },
      set cookie(value: string) {
        writes.push(value);
      },
    },
  };
}

/** A fake window over the real jsdom document, so `loadOpenAiPixel` can insert a script. */
function fakeWindow(opts: { hostname?: string; pathname?: string; search?: string; storage?: Record<string, string> | "throws" } = {}) {
  const storage = opts.storage;
  const win = {
    location: { hostname: opts.hostname ?? "kheelona.com", pathname: opts.pathname ?? "/", search: opts.search ?? "" },
    document,
    get localStorage() {
      if (storage === "throws") throw new Error("blocked");
      return { getItem: (k: string) => (storage && k in storage ? storage[k] : null) };
    },
  } as unknown as Window & { oaiq?: Oaiq };
  return win;
}

const sdkScripts = () => document.querySelectorAll('script[src="https://bzrcdn.openai.com/sdk/oaiq.min.js"]');
/** The queued calls, as plain argument arrays. */
const queued = (win: { oaiq?: Oaiq }) => (win.oaiq?.q ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));

const respond = (body: unknown, ok = true) =>
  vi.fn(async () => ({ ok, json: async () => body }) as unknown as Response) as unknown as typeof fetch;

afterEach(() => {
  document.querySelectorAll("script").forEach((s) => s.remove());
  vi.restoreAllMocks();
});

describe("shouldLoadOpenAiPixel", () => {
  it("is true on the three production hosts, whatever the case", () => {
    for (const host of ["kheelona.com", "www.kheelona.com", "store.kheelona.com", "KHEELONA.COM", "Store.Kheelona.com"]) {
      expect(shouldLoadOpenAiPixel(host), host).toBe(true);
    }
  });

  it("is false on beta hosts, previews, localhost and lookalikes", () => {
    for (const host of [
      "betawebsite.kheelona.com",
      "betastore.kheelona.com",
      "kheelona-git-x-kheelona.vercel.app",
      "website-hdn2.vercel.app",
      "localhost",
      "store.localhost",
      "127.0.0.1",
      "kheelona.ai",
      "kheelona.com.evil.example",
      "notkheelona.com",
    ]) {
      expect(shouldLoadOpenAiPixel(host), host).toBe(false);
    }
  });
});

describe("OPENAI_PIXEL_PAGES and isOpenAiPixelPage", () => {
  it("lists exactly the reviewed pages", () => {
    expect({ marketing: [...OPENAI_PIXEL_PAGES.marketing], store: [...OPENAI_PIXEL_PAGES.store] }).toEqual({
      marketing: ["/", "/products/kheelu"],
      store: ["/"],
    });
  });

  it("allows the ad's landing page, the product page and the store's form, with or without a trailing slash", () => {
    expect(isOpenAiPixelPage("kheelona.com", "/")).toBe(true);
    expect(isOpenAiPixelPage("www.kheelona.com", "/products/kheelu")).toBe(true);
    expect(isOpenAiPixelPage("kheelona.com", "/products/kheelu/")).toBe(true);
    expect(isOpenAiPixelPage("store.kheelona.com", "/")).toBe(true);
  });

  it("refuses every other page, the support and legal pages included", () => {
    for (const path of ["/contact", "/contact/", "/privacy", "/terms", "/shipping", "/team", "/stories/x", "/products", "/nope"]) {
      expect(isOpenAiPixelPage("kheelona.com", path), path).toBe(false);
    }
    expect(isOpenAiPixelPage("store.kheelona.com", "/thanks")).toBe(false);
    expect(isOpenAiPixelPage("store.kheelona.com", "/products/kheelu")).toBe(false);
    expect(isOpenAiPixelPage("kheelona.com", "/thanks")).toBe(false);
  });
});

describe("OPENAI_AAM_POLICY", () => {
  it("is one of the two reviewed modes", () => {
    expect(["require-off", "verified-pages"]).toContain(OPENAI_AAM_POLICY);
  });
});

describe("isInternalDevice", () => {
  const key = `ph_${POSTHOG_KEY}_posthog`;
  const stored = (v: unknown) => ({ getItem: (k: string) => (k === key ? JSON.stringify(v) : null) });

  it("is true for ?internal=1 and false for ?internal=0", () => {
    expect(isInternalDevice({ search: "?internal=1" }, null)).toBe(true);
    expect(isInternalDevice({ search: "?utm_source=x&internal=1" }, null)).toBe(true);
    expect(isInternalDevice({ search: "?internal=0" }, null)).toBe(false);
  });

  it("reads PostHog's persisted flag when the URL says nothing", () => {
    expect(isInternalDevice({ search: "" }, stored({ internal: true }))).toBe(true);
    expect(isInternalDevice({ search: "" }, stored({ internal: false }))).toBe(false);
    expect(isInternalDevice({ search: "" }, stored({ other: 1 }))).toBe(false);
  });

  it("lets ?internal=0 win over storage, and ?internal=1 over an empty one", () => {
    expect(isInternalDevice({ search: "?internal=0" }, stored({ internal: true }))).toBe(false);
    expect(isInternalDevice({ search: "?internal=1" }, stored({}))).toBe(true);
  });

  it("is false for a typo, missing storage, malformed JSON or a throwing store", () => {
    expect(isInternalDevice({ search: "?internal=yes" }, null)).toBe(false);
    expect(isInternalDevice({ search: "" }, null)).toBe(false);
    expect(isInternalDevice({ search: "" }, { getItem: () => "{not json" })).toBe(false);
    expect(isInternalDevice({ search: "" }, { getItem: () => "null" })).toBe(false);
    expect(
      isInternalDevice({ search: "" }, {
        getItem: () => {
          throw new Error("denied");
        },
      }),
    ).toBe(false);
  });
});

describe("rememberOppref", () => {
  it("writes kh_oppref on the shared domain: session, Secure, SameSite=Lax", () => {
    const { doc, writes } = jar();
    const value = rememberOppref({ hostname: "kheelona.com", search: "?utm_source=openai_ads&oppref=f6_test_ref" }, doc);
    expect(value).toBe("f6_test_ref");
    expect(writes).toEqual(["kh_oppref=f6_test_ref; Domain=.kheelona.com; Path=/; Secure; SameSite=Lax"]);
    expect(writes[0]).not.toMatch(/Max-Age|Expires/);
  });

  it("lets the latest click win: a second oppref is written over the first", () => {
    const { doc, writes } = jar();
    rememberOppref({ hostname: "kheelona.com", search: "?oppref=first" }, doc);
    rememberOppref({ hostname: "store.kheelona.com", search: "?oppref=second" }, doc);
    expect(writes.map((w) => w.split(";")[0])).toEqual(["kh_oppref=first", "kh_oppref=second"]);
  });

  it("uses the first value when the URL repeats the parameter", () => {
    const { doc, writes } = jar();
    rememberOppref({ hostname: "kheelona.com", search: "?oppref=one&oppref=two" }, doc);
    expect(writes[0]).toMatch(/^kh_oppref=one;/);
  });

  it("writes nothing for an absent, empty or invalid oppref", () => {
    for (const search of ["", "?oppref=", "?oppref=a%20b", "?oppref=a%3Bb", `?oppref=${"a".repeat(513)}`, "?oppreff=x"]) {
      const { doc, writes } = jar();
      expect(rememberOppref({ hostname: "kheelona.com", search }, doc), search).toBeNull();
      expect(writes, search).toEqual([]);
    }
  });

  it("writes nothing off the production hosts", () => {
    for (const hostname of ["localhost", "store.localhost", "betawebsite.kheelona.com", "x.vercel.app"]) {
      const { doc, writes } = jar();
      expect(rememberOppref({ hostname, search: "?oppref=abc" }, doc)).toBeNull();
      expect(writes).toEqual([]);
    }
  });

  it("never throws, even when cookies are unavailable", () => {
    const doc = {
      get cookie() {
        return "";
      },
      set cookie(_v: string) {
        throw new Error("cookies disabled");
      },
    };
    expect(rememberOppref({ hostname: "kheelona.com", search: "?oppref=abc" }, doc)).toBeNull();
  });
});

describe("currentOppref", () => {
  it("prefers the URL, falls back to our cookie, and validates both", () => {
    const cookie = (c: string) => ({ cookie: c });
    expect(currentOppref({ search: "?oppref=fromurl" }, cookie("kh_oppref=fromcookie"))).toBe("fromurl");
    expect(currentOppref({ search: "" }, cookie("a=1; kh_oppref=fromcookie; b=2"))).toBe("fromcookie");
    expect(currentOppref({ search: "" }, cookie("kh_oppref=a%20b"))).toBeNull();
    expect(currentOppref({ search: "?oppref=a%20b" }, cookie("kh_oppref=ok"))).toBe("ok");
    expect(currentOppref({ search: "" }, cookie(""))).toBeNull();
  });
});

describe("clearOpenAiCookies", () => {
  it("expires all three cookies on the shared domain and on the host", () => {
    const { doc, writes } = jar();
    clearOpenAiCookies(doc);
    for (const name of ["kh_oppref", "__oppref", "__obref"]) {
      expect(writes).toContain(`${name}=; Max-Age=0; Path=/; Domain=.kheelona.com`);
      expect(writes).toContain(`${name}=; Max-Age=0; Path=/`);
    }
    expect(writes).toHaveLength(6);
  });
});

describe("startOpenAiAttribution", () => {
  it("remembers the click on a production host", () => {
    const { doc, writes } = jar();
    const win = { location: { hostname: "kheelona.com", search: "?oppref=abc" }, document: doc, localStorage: { getItem: () => null } };
    startOpenAiAttribution(win as unknown as Window);
    expect(writes).toEqual(["kh_oppref=abc; Domain=.kheelona.com; Path=/; Secure; SameSite=Lax"]);
  });

  it("clears the cookies and remembers nothing on a team device", () => {
    const { doc, writes } = jar();
    const win = {
      location: { hostname: "store.kheelona.com", search: "?internal=1&oppref=abc" },
      document: doc,
      localStorage: { getItem: () => null },
    };
    startOpenAiAttribution(win as unknown as Window);
    expect(writes.every((w) => w.includes("Max-Age=0"))).toBe(true);
    expect(writes.some((w) => w.startsWith("kh_oppref=abc"))).toBe(false);
  });

  it("does nothing off the production hosts", () => {
    const { doc, writes } = jar();
    const win = { location: { hostname: "localhost", search: "?oppref=abc" }, document: doc, localStorage: { getItem: () => null } };
    startOpenAiAttribution(win as unknown as Window);
    expect(writes).toEqual([]);
  });
});

describe("loadOpenAiPixel, require-off mode", () => {
  it("inserts the SDK once, with a queue of init and page_viewed and no user, when AAM is reported off", async () => {
    const win = fakeWindow();
    const fetchImpl = respond({ automatic_advanced_matching_enabled: false });
    await expect(loadOpenAiPixel({ window: win, fetch: fetchImpl, policy: "require-off" })).resolves.toBe("loaded");
    expect(sdkScripts()).toHaveLength(1);
    expect((sdkScripts()[0] as HTMLScriptElement).async).toBe(true);
    expect(queued(win)).toEqual([
      ["init", { pixelId: "CtmHigpYxafJN3qgbj3xnv" }],
      ["measure", "page_viewed", { type: "contents" }],
    ]);
    expect(JSON.stringify(queued(win))).not.toContain("user");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://bzrcdn.openai.com/pixel-config/v1/CtmHigpYxafJN3qgbj3xnv.json",
      expect.objectContaining({ credentials: "omit" }),
    );
  });

  it("passes the ad click and the team debug switch to init", async () => {
    const win = fakeWindow({ search: "?oppref=f6_test_ref", storage: { kh_oaiq_debug: "1" } });
    await loadOpenAiPixel({ window: win, fetch: respond({ automatic_advanced_matching_enabled: false }), policy: "require-off" });
    expect(queued(win)[0]).toEqual(["init", { pixelId: "CtmHigpYxafJN3qgbj3xnv", debug: true, oppref: "f6_test_ref" }]);
  });

  it.each([
    ["AAM on", () => respond({ automatic_advanced_matching_enabled: true })],
    ["key missing", () => respond({})],
    ["not a boolean", () => respond({ automatic_advanced_matching_enabled: "false" })],
    ["a 404", () => respond({ automatic_advanced_matching_enabled: false }, false)],
    ["bad JSON", () => vi.fn(async () => ({ ok: true, json: async () => Promise.reject(new SyntaxError("bad")) }) as unknown as Response) as unknown as typeof fetch],
    ["null body", () => respond(null)],
    ["a throwing fetch", () => vi.fn(async () => Promise.reject(new TypeError("offline"))) as unknown as typeof fetch],
  ])("does not load the SDK, removes the stub and warns once: %s", async (_name, make) => {
    const win = fakeWindow();
    const warn = vi.fn();
    await expect(loadOpenAiPixel({ window: win, fetch: make(), policy: "require-off", warn })).resolves.toBe("refused");
    expect(sdkScripts()).toHaveLength(0);
    expect(win.oaiq).toBeUndefined();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/automatic advanced matching/);
  });

  it("does not load the SDK when the configuration does not arrive in time", async () => {
    const win = fakeWindow();
    const warn = vi.fn();
    const never = vi.fn(() => new Promise<Response>(() => {})) as unknown as typeof fetch;
    await expect(loadOpenAiPixel({ window: win, fetch: never, policy: "require-off", warn, configTimeoutMs: 20 })).resolves.toBe("refused");
    expect(sdkScripts()).toHaveLength(0);
    expect(win.oaiq).toBeUndefined();
  });

  it("does not load without fetch at all", async () => {
    vi.stubGlobal("fetch", undefined);
    const win = fakeWindow();
    await expect(loadOpenAiPixel({ window: win, policy: "require-off", warn: () => {} })).resolves.toBe("refused");
    vi.unstubAllGlobals();
    expect(sdkScripts()).toHaveLength(0);
  });

  it("is idempotent: a second call neither queues again nor inserts a second script", async () => {
    const win = fakeWindow();
    const fetchImpl = respond({ automatic_advanced_matching_enabled: false });
    await loadOpenAiPixel({ window: win, fetch: fetchImpl, policy: "require-off" });
    await expect(loadOpenAiPixel({ window: win, fetch: fetchImpl, policy: "require-off" })).resolves.toBe("loaded");
    expect(sdkScripts()).toHaveLength(1);
    expect(queued(win)).toHaveLength(2);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("queues funnel calls made before the SDK arrives, and oaiqMeasure reaches the queue", async () => {
    const win = fakeWindow();
    vi.stubGlobal("window", win);
    await loadOpenAiPixel({ window: win, fetch: respond({ automatic_advanced_matching_enabled: false }), policy: "require-off" });
    oaiqMeasure("checkout_started", { type: "contents" });
    oaiqMeasure("order_created", { type: "contents" }, { event_id: "KH-TEST-F6F6" });
    vi.unstubAllGlobals();
    expect(queued(win).slice(2)).toEqual([
      ["measure", "checkout_started", { type: "contents" }],
      ["measure", "order_created", { type: "contents" }, { event_id: "KH-TEST-F6F6" }],
    ]);
  });

  it("runs the part after the stub through `schedule`, so the store can wait for idle", async () => {
    const win = fakeWindow({ hostname: "store.kheelona.com" });
    let run: (() => void) | undefined;
    const fetchImpl = respond({ automatic_advanced_matching_enabled: false });
    const done = loadOpenAiPixel({ window: win, fetch: fetchImpl, policy: "require-off", schedule: (r) => (run = r) });
    await Promise.resolve();
    expect(win.oaiq).toBeDefined(); // the stub is there at once
    expect(fetchImpl).not.toHaveBeenCalled(); // the network waits for idle
    expect(sdkScripts()).toHaveLength(0);
    run!();
    await expect(done).resolves.toBe("loaded");
    expect(sdkScripts()).toHaveLength(1);
  });
});

describe("loadOpenAiPixel, verified-pages mode", () => {
  it("loads on an allowed page with no configuration request", async () => {
    const win = fakeWindow({ pathname: "/products/kheelu/" });
    const fetchImpl = respond({ automatic_advanced_matching_enabled: true });
    await expect(loadOpenAiPixel({ window: win, fetch: fetchImpl, policy: "verified-pages" })).resolves.toBe("loaded");
    expect(sdkScripts()).toHaveLength(1);
    expect(fetchImpl).not.toHaveBeenCalled();
    expect(queued(win).map((c) => (c[0] === "measure" ? c[1] : c[0]))).toEqual(["init", "page_viewed"]);
  });

  it("loads on the store's /", async () => {
    const win = fakeWindow({ hostname: "store.kheelona.com", pathname: "/" });
    await expect(loadOpenAiPixel({ window: win, fetch: respond({}), policy: "verified-pages" })).resolves.toBe("loaded");
    expect(sdkScripts()).toHaveLength(1);
  });

  it.each([
    ["kheelona.com", "/contact"],
    ["kheelona.com", "/privacy"],
    ["kheelona.com", "/terms"],
    ["kheelona.com", "/team"],
    ["kheelona.com", "/stories/some-post"],
    ["store.kheelona.com", "/thanks"],
    ["store.kheelona.com", "/nowhere"],
  ])("installs nothing on %s%s: no stub, no script, no request", async (hostname, pathname) => {
    const win = fakeWindow({ hostname, pathname });
    const fetchImpl = respond({ automatic_advanced_matching_enabled: false });
    await expect(loadOpenAiPixel({ window: win, fetch: fetchImpl, policy: "verified-pages" })).resolves.toBe("page-not-verified");
    expect(win.oaiq).toBeUndefined();
    expect(sdkScripts()).toHaveLength(0);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("is idempotent", async () => {
    const win = fakeWindow();
    await loadOpenAiPixel({ window: win, policy: "verified-pages" });
    await loadOpenAiPixel({ window: win, policy: "verified-pages" });
    expect(sdkScripts()).toHaveLength(1);
    expect(queued(win)).toHaveLength(2);
  });
});

describe("loadOpenAiPixel, hosts and team devices (either mode)", () => {
  it.each(["require-off", "verified-pages"] as const)("does nothing off the production hosts (%s)", async (policy) => {
    for (const hostname of ["localhost", "store.localhost", "betawebsite.kheelona.com", "kheelona-x.vercel.app"]) {
      const win = fakeWindow({ hostname });
      const fetchImpl = respond({ automatic_advanced_matching_enabled: false });
      await expect(loadOpenAiPixel({ window: win, fetch: fetchImpl, policy })).resolves.toBe("skipped");
      expect(win.oaiq).toBeUndefined();
      expect(sdkScripts()).toHaveLength(0);
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it.each(["require-off", "verified-pages"] as const)("installs no stub and no script on a team device (%s)", async (policy) => {
    const win = fakeWindow({ search: "?internal=1" });
    const fetchImpl = respond({ automatic_advanced_matching_enabled: false });
    await expect(loadOpenAiPixel({ window: win, fetch: fetchImpl, policy })).resolves.toBe("internal");
    expect(win.oaiq).toBeUndefined();
    expect(sdkScripts()).toHaveLength(0);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("treats PostHog's stored flag as a team device, and ?internal=0 as not", async () => {
    const stored = { [`ph_${POSTHOG_KEY}_posthog`]: JSON.stringify({ internal: true }) };
    const team = fakeWindow({ storage: stored });
    await expect(loadOpenAiPixel({ window: team, policy: "verified-pages" })).resolves.toBe("internal");
    const cleared = fakeWindow({ search: "?internal=0", storage: stored });
    await expect(loadOpenAiPixel({ window: cleared, policy: "verified-pages" })).resolves.toBe("loaded");
  });

  it("keeps working when storage throws", async () => {
    const win = fakeWindow({ storage: "throws" });
    await expect(loadOpenAiPixel({ window: win, policy: "verified-pages" })).resolves.toBe("loaded");
    expect(queued(win)[0]).toEqual(["init", { pixelId: "CtmHigpYxafJN3qgbj3xnv" }]);
  });

  it("never throws, even with a broken window", async () => {
    await expect(loadOpenAiPixel({ window: {} as unknown as Window })).resolves.toBe("skipped");
  });
});

describe("oaiqMeasure", () => {
  it("is a no-op when the pixel is absent", () => {
    vi.stubGlobal("window", {} as Window);
    expect(() => oaiqMeasure("order_created", { type: "contents" }, { event_id: "KH-X" })).not.toThrow();
    vi.unstubAllGlobals();
  });

  it("calls oaiq with the exact arguments, with and without options", () => {
    const calls: unknown[][] = [];
    vi.stubGlobal("window", { oaiq: (...args: unknown[]) => calls.push(args) } as unknown as Window);
    oaiqMeasure("checkout_started", { type: "contents", amount: 49_900 });
    oaiqMeasure("order_created", { type: "contents", amount: 49_900 }, { event_id: "KH-TEST-F6F6" });
    vi.unstubAllGlobals();
    expect(calls).toEqual([
      ["measure", "checkout_started", { type: "contents", amount: 49_900 }],
      ["measure", "order_created", { type: "contents", amount: 49_900 }, { event_id: "KH-TEST-F6F6" }],
    ]);
  });

  it("swallows a throwing oaiq", () => {
    vi.stubGlobal("window", {
      oaiq: () => {
        throw new Error("sdk broke");
      },
    } as unknown as Window);
    expect(() => oaiqMeasure("order_created", {})).not.toThrow();
    vi.unstubAllGlobals();
  });
});
