import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { shouldLoadGa4 as gateGa4 } from "@/components/tracking/GoogleAnalyticsGate";
import { shouldLoadMetaPixel as gateMeta } from "@/components/tracking/MetaPixel";
import { BETA_HOSTS } from "@/config/env";
import { GA4_MEASUREMENT_ID, META_PIXEL_ID, POSTHOG_KEY, shouldLoadPostHog } from "@/config/site";
import {
  loadGa4,
  loadMetaPixel,
  postHogOptions,
  shouldLoadGa4,
  shouldLoadMetaPixel,
  trackViewContent,
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
