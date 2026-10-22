import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import { afterEach, describe, expect, it, vi } from "vitest";
import { securityHeaders } from "@/lib/security-headers";
import { IMMUTABLE, IMMUTABLE_SOURCES, withSiteImageOrigins } from "@/lib/site-pages/headers";

/**
 * next.config.ts and vercel.json, the two files Vercel builds from (task 1.3;
 * architecture §15.2-15.3, §9.4; ADR-008, ADR-009, ADR-012).
 *
 * Asserted on the RESOLVED config (the object Next loads), not on its text,
 * apart from the three literals other guards read and the absent
 * `cacheComponents` key (QA review N13).
 */

const ROOT = process.cwd();
const CONFIG_TEXT = readFileSync(join(ROOT, "next.config.ts"), "utf8");
const NOINDEX = { source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] };

/* Vercel's system variables for each kind of build, without KH_SITE_ENV. */
const VERCEL: Record<string, Record<string, string>> = {
  production: { VERCEL: "1", VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main" },
  beta: { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "beta" },
  preview: { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "reset/website-v2" },
  development: {},
};

function stubBuild(vars: Record<string, string | undefined>) {
  for (const name of ["KH_SITE_ENV", "VERCEL", "VERCEL_ENV", "VERCEL_GIT_COMMIT_REF"]) vi.stubEnv(name, vars[name]);
}

async function loadConfigUnder(vars: Record<string, string | undefined>) {
  vi.resetModules();
  stubBuild(vars);
  return (await import("../../next.config")).default;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("env: the build-time SITE_ENV", () => {
  it.each(Object.entries(VERCEL))("a %s build inlines KH_SITE_ENV from Vercel's own variables", async (kind, vars) => {
    const config = await loadConfigUnder(vars);
    expect(config.env).toEqual({ KH_SITE_ENV: kind });
  });

  it("lets KH_SITE_ENV force it, for tests and the Gate B dry run", async () => {
    const config = await loadConfigUnder({ ...VERCEL.preview, KH_SITE_ENV: "production" });
    expect(config.env).toEqual({ KH_SITE_ENV: "production" });
  });

  it("refuses to load on Vercel with the system variables off", async () => {
    await expect(loadConfigUnder({ VERCEL: "1" })).rejects.toThrow(/system environment variables are off/i);
  });
});

describe("headers(): beta is noindex on every response", () => {
  /* The proxy's matcher skips any path with a dot (src/proxy.ts:203), so
     /llms.txt, /pricing.md, /sitemap.xml, images and films get no header from
     it (QA review N1). This rule covers every path, on a beta build only. */
  it("adds X-Robots-Tag noindex, nofollow to every path on a beta build", async () => {
    const config = await loadConfigUnder(VERCEL.beta);
    expect(await config.headers!()).toContainEqual(NOINDEX);
  });

  /* Inside next.config.ts the inlined SITE_ENV still reads "development", so
     the rule must ask resolveSiteEnv(process.env) itself, at the moment Next
     calls headers(). Vercel's variables alone (no KH_SITE_ENV) prove it. */
  it("decides from Vercel's variables when Next calls headers(), not from the inlined SITE_ENV", async () => {
    const config = await loadConfigUnder(VERCEL.development);
    expect(JSON.stringify(await config.headers!())).not.toContain("X-Robots-Tag");
    stubBuild(VERCEL.beta);
    expect(await config.headers!()).toContainEqual(NOINDEX);
  });

  it.each(["production", "preview", "development"])("adds no robots header on a %s build", async (kind) => {
    const config = await loadConfigUnder(VERCEL[kind]);
    expect(JSON.stringify(await config.headers!())).not.toMatch(/robots/i);
  });

  /* 2026-10-22: the frozen policy plus the redesign's two image origins in img-src (src/lib/site-pages/headers.ts;
     test/site-pages.test.ts proves it a superset that changes nothing else), and a year's cache on the redesign's
     content-hashed files. Nothing else. */
  it.each(Object.entries(VERCEL))("keeps the security headers exactly as they were on a %s build", async (_kind, vars) => {
    const config = await loadConfigUnder(vars);
    const rules = await config.headers!();
    expect(rules[0]).toEqual({
      source: "/((?!_next/static|_next/image).*)",
      headers: withSiteImageOrigins(securityHeaders(process.env.NODE_ENV === "development")),
    });
    const cache = IMMUTABLE_SOURCES.map((source) => ({ source, headers: [{ key: "Cache-Control", value: IMMUTABLE }] }));
    expect(rules.slice(1, 1 + cache.length)).toEqual(cache);
    expect(
      rules.filter((r, i) => i > cache.length && JSON.stringify(r) !== JSON.stringify(NOINDEX)),
    ).toEqual([]);
  });

  /* test/security-headers.test.ts reads these three literals as text. */
  it("keeps the literals other guards read", () => {
    expect(CONFIG_TEXT).toContain("securityHeaders");
    expect(CONFIG_TEXT).toMatch(/async headers\(\)/);
    expect(CONFIG_TEXT).toContain("poweredByHeader: false");
  });
});

describe("redirects(): one table", () => {
  it.each(Object.entries(VERCEL))("returns the table in src/config/redirects.ts, whole, on a %s build", async (_kind, vars) => {
    const config = await loadConfigUnder(vars);
    const { REDIRECTS } = await import("@/config/redirects");
    expect(await config.redirects!()).toEqual([...REDIRECTS]);
  });

  /* Next resolves no `@/` alias in the config's own import graph (structure §2). */
  it("imports env.ts, redirects.ts and journal.ts by relative path", () => {
    expect(CONFIG_TEXT).toMatch(/from "\.\/src\/config\/env"/);
    expect(CONFIG_TEXT).toMatch(/from "\.\/src\/config\/redirects"/);
    expect(CONFIG_TEXT).toMatch(/from "\.\/src\/config\/journal"/);
    expect(CONFIG_TEXT).not.toMatch(/from "@\//);
    const table = readFileSync(join(ROOT, "src/config/redirects.ts"), "utf8");
    expect(table).not.toMatch(/from "@\//);
  });
});

/* The journal's images (ADR-014; journal-pipeline §6): an uploaded cover or body image from the dashboard's image
   folder, and a YouTube still for a video, both through our optimiser. Exactly these two, each a URL pattern, whose
   empty `search` lets no query string through (image.md, remotePatterns), and no redirect followed: the optimiser
   would follow one without checking remotePatterns again (image.md, maximumRedirects). Read through Next's own
   normalisation (next/dist/server/config.js) and matcher (next/dist/shared/lib/match-remote-pattern.js). */
describe("images: the journal's two remote sources, and nothing else", () => {
  /** The patterns as Next normalises a `URL` entry (next/dist/server/config.js, `images.remotePatterns`): the
   *  protocol's colon dropped, every other part kept as the URL holds it (an empty search stays ""). */
  async function remotePatterns(): Promise<RemotePattern[]> {
    const config = await loadConfigUnder(VERCEL.production);
    return (config.images?.remotePatterns ?? []).map(({ protocol, hostname, port, pathname, search }) => ({
      protocol: protocol?.replace(/:$/, "") as RemotePattern["protocol"],
      hostname,
      port,
      pathname,
      search,
    }));
  }

  it("allows exactly the image folder and the video stills, https, no port, no query string", async () => {
    const { JOURNAL_IMAGES, VIDEO_STILLS } = await import("@/config/journal");
    expect(JOURNAL_IMAGES).toBe("https://api.kheelona.com/v1/public/blog/images/");
    expect(VIDEO_STILLS).toBe("https://i.ytimg.com/vi/");
    expect(await remotePatterns()).toEqual([
      { protocol: "https", hostname: "api.kheelona.com", port: "", pathname: "/v1/public/blog/images/**", search: "" },
      { protocol: "https", hostname: "i.ytimg.com", port: "", pathname: "/vi/**", search: "" },
    ]);
  });

  it.each([
    ["an upload", "https://api.kheelona.com/v1/public/blog/images/cover.jpg", true],
    ["an upload in a folder", "https://api.kheelona.com/v1/public/blog/images/2026/10/cover.webp", true],
    ["a YouTube still", "https://i.ytimg.com/vi/abcDEF12345/hqdefault.jpg", true],
    ["an upload with a query string", "https://api.kheelona.com/v1/public/blog/images/cover.jpg?w=1", false],
    ["a YouTube still with a query string", "https://i.ytimg.com/vi/abcDEF12345/hqdefault.jpg?sqp=x", false],
    ["the posts API", "https://api.kheelona.com/v1/public/blog/posts", false],
    ["the image folder over http", "http://api.kheelona.com/v1/public/blog/images/cover.jpg", false],
    ["another port", "https://api.kheelona.com:8443/v1/public/blog/images/cover.jpg", false],
    ["another host", "https://images.example.org/v1/public/blog/images/cover.jpg", false],
    ["a subdomain", "https://x.api.kheelona.com/v1/public/blog/images/cover.jpg", false],
    ["another YouTube path", "https://i.ytimg.com/an_webp/abcDEF12345/mqdefault_6s.webp", false],
  ])("Next's matcher on %s (%s): allowed %s", async (_what, address, allowed) => {
    const { hasRemoteMatch } = await import("next/dist/shared/lib/match-remote-pattern");
    expect(hasRemoteMatch([], await remotePatterns(), new URL(address))).toBe(allowed);
  });

  it("follows no redirect from a remote image, and keeps the formats", async () => {
    const config = await loadConfigUnder(VERCEL.production);
    expect(config.images?.maximumRedirects).toBe(0);
    expect(config.images?.formats).toEqual(["image/avif", "image/webp"]);
    expect(Object.keys(config.images ?? {}).sort()).toEqual(["formats", "maximumRedirects", "remotePatterns"]);
  });

  it.each(Object.entries(VERCEL))("is the same on a %s build", async (_kind, vars) => {
    const config = await loadConfigUnder(vars);
    const prod = await loadConfigUnder(VERCEL.production);
    expect(JSON.stringify(config.images)).toBe(JSON.stringify(prod.images));
  });
});

describe("the rest of the config", () => {
  /* Cache Components stays off (ADR-005; QA review N13): the store is
     force-dynamic and the pages use route-segment revalidate. */
  it("has no cacheComponents key, anywhere", async () => {
    const config = await loadConfigUnder(VERCEL.production);
    expect("cacheComponents" in config).toBe(false);
    expect(config.experimental ?? {}).not.toHaveProperty("cacheComponents");
    expect(CONFIG_TEXT).not.toContain("cacheComponents");
  });

  it("sets exactly the keys the plan names", async () => {
    const config = await loadConfigUnder(VERCEL.production);
    expect(Object.keys(config).sort()).toEqual(
      [
        "env",
        "headers",
        "images",
        "poweredByHeader",
        "redirects",
        "rewrites",
        "skipTrailingSlashRedirect",
        /* 2026-10-22, the redesign as the marketing site: its 404 outside the root layout, and build/site/ traced. */
        "experimental",
        "outputFileTracingIncludes",
      ].sort(),
    );
    expect(config.experimental).toEqual({ globalNotFound: true });
    expect(config.poweredByHeader).toBe(false);
    expect(config.skipTrailingSlashRedirect).toBe(true);
  });
});

/* Architecture §15.3, exactly: functions in Mumbai (D047, ADR-009); the daily
   health cron that keeps Supabase awake (test/store-secrets.test.ts reads it);
   `reset/*` builds off and `beta` on (any true rule wins, so `beta` deploys and
   `reset/website-v2` does not). */
describe("vercel.json", () => {
  it("is exactly the architecture's", () => {
    expect(JSON.parse(readFileSync(join(ROOT, "vercel.json"), "utf8"))).toEqual({
      $schema: "https://openapi.vercel.sh/vercel.json",
      regions: ["bom1"],
      crons: [{ path: "/api/health", schedule: "0 4 * * *" }],
      git: { deploymentEnabled: { "reset/*": false, beta: true } },
    });
  });
});
