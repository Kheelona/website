import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { securityHeaders } from "@/lib/security-headers";

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

  it.each(Object.entries(VERCEL))("keeps the security headers exactly as they were on a %s build", async (_kind, vars) => {
    const config = await loadConfigUnder(vars);
    const rules = await config.headers!();
    expect(rules[0]).toEqual({
      source: "/((?!_next/static|_next/image).*)",
      headers: securityHeaders(process.env.NODE_ENV === "development"),
    });
    expect(rules.filter((r) => r !== rules[0] && JSON.stringify(r) !== JSON.stringify(NOINDEX))).toEqual([]);
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
  it("imports env.ts and redirects.ts by relative path", () => {
    expect(CONFIG_TEXT).toMatch(/from "\.\/src\/config\/env"/);
    expect(CONFIG_TEXT).toMatch(/from "\.\/src\/config\/redirects"/);
    expect(CONFIG_TEXT).not.toMatch(/from "@\//);
    const table = readFileSync(join(ROOT, "src/config/redirects.ts"), "utf8");
    expect(table).not.toMatch(/from "@\//);
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
      ["env", "headers", "images", "poweredByHeader", "redirects", "rewrites", "skipTrailingSlashRedirect"].sort(),
    );
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
