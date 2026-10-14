import { readFileSync } from "node:fs";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FONT_PRELOADS } from "@/styles/generated/fonts.generated";
import { SITE_LANGUAGE } from "@/layouts/SiteShell/site-graph";

/* The root layout (task 3.1; architecture §4.1, §9.1, §10, §11.3, §15.3; structure §3.1). Shared by the marketing site
 * and the store: <html lang="en-IN"> (the smooth-scroll hook arrives from the client, task 7.1a), the one CSS entry, the three font preloads, the
 * canonical metadata base, noindex on beta, Ahrefs in the head except on beta, the bubble's clearance class on <body>,
 * and the five measurement tools last in <body>. test/analytics-tags.test.ts guards the tags' wording and stays
 * unedited (its owner is 5.11). */

vi.mock("@/styles/site.css", () => ({}));
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => <i data-tool="vercel" /> }));
vi.mock("@/components/tracking/GoogleAnalyticsGate", () => ({ GoogleAnalyticsGate: () => <i data-tool="ga4" /> }));
vi.mock("@/components/tracking/MetaPixel", () => ({ MetaPixel: () => <i data-tool="meta" /> }));
vi.mock("@/components/tracking/PostHogGate", () => ({ PostHogGate: () => <i data-tool="posthog" /> }));

type LayoutModule = { default: (props: { children: ReactNode }) => ReactNode; metadata: Metadata; viewport?: Viewport };

/** The layout as built for one site environment (SITE_ENV is read once, when src/config/env.ts loads). */
async function layoutFor(
  env: "development" | "beta" | "production",
): Promise<{ doc: Document; metadata: Metadata; viewport: Viewport | undefined }> {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", env);
  const mod = (await import("./layout")) as LayoutModule;
  const Layout = mod.default;
  // Rendered as an element, so React's preload() calls reach this render (they write the head's preload links).
  const html = renderToStaticMarkup(
    <Layout>
      <p id="page">page</p>
    </Layout>,
  );
  return { doc: new DOMParser().parseFromString(html, "text/html"), metadata: mod.metadata, viewport: mod.viewport };
}
afterEach(() => {
  vi.unstubAllEnvs();
});

const SOURCE = readFileSync("src/app/layout.tsx", "utf8");

describe("root layout: the document", () => {
  /* The smooth in-page scroll hook motion.css reads (html[data-scroll-behavior="smooth"]) is not in the server HTML: it
     arrives once the page has loaded, from MotionController, so a landing at a #fragment jumps (task 7.1a, CMO M1;
     MotionController.test.tsx, test/e2e/anchors.spec.ts). */
  it("is <html lang=\"en-IN\">, without the smooth-scroll hook, which the client adds once the page has loaded", async () => {
    const { doc } = await layoutFor("production");
    expect(doc.documentElement.getAttribute("lang")).toBe("en-IN");
    expect(doc.documentElement.getAttribute("lang")).toBe(SITE_LANGUAGE);
    expect(doc.documentElement.hasAttribute("data-scroll-behavior")).toBe(false);
  });

  it("gives <body> the mockup's page classes and the WhatsApp bubble's clearance (every page carries the bubble)", async () => {
    const { doc } = await layoutFor("production");
    expect(doc.body.className.split(/\s+/)).toEqual(["kh-page", "ks-has-float"]);
    expect(doc.body.getAttribute("data-theme")).toBe("light");
  });

  it("renders the page first and the five measurement tools last, in their order", async () => {
    const { doc } = await layoutFor("production");
    const kids = Array.from(doc.body.children);
    expect(kids[0].id).toBe("page");
    expect(kids.slice(1).map((el) => el.getAttribute("data-tool"))).toEqual(["vercel", "ga4", "meta", "posthog"]);
  });

  it("preloads the three hero fonts from the generated list, each once (architecture §10, N17)", async () => {
    const { doc } = await layoutFor("production");
    const links = Array.from(doc.head.querySelectorAll('link[rel="preload"]'));
    // crossorigin="" and "anonymous" are the same CORS mode (React's server renderer writes the empty form).
    const cors = (l: Element) => (l.getAttribute("crossorigin") === "" ? "anonymous" : l.getAttribute("crossorigin"));
    expect(links.map((l) => [l.getAttribute("href"), l.getAttribute("as"), l.getAttribute("type"), cors(l)])).toEqual(
      FONT_PRELOADS.map((f) => [f.href, "font", "font/woff2", "anonymous"]),
    );
  });

  it("declares the approved mockup's viewport: device width, scale 1, viewport-fit=cover (so the safe areas apply)", async () => {
    /* Every approved mockup page has `width=device-width, initial-scale=1, viewport-fit=cover` (mockup/build.mjs:37).
       Browsers give env(safe-area-inset-*) a value only under viewport-fit=cover, and the buy bar's foot (G-09), the
       WhatsApp bubble's offset (D050) and the footer's clearance (ks-has-float) all add it. Next's default viewport
       leaves it out, so the root layout exports its own, in every environment. */
    for (const env of ["production", "beta", "development"] as const) {
      const { viewport } = await layoutFor(env);
      expect(viewport, env).toEqual({ width: "device-width", initialScale: 1, viewportFit: "cover" });
    }
  });

  it("loads the new site's one CSS entry and none of the retired fonts or styles", () => {
    expect(SOURCE).toContain('import "@/styles/site.css";');
    expect(SOURCE).not.toMatch(/globals\.css|next\/font|localFont|Glory|Instrument/);
  });
});

describe("root layout: environments (D048, D051; architecture §15.3)", () => {
  it("loads Ahrefs in the head, async, with its key, except on beta", async () => {
    for (const env of ["production", "development"] as const) {
      const { doc } = await layoutFor(env);
      const script = doc.head.querySelector('script[src="https://analytics.ahrefs.com/analytics.js"]');
      expect(script, env).not.toBeNull();
      expect(script!.hasAttribute("async")).toBe(true);
      expect(script!.getAttribute("data-key")).toBe("N7vd/jLtIIlHqzFqu57UBg");
    }
    const { doc } = await layoutFor("beta");
    expect(doc.querySelector('script[src*="ahrefs"]')).toBeNull();
  });

  it("resolves every relative URL against the canonical origin, in every environment", async () => {
    for (const env of ["production", "beta", "development"] as const) {
      const { metadata } = await layoutFor(env);
      expect(String(metadata.metadataBase)).toBe("https://kheelona.com/");
    }
  });

  it("is noindex, nofollow on beta only, and never sets robots elsewhere (pages never set it either, N15)", async () => {
    expect((await layoutFor("beta")).metadata.robots).toEqual({ index: false, follow: false });
    expect((await layoutFor("production")).metadata).not.toHaveProperty("robots");
    expect((await layoutFor("development")).metadata).not.toHaveProperty("robots");
  });

  it("keeps the brand in one place: the title template legacy pages still rely on; new pages set absolute titles", async () => {
    const { metadata } = await layoutFor("production");
    expect(metadata.title).toEqual({ default: "Kheelona", template: "%s · Kheelona" });
  });
});
