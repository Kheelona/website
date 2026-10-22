import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { stringify } from "node:querystring";
import { execFileSync } from "node:child_process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { getPathMatch } from "next/dist/shared/lib/router/utils/path-match";
import { modifyRouteRegex } from "next/dist/lib/redirect-status";
import { matchHas, prepareDestination } from "next/dist/shared/lib/router/utils/prepare-destination";
import { formatUrl } from "next/dist/shared/lib/router/utils/format-url";

/**
 * Every legacy URL answers in ONE hop (brief §9.2, ADR-012, architecture §9.4).
 *
 * A hop simulator, not a grep. It resolves each request the way the deployed
 * app does, in Next's order (node_modules/next/dist/docs/.../redirects.md:
 * redirects before the filesystem; the proxy after redirects):
 *
 *   1. the redirects `next.config.ts` really returns, matched by NEXT'S OWN
 *      matcher (`getPathMatch` with the `(?:/)?$` and `/_next` guard that
 *      `modifyRouteRegex` adds, `matchHas` for the host condition,
 *      `prepareDestination` for the Location), exactly as
 *      next/dist/server/lib/router-utils/{filesystem,resolve-routes}.js do;
 *   2. then the real `src/proxy.ts`, driven with a real NextRequest, for every
 *      path its matcher covers (the trailing-slash redirect, the apex `/store`
 *      redirect, the confirmation claim);
 *   3. anything left is served.
 *
 * It follows each chain to the end, so a rule that lands on another rule, or on
 * the proxy's trailing-slash redirect, shows up as two hops.
 */

const ROOT = process.cwd();
const QUERY = "?utm_source=qa-redirect";
const REDIRECT_CODES = new Set([301, 302, 303, 307, 308]);

type Rule = {
  source: string;
  destination: string;
  permanent?: boolean;
  has?: { type: string; value?: string; key?: string }[];
  missing?: { type: string; value?: string; key?: string }[];
};
type Hop = { status: number; to: URL; by: string };

async function loadBuild(siteEnv: string | undefined) {
  vi.resetModules();
  vi.stubEnv("KH_SITE_ENV", siteEnv);
  const nextConfig = (await import("../../next.config")).default;
  const { proxy, config: proxyConfig } = await import("@/proxy");
  const rules = ((await nextConfig.redirects!()) as Rule[]).map((rule, index) => ({
    rule,
    index,
    match: getPathMatch(rule.source, {
      strict: true,
      removeUnnamedParams: true,
      regexModifier: (regex) => modifyRouteRegex(regex, ["/_next"]),
    }),
  }));
  const proxyMatcher = new RegExp(`^${proxyConfig.matcher[0]}$`);

  /** One request: the hop it answers with, or null when it is served. */
  function step(url: URL): Hop | null {
    const query = Object.fromEntries(url.searchParams);
    const request = { headers: { host: url.host } } as unknown as Parameters<typeof matchHas>[0];
    for (const { rule, index, match } of rules) {
      let params = match(url.pathname);
      if (params && (rule.has || rule.missing)) {
        const fromHas = matchHas(request, query, rule.has as never, rule.missing as never);
        params = fromHas ? { ...params, ...fromHas } : false;
      }
      if (!params) continue;
      const { parsedDestination } = prepareDestination({
        appendParamsToQuery: false,
        destination: rule.destination,
        params,
        query,
      });
      const search = stringify(parsedDestination.query as Record<string, string>);
      delete (parsedDestination as { query?: unknown }).query;
      parsedDestination.search = search ? `?${search}` : "";
      return {
        status: rule.permanent ? 308 : 307,
        to: new URL(formatUrl(parsedDestination), url),
        by: `redirect #${index} ${rule.source}${rule.has ? ` (host ${rule.has[0].value})` : ""}`,
      };
    }
    if (proxyMatcher.test(url.pathname)) {
      const response = proxy(new NextRequest(url, { headers: { host: url.host } }));
      if (REDIRECT_CODES.has(response.status)) {
        return { status: response.status, to: new URL(response.headers.get("location")!, url), by: "proxy" };
      }
    }
    return null;
  }

  /** Follow a URL to where it is served. */
  function chain(start: string): { hops: Hop[]; served: URL } {
    const hops: Hop[] = [];
    let url = new URL(start);
    for (let i = 0; i < 6; i += 1) {
      const request = new URL(url);
      request.hash = "";
      const hop = step(request);
      if (!hop) return { hops, served: url };
      hops.push(hop);
      url = hop.to;
    }
    throw new Error(`${start} never settles: ${hops.map((h) => h.to.href).join(" -> ")}`);
  }

  return { chain, rules: rules.map((r) => r.rule) };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

/* Test plan §8: one sample per legacy family, with the url-map target. */
const LEGACY: [string, string][] = [
  ["/stories/why-three-to-six-matters-most", "/stories/why-three-to-six-are-the-years-that-matter-most"],
  ["/products/lumi", "/products/kheelu"],
  ["/product-page/kheelu-plush", "/products/kheelu"],
  ["/product-page", "/products/kheelu"],
  ["/product/lumi", "/products/kheelu"],
  ["/shop", "/products/kheelu"],
  ["/category/all-products", "/products/kheelu"],
  ["/category/toys", "/products/kheelu"],
  ["/accessibility-statement", "/products/kheelu"],
  ["/post/a-wix-post", "/stories"],
  ["/terms-conditions", "/terms"],
  ["/privacy-policy", "/privacy"],
  ["/for-the-parents", "/stories"],
  ["/lumi", "/products/kheelu"],
  ["/faq", "/products/kheelu#faq"],
  ["/sitemap", "/sitemap.xml"],
  ["/blog", "/stories"],
  ["/blog/a/b", "/stories"],
  ["/about", "/team"],
  ["/community", "/stories"],
  ["/login", "/"],
  ["/signup", "/"],
  ["/account/orders/1", "/"],
  ["/cart", "/products/kheelu"],
  ["/checkout/step-2", "/products/kheelu"],
  /* New in the reset (D041, url-map §4d, strategy §4.2). */
  ["/playos", "/products/kheelu"],
  ["/stories/brain-development-toys-for-a-2-year-old", "/stories/learning-toys-for-a-three-year-old"],
  ["/kheelu", "/products/kheelu"],
  ["/products", "/products/kheelu"],
  ["/careers", "/team"],
  ["/jobs", "/team"],
  ["/pricing", "/products/kheelu#offer"],
  /* D053 (task 6.5): the 3-6-9-12 article leaves the journal, to its hub topic. */
  ["/stories/screen-time-rules-parents-swear-by", "/stories#screen-time"],
];

/* Each sample plain, with a trailing slash, and with a campaign query that must
   survive (test plan §8). */
function variants(path: string): { request: string; query: string }[] {
  return [
    { request: path, query: "" },
    { request: `${path}/`, query: "" },
    { request: `${path}${QUERY}`, query: QUERY },
  ];
}

function expected(origin: string, target: string, query: string): string {
  const url = new URL(target, origin);
  url.search = query;
  return url.href;
}

describe("every legacy family is one hop, on every host that serves the site", () => {
  const HOSTS: [string, string | undefined, string][] = [
    /* [request host, KH_SITE_ENV, the origin the target must be on] */
    ["kheelona.com", "production", "https://kheelona.com"],
    ["kheelona.com", undefined, "https://kheelona.com"],
    /* `www` reaches these rules once the founder switches it from Vercel's
       domain redirect to "serve this project" (Gate B runbook). */
    ["www.kheelona.com", "production", "https://kheelona.com"],
    ["betawebsite.kheelona.com", "beta", "https://betawebsite.kheelona.com"],
    ["www.kheelona.com", "beta", "https://kheelona.com"],
  ];

  it.each(HOSTS)("%s (KH_SITE_ENV=%s)", async (host, siteEnv, origin) => {
    const { chain } = await loadBuild(siteEnv);
    for (const [path, target] of LEGACY) {
      for (const { request, query } of variants(path)) {
        const { hops, served } = chain(`https://${host}${request}`);
        const route = `${host}${request}: ${hops.map((h) => `${h.status} ${h.to.href} [${h.by}]`).join(" -> ")}`;
        expect(hops.length, route).toBe(1);
        expect(hops[0].status, route).toBe(308);
        expect(served.href, route).toBe(expected(origin, target, query));
      }
    }
  });

  it("exercises every rule in the table, so a rule cannot hide from this test", async () => {
    const { chain, rules } = await loadBuild("production");
    const used = new Set<string>();
    const extra = ["/team", "/team/", "/", "/products/kheelu/", "/store/x", "/store", "/product/lumi.png"];
    for (const host of ["kheelona.com", "www.kheelona.com"]) {
      for (const path of [...LEGACY.map(([p]) => p), ...extra]) {
        for (const hop of chain(`https://${host}${path}`).hops) used.add(hop.by);
      }
    }
    const unused = rules
      .map((rule, index) => `redirect #${index} ${rule.source}${rule.has ? ` (host ${rule.has[0].value})` : ""}`)
      .filter((label) => !used.has(label));
    expect(unused, "rules no sample reaches").toEqual([]);
  });
});

describe("the rest of the URL plan", () => {
  it("strips a trailing slash in one hop and keeps the query", async () => {
    const { chain } = await loadBuild("production");
    for (const host of ["kheelona.com", "www.kheelona.com"]) {
      const { hops, served } = chain(`https://${host}/team/?utm_source=x`);
      expect(hops.length, host).toBe(1);
      expect(served.href, host).toBe("https://kheelona.com/team?utm_source=x");
    }
  });

  /* PostHog ingests on `/e/`, `/s/` and `/i/` WITH the slash (§8.39), on the
     hosts where pages render. No rule may touch them there. */
  it("leaves PostHog's ingestion paths alone on the hosts that render pages", async () => {
    for (const [host, siteEnv] of [["kheelona.com", "production"], ["store.kheelona.com", "production"], ["betawebsite.kheelona.com", "beta"], ["betastore.kheelona.com", "beta"]] as const) {
      const { chain } = await loadBuild(siteEnv);
      for (const path of ["/ingest/e/", "/ingest/s/", "/ingest-assets/static/recorder.js"]) {
        expect(chain(`https://${host}${path}`).hops, `${host}${path}`).toEqual([]);
      }
    }
  });

  it("sends the marketing host's /store paths to its own store in one hop", async () => {
    const cases: [string, string | undefined, string][] = [
      ["kheelona.com", "production", "https://store.kheelona.com"],
      ["betawebsite.kheelona.com", "beta", "https://betastore.kheelona.com"],
      ["www.kheelona.com", "production", "https://store.kheelona.com"],
    ];
    for (const [host, siteEnv, store] of cases) {
      const { chain } = await loadBuild(siteEnv);
      for (const [path, target] of [["/store", "/"], ["/store/x", "/x"], [`/store/x${QUERY}`, `/x${QUERY}`]]) {
        const { hops, served } = chain(`https://${host}${path}`);
        expect(hops.length, `${host}${path}`).toBe(1);
        expect(served.href, `${host}${path}`).toBe(new URL(target, store).href);
      }
    }
  });

  /* Recorded, not hidden: on the apex, `/store/x/` meets the frozen proxy's
     trailing-slash redirect before its host rule (src/proxy.ts:47-58), so it
     takes two hops, exactly as at the tag. */
  it("records the one frozen two-hop path: a trailing slash on the apex's /store", async () => {
    const { chain } = await loadBuild("production");
    const { hops, served } = chain("https://kheelona.com/store/x/");
    expect(hops.map((h) => h.by)).toEqual(["proxy", "proxy"]);
    expect(served.href).toBe("https://store.kheelona.com/x");
  });

  /* Every file in public/, and a file under each folder a dot-excluding rule covers: /product/ (public/product/lumi.png
     until task 6.3 deleted it with the old pages) and /category/, so the [^.]+ rules stay proven with no such folder. */
  it("never redirects a public/ file on the hosts that serve it (the [^.]+ guard)", async () => {
    const files = readdirSync(join(ROOT, "public"), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => `/${relative(join(ROOT, "public"), join(entry.parentPath, entry.name)).split(sep).join("/")}`);
    expect(files).toContain("/og.png");
    expect(files.length).toBeGreaterThan(10);
    for (const [host, siteEnv] of [["kheelona.com", "production"], ["betawebsite.kheelona.com", "beta"]] as const) {
      const { chain } = await loadBuild(siteEnv);
      for (const path of ["/product/lumi.png", "/category/x.png", ...files, "/llms.txt", "/pricing.md", "/sitemap.xml"]) {
        expect(chain(`https://${host}${path}`).hops, `${host}${path}`).toEqual([]);
      }
    }
  });

  /* On www a file moves to the same file on the apex, one hop. */
  it("moves a www file to the same apex file in one hop", async () => {
    const { chain } = await loadBuild("production");
    const { hops, served } = chain("https://www.kheelona.com/og.png");
    expect(hops.length).toBe(1);
    expect(served.href).toBe("https://kheelona.com/og.png");
  });

  /* D041 drops /playos. Redirects run before the filesystem, so the 308 wins
     while the old page file still exists (task 6.3 deletes the folder, B2b). */
  it("sends /playos to /products/kheelu in one hop, page file or not", async () => {
    const { chain } = await loadBuild("production");
    const { hops, served } = chain("https://kheelona.com/playos");
    expect(hops.length).toBe(1);
    expect(served.pathname).toBe("/products/kheelu");
    if (existsSync(join(ROOT, "src/app/(site)/playos/page.tsx"))) {
      expect(hops[0].by).toMatch(/^redirect #\d+ \/playos$/);
    }
  });

  it("serves every target: each lands on a route file in src/app", async () => {
    const targets = new Set(LEGACY.map(([, target]) => new URL(target, "https://kheelona.com").pathname));
    for (const target of targets) {
      expect(routeFileFor(target), target).not.toBeNull();
    }
  });
});

/* The 24 rules of the tag's next.config.ts (url-map §4b), unchanged and in
   their order, now read from the table. */
describe("the tag's 24 redirects are all still there, unchanged", () => {
  it("keeps every one, in order, with the same destination and status", async () => {
    const tagConfig = execFileSync("git", ["show", "archive/pre-reset-2026-10-10:next.config.ts"], {
      encoding: "utf8",
    });
    const tagRules = [
      ...tagConfig.matchAll(
        /\{\s*(?:\/\/[^\n]*\n\s*)?source:\s*"([^"]+)",\s*destination:\s*"([^"]+)",\s*permanent:\s*(true|false),?\s*\}/g,
      ),
    ].map((m) => ({ source: m[1], destination: m[2], permanent: m[3] === "true" }));
    expect(tagRules.length).toBe(24);

    const { rules } = await loadBuild("production");
    const apex = rules.filter((r) => !r.has && !r.missing);
    const positions = tagRules.map((tagRule) =>
      apex.findIndex(
        (r) =>
          r.source === tagRule.source && r.destination === tagRule.destination && r.permanent === tagRule.permanent,
      ),
    );
    expect(positions.filter((p) => p < 0), "missing or changed tag rules").toEqual([]);
    expect([...positions].sort((a, b) => a - b), "tag rules out of order").toEqual(positions);
  });
});

/** The route file a path is served by, or null. Since 2026-10-22 every marketing page is the redesign's built page
 *  (redesign/<path>/index.html), served by the one marketing route; the machine files have their own route handlers. */
function routeFileFor(path: string): string | null {
  const own = join(ROOT, "src/app", path, "route.ts");
  if (path.includes(".") && existsSync(own)) return own;
  const route = join(ROOT, "src/app/(site)/[[...path]]/route.ts");
  const page = join(ROOT, "redesign", path, "index.html");
  return existsSync(route) && existsSync(page) ? page : null;
}
