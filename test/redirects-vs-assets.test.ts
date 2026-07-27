import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Next.js matches redirects BEFORE it serves public/ files. So a legacy-URL
 * redirect whose first segment equals one of our asset directories silently
 * 308s our own images away, and the image optimizer answers 400 for every one
 * of them. That happened with `/product/:slug*` vs `public/product/` on
 * 2026-07-28: the home hero plush (the mobile LCP element) went blank.
 *
 * This reads the config as text on purpose. Importing it would need a Next
 * runtime; the shape we care about is one line per redirect, and text keeps the
 * guard honest about what a reviewer actually sees in the file.
 */

// jsdom gives import.meta.url an http:// base, so resolve from the Vitest root.
const ROOT = process.cwd();
const CONFIG = readFileSync(join(ROOT, "next.config.ts"), "utf8");

const sources = [...CONFIG.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]);

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
    expect(CONFIG).toContain('source: "/product/:slug([^.]+)"');
  });
});
