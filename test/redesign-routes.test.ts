import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NAV_LINKS, FOOTER_LINKS } from "@/config/site";

/** The 2026-10 redesign moved pages and folded one into another. Three
 *  things could go silently wrong, and each is a test here:
 *
 *  1. An old URL stops answering. Printed QR codes, WhatsApp forwards and a
 *     year of inbound links point at /products/kheelu, /team and /contact.
 *  2. A redirect shadows a real page. `/faq` used to 308 to the product FAQ;
 *     left in place it would have hidden the new /faq page entirely, because
 *     redirects run before routes and nothing would look broken in a build.
 *  3. A mockup placeholder ships. The mockup was full of bracketed blanks
 *     ("[wake word]", "[X] families") and "verify" flags; none may reach a
 *     parent. */

const ROOT = process.cwd();
const CONFIG = readFileSync(join(ROOT, "next.config.ts"), "utf8");

const redirects = [
  ...CONFIG.matchAll(/source:\s*"([^"]+)",\s*destination:\s*("([^"]+)"|STORE_URL)/g),
].map((m) => ({ source: m[1], destination: m[3] ?? "STORE_URL" }));

const SITE = join(ROOT, "src/app/(site)");
const pageRoutes = readdirSync(SITE)
  .filter((d) => statSync(join(SITE, d)).isDirectory())
  .filter((d) => {
    try {
      return statSync(join(SITE, d, "page.tsx")).isFile();
    } catch {
      return false;
    }
  })
  .map((d) => `/${d}`);

describe("the redesign's routes", () => {
  it("finds the redirects and the pages", () => {
    expect(redirects.length).toBeGreaterThan(20);
    for (const p of ["/how", "/kheelu", "/safety", "/story", "/faq"]) {
      expect(pageRoutes).toContain(p);
    }
  });

  it.each([
    ["/products/kheelu", "/kheelu"],
    ["/team", "/story"],
    ["/contact", "/story#talk"],
    ["/reserve", "STORE_URL"],
  ])("%s still answers, at %s", (source, destination) => {
    expect(redirects.find((r) => r.source === source)?.destination).toBe(destination);
  });

  it("never redirects away from a page that exists", () => {
    const shadowed = redirects.filter((r) => pageRoutes.includes(r.source));
    expect(shadowed).toEqual([]);
  });

  it("never chains: no destination is itself a redirect source", () => {
    const sources = new Set(redirects.map((r) => r.source));
    const chains = redirects.filter((r) => sources.has(r.destination.split("#")[0]));
    expect(chains).toEqual([]);
  });

  it("every nav and footer link is a page that exists, not a redirect", () => {
    const sources = new Set(redirects.map((r) => r.source));
    for (const l of [...NAV_LINKS, ...FOOTER_LINKS]) {
      expect(sources.has(l.href), l.href).toBe(false);
      expect(pageRoutes.includes(l.href) || l.href === "/", l.href).toBe(true);
    }
  });
});

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/* The mockup's blanks, by shape: a bracket opening on a placeholder word.
   Tailwind's arbitrary values (`text-[17px]`, `min-[900px]:`) never start
   with one of these, so they cannot trip it. */
const PLACEHOLDER =
  /\[(?:[XYZN]\b|wake word|Name|Number|Photo|City|Legal|Expected|Answer|Add |One |Describe|Founder|₹X|1-year|position|payment provider|Video frame|Check current|Mon to Sat|cities|age\]|word\])/;

describe("no mockup placeholder ships", () => {
  const files = sourceFiles(join(ROOT, "src")).map((p) => ({
    path: p.slice(ROOT.length + 1),
    src: readFileSync(p, "utf8"),
  }));

  it("scans the source tree", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  it("has no bracketed placeholder text anywhere in src/", () => {
    const hits = files.filter((f) => PLACEHOLDER.test(f.src)).map((f) => f.path);
    expect(hits).toEqual([]);
  });

  it("has no mockup fact-check flag markup", () => {
    const hits = files.filter((f) => /className="vf"|>verify</.test(f.src)).map((f) => f.path);
    expect(hits).toEqual([]);
  });
});
