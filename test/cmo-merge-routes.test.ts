import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_LINKS, FOOTER_LINKS } from "@/config/site";

/**
 * The CMO merge (2026-10-04, docs/checkpoints/cmo-merge-2026-10.md).
 *
 * Founder decision 1 was to KEEP every indexed URL: the mockup's /kheelu and
 * /story were not built, and /products/kheelu, /team and /contact stay pages.
 * Only /how and /faq are new. This file pins that, because the failure would
 * be invisible in the browser: a redirect added "for tidiness" moves a URL
 * Google, the ads and the answer engines already cite, and every page still
 * renders.
 *
 * Adapted from the redesign branch's own redesign-routes test (which pinned
 * the opposite: its URL moves), keeping its two good ideas: every nav and
 * footer link must be a real page, and no mockup placeholder may ship.
 *
 * Reads next.config.ts as text, like redirects-vs-assets: importing it would
 * need a Next runtime.
 */
const ROOT = process.cwd();
const CONFIG = readFileSync(join(ROOT, "next.config.ts"), "utf8");
const redirects = [
  ...CONFIG.matchAll(/source:\s*"([^"]+)",\s*destination:\s*([^,]+),/g),
].map((m) => ({ source: m[1]!, destination: m[2]!.trim().replace(/^"|"$/g, "") }));
const sources = new Set(redirects.map((r) => r.source));

/** A marketing route's page file, inside the (site) route group. */
const pageFile = (path: string) =>
  join(ROOT, "src/app/(site)", path === "/" ? "" : path, "page.tsx");

describe("the CMO merge kept every indexed URL", () => {
  it("finds the redirects", () => {
    expect(redirects.length).toBeGreaterThan(10);
  });

  it.each(["/products/kheelu", "/team", "/contact"])("%s is still a page, not a redirect", (path) => {
    expect(existsSync(pageFile(path)), `${path} page file`).toBe(true);
    expect(sources.has(path), `${path} must not be a redirect source`).toBe(false);
  });

  it.each(["/how", "/faq"])("%s is a new real page, not a redirect", (path) => {
    expect(existsSync(pageFile(path)), `${path} page file`).toBe(true);
    expect(sources.has(path), `${path} must not be a redirect source`).toBe(false);
  });

  it("did not build the mockup's moved URLs", () => {
    expect(existsSync(pageFile("/kheelu"))).toBe(false);
    expect(existsSync(pageFile("/story"))).toBe(false);
  });

  it("still sends the old product names straight to /products/kheelu, in one hop", () => {
    const lumi = redirects.find((r) => r.source === "/products/lumi");
    expect(lumi?.destination).toBe("/products/kheelu");
    const chains = redirects.filter((r) => sources.has(r.destination.split("#")[0]!));
    expect(chains.map((r) => `${r.source} -> ${r.destination}`)).toEqual([]);
  });
});

describe("every nav and footer link is a real page", () => {
  const links = [...NAV_LINKS, ...FOOTER_LINKS].map((l) => l.href);

  it.each([...new Set(links)])("%s has a page file and is not a redirect", (href) => {
    expect(existsSync(pageFile(href)), `${href} page file`).toBe(true);
    expect(sources.has(href)).toBe(false);
  });

  it("keeps the journal and the buyer's guide reachable from every page", () => {
    expect(NAV_LINKS.map((l) => l.href)).toContain("/stories");
    expect(FOOTER_LINKS.map((l) => l.href)).toContain("/ai-toys-for-kids-in-india");
    expect(FOOTER_LINKS.map((l) => l.href)).toContain("/contact");
  });
});

/* The branch's placeholder guard, kept: the mockup carried bracketed
   placeholders ("[City]", "[₹X]") and "verify" flags, and none may ship.
   Journal links use [label](url), which none of these patterns match. */
const PLACEHOLDER =
  /\[(?:[XYZN]\b|wake word|Name|Number|Photo|City|Legal|Expected|Answer|Add |One |Describe|Founder|₹X|1-year|position|payment provider|Video frame|Check current|Mon to Sat|cities|age\]|word\])/;

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

describe("no mockup placeholder ships", () => {
  const files = sourceFiles(join(ROOT, "src")).map((p) => ({
    path: p.slice(ROOT.length + 1),
    src: readFileSync(p, "utf8"),
  }));

  it("scans the source tree", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it("has no bracketed placeholder text anywhere in src/", () => {
    expect(files.filter((f) => PLACEHOLDER.test(f.src)).map((f) => f.path)).toEqual([]);
  });

  it("has no mockup fact-check flag markup", () => {
    expect(
      files.filter((f) => /className="vf"|>verify</.test(f.src)).map((f) => f.path),
    ).toEqual([]);
  });
});
