import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, nodeGet, requiresServer, test, type NodeResponse } from "./support/fixtures";
import { ORIGINS, PORT, TARGET } from "./support/env";
import { NOT_FOUND_PATH } from "./support/routes";
import { ROOT, listFiles } from "./support/repo";

/* The redirect matrix (task 1.1; test plan §8, url-map §4, architecture §9.4, lessons §1 and §6).
 *
 * Every legacy URL answers one permanent redirect (308) straight to its final URL, which answers
 * 200: never a chain, never a 404. The query string survives every redirect. Assets in public/ are
 * never shadowed by a redirect. A trailing slash is one 308 to the bare path (query kept), the
 * marketing host's /store/* is one 308 to the store host, and an unknown URL answers 404 with a
 * server-rendered page (never the empty __next_error__ shell). On L the hosts are given by Host
 * header from Node, one request per hop. The rules added by task 1.3 (D041 and the www twins) are
 * checked once src/config/redirects.ts exists; until then they print as pending.
 */

type Row = { from: string; to: string; host?: string };

/** url-map §4b: the 24 existing rules (sources as the test plan's examples). */
const EXISTING: Row[] = [
  { from: "/stories/why-three-to-six-matters-most", to: "/stories/why-three-to-six-are-the-years-that-matter-most" },
  { from: "/products/lumi", to: "/products/kheelu" },
  { from: "/product-page/x", to: "/products/kheelu" },
  { from: "/product/x", to: "/products/kheelu" },
  { from: "/shop", to: "/products/kheelu" },
  { from: "/category/all-products", to: "/products/kheelu" },
  { from: "/category/toys", to: "/products/kheelu" },
  { from: "/accessibility-statement", to: "/products/kheelu" },
  { from: "/post/x", to: "/stories" },
  { from: "/terms-conditions", to: "/terms" },
  { from: "/privacy-policy", to: "/privacy" },
  { from: "/for-the-parents", to: "/stories" },
  { from: "/lumi", to: "/products/kheelu" },
  { from: "/faq", to: "/products/kheelu#faq" },
  { from: "/sitemap", to: "/sitemap.xml" },
  { from: "/blog", to: "/stories" },
  { from: "/blog/x", to: "/stories" },
  { from: "/about", to: "/team" },
  { from: "/community", to: "/stories" },
  { from: "/login", to: "/" },
  { from: "/signup", to: "/" },
  { from: "/account/x", to: "/" },
  { from: "/cart", to: "/products/kheelu" },
  { from: "/checkout/x", to: "/products/kheelu" },
];

/** url-map §4d and D041: added by task 1.3. */
const ADDED: Row[] = [
  { from: "/playos", to: "/products/kheelu" },
  { from: "/stories/brain-development-toys-for-a-2-year-old", to: "/stories/learning-toys-for-a-three-year-old" },
  { from: "/kheelu", to: "/products/kheelu" },
  { from: "/products", to: "/products/kheelu" },
  { from: "/careers", to: "/team" },
  { from: "/jobs", to: "/team" },
  { from: "/pricing", to: "/products/kheelu#offer" },
];

const RULES_TABLE = existsSync(join(ROOT, "src/config/redirects.ts"));
const MARKETING_HOST = TARGET === "beta" ? new URL(ORIGINS.marketing).host : `localhost:${PORT}`;

/** Location → a path on the marketing host (absolute apex URLs are the same site). */
function localPath(location: string): { path: string; hash: string; host: "marketing" | "store" } {
  const url = new URL(location, "https://kheelona.com");
  const store = /^(?:store|betastore)\.kheelona\.com$|^store\.localhost$/.test(url.hostname);
  return { path: `${url.pathname}${url.search}`, hash: url.hash, host: store ? "store" : "marketing" };
}

async function oneHop(from: string, hostHeader?: string): Promise<{ first: NodeResponse; final: NodeResponse | null; target: string }> {
  const first = await nodeGet(from, "marketing", hostHeader);
  const location = String(first.headers.location ?? "");
  if (!location) return { first, final: null, target: "" };
  const t = localPath(location);
  const final = await nodeGet(t.path, t.host);
  return { first, final, target: `${t.path}${t.hash}` };
}

function check(rows: Row[], label: string, hostHeader?: string) {
  for (const row of rows) {
    test(`${label}: ${row.from} → ${row.to}`, async () => {
      for (const suffix of ["", "?utm_source=qa-redirect"]) {
        const { first, final, target } = await oneHop(`${row.from}${suffix}`, hostHeader);
        expect(first.status, `${row.from}${suffix}: permanent redirect`).toBe(308);
        const [toPath, toHash] = row.to.split("#");
        const expected = `${toPath}${suffix}${toHash ? `#${toHash}` : ""}`;
        expect(target, `${row.from}${suffix}: straight to the final URL, query kept`).toBe(expected);
        expect(final?.status, `${row.from}${suffix}: the target answers 200 (one hop, no chain)`).toBe(200);
      }
    });
  }
}

test.describe("redirects: the 24 existing rules (url-map §4b)", () => {
  requiresServer();
  // KH_E2E_PLANT=redirect adds a row the site does not have, to prove the matrix red.
  check(process.env.KH_E2E_PLANT === "redirect" ? [...EXISTING, { from: "/team", to: "/stories" }] : EXISTING, "apex");
});

test.describe("redirects: rules added in wave 1 (D041, url-map §4d)", () => {
  requiresServer();
  test.skip(!RULES_TABLE, "pending: src/config/redirects.ts (task 1.3) is not in this tree");
  check(ADDED, "apex");
});

test.describe("redirects: www twins (url-map §4c)", () => {
  requiresServer();
  test.skip(!RULES_TABLE || TARGET === "beta", "pending: the host-matched www twins come with task 1.3");
  check([...EXISTING, ...ADDED], "www", "www.kheelona.com");
});

test.describe("redirects: platform behaviour", () => {
  requiresServer();
  test("assets in public/ are never shadowed by a redirect", async () => {
    const assets = listFiles(["public"]).filter((p) => !/\/\.|\.DS_Store$/.test(p)).slice(0, 400);
    const shadowed: string[] = [];
    for (const file of assets) {
      const res = await nodeGet(`/${file.slice("public/".length).split("/").map(encodeURIComponent).join("/")}`, "marketing");
      if (res.status >= 300 && res.status < 400) shadowed.push(`${file}: ${res.status} → ${res.headers.location}`);
    }
    expect(shadowed).toEqual([]);
  });

  /* /ingest/e/ keeping its slash is NOT requested here: any request under /ingest/ that is not
     redirected reaches the PostHog rewrite and leaves the machine. It is asserted without the
     network by the kept repo guards that `verify` runs (architecture §14): next.config's
     skipTrailingSlashRedirect (test/posthog-proxy.test.ts), proxy() leaving /ingest/e/ alone
     (test/proxy-trailing-slash.test.ts) and the proxy matcher skipping every PostHog path
     (test/posthog-proxy.test.ts). */
  test("a trailing slash is one 308 to the bare path, query kept", async () => {
    for (const [from, to] of [
      ["/team/", "/team"],
      ["/team/?utm_source=x", "/team?utm_source=x"],
    ]) {
      const { first, final, target } = await oneHop(from);
      expect(first.status, from).toBe(308);
      expect(target, from).toBe(to);
      expect(final?.status, `${from}: target`).toBe(200);
    }
  });

  test("the marketing host's /store/* is one 308 to the store host", async () => {
    for (const from of ["/store", "/store/x"]) {
      const res = await nodeGet(from, "marketing", MARKETING_HOST);
      expect(res.status, from).toBe(308);
      expect(String(res.headers.location), from).toMatch(/^https:\/\/(?:beta)?store\.kheelona\.com\b/);
    }
  });

  test("an unknown URL answers 404 with a server-rendered page", async () => {
    for (const path of [NOT_FOUND_PATH, "/stories/no-such-slug", "/products/no-such"]) {
      const res = await nodeGet(path, "marketing");
      expect(res.status, path).toBe(404);
      expect(res.body, `${path}: the empty __next_error__ shell (a thrown notFound)`).not.toMatch(/id="__next_error__"/);
      expect(res.body, `${path}: server-rendered with lang`).toMatch(/<html[^>]*\blang="en-IN"/);
    }
  });
});
