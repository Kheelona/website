import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

/**
 * The inverse copy law (§8.25-f).
 *
 * For a year this site's central promise was "No payment now". It became FALSE
 * on 2026-08-22, on a live site taking real money, and it was spread across
 * nineteen places including two machine-readable routes that answer engines
 * quote back at people.
 *
 * The sweep that removed it is not self-guarding: the phrases are the kind a
 * writer reaches for by habit, and llms.txt or pricing.md is exactly where one
 * would come back unnoticed. So this asserts their ABSENCE from everything the
 * site publishes.
 *
 * 2026-08-23, the list INVERTED once (§8.26): the founder brought the 500-unit
 * cap BACK as the whole of the urgency, and retired the 30 September date
 * deadline, the ₹9,999 after-price and the 1 October ship date in the same
 * decision. So "first 500 units" left this list and became load-bearing (the
 * money test REQUIRES it in the offer line), and the date-era strings joined
 * it. The worst find of the original sweep was a hardcoded ship date in a FAQ
 * that no config change could reach, which is why the old ship date is banned
 * by literal text here rather than trusted to imports.
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
  [/pay nothing|nothing is charged today/i, "₹499 is charged today"],
  [/tally/i, "the form is ours now, in src/features/preorder"],
  [
    /30 September|2026-09-30/i,
    "the date deadline is retired (2026-08-23): the urgency is the 500-unit cap, CAP_UNITS_TEXT",
  ],
  [/₹9,999|Rs 9,999|999_900/, "the post-cap price is ₹7,999 (FULL_PRICE)"],
  [/1 October 2026|2026-10-01/, "the ship date is 20 October 2026 (SHIP_DATE_TEXT/ISO)"],
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

  /* Added 2026-08-23, because this scan was scoped to `src/` and the README's
     OPENING SENTENCE still described the offer as "no payment now" for a day
     after the store went live. It is the first thing a person reads on GitHub.
     Only the front door is checked, not the whole file: the bullets further down
     are dated history and legitimately say what shipped in July. */
  it("keeps the README's front door honest, not only the app", () => {
    const readme = readFileSync("README.md", "utf8");
    const cut = readme.indexOf("### Step 1");
    expect(cut, "the README's resume protocol moved; re-point this scan").toBeGreaterThan(0);
    const frontDoor = readme.slice(0, cut);
    for (const [pattern, why] of RETIRED) {
      expect(frontDoor, `README's lead still publishes ${pattern} — ${why}`).not.toMatch(pattern);
    }
  });
});
