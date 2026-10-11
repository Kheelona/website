import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInThisContext } from "node:vm";
import ts from "typescript";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSiteEnv } from "@/config/env";
import type { PreorderRow } from "@/lib/store/db";

/**
 * One build-time site environment (D048, ADR-008, architecture §15.2).
 *
 * `SITE_ENV` decides which store a button opens, whether Meta's server events
 * are sent, and whether a paid order is stamped as a test. It is resolved ONCE,
 * in `next.config.ts`, from Vercel's system variables, and inlined into every
 * bundle; `KH_SITE_ENV` forces it for tests and the local production check.
 *
 * The failure this file exists to prevent is the quiet one: a beta build whose
 * orange buttons open the PRODUCTION store, or a production build that thinks it
 * is anything else.
 */

const ROOT = process.cwd();

/* `SITE_ENV` and everything derived from it are read when a module loads, so
   each case loads fresh copies under the environment it names. */
async function loadUnder<T>(value: string | undefined, load: () => Promise<T>): Promise<T> {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", value);
  return load();
}
const loadEnvUnder = (value: string | undefined) => loadUnder(value, () => import("@/config/env"));
const loadSiteUnder = (value: string | undefined) => loadUnder(value, () => import("@/config/site"));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

/* THE TAG IS THE REFERENCE (D008, ADR-013). "Production is unchanged" is proven
   by running the tag's own code beside today's, not by restating its values:
   the tag's file is read with `git show`, compiled to CommonJS and evaluated
   with its imports wired by hand. A module it asks for that is not wired here
   throws, so the comparison can never silently run against today's code. */
const TAG = "archive/pre-reset-2026-10-10";

function tagSource(path: string): string {
  return execFileSync("git", ["show", `${TAG}:${path}`], { encoding: "utf8" });
}

function loadTagModule(path: string, imports: Record<string, unknown> = {}): Record<string, unknown> {
  const { outputText } = ts.transpileModule(tagSource(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loaded = { exports: {} as Record<string, unknown> };
  const wrapped = runInThisContext(`(function (module, exports, require) {\n${outputText}\n})`, {
    filename: `${TAG}:${path}`,
  }) as (m: typeof loaded, e: typeof loaded.exports, r: (id: string) => unknown) => void;
  wrapped(loaded, loaded.exports, (id) => {
    if (id in imports) return imports[id];
    throw new Error(`${TAG}:${path} imports ${id}, which the test did not wire`);
  });
  return loaded.exports;
}

describe("resolveSiteEnv: the truth table", () => {
  const cases: [string, Record<string, string | undefined>, string][] = [
    ["Vercel production", { VERCEL: "1", VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main" }, "production"],
    ["the beta branch on Vercel", { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "beta" }, "beta"],
    ["any other preview branch", { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "reset/website-v2" }, "preview"],
    ["vercel dev", { VERCEL: "1", VERCEL_ENV: "development" }, "development"],
    ["a local build", {}, "development"],
    /* Production wins over the branch name: a beta commit promoted to
       production is production. */
    ["production built from the beta branch", { VERCEL: "1", VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "beta" }, "production"],
    ["override: production", { KH_SITE_ENV: "production" }, "production"],
    ["override: beta", { KH_SITE_ENV: "beta" }, "beta"],
    ["override: preview", { KH_SITE_ENV: "preview" }, "preview"],
    ["override: development, even on Vercel production", { KH_SITE_ENV: "development", VERCEL: "1", VERCEL_ENV: "production" }, "development"],
    ["override beats the missing system variables", { KH_SITE_ENV: "beta", VERCEL: "1" }, "beta"],
    ["an unknown override is ignored, not trusted", { KH_SITE_ENV: "staging" }, "development"],
    ["an unknown override falls through to Vercel's answer", { KH_SITE_ENV: "prod", VERCEL: "1", VERCEL_ENV: "production" }, "production"],
  ];

  it.each(cases)("%s", (_name, vars, expected) => {
    expect(resolveSiteEnv(vars)).toBe(expected);
  });

  /* Without system variables a Vercel build cannot tell beta from production,
     and guessing "development" would ship a beta whose buttons open the
     production store. The build refuses instead, and says how to fix it. */
  it("refuses to guess when Vercel's system variables are switched off", () => {
    expect(() => resolveSiteEnv({ VERCEL: "1" })).toThrow(/system environment variables are off/i);
    expect(() => resolveSiteEnv({ VERCEL: "1", VERCEL_GIT_COMMIT_REF: "beta" })).toThrow(
      /Settings → Environment Variables/,
    );
  });
});

describe("SITE_ENV and the origins it picks", () => {
  it.each([
    [undefined, "development"],
    ["production", "production"],
    ["beta", "beta"],
    ["preview", "preview"],
    ["development", "development"],
    ["staging", "development"],
  ])("KH_SITE_ENV=%s gives SITE_ENV %s", async (value, expected) => {
    const { SITE_ENV } = await loadEnvUnder(value);
    expect(SITE_ENV).toBe(expected);
  });

  it.each([undefined, "production", "preview", "development"])(
    "KH_SITE_ENV=%s links the production hosts",
    async (value) => {
      const env = await loadEnvUnder(value);
      expect(env.MARKETING_ORIGIN).toBe("https://kheelona.com");
      expect(env.STORE_ORIGIN).toBe("https://store.kheelona.com");
    },
  );

  it("a beta build links the beta hosts", async () => {
    const env = await loadEnvUnder("beta");
    expect(env.MARKETING_ORIGIN).toBe("https://betawebsite.kheelona.com");
    expect(env.STORE_ORIGIN).toBe("https://betastore.kheelona.com");
  });

  /* Canonicals, JSON-LD and the sitemap name the production site everywhere,
     so a beta page can never canonicalise to itself. */
  it.each([undefined, "production", "beta", "preview"])(
    "KH_SITE_ENV=%s keeps the canonical origin on production",
    async (value) => {
      const { CANONICAL_ORIGIN } = await loadEnvUnder(value);
      expect(CANONICAL_ORIGIN).toBe("https://kheelona.com");
    },
  );

  it("names exactly the two beta hosts", async () => {
    const { BETA_HOSTS, HOSTS } = await loadEnvUnder(undefined);
    expect(BETA_HOSTS).toEqual(["betawebsite.kheelona.com", "betastore.kheelona.com"]);
    expect(HOSTS).toEqual({
      production: { marketing: "kheelona.com", store: "store.kheelona.com" },
      beta: { marketing: "betawebsite.kheelona.com", store: "betastore.kheelona.com" },
    });
  });

  it("recognises a beta host whatever the port or case", async () => {
    const { isBetaHost } = await loadEnvUnder(undefined);
    for (const host of ["betawebsite.kheelona.com", "betastore.kheelona.com", "BETASTORE.kheelona.com:443"]) {
      expect(isBetaHost(host), host).toBe(true);
    }
    for (const host of ["kheelona.com", "www.kheelona.com", "store.kheelona.com", "localhost:3000", "beta.kheelona.com"]) {
      expect(isBetaHost(host), host).toBe(false);
    }
  });
});

/* `next.config.ts` imports this file by relative path, where Next resolves no
   `@/` alias, and the placeholder guard (task 2.9) imports it from a plain Node
   script with type stripping. Both break the day it gains an import or a
   TypeScript-only construct (an enum, a namespace, a parameter property). */
describe("env.ts stays importable from anywhere", () => {
  const source = readFileSync(join(ROOT, "src/config/env.ts"), "utf8");

  it("has no imports", () => {
    expect(source).not.toMatch(/^\s*import\b/m);
    expect(source).not.toMatch(/\bfrom\s+["']/);
    expect(source).not.toMatch(/\brequire\(/);
  });

  it("loads in plain Node 24 with type stripping, with nothing but the file", () => {
    const script = [
      `const env = await import(${JSON.stringify(join(ROOT, "src/config/env.ts"))});`,
      `process.stdout.write(JSON.stringify([env.SITE_ENV, env.STORE_ORIGIN, env.resolveSiteEnv({ VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "beta" })]));`,
    ].join("\n");
    const out = execFileSync(process.execPath, ["--input-type=module", "--eval", script], {
      encoding: "utf8",
      env: { ...process.env, KH_SITE_ENV: "beta", NODE_OPTIONS: "" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    expect(JSON.parse(out)).toEqual(["beta", "https://betastore.kheelona.com", "beta"]);
  });
});

/* site.ts (task 1.3 owns the STORE_URL line and the MRP constants only). The
   money block is frozen (ADR-013); the host lists move only as architecture
   §15.3 says, and POSTHOG_HOSTS is task 2.6's, so it is not pinned here. */
describe("site.ts in a production build is the tag's site.ts", () => {
  const tagSite = loadTagModule("src/config/site.ts");
  const PARITY = [
    "STORE_URL",
    "PREORDER_HREF",
    "WHATSAPP_SHARE_HREF",
    "GA4_HOSTS",
    "META_PIXEL_HOSTS",
    "INDEXABLE_HOSTS",
  ] as const;

  it.each([undefined, "production"])("KH_SITE_ENV=%s: links and host lists equal the tag's", async (value) => {
    const site = (await loadSiteUnder(value)) as unknown as Record<string, unknown>;
    for (const name of PARITY) {
      expect(site[name], name).toEqual(tagSite[name]);
    }
    expect(site.STORE_URL).toBe("https://store.kheelona.com");
  });

  it("a beta build opens the beta store from every orange button", async () => {
    const site = await loadSiteUnder("beta");
    expect(site.STORE_URL).toBe("https://betastore.kheelona.com");
    expect(site.PREORDER_HREF).toBe("https://betastore.kheelona.com");
  });

  /* GA4 and the Meta Pixel load only on these hosts, so beta stays out of the
     real reports and the ad account's audiences without a line of gate code. */
  it("a beta build keeps the tag's host lists, so GA4 and Meta never load on beta", async () => {
    const site = (await loadSiteUnder("beta")) as unknown as Record<string, unknown>;
    for (const name of ["GA4_HOSTS", "META_PIXEL_HOSTS", "INDEXABLE_HOSTS"]) {
      expect(site[name], name).toEqual(tagSite[name]);
    }
    for (const host of ["betawebsite.kheelona.com", "betastore.kheelona.com"]) {
      expect(site.GA4_HOSTS as readonly string[]).not.toContain(host);
      expect(site.INDEXABLE_HOSTS as readonly string[]).not.toContain(host);
    }
  });

  function moneyBlock(source: string): string {
    const start = source.indexOf("/* ── Money ──");
    const endLine = source.indexOf("export const PRICE_HOLD_LINE");
    expect(start, "money block start not found").toBeGreaterThan(-1);
    expect(endLine, "money block end not found").toBeGreaterThan(start);
    return source.slice(start, source.indexOf("\n", endLine));
  }

  it("leaves the money block byte for byte as the tag has it", () => {
    const today = readFileSync(join(ROOT, "src/config/site.ts"), "utf8");
    expect(moneyBlock(today)).toBe(moneyBlock(tagSource("src/config/site.ts")));
  });

  it.each([undefined, "production", "beta"])("KH_SITE_ENV=%s: every money value equals the tag's", async (value) => {
    const site = (await loadSiteUnder(value)) as unknown as Record<string, unknown>;
    const names = [...moneyBlock(tagSource("src/config/site.ts")).matchAll(/^export const (\w+)/gm)].map(
      (m) => m[1],
    );
    expect(names.length).toBeGreaterThan(10);
    for (const name of names) {
      expect(site[name], name).toEqual(tagSite[name]);
    }
    const format = site.formatInr as (paise: number) => string;
    const tagFormat = tagSite.formatInr as (paise: number) => string;
    for (const paise of [0, 49_900, 450_000, 799_900, 12_345_678]) {
      expect(format(paise)).toBe(tagFormat(paise));
    }
  });

  /* D034: MRP ₹7,999 inclusive of all taxes, its own constant (ADR-004), so the
     product declarations never borrow the full price's name for a legal figure. */
  it("adds the MRP after the money block, in paise, with its one rupee string", async () => {
    const site = (await loadSiteUnder(undefined)) as unknown as Record<string, unknown>;
    expect(site.MRP_AMOUNT_PAISE).toBe(799_900);
    expect(site.MRP_PRICE).toBe("₹7,999");
    expect(site.MRP_PRICE).toBe((site.formatInr as (paise: number) => string)(799_900));
    const today = readFileSync(join(ROOT, "src/config/site.ts"), "utf8");
    expect(today.indexOf("export const MRP_AMOUNT_PAISE")).toBeGreaterThan(
      today.indexOf("export const PRICE_HOLD_LINE"),
    );
  });
});

/* host.ts is frozen apart from one authorised line (D048): betastore is a store
   host. Everything else it decides, on every host, must be what the tag decides. */
describe("host.ts in a production build routes exactly as the tag's", () => {
  const tagSite = loadTagModule("src/config/site.ts");
  const HOSTS_SEEN = [
    "kheelona.com",
    "www.kheelona.com",
    "KHEELONA.COM",
    "store.kheelona.com",
    "STORE.KHEELONA.COM",
    "store.localhost:3000",
    "localhost:3000",
    "127.0.0.1:3456",
    "betawebsite.kheelona.com",
    "website-hdn2.vercel.app",
  ];
  const PATHS = [
    "/",
    "/store",
    "/store/",
    "/store/thanks",
    "/store/e/ideabaaz",
    "/thanks",
    "/products/kheelu",
    "/refund",
    "/ingest/e/",
    "/ingest-assets/static/recorder.js",
    "/ingestion-report",
  ];
  const SEARCHES = ["", "?utm_source=meta", "?ref=KH-A2B3-C4D5&t=1790000000000.AbCdEfGh12345678"];

  async function bothHostModules(value: string | undefined) {
    const today = await loadUnder(value, () => import("@/lib/store/host"));
    const thanks = await import("@/lib/store/thanks-session");
    const tag = loadTagModule("src/lib/store/host.ts", {
      "@/config/site": tagSite,
      "./thanks-session": thanks,
    }) as unknown as typeof today;
    return { today, tag };
  }

  it("imports a thanks-session that is the tag's byte for byte", () => {
    expect(readFileSync(join(ROOT, "src/lib/store/thanks-session.ts"), "utf8")).toBe(
      tagSource("src/lib/store/thanks-session.ts"),
    );
  });

  it.each([undefined, "production"])("KH_SITE_ENV=%s: every host, path and query routes as the tag routes it", async (value) => {
    const { today, tag } = await bothHostModules(value);
    let compared = 0;
    for (const host of HOSTS_SEEN) {
      expect(today.isStoreHost(host), host).toBe(tag.isStoreHost(host));
      for (const path of PATHS) {
        for (const search of SEARCHES) {
          expect(today.routeForHost(host, path, search), `${host}${path}${search}`).toEqual(
            tag.routeForHost(host, path, search),
          );
          compared += 1;
        }
      }
    }
    expect(compared).toBe(HOSTS_SEEN.length * PATHS.length * SEARCHES.length);
  });

  it("differs from the tag on one host only: betastore serves the store (D048)", async () => {
    const { today, tag } = await bothHostModules("production");
    expect(tag.isStoreHost("betastore.kheelona.com")).toBe(false);
    expect(today.isStoreHost("betastore.kheelona.com")).toBe(true);
    expect(today.routeForHost("betastore.kheelona.com", "/")).toEqual(tag.routeForHost("store.kheelona.com", "/"));
  });
});

/* purchase_confirmed is the conversion goal and the revenue source (D031). The
   only authorised change (D048, N4) is an `env` stamp on builds that are not
   production; production's payload must stay the tag's, key for key. */
describe("purchase_confirmed in a production build is the tag's payload", () => {
  const SALES = [
    { order_ref: "KH-KZYJ-PEHT", tier: "launch", amount_paise: 49_900, ph_distinct_id: null, utm: null, paid_at: "2026-09-20T10:00:00.000Z" },
    { order_ref: "KH-A2B3-C4D5", tier: "full", amount_paise: 799_900, ph_distinct_id: "0199-abc", utm: { utm_source: "meta", utm_campaign: "2026-10-launch" }, paid_at: null },
  ] as unknown as PreorderRow[];

  async function bothServerModules(value: string | undefined) {
    const today = await loadUnder(value, () => import("@/lib/store/posthog-server"));
    const tag = loadTagModule("src/lib/store/posthog-server.ts", {
      "posthog-node": { PostHog: class {} },
      "@/config/site": loadTagModule("src/config/site.ts"),
    }) as unknown as typeof today;
    return { today, tag };
  }

  it("is deep-equal to the tag's for every sale shape", async () => {
    const { today, tag } = await bothServerModules("production");
    for (const sale of SALES) {
      expect(today.purchaseConfirmedEvent(sale), sale.order_ref).toEqual(tag.purchaseConfirmedEvent(sale));
    }
  });

  it.each(["beta", "preview", "development"])("on %s it is the tag's payload plus the env stamp, nothing else", async (value) => {
    const { today, tag } = await bothServerModules(value);
    for (const sale of SALES) {
      const expected = tag.purchaseConfirmedEvent(sale);
      expect(today.purchaseConfirmedEvent(sale), sale.order_ref).toEqual({
        ...expected,
        properties: { ...expected.properties, env: value },
      });
    }
  });
});
