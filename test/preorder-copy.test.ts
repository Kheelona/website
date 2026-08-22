import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

/**
 * The inverse copy law (§8.25-f).
 *
 * For a year this site's central promise was "No payment now", and its urgency
 * was "first 500 units at ₹4,999". Both became FALSE on 2026-08-22, on a live
 * site taking real money, and they were spread across nineteen places including
 * two machine-readable routes that answer engines quote back at people.
 *
 * The sweep that removed them is not self-guarding: the phrases are the kind a
 * writer reaches for by habit, and llms.txt or pricing.md is exactly where one
 * would come back unnoticed. So this asserts their ABSENCE from everything the
 * site publishes.
 *
 * Comments are stripped before the scan, because the commit that removed these
 * phrases has to be able to explain why they are gone.
 */

const files = execFileSync(
  "git",
  ["ls-files", "src/**/*.ts", "src/**/*.tsx", "src/*.ts"],
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean)
  // tests and stories legitimately quote retired copy in order to forbid it
  .filter((f) => !/\.(test|stories)\.tsx?$/.test(f));

/** Strip block and line comments so a code comment can discuss retired copy. */
function published(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

/** Phrases that are now untrue, with what replaced each one. */
const RETIRED: readonly [RegExp, string][] = [
  [/no payment/i, "the token is real money: say what it costs and that it is refundable"],
  [/first 500|first five hundred/i, "there is no unit cap: urgency is PREORDER_DEADLINE_TEXT"],
  [/pay nothing|nothing is charged today/i, "₹499 is charged today"],
  [/tally/i, "the form is ours now, in src/features/preorder"],
];

describe("retired promises stay retired", () => {
  it("scans a real file list", () => {
    expect(files.length).toBeGreaterThan(60);
    expect(files).toContain("src/app/llms.txt/route.ts");
    expect(files).toContain("src/app/pricing.md/route.ts");
  });

  it.each(files)("%s publishes no retired promise", (file) => {
    const text = published(readFileSync(file, "utf8"));
    for (const [pattern, why] of RETIRED) {
      expect(text, `${file} still publishes ${pattern} — ${why}`).not.toMatch(pattern);
    }
  });
});
