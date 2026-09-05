import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
// @ts-expect-error -- a plain .mjs tool, deliberately outside the TS graph
import { buildUtmUrl, UtmError, SOURCES, MEDIUMS, SITE_URL } from "../tools/utm/build-link.mjs";
import { SITE_URL as CANONICAL_SITE_URL } from "@/lib/seo";

/**
 * Campaign tagging, guarded rather than hoped for.
 *
 * The Ahrefs export for the fortnight to 2026-09-05 reads 100% "Direct / None"
 * on utm_campaign and utm_term while a Meta Pixel runs for paid social. An
 * untagged click is untagged forever, so the rules in docs/utm-conventions.md
 * only pay off if something enforces them.
 */

const DOC = readFileSync("docs/utm-conventions.md", "utf8");

/** The backticked values out of one row of the doc's parameter table. */
function documentedValues(param: string): string[] {
  const row = DOC.split("\n").find((line) => line.startsWith(`| \`${param}\``));
  if (!row) throw new Error(`no table row for ${param} in docs/utm-conventions.md`);
  return [...row.split("|")[3].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
}

describe("the builder and the doc cannot drift apart", () => {
  it("offers exactly the sources the doc lists", () => {
    expect(documentedValues("utm_source")).toEqual(SOURCES);
  });

  it("offers exactly the mediums the doc lists", () => {
    expect(documentedValues("utm_medium")).toEqual(MEDIUMS);
  });

  it("builds on the same origin the rest of the site uses", () => {
    expect(SITE_URL).toBe(CANONICAL_SITE_URL);
  });

  it("reproduces the doc's own worked example", () => {
    /* If the example in the doc and the tool ever disagree, one of them is
       teaching the wrong thing. */
    const example = DOC.split("\n").find((l) =>
      l.includes("utm_content=rabbit-hero-a"),
    );
    expect(example).toBeDefined();
    expect(
      buildUtmUrl({
        source: "instagram",
        medium: "paid_social",
        campaign: "2026-10-launch",
        path: "/products/kheelu",
        content: "rabbit-hero-a",
      }),
    ).toBe(example!.trim());
  });
});

describe("the builder refuses what silently fragments a report", () => {
  const good = {
    source: "instagram",
    medium: "paid_social",
    campaign: "2026-10-launch",
  } as const;

  it("refuses a source outside the scheme", () => {
    expect(() => buildUtmUrl({ ...good, source: "fb" })).toThrow(UtmError);
  });

  it("refuses casing drift, which is the most common way a report splits", () => {
    expect(() => buildUtmUrl({ ...good, medium: "Paid_Social" })).toThrow(UtmError);
    expect(() => buildUtmUrl({ ...good, campaign: "2026-10-Launch" })).toThrow(UtmError);
  });

  it("insists on the yyyy-mm prefix so campaigns sort and can repeat", () => {
    for (const campaign of ["launch", "2026-13-launch", "202610-launch", "2026-10"]) {
      expect(() => buildUtmUrl({ ...good, campaign }), campaign).toThrow(UtmError);
    }
    expect(buildUtmUrl({ ...good, campaign: "2026-09-preorder-500" })).toContain(
      "utm_campaign=2026-09-preorder-500",
    );
  });

  it("keeps utm_term to paid search, where it is the only field that reads", () => {
    expect(() => buildUtmUrl({ ...good, term: "talking toy" })).toThrow(UtmError);
    expect(buildUtmUrl({ ...good, medium: "cpc", term: "talking toy" })).toContain(
      "utm_term=talking+toy",
    );
  });

  it("refuses a path that is already tagged", () => {
    expect(() => buildUtmUrl({ ...good, path: "/?utm_source=x" })).toThrow(UtmError);
  });
});

describe("the site's own links stay clean", () => {
  /* Rule 2 of the conventions, and the reason it is a rule: a UTM on a link
     from one page of kheelona.com to another starts a NEW analytics session,
     throwing away the attribution of the visit already in progress. Tagging an
     internal link therefore destroys exactly the data the tagging exists to
     collect. */
  const sources = execFileSync("git", ["ls-files", "src"], { encoding: "utf8" })
    .split("\n")
    .filter((f) => /\.(ts|tsx)$/.test(f) && !/\.test\.tsx?$/.test(f));

  /** Writing a tag, not reading one. The store deliberately READS utm_ values
   *  off the landing URL to record which campaign produced an order, and that
   *  must not trip this guard — so match a query string being built, either as
   *  a literal or through URLSearchParams. */
  const WRITES_A_TAG = /[?&]utm_(source|medium|campaign|content|term)=|(?:set|append)\(\s*["'`]utm_/;

  it("no source file writes a utm_ parameter into a link", () => {
    expect(sources.length).toBeGreaterThan(50);
    const offenders = sources.filter((f) => WRITES_A_TAG.test(readFileSync(f, "utf8")));
    expect(offenders, `these tag an internal link: ${offenders.join(", ")}`).toEqual([]);
  });

  it("catches a tagged internal link if one is ever added", () => {
    /* Guard the guard: the regex above is the whole test, so prove it fires. */
    expect(WRITES_A_TAG.test('<a href="/products/kheelu?utm_source=instagram">')).toBe(true);
    expect(WRITES_A_TAG.test('url.searchParams.set("utm_campaign", c)')).toBe(true);
    /* and that reading one still passes */
    expect(WRITES_A_TAG.test('for (const key of ["utm_source", "utm_medium"])')).toBe(false);
    expect(WRITES_A_TAG.test('params.get("utm_source")')).toBe(false);
  });

  it("the store still records the campaign that produced an order", () => {
    /* The other half of the story, and the reason tagging pays off at all:
       create-order copies the landing URL's utm_ values onto the order, so a
       paid pre-order can be traced back to the ad that caused it. */
    const route = readFileSync("src/app/api/preorder/create-order/route.ts", "utf8");
    expect(route).toContain("utm_campaign");
  });
});
