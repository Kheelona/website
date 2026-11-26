import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

/* Which builds write the measurement tags (K-187, 2026-11-26; src/config/analytics-env.ts). The root layout decides on the
 * server, from the build's SITE_ENV, before any browser gate runs: Ahrefs, GA4, the Meta Pixel and OpenAI's pixel on a
 * production build only, PostHog on production and beta, Vercel Web Analytics everywhere. A development or preview build
 * writes none of the five, whatever hostname it is opened under. src/app/layout.test.tsx holds the rest of the layout's
 * contract. */

vi.mock("@/styles/site.css", () => ({}));
vi.mock("@vercel/analytics/next", () => ({ Analytics: () => <i data-tool="vercel" /> }));
vi.mock("@/components/tracking/GoogleAnalyticsGate", () => ({ GoogleAnalyticsGate: () => <i data-tool="ga4" /> }));
vi.mock("@/components/tracking/MetaPixel", () => ({ MetaPixel: () => <i data-tool="meta" /> }));
vi.mock("@/components/tracking/OpenAiPixel", () => ({ OpenAiPixel: () => <i data-tool="openai" /> }));
vi.mock("@/components/tracking/PostHogGate", () => ({ PostHogGate: () => <i data-tool="posthog" /> }));

type Env = "production" | "beta" | "preview" | "development";
type LayoutModule = { default: (props: { children: ReactNode }) => ReactNode };

async function layoutFor(env: Env): Promise<Document> {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", env);
  const { default: Layout } = (await import("./layout")) as LayoutModule;
  const html = renderToStaticMarkup(
    <Layout>
      <p id="page">page</p>
    </Layout>,
  );
  return new DOMParser().parseFromString(html, "text/html");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

const tools = (doc: Document) =>
  Array.from(doc.body.children)
    .slice(1)
    .map((el) => el.getAttribute("data-tool"));
const ahrefs = (doc: Document) => doc.querySelector('script[src*="ahrefs"]');

describe("root layout: which builds write which tags (K-187)", () => {
  it("a production build writes all five, in the order it always has: Ahrefs in the head, then Vercel, GA4, Meta, OpenAI, PostHog", async () => {
    const doc = await layoutFor("production");
    expect(doc.head.querySelector('script[src="https://analytics.ahrefs.com/analytics.js"]')).not.toBeNull();
    expect(tools(doc)).toEqual(["vercel", "ga4", "meta", "openai", "posthog"]);
  });

  it("a beta build keeps PostHog and Vercel only: no Ahrefs, GA4, Meta or OpenAI (as before)", async () => {
    const doc = await layoutFor("beta");
    expect(ahrefs(doc)).toBeNull();
    expect(tools(doc)).toEqual(["vercel", "posthog"]);
  });

  it.each(["development", "preview"] as const)("a %s build writes none of the five: no Ahrefs, GA4, Meta, OpenAI or PostHog", async (env) => {
    const doc = await layoutFor(env);
    expect(ahrefs(doc)).toBeNull();
    expect(tools(doc)).toEqual(["vercel"]);
    expect(doc.documentElement.outerHTML).not.toMatch(/ahrefs|googletagmanager|facebook|posthog|oaiq/i);
  });

  it("changes nothing else in the document, in any environment: same <html>, same <body> classes, the page first", async () => {
    for (const env of ["production", "beta", "preview", "development"] as const) {
      const doc = await layoutFor(env);
      expect(doc.documentElement.getAttribute("lang"), env).toBe("en-IN");
      expect(doc.body.className.split(/\s+/), env).toEqual(["kh-page", "ks-has-float"]);
      expect(doc.body.children[0].id, env).toBe("page");
    }
  });
});
