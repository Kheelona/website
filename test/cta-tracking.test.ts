import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * How the marketing pages touch the analytics (CMO merge, 2026-10-04). The
 * integrations themselves are frozen (test/analytics-freeze.test.ts); pages
 * reach them in exactly two ways that a content rebuild could silently break:
 *
 * 1. The `track` prop on reserve CTAs, which becomes PostHog's top-level `cta`
 *    property (§8.40-h). Every reserve button shares one label and one
 *    destination by law (§8.25-b), so without it autocapture cannot tell which
 *    one a parent tapped. The names are a CONTRACT with PostHog insights:
 *    surviving folds kept their old names, and only two are new.
 * 2. `ViewContentTracker`, Meta's ViewContent, on the product page and (since
 *    this round, by founder request) on Home.
 */
const ROOT = process.cwd();

/** Every cta value a reserve button may carry, and why it exists. */
const CTA_VALUES = {
  hero: "Home hero",
  navbar: "the navbar button",
  "navbar-mobile": "the mobile menu's button",
  finale: "every page's #reserve finale",
  "product-top": "the Kheelu page hero",
  "product-foot": "the Kheelu page price room",
  compare: "Home's comparison",
  "home-arc": "Home's how-it-works room (kept from the growth room it replaced)",
  "home-reserve": "Home's price room (new 2026-10-04)",
  "sticky-bar": "the phone reserve bar (new 2026-10-04; the guide's dock had none)",
} as const;

function files(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files(full, out);
    else if (/\.tsx$/.test(entry) && !/\.(test|stories)\.tsx$/.test(entry)) out.push(full);
  }
  return out;
}

const MARKETING = [
  ...files(join(ROOT, "src/app/(site)")),
  ...files(join(ROOT, "src/features/home")),
  ...files(join(ROOT, "src/components")),
].map((p) => ({ path: p.slice(ROOT.length + 1), src: readFileSync(p, "utf8") }));

const used = MARKETING.flatMap((f) =>
  [...f.src.matchAll(/track="([a-z-]+)"/g)].map((m) => ({ value: m[1]!, path: f.path })),
);

describe("reserve CTAs carry a known PostHog cta value", () => {
  it("finds the tracked buttons", () => {
    expect(used.length).toBeGreaterThanOrEqual(Object.keys(CTA_VALUES).length);
  });

  it("uses only the agreed names (a renamed value breaks an insight silently)", () => {
    const unknown = used.filter((u) => !(u.value in CTA_VALUES));
    expect(unknown).toEqual([]);
  });

  it.each(Object.keys(CTA_VALUES))("%s is still emitted somewhere", (value) => {
    expect(used.some((u) => u.value === value), CTA_VALUES[value as keyof typeof CTA_VALUES]).toBe(true);
  });

  it("every Button that goes to the store carries a track value", () => {
    const untracked = MARKETING.flatMap((f) =>
      [...f.src.matchAll(/<Button\b[\s\S]*?>/g)]
        .map((m) => m[0])
        .filter((tag) => /href=\{(PREORDER_HREF|STORE_URL)\}/.test(tag) && !/track=/.test(tag))
        .map((tag) => `${f.path}: ${tag.replace(/\s+/g, " ")}`),
    );
    expect(untracked).toEqual([]);
  });

  it("no raw anchor reaches the store untracked (the retired guard dock did)", () => {
    const raw = MARKETING.filter((f) => /<a\b[^>]*href=\{(PREORDER_HREF|STORE_URL)\}/.test(f.src)).map(
      (f) => f.path,
    );
    expect(raw).toEqual([]);
  });
});

describe("Meta ViewContent is mounted where the founder asked", () => {
  it.each(["src/app/(site)/page.tsx", "src/app/(site)/products/kheelu/page.tsx"])("%s mounts ViewContentTracker", (p) => {
    expect(readFileSync(join(ROOT, p), "utf8")).toMatch(/<ViewContentTracker \/>/);
  });

  it("and nowhere else, so the count means 'saw the product'", () => {
    const mounts = MARKETING.filter((f) => /<ViewContentTracker \/>/.test(f.src)).map((f) => f.path).sort();
    expect(mounts).toEqual(["src/app/(site)/page.tsx", "src/app/(site)/products/kheelu/page.tsx"]);
  });
});
