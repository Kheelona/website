import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { REDIRECTS, WWW_HOST } from "@/config/redirects";
import { CANONICAL_ORIGIN } from "@/config/env";

/**
 * Next.js matches redirects BEFORE it serves public/ files. So a legacy-URL
 * redirect whose first segment equals one of our asset directories silently
 * 308s our own images away, and the image optimizer answers 400 for every one
 * of them. That happened with `/product/:slug*` vs `public/product/` on
 * 2026-07-28: the home hero plush (the mobile LCP element) went blank.
 *
 * Since the reset (task 1.3, ADR-012) the rules live in one table,
 * `src/config/redirects.ts`, which `next.config.ts` returns whole
 * (`test/guards/next-config.test.ts` proves that), so this reads the table.
 */

// jsdom gives import.meta.url an http:// base, so resolve from the Vitest root.
const ROOT = process.cwd();

/* The `www` catch-all moves EVERY path, files included, to the same path on the
   apex: on www a file is not lost, it is one hop away at its canonical address
   (asserted below). Every other rule is checked for shadowing. */
const isWwwCatchAll = (r: (typeof REDIRECTS)[number]) =>
  r.has?.some((h) => h.type === "host") === true && r.source === "/:path*";

const sources = REDIRECTS.filter((r) => !isWwwCatchAll(r)).map((r) => r.source);

const assetDirs = readdirSync(join(ROOT, "public"), { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => e.name);

describe("redirects never shadow public/ assets", () => {
  it("finds the redirects and the asset directories", () => {
    expect(sources.length).toBeGreaterThan(10);
    expect(assetDirs).toContain("product");
  });

  it.each(assetDirs)("public/%s is not swallowed by a redirect", (dir) => {
    const files = readdirSync(join(ROOT, "public", dir));
    const shadowing = sources.filter((s) => {
      if ((s.split("/")[1] ?? "") !== dir) return false;
      // A literal source only ever shadows the one file of that exact name.
      if (!/[:*]/.test(s)) return files.includes(s.split("/").slice(2).join("/"));
      // A pattern that cannot match a dot cannot match a filename, so it is safe.
      return !s.includes("[^.]");
    });
    expect(shadowing, `redirect source(s) shadow public/${dir}/`).toEqual([]);
  });

  it("keeps the dot-excluding pattern on the legacy product redirect", () => {
    expect(sources).toContain("/product/:slug([^.]+)");
  });

  /* A source whose FIRST segment is a pattern would cover every public/ folder
     at once. Only the www catch-all may, and only on www. */
  it("lets no rule but the www catch-all start with a pattern", () => {
    expect(sources.filter((s) => /^\/[:(*]/.test(s))).toEqual([]);
    const catchAlls = REDIRECTS.filter(isWwwCatchAll);
    expect(catchAlls).toHaveLength(1);
    expect(catchAlls[0].has).toEqual([{ type: "host", value: WWW_HOST.replace(/\./g, "\\.") }]);
    expect(catchAlls[0].destination).toBe(`${CANONICAL_ORIGIN}/:path*`);
  });
});

/* §8.36-a (2026-09-11): the legacy legal URLs travel as a PAIR.
 *
 *  Wix served `/terms-conditions` and `/privacy-policy`. The 2026-09-05 round
 *  redirected the first and missed the second, and the miss was not free:
 *  Perplexity was still citing `www.kheelona.com/privacy-policy` as a live
 *  source and quoting a Wix-era "Privacy Policy (Beta)" off it, which is where
 *  its claim that this company is in "limited beta" came from — on a site that
 *  has taken real payments since 2026-08-22.
 *
 *  A 404 does not correct a stale index. It leaves the crawler holding the last
 *  thing it saw. This test exists so the pair cannot be split again. */
describe("the legacy legal URLs are redirected as a pair", () => {
  const pairs = [
    ["/terms-conditions", "/terms"],
    ["/privacy-policy", "/privacy"],
  ] as const;
  const apexRule = (source: string) => REDIRECTS.find((r) => r.source === source && !r.has);

  it.each(pairs)("redirects %s to %s", (source, destination) => {
    const rule = apexRule(source);
    expect(rule, `no redirect declared for ${source}`).toBeDefined();
    expect(rule!.destination).toBe(destination);
  });

  it("sends both permanently, so the stale citation is actually replaced", () => {
    for (const [source] of pairs) {
      const rule = apexRule(source);
      expect(rule, `no permanent flag on ${source}`).toBeDefined();
      expect(rule!.permanent).toBe(true);
    }
  });
});
