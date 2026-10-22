import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { STORE_ORIGIN } from "@/config/env";
import { REDIRECTS } from "@/config/redirects";
import { AHREFS_ANALYTICS_KEY, FULL_AMOUNT_PAISE, LAUNCH_AMOUNT_PAISE } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { IMMUTABLE_SOURCES, SITE_IMAGE_ORIGINS, withSiteImageOrigins } from "@/lib/site-pages/headers";
import { applyOffer } from "@/lib/site-pages/offer-swap";
import { renderSitePage, robotsTag, type SitePageContext } from "@/lib/site-pages/transform";
import { securityHeaders } from "@/lib/security-headers";
import { CTA_IDS } from "@/lib/tracking/cta";
import { headElements, parseAttributes, splitDocument } from "@/lib/site-pages/document";
import { routeOf } from "../scripts/site/prepare.mjs";

/* The redesign served as the marketing site (2026-10-22): the transform every page goes through, the live offer in
 * both modes over every page the redesign builds, the headers, and the redirect map the redesign asks for. The pages
 * are the redesign's committed build output (redesign/<route>/index.html, written by tools/build-pages.py), which has
 * the same words as the deployable redesign/dist. */

const ROOT = process.cwd();
const REDESIGN = join(ROOT, "redesign");

function builtPages(): { path: string; html: string }[] {
  const out: { path: string; html: string }[] = [];
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (!["pages", "tools", "dist", "assets", "seo", ".cache", "node_modules"].includes(name)) walk(full);
      } else if (name === "index.html") {
        out.push({ path: routeOf(relative(REDESIGN, full)), html: readFileSync(full, "utf8") });
      }
    }
  };
  walk(REDESIGN);
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

const PAGES = builtPages();
const LEGAL = ["/terms", "/refund", "/shipping", "/privacy"];
const TOKEN = buildOffer("token");
const FULL = buildOffer("full");

const ctx = (over: Partial<SitePageContext> = {}): SitePageContext => ({
  path: "/safety",
  env: "production",
  storeOrigin: "https://store.kheelona.com",
  offer: TOKEN,
  trackingSrc: "/_site/_kh/tracking-ABCDEFGH.js",
  ahrefsKey: AHREFS_ANALYTICS_KEY,
  ...over,
});

const page = (path: string) => {
  const p = PAGES.find((x) => x.path === path);
  if (!p) throw new Error(`the redesign builds no ${path}`);
  return p.html;
};

/** The page's text with the legal pages' own body left out: their policy text describes both modes on purpose. */
function sellingText(path: string, html: string): string {
  if (!LEGAL.includes(path)) return html;
  const main = /<main\b[\s\S]*?<\/main>/.exec(html);
  return main ? html.replace(main[0], "") : html;
}

describe("the redesign's pages", () => {
  it("are all here: the 13 marketing routes and the stories", () => {
    const paths = PAGES.map((p) => p.path);
    for (const p of ["/", "/products/kheelu", "/safety", "/setup", "/ai-toys-for-kids-in-india", "/stories", "/team", "/contact", "/privacy", "/terms", "/refund", "/shipping"]) {
      expect(paths).toContain(p);
    }
    expect(paths.filter((p) => p.startsWith("/stories/")).length).toBeGreaterThanOrEqual(4);
  });

  it("maps dist files to routes", () => {
    expect(routeOf("index.html")).toBe("/");
    expect(routeOf("products/kheelu/index.html")).toBe("/products/kheelu");
    expect(routeOf("stories/a.html")).toBe("/stories/a");
  });
});

describe("robots", () => {
  it("says nothing on production and noindex everywhere else; the 404 always noindex", () => {
    expect(robotsTag("production")).toBe("");
    for (const env of ["beta", "preview", "development"] as const) expect(robotsTag(env)).toContain('content="noindex"');
    expect(robotsTag("production", true)).toContain("noindex");
  });

  it("replaces the marker, or the prototype noindex when the page has no marker", () => {
    const marked = '<head><!--robots--><link rel="canonical" href="x"></head><body></body>';
    expect(renderSitePage(marked, ctx({ env: "beta" }))).toContain('<meta name="robots" content="noindex"><link');
    expect(renderSitePage(marked, ctx())).not.toContain("robots");
    for (const { path, html } of PAGES) {
      const prod = renderSitePage(html, ctx({ path }));
      expect(prod, path).not.toMatch(/<meta name="robots"/);
      expect(renderSitePage(html, ctx({ path, env: "beta" })).match(/<meta name="robots"/g), path).toHaveLength(1);
    }
  });
});

describe("the store link", () => {
  it("opens this build's store and is unchanged on production", () => {
    const html = page("/");
    expect(renderSitePage(html, ctx({ path: "/" }))).toContain('href="https://store.kheelona.com"');
    const beta = renderSitePage(html, ctx({ path: "/", storeOrigin: "https://betastore.kheelona.com" }));
    expect(beta).not.toMatch(/href="https:\/\/store\.kheelona\.com/);
    expect(beta).toContain('href="https://betastore.kheelona.com"');
    expect(STORE_ORIGIN).toMatch(/^https:\/\/(beta)?store\.kheelona\.com$/);
  });
});

describe("CTA values (tracking inventory §6; src/lib/tracking/cta.ts)", () => {
  it("the dock reports hero on Home and sticky-bar in the server HTML everywhere else", () => {
    const dock = (html: string) => /<a\b[^>]*id="hero-cta"[^>]*>/.exec(html)?.[0] ?? "";
    expect(dock(renderSitePage(page("/"), ctx({ path: "/" })))).toContain('cta="hero"');
    for (const { path, html } of PAGES.filter((p) => p.path !== "/")) {
      expect(dock(renderSitePage(html, ctx({ path }))), path).toContain('cta="sticky-bar"');
    }
  });

  it("every page reports a finale, and only values the registry knows", () => {
    for (const { path, html } of PAGES) {
      const out = renderSitePage(html, ctx({ path }));
      expect(out, path).toContain('data-ph-capture-attribute-cta="finale"');
      for (const [, v] of out.matchAll(/data-ph-capture-attribute-cta="([^"]+)"/g)) {
        expect(CTA_IDS as readonly string[], `${path}: ${v}`).toContain(v);
      }
    }
  });
});

describe("tracking", () => {
  it("puts Ahrefs in the head (not on beta) and the shell last in the body, with ViewContent on Home and the product page", () => {
    for (const { path, html } of PAGES) {
      const out = renderSitePage(html, ctx({ path }));
      const head = out.slice(0, out.indexOf("</head>"));
      expect(head, path).toContain(`data-key="${AHREFS_ANALYTICS_KEY}"`);
      expect(out.match(/data-kh-tracking/g), path).toHaveLength(1);
      expect(out.indexOf("data-kh-tracking")).toBeGreaterThan(out.indexOf("</main>"));
      expect(out.includes("data-view-content-paise"), path).toBe(path === "/" || path === "/products/kheelu");
      expect(renderSitePage(html, ctx({ path, env: "beta" })), path).not.toContain("analytics.ahrefs.com");
    }
    expect(renderSitePage(page("/"), ctx({ path: "/", offer: FULL }))).toContain(`data-view-content-paise="${FULL_AMOUNT_PAISE}"`);
  });

  it("uses the markers when the page has them", () => {
    const out = renderSitePage("<head><!--tracking-head--></head><body><!--tracking-body--><p>x</p></body>", ctx({ path: "/" }));
    expect(out).toMatch(/^<head><script src="https:\/\/analytics\.ahrefs\.com/);
    expect(out).toMatch(/<body><script type="module"[^>]*data-kh-tracking data-view-content-paise="499900"><\/script><p>x/);
  });
});

describe("the live offer", () => {
  const LEFTOVERS = [TOKEN.prices.token, TOKEN.prices.balance, "first 500", "First 500"];

  it("token mode is the redesign as built, with the schema price from the checkout's constant", () => {
    for (const { path, html } of PAGES) expect(applyOffer(html, TOKEN), path).toBe(html);
    expect(applyOffer(page("/products/kheelu"), TOKEN)).toContain(`"price":${LAUNCH_AMOUNT_PAISE / 100}`);
  });

  it("every amount the redesign prints is one of the checkout's", () => {
    const known = new Set(Object.values(TOKEN.prices));
    for (const { path, html } of PAGES) {
      for (const [amount] of html.matchAll(/₹[0-9]{1,3}(?:,[0-9]{2,3})*/g)) expect(known, `${path}: ${amount}`).toContain(amount);
    }
  });

  it("full mode leaves no token amount or first-500 line outside the legal pages' own text", () => {
    for (const { path, html } of PAGES) {
      const out = sellingText(path, renderSitePage(html, ctx({ path, offer: FULL })));
      for (const word of LEFTOVERS) expect(out.includes(word), `${path} still says "${word}" in full mode`).toBe(false);
      expect(out, path).not.toMatch(/₹499/);
      for (const [, encoded] of out.matchAll(/https:\/\/wa\.me\/\?text=([^"&]+)/g)) {
        expect(decodeURIComponent(encoded), path).not.toContain(TOKEN.prices.token);
      }
    }
    const product = renderSitePage(page("/products/kheelu"), ctx({ path: "/products/kheelu", offer: FULL }));
    expect(product).toContain(`"price":${FULL_AMOUNT_PAISE / 100}`);
    expect(product).toContain("₹7,999 in total, paid in full when you order.");
  });

  it("delivery stays mid-November everywhere", () => {
    for (const { path, html } of PAGES) expect(html, path).not.toMatch(/\b20 October\b|\bOctober 20\b(?!\d)|2026-10-20/);
    expect(TOKEN.delivery).toBe("Deliveries start mid-November");
  });
});

describe("the machine files (redesign/sitemap.xml, robots.txt, llms.txt, pricing.md)", () => {
  const file = (name: string) => readFileSync(join(REDESIGN, name), "utf8");

  it("robots.txt lets search and answer engines in and keeps Bytespider out", () => {
    const robots = file("robots.txt");
    for (const agent of ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "CCBot"]) {
      expect(robots, agent).toMatch(new RegExp(`User-Agent: ${agent.replace("*", "\\*")}\\nAllow: /`, "i"));
    }
    expect(robots).toMatch(/User-Agent: Bytespider\nDisallow: \//i);
    expect(robots).toContain("Sitemap: https://kheelona.com/sitemap.xml");
  });

  it("sitemap.xml lists exactly the pages the redesign builds, canonical and slash-less", () => {
    const locs = [...file("sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).sort();
    const pages = PAGES.map((p) => `https://kheelona.com${p.path === "/" ? "" : p.path}`).sort();
    expect(locs).toEqual(pages);
  });

  it("llms.txt and pricing.md follow the live offer: no token amount or first-500 line in full mode", () => {
    for (const name of ["llms.txt", "pricing.md"]) {
      const text = file(name);
      expect(applyOffer(text, TOKEN), name).toBe(text);
      const full = applyOffer(text, FULL);
      for (const word of [TOKEN.prices.token, TOKEN.prices.balance, "first 500"]) {
        expect(full.includes(word), `${name} still says "${word}" in full mode`).toBe(false);
      }
      expect(full, name).toContain(FULL.prices.full);
      expect(full, name).toContain("Deliveries start mid-November");
    }
  });
});

describe("headers", () => {
  it("adds the redesign's two image origins to img-src and changes nothing else", () => {
    const before = securityHeaders();
    const after = withSiteImageOrigins(before);
    expect(after.map((h) => h.key)).toEqual(before.map((h) => h.key));
    const csp = (hs: { key: string; value: string }[]) => hs.find((h) => h.key.startsWith("Content-Security-Policy"))!.value;
    const directives = (v: string) => Object.fromEntries(v.split(/;\s*/).map((d) => [d.split(" ")[0], d]));
    const [b, a] = [directives(csp(before)), directives(csp(after))];
    for (const key of Object.keys(b)) if (key !== "img-src") expect(a[key]).toBe(b[key]);
    expect(a["img-src"]).toBe(`${b["img-src"]} ${SITE_IMAGE_ORIGINS.join(" ")}`);
    expect(SITE_IMAGE_ORIGINS).toEqual(["https://api.kheelona.com", "https://i.ytimg.com"]);
  });

  it("caches exactly the hashed files for a year, as the redesign's asset manifest says", () => {
    const manifestRule = new RegExp("^/assets/.+\\.[0-9a-f]{10}\\.[a-z0-9]+$|^/assets/js/m/.+\\.[A-Z0-9]{8}\\.js$");
    const asRegex = (source: string) =>
      new RegExp(`^${source.replace(/:file\((.+)\)$/, "($1)")}$`);
    const rules = IMMUTABLE_SOURCES.filter((s) => s.startsWith("/assets/")).map(asRegex);
    const samples = [
      "/assets/css/site.5fb7f860f0.css",
      "/assets/img/guide/ira-01-story-on-the-bed.418053224c.webp",
      "/assets/js/m/team3d.D5URZ2FJ.js",
      "/assets/audio/tap.m4a",
      "/assets/img/myra-01-breakfast-why.webp",
      "/assets/js/pages.js",
    ];
    for (const url of samples) expect(rules.some((r) => r.test(url)), url).toBe(manifestRule.test(url));
  });
});

describe("the 404 document", () => {
  it("splits a page and turns its head into elements, without its charset and viewport", () => {
    const html = page("/contact");
    const doc = splitDocument(html);
    expect(doc.htmlAttrs.lang).toBe("en-IN");
    expect(doc.bodyAttrs.class).toMatch(/^page/);
    const tags = headElements(doc.head).map((el) => (el as { type: string }).type);
    expect(tags).toContain("title");
    expect(tags).toContain("script");
    expect(tags.filter((t) => t === "meta").length).toBeGreaterThan(5);
    expect(parseAttributes('a="x &amp; y" defer data-k=\'1\'')).toEqual({ a: "x & y", defer: "", "data-k": "1" });
  });
});

describe("redirects (redesign/pages/_shell/redirects.json)", () => {
  it("serves every rule the redesign asks for, to the same destination", () => {
    const map = JSON.parse(readFileSync(join(REDESIGN, "pages", "_shell", "redirects.json"), "utf8")) as {
      redirects: { source: string; destination: string }[];
    };
    const apex = REDIRECTS.filter((r) => !r.has);
    for (const rule of map.redirects) {
      const ours = apex.find((r) => r.source === rule.source);
      expect(ours, rule.source).toBeDefined();
      expect(ours!.destination, rule.source).toBe(rule.destination);
      expect(ours!.permanent).toBe(true);
    }
    /* And a www twin of each, straight to the apex (one hop). */
    for (const rule of map.redirects) {
      expect(REDIRECTS.some((r) => r.has && r.source === rule.source && r.destination === `https://kheelona.com${rule.destination}`), rule.source).toBe(true);
    }
  });
});
