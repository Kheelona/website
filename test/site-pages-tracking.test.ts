import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shouldLoadGa4 as gateGa4 } from "@/components/tracking/GoogleAnalyticsGate";
import { shouldLoadMetaPixel as gateMeta } from "@/components/tracking/MetaPixel";
import { BETA_HOSTS } from "@/config/env";
import { shouldLoadOpenAiPixel } from "@/lib/ads/openai-pixel";
import { GA4_MEASUREMENT_ID, META_PIXEL_ID, POSTHOG_KEY, shouldLoadPostHog } from "@/config/site";
import { STORE_CTA_TAPPED_EARLY } from "@/lib/tracking/beacon";
import {
  ctaOf,
  loadGa4,
  loadMetaPixel,
  postHogOptions,
  reportEarlyStoreTaps,
  shouldLoadGa4,
  shouldLoadMetaPixel,
  trackViewContent,
  whenEngaged,
} from "@/lib/site-pages/tracking-shell";

/* The redesign's tracking shell (src/lib/site-pages/tracking-shell.ts) against the React gates it stands in for on the
 * marketing pages (tracking inventory parity rows 1-4, 11, 12, 14, 17): the same host gates, the same PostHog options as
 * the production fixture the gates are held to (test/guards/posthog-init-fixture.test.ts), the beta stamp only on the
 * beta hosts, Meta's init and PageView with the pixel id, gtag's config, and ViewContentTracker's payload. */

const FIXTURE = JSON.parse(
  readFileSync(join(process.cwd(), "test/guards/fixtures/posthog-init/src__components__tracking__PostHogGate.tsx.json"), "utf8"),
) as { key: string; options: Record<string, unknown> };

const HOSTS = ["kheelona.com", "www.kheelona.com", "store.kheelona.com", "KHEELONA.COM", ...BETA_HOSTS, "localhost", "kheelona-git-x.vercel.app"];

describe("host gates", () => {
  it.each(HOSTS)("%s: GA4 and Meta load where the React gates load them", (host) => {
    expect(shouldLoadGa4(host)).toBe(gateGa4(host));
    expect(shouldLoadMetaPixel(host)).toBe(gateMeta(host));
  });

  it("GA4 and Meta never on beta, PostHog on production and beta only", () => {
    for (const host of BETA_HOSTS) {
      expect(shouldLoadGa4(host)).toBe(false);
      expect(shouldLoadMetaPixel(host)).toBe(false);
      expect(shouldLoadPostHog(host)).toBe(true);
    }
    expect(shouldLoadPostHog("localhost")).toBe(false);
  });
});

/* OpenAI's pixel (D069) is a fourth tool in the shell. It shares the Meta Pixel's host list, so the marketing pages and the
 * store's React gate (OpenAiPixel, which calls the same predicate) can never disagree about where it loads. */
describe("OpenAI Ads pixel in the shell", () => {
  it.each(HOSTS)("%s: loads exactly where the Meta Pixel loads", (host) => {
    expect(shouldLoadOpenAiPixel(host)).toBe(shouldLoadMetaPixel(host));
  });

  it("is never on beta", () => {
    for (const host of BETA_HOSTS) expect(shouldLoadOpenAiPixel(host)).toBe(false);
  });

  it("remembers the ad click as the shell evaluates, then starts the pixel in boot() after Meta, behind the host gate", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/site-pages/tracking-shell.ts"), "utf8");
    const boot = source.slice(source.indexOf("export function boot("), source.indexOf("/** Lighthouse, 2026-10-23"));
    expect(boot.indexOf("loadMetaPixel()")).toBeGreaterThan(-1);
    expect(boot.indexOf("if (shouldLoadOpenAiPixel(host)) void loadOpenAiPixel()")).toBeGreaterThan(boot.indexOf("loadMetaPixel()"));
    const tail = source.slice(source.lastIndexOf("if (typeof document !== "));
    expect(tail.indexOf("startOpenAiAttribution()")).toBeGreaterThan(-1);
    expect(tail.indexOf("startOpenAiAttribution()")).toBeLessThan(tail.indexOf("whenEngaged(start)"));
  });
});

describe("PostHog", () => {
  it("uses the production fixture's key and options on every production host", () => {
    expect(POSTHOG_KEY).toBe(FIXTURE.key);
    for (const host of ["kheelona.com", "www.kheelona.com", "store.kheelona.com"]) {
      expect(postHogOptions(host)).toStrictEqual(FIXTURE.options);
    }
  });

  it("adds only the env=beta stamp on the beta hosts, through before_send", () => {
    for (const host of BETA_HOSTS) {
      const { before_send, ...rest } = postHogOptions(host) as Record<string, unknown> & {
        before_send: (e: unknown) => { properties: Record<string, unknown> };
      };
      expect(rest).toStrictEqual(FIXTURE.options);
      expect(before_send({ event: "$pageview", properties: { a: 1 } }).properties).toEqual({ a: 1, env: "beta" });
    }
  });
});

describe("GA4, Meta and ViewContent", () => {
  afterEach(() => {
    vi.useRealTimers();
    const w = window as unknown as Record<string, unknown>;
    delete w.fbq;
    delete w._fbq;
    delete w.dataLayer;
    delete w.gtag;
    document.body.innerHTML = "";
  });

  it("GA4: the config call for the measurement id, then gtag.js", () => {
    loadGa4();
    const layer = (window as unknown as { dataLayer: IArguments[] }).dataLayer.map((a) => [...a]);
    expect(layer[0][0]).toBe("js");
    expect(layer[1]).toEqual(["config", GA4_MEASUREMENT_ID]);
    expect(document.querySelector("script")?.getAttribute("src")).toBe(
      `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`,
    );
  });

  it("Meta: init with the pixel id and one PageView, then fbevents.js", () => {
    loadMetaPixel();
    const queue = (window as unknown as { fbq: { queue: IArguments[] } }).fbq.queue.map((a) => [...a]);
    expect(queue).toEqual([
      ["init", META_PIXEL_ID],
      ["track", "PageView"],
    ]);
    expect(META_PIXEL_ID).toBe("1051265191046395");
    expect(document.querySelector("script")?.getAttribute("src")).toBe("https://connect.facebook.net/en_US/fbevents.js");
  });

  it("ViewContent: ViewContentTracker's payload, in rupees, once fbq is there", () => {
    vi.useFakeTimers();
    const fbq = vi.fn();
    trackViewContent(499_900);
    expect(fbq).not.toHaveBeenCalled();
    (window as unknown as { fbq: unknown }).fbq = fbq;
    vi.advanceTimersByTime(400);
    expect(fbq).toHaveBeenCalledTimes(1);
    expect(fbq).toHaveBeenCalledWith(
      "track",
      "ViewContent",
      { content_name: "Kheelu", content_ids: ["lumi"], content_type: "product", value: 4999, currency: "INR" },
      undefined,
    );
  });
});

/* Lighthouse, 2026-10-23: the tools start on the first interaction or a few seconds after load. */
describe("deferred start", () => {
  afterEach(() => vi.useRealTimers());

  it("starts once, on the first interaction", () => {
    vi.useFakeTimers();
    const start = vi.fn();
    whenEngaged(start, 4000);
    expect(start).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("pointerdown"));
    window.dispatchEvent(new Event("scroll"));
    vi.advanceTimersByTime(10_000);
    expect(start).toHaveBeenCalledTimes(1);
  });

  it("starts after the delay when nobody interacts (the page has loaded)", () => {
    vi.useFakeTimers();
    const start = vi.fn();
    whenEngaged(start, 4000);
    vi.advanceTimersByTime(3999);
    expect(start).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(start).toHaveBeenCalledTimes(1);
  });
});

/* D070 / B5 (K-173): the Pre-order tap is never held. Before PostHog has loaded the tap is reported by beacon
 * (`store_cta_tapped_early`, with the link's cta); after, autocapture reports it and this code does nothing. */
describe("a store link tap (D070 / B5)", () => {
  /** A document of its own (its listeners, nothing left over between tests) with a hero Pre-order link, a plain link and a
   *  store-lookalike, plus a listener that records what the page's own handlers would see: `defaultPrevented`. */
  function page() {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML =
      '<a id="hero" href="https://store.kheelona.com" data-ph-capture-attribute-cta="hero"><span id="label">Pre-order</span></a>' +
      '<a id="nav" href="https://store.kheelona.com/?utm_source=x" data-ph-capture-attribute-cta="navbar-mobile">Pre-order</a>' +
      '<a id="bare" href="https://store.kheelona.com/">Pre-order</a>' +
      '<a id="odd" href="https://store.kheelona.com/" data-ph-capture-attribute-cta="Hero Button!">Pre-order</a>' +
      '<a id="home" href="https://www.kheelona.com/products/kheelu/" data-ph-capture-attribute-cta="hero">Kheelu</a>';
    const seen: boolean[] = [];
    doc.addEventListener("click", (e) => { seen.push(e.defaultPrevented); e.preventDefault(); }); // jsdom: no navigation
    return { doc, seen, el: (id: string) => doc.getElementById(id)! };
  }

  it("never prevents the tap: before PostHog has loaded, after it, and on a link that is not ours", () => {
    for (const loaded of [false, true]) {
      const { doc, seen, el } = page();
      reportEarlyStoreTaps(() => loaded, doc, vi.fn());
      el("hero").click();
      el("home").click();
      expect(seen, `loaded=${loaded}`).toEqual([false, false]);
    }
  });

  it("holds nothing: the beacon goes out inside the click itself, with the link's cta, once, and the tap is not repeated", () => {
    const { doc, seen, el } = page();
    const send = vi.fn();
    reportEarlyStoreTaps(() => false, doc, send);
    el("hero").click();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(STORE_CTA_TAPPED_EARLY, { cta: "hero" });
    expect(STORE_CTA_TAPPED_EARLY).toBe("store_cta_tapped_early");
    expect(seen).toEqual([false]); // one click event only: no second, synthetic click
  });

  it("reports the cta of the link that was tapped, also when the tap lands on something inside it", () => {
    const { doc, el } = page();
    const send = vi.fn();
    reportEarlyStoreTaps(() => false, doc, send);
    el("label").click();
    el("nav").click();
    expect(send.mock.calls).toEqual([
      [STORE_CTA_TAPPED_EARLY, { cta: "hero" }],
      [STORE_CTA_TAPPED_EARLY, { cta: "navbar-mobile" }],
    ]);
  });

  it("sends 'unknown' for a link with no cta, or one that is not a registry-shaped value, never the raw text", () => {
    const { doc, el } = page();
    const send = vi.fn();
    reportEarlyStoreTaps(() => false, doc, send);
    el("bare").click();
    el("odd").click();
    expect(send.mock.calls).toEqual([
      [STORE_CTA_TAPPED_EARLY, { cta: "unknown" }],
      [STORE_CTA_TAPPED_EARLY, { cta: "unknown" }],
    ]);
    expect(ctaOf(el("hero"))).toBe("hero");
    expect(ctaOf(el("odd"))).toBe("unknown");
  });

  it("sends nothing once PostHog has loaded (autocapture reports the tap), the moment it flips, not before", () => {
    const { doc, el } = page();
    const send = vi.fn();
    let loaded = false;
    reportEarlyStoreTaps(() => loaded, doc, send);
    el("hero").click();
    expect(send).toHaveBeenCalledTimes(1);
    loaded = true;
    el("hero").click();
    el("nav").click();
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("sends nothing for a link that is not the store's, or a click that is not the primary button", () => {
    const { doc, el } = page();
    const send = vi.fn();
    reportEarlyStoreTaps(() => false, doc, send);
    el("home").click();
    el("hero").dispatchEvent(new MouseEvent("click", { bubbles: true, button: 2 }));
    expect(send).not.toHaveBeenCalled();
  });

  it("sends nothing for a click something else already prevented", () => {
    const { doc, el } = page();
    const send = vi.fn();
    doc.addEventListener("click", (e) => e.preventDefault(), true); // registered first, so it runs first in the capture phase
    reportEarlyStoreTaps(() => false, doc, send);
    el("hero").click();
    expect(send).not.toHaveBeenCalled();
  });

  it("is the tracking-shell's real wiring: the PostHog hosts only, through beaconCapture, and no preventDefault anywhere in the shell", () => {
    const source = readFileSync(join(process.cwd(), "src/lib/site-pages/tracking-shell.ts"), "utf8");
    const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(code).not.toContain("preventDefault");
    expect(code).not.toContain("holdStoreClicks");
    const tail = code.slice(code.lastIndexOf("if (typeof document !== "));
    expect(tail).toContain("if (shouldLoadPostHog(window.location.hostname)) reportEarlyStoreTaps(() => loaded);");
    expect(code).toContain("send: (event: string, props: Record<string, unknown>) => unknown = beaconCapture");
  });
});

/* The default sender is beaconCapture, and it is host-gated as PostHog is: on a host PostHog never loads on (localhost, a
 * preview), a tap sends nothing; on the production marketing host and on beta it sends one PostHog beacon. */
describe("a store link tap, sent by the real beaconCapture (D070 / B5)", () => {
  const CHROME_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
  let sendBeacon: ReturnType<typeof vi.fn>;
  let bodies: string[];

  class FakeBlob {
    constructor(readonly parts: string[]) {}
  }

  beforeEach(() => {
    bodies = [];
    vi.stubGlobal("Blob", FakeBlob);
    sendBeacon = vi.fn((_url: string, blob: FakeBlob) => {
      bodies.push(blob.parts.join(""));
      return true;
    });
    Object.defineProperty(navigator, "sendBeacon", { value: sendBeacon, configurable: true, writable: true });
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(CHROME_UA);
    vi.stubGlobal("fetch", vi.fn(() => Promise.resolve(new Response(null, { status: 204 }))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    delete (navigator as unknown as { sendBeacon?: unknown }).sendBeacon;
  });

  const at = (host: string, search = "") =>
    vi.stubGlobal("location", { hostname: host, host, pathname: "/", search, origin: `https://${host}`, href: `https://${host}/${search}` });

  function tap() {
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = '<a href="https://store.kheelona.com" data-ph-capture-attribute-cta="hero">Pre-order</a>';
    reportEarlyStoreTaps(() => false, doc);
    doc.querySelector("a")!.click();
  }
  const decoded = () =>
    bodies.map((b) => JSON.parse(Buffer.from(decodeURIComponent(b.slice("data=".length)), "base64").toString("utf8")));

  it.each(["localhost", "kheelona-git-x.vercel.app", "store.localhost"])("%s: nothing is sent", (host) => {
    at(host);
    tap();
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it.each(["kheelona.com", "www.kheelona.com"])("%s: one PostHog beacon, store_cta_tapped_early, cta only plus the page's own url", (host) => {
    at(host, "?utm_source=ig&email=a%40b.c&foo=1");
    tap();
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon.mock.calls[0][0]).toBe("/ingest/e/?compression=base64");
    const [{ api_key, batch }] = decoded();
    expect(api_key).toBe(POSTHOG_KEY);
    expect(batch).toHaveLength(1);
    expect(batch[0].event).toBe("store_cta_tapped_early");
    expect(batch[0].properties).toMatchObject({
      token: POSTHOG_KEY,
      cta: "hero",
      $current_url: `https://${host}/?utm_source=ig`, // campaign keys only: no email, no foo
      $host: host,
      $pathname: "/",
      $lib: "kh-beacon",
      $process_person_profile: false,
    });
    expect(Object.keys(batch[0].properties).sort()).toEqual(
      ["$current_url", "$host", "$lib", "$pathname", "$process_person_profile", "cta", "distinct_id", "token"].sort(),
    );
  });

  it("on a beta host it carries env: beta, as PostHog's own events do", () => {
    at(BETA_HOSTS[0]);
    tap();
    expect(decoded()[0].batch[0].properties.env).toBe("beta");
  });

  it("not for a bot or an automated browser (posthog-js drops those visits too)", () => {
    at("kheelona.com");
    Object.defineProperty(navigator, "webdriver", { value: true, configurable: true }); // jsdom has none
    try {
      tap();
      expect(sendBeacon).not.toHaveBeenCalled();
    } finally {
      delete (navigator as unknown as { webdriver?: unknown }).webdriver;
    }
  });
});
