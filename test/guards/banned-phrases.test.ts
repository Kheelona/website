import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT, listFiles, readRepoFile } from "../e2e/support/repo";
import { approvedMockupText, MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { parseSource, sourceStrings } from "../e2e/support/source";
import { BANNED_PHRASES, findBanned } from "./banned-phrases.data";

/* banned-phrases (task 1.1; architecture §14, claims §4, QA review N24).
 *
 * Checks, every run:
 *   1. the data is in sync with wiki/product/claims.md §4: every BANNED row has an entry;
 *   2. every entry is red on its planted example;
 *   3. every entry is green on all 18 approved mockup pages (visible text, title and description)
 *      and on every copy block (quoted lines) of wiki/site/pages/*.md, so the guard can never
 *      contradict approved copy;
 *   4. no string in src/content/** carries a banned phrase (rendered text: content-integrity.spec.ts);
 *   5. the README's front door carries no retired offer term (kept from test/preorder-copy.test.ts).
 */

function claimsTableFirstCells(heading: string, until: string): { first: string; site: string }[] {
  const md = readRepoFile("wiki/product/claims.md");
  const start = md.indexOf(heading);
  const end = md.indexOf(until, start + heading.length);
  expect(start, `claims.md has no "${heading}" section`).toBeGreaterThan(0);
  return md
    .slice(start, end)
    .split("\n")
    .filter((l) => l.startsWith("| ") && !/^\|\s*(Wording|Claim)\s*\|/.test(l))
    .map((l) => {
      const cells = l.split(" | ");
      return { first: cells[0].replace(/^\|\s*/, "").trim(), site: cells[cells.length - 1].replace(/\s*\|\s*$/, "") };
    });
}

describe("banned-phrases data stays in sync with claims §4", () => {
  const section4 = claimsTableFirstCells("## 4. Retired or banned wording", "### 4.1");
  const section3 = claimsTableFirstCells("## 3. Not confirmed: do not publish", "### 3.1");

  it("reads the real §4 table", () => {
    expect(section4.length).toBeGreaterThanOrEqual(20);
  });

  it("has an entry for every banned row of §4", () => {
    const missing = section4
      .filter((r) => /BANNED/.test(r.site))
      .filter((r) => !BANNED_PHRASES.some((e) => r.first.startsWith(e.claimsRow)))
      .map((r) => r.first.slice(0, 80));
    expect(missing, `claims §4 rows with no banned-phrases entry:\n${missing.join("\n")}`).toEqual([]);
  });

  it("cites a real claims row in every entry", () => {
    const orphans = BANNED_PHRASES.filter((e) => e.kind !== "spelling").filter((e) =>
      e.claimsRow.startsWith("§3: ")
        ? !section3.some((r) => r.first.startsWith(e.claimsRow.slice(4)))
        : !section4.some((r) => r.first.startsWith(e.claimsRow)),
    );
    expect(orphans.map((e) => `${e.id}: ${e.claimsRow}`)).toEqual([]);
  });

  it("uses unique ids", () => {
    const ids = BANNED_PHRASES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("every entry is red on its planted example", () => {
  it.each(BANNED_PHRASES.map((e) => [e.id, e] as const))("%s", (_id, entry) => {
    expect(findBanned(entry.planted).map((h) => h.id)).toContain(entry.id);
  });
});

describe("every entry is green on approved copy", () => {
  it.each(MOCKUP_SLUGS)("mockup %s", (slug) => {
    const hits = findBanned(approvedMockupText(slug));
    expect(hits, hits.map((h) => `${h.id}: "${h.match}" in "${h.sentence}"`).join("\n")).toEqual([]);
  });

  const pages = readdirSync(join(ROOT, "wiki/site/pages")).filter((f) => f.endsWith(".md"));
  it("covers the 18 copy pages", () => {
    expect(pages.length).toBe(18);
  });
  it.each(pages)("copy blocks of %s", (file) => {
    const quoted = readRepoFile(`wiki/site/pages/${file}`)
      .split("\n")
      .filter((l) => /^\s*>/.test(l))
      .map((l) => l.replace(/^\s*>\s?/, ""))
      .join("\n");
    const hits = findBanned(quoted);
    expect(hits, hits.map((h) => `${h.id}: "${h.match}" in "${h.sentence}"`).join("\n")).toEqual([]);
  });
});

describe("src/content carries no banned phrase", () => {
  it("checks every string of every content module", () => {
    const files = listFiles(["src/content"]).filter((p) => /\.(ts|tsx)$/.test(p) && !/\.test\.tsx?$/.test(p));
    const problems: string[] = [];
    for (const path of files) {
      for (const s of sourceStrings(parseSource(path, readRepoFile(path)))) {
        for (const h of findBanned(s.text)) problems.push(`${path}:${s.line} ${h.id}: "${h.match}" in "${h.sentence}"`);
      }
    }
    console.log(`[banned-phrases] ${BANNED_PHRASES.length} entries; scanned ${files.length} content module(s).`);
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

describe("the README's front door", () => {
  /* Kept from test/preorder-copy.test.ts (2026-08-23): the README's opening sentence described
     the offer as "no payment now" for a day after the store went live. Only the front door is
     checked; the dated history further down legitimately says what shipped in July. */
  it("carries no retired offer term", () => {
    const readme = readRepoFile("README.md");
    const cut = readme.indexOf("### Step 1");
    expect(cut, "the README's resume protocol moved; re-point this scan").toBeGreaterThan(0);
    const hits = findBanned(readme.slice(0, cut), ["offer"]);
    expect(hits.map((h) => `${h.id}: "${h.match}"`)).toEqual([]);
  });
});
