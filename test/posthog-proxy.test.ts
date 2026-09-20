import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";
import {
  POSTHOG_API_HOST,
  POSTHOG_ASSET_HOST,
  POSTHOG_ASSET_PROXY_PATH,
  POSTHOG_PROXY_PATH,
} from "@/config/site";

/**
 * PostHog's requests go through our own domain since 2026-09-20 (§8.39), so an
 * ad blocker cannot drop them. That is a routing change on a live commercial
 * site, and routing is where this repo has been bitten hardest: §8.34-f (a
 * rewrite behaves differently on Vercel than under `next start`) and §8.38-i (a
 * path in a config file is a claim about what a browser reports).
 *
 * So these tests assert the RESOLVED config rather than grepping for a string,
 * and the proxy matcher is checked by running its regex against real request
 * paths rather than by looking for the word "ingest" in it.
 */

type Rewrite = { source: string; destination: string };

async function rewrites(): Promise<Rewrite[]> {
  const result = await nextConfig.rewrites!();
  /* The object form. If it is ever flattened to a bare array these tests should
     fail loudly rather than quietly read `undefined`. */
  expect(Array.isArray(result), "rewrites() must use the {beforeFiles} form").toBe(false);
  return (result as { beforeFiles: Rewrite[] }).beforeFiles;
}

describe("the PostHog reverse proxy rewrites", () => {
  it("forwards ingestion to the PostHog ingestion host", async () => {
    /* Matched EXACTLY, not by prefix: "/ingest-assets" also startsWith
       "/ingest", which is the very overlap these two prefixes exist to avoid
       and which caught this test on its first run. */
    const rule = (await rewrites()).find((r) => r.source === `${POSTHOG_PROXY_PATH}/:path*`);
    expect(rule).toBeDefined();
    expect(rule!.destination).toBe(`${POSTHOG_API_HOST}/:path*`);
  });

  it("forwards the lazily-fetched bundles to the PostHog ASSET host", async () => {
    const rule = (await rewrites()).find((r) => r.source === `${POSTHOG_ASSET_PROXY_PATH}/:path*`);
    expect(rule).toBeDefined();
    expect(rule!.destination).toBe(`${POSTHOG_ASSET_HOST}/:path*`);
  });

  /* THE REASON THERE ARE TWO PREFIXES AT ALL. Next's docs say `beforeFiles`
     rules keep being evaluated after one matches, so two OVERLAPPING sources
     leave it undecided which destination wins. If the ingestion rule won a
     `/static/` path, the recorder would 404 and session replay would silently
     never start, which is exactly §8.38-b happening a second time. Prefixes
     that cannot both match make the question unaskable, and this test is what
     stops someone "simplifying" them back into one. */
  it("uses prefixes that can never both match the same path", () => {
    expect(POSTHOG_ASSET_PROXY_PATH.startsWith(`${POSTHOG_PROXY_PATH}/`)).toBe(false);
    expect(POSTHOG_PROXY_PATH.startsWith(`${POSTHOG_ASSET_PROXY_PATH}/`)).toBe(false);
    expect(POSTHOG_PROXY_PATH).not.toBe(POSTHOG_ASSET_PROXY_PATH);
  });

  /* PostHog ingests on `/e/`, `/s/` and `/i/` — WITH the trailing slash, read
     out of the installed SDK. Next's default would 308 those away, and a
     redirect on a beacon fired during page unload is a lost event. */
  it("keeps the trailing slashes PostHog ingests on", () => {
    expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
  });
});

describe("the proxy matcher", () => {
  const PROXY = readFileSync(join(process.cwd(), "src/proxy.ts"), "utf8");
  const matcher = PROXY.match(/matcher:\s*\[\s*"([^"]+)"/)?.[1];

  it("is readable from the file", () => {
    expect(matcher, "could not find the matcher in src/proxy.ts").toBeTruthy();
  });

  /* DERIVED, NOT RESTATED (§8.38-i). Asserting the matcher "contains ingest"
     would restate the same claim the code makes and prove nothing. This runs
     the matcher's own regex against the paths the browser will really request,
     so it fails if either constant changes without the matcher changing. */
  it("excludes every PostHog proxy path, so analytics never wakes the edge", () => {
    const re = new RegExp(`^${matcher}$`);
    for (const path of [
      `${POSTHOG_PROXY_PATH}/e/`,
      `${POSTHOG_PROXY_PATH}/s/`,
      `${POSTHOG_PROXY_PATH}/i/`,
      `${POSTHOG_ASSET_PROXY_PATH}/static/recorder.js`,
    ]) {
      expect(re.test(path), `${path} still runs through the proxy`).toBe(false);
    }
  });

  it("still runs on the pages that need it", () => {
    const re = new RegExp(`^${matcher}$`);
    for (const path of ["/", "/products/kheelu", "/thanks", "/store/thanks"]) {
      expect(re.test(path), `${path} stopped being routed`).toBe(true);
    }
  });
});
