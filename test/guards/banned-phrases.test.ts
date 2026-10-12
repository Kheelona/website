import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT, isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";
import { approvedMockupText, MOCKUP_SLUGS } from "../e2e/support/mockup-text";
import { codeWithoutComments, parseSource, sourceStrings } from "../e2e/support/source";
import { BANNED_PHRASES, findBanned } from "./banned-phrases.data";
import { isStillLegacy } from "./legacy-paths";

/* banned-phrases (task 1.1; architecture §14, claims §4, QA review N24).
 *
 * Checks, every run:
 *   1. the data is in sync with wiki/product/claims.md §4: every BANNED row has an entry;
 *   2. every entry is red on its planted example;
 *   3. every entry is green on all 18 approved mockup pages (visible text, title and description)
 *      and on every copy block (quoted lines) of wiki/site/pages/*.md, so the guard can never
 *      contradict approved copy;
 *   4. no string in src/content/** carries a banned phrase (rendered text: content-integrity.spec.ts);
 *   5. no shipped src/**\/*.ts(x) file carries a retired offer term, comments aside (the full scope
 *      of test/preorder-copy.test.ts, machine routes named);
 *   6. no shipped src file that is not still legacy carries a banned claim (pending items printed);
 *   7. the README's front door carries no retired offer term (kept from test/preorder-copy.test.ts).
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

describe("src/ publishes no retired offer term (ported from test/preorder-copy.test.ts)", () => {
  /* The old test scanned every shipped .ts/.tsx file under src/, comments stripped, and named the
     two machine routes on purpose: llms.txt and pricing.md are exactly where a retired promise
     ("No payment now", "₹9,999", "the pre-order list") would come back unnoticed and be quoted by
     answer engines. That coverage is kept whole here, over config, lib, components and app alike;
     content-integrity.spec.ts adds the rendered text of every new route. The en-IN spelling entries
     stay out of code (N24): "center" and "color" are CSS words there, not copy. */
  const files = listFiles(["src"]).filter((p) => /\.(ts|tsx)$/.test(p) && !isTestOrStory(p));

  it("drops comments but keeps every literal verbatim (the scan's own calibration)", () => {
    const sample = [
      `// "No payment now" may be explained in a comment`,
      `/* ₹9,999 was the after-price */`,
      `export const PAISE = 999_900;`,
      `export const P = () => <p>Reserve a spot. <strong>It is free</strong>{/* Tally */}</p>;`,
    ].join("\n");
    const ids = findBanned(codeWithoutComments(parseSource("src/x.tsx", sample)), ["offer"]).map((h) => h.id);
    expect(ids.sort()).toEqual(["offer-9999", "offer-reserving-free"]);
  });

  it("scans a real file list", () => {
    expect(files.length).toBeGreaterThan(60);
    expect(files).toContain("src/app/llms.txt/route.ts");
    expect(files).toContain("src/app/pricing.md/route.ts");
  });

  it("finds no retired offer term in any shipped src file, comments aside", () => {
    const problems: string[] = [];
    for (const path of files) {
      const code = codeWithoutComments(parseSource(path, readRepoFile(path)));
      for (const h of findBanned(code, ["offer"])) problems.push(`${path} ${h.id}: "${h.match}" in "${h.sentence}"`);
    }
    console.log(`[banned-phrases] retired offer terms: scanned ${files.length} shipped src file(s).`);
    expect(problems, `retired offer terms in src/ (claims §4 row 18):\n${problems.join("\n")}`).toEqual([]);
  });
});

describe("new src/ code carries no banned claim", () => {
  /* The claim entries over every shipped src file that is not still legacy (legacy-paths.ts): new
     code, and any legacy file the moment a task rewrites it. Pending items are hits that predate
     the reset in files no wave-1 task owns; each is printed on every run, never silent, and stops
     printing once its owner rewrites the line. A pending item never hides a new hit. */
  const PENDING: readonly { path: string; id: string; match: string; why: string }[] = [
    {
      path: "src/config/site.ts",
      id: "lessons",
      match: "lessons",
      why: 'KHEELONA_PLUS_LINE says "the stories, lessons, languages"; claims §4 row 10 already flags it (D027).',
    },
  ];

  it("finds no banned claim outside the named pending items", () => {
    const files = listFiles(["src"]).filter((p) => /\.(ts|tsx)$/.test(p) && !isTestOrStory(p) && !isStillLegacy(p));
    const problems: string[] = [];
    const pendingSeen = new Set<number>();
    for (const path of files) {
      for (const h of findBanned(codeWithoutComments(parseSource(path, readRepoFile(path))), ["claim"])) {
        const i = PENDING.findIndex((p) => p.path === path && p.id === h.id && p.match === h.match);
        if (i >= 0) pendingSeen.add(i);
        else problems.push(`${path} ${h.id}: "${h.match}" in "${h.sentence}"`);
      }
    }
    const pendingLines = PENDING.map((p, i) => `  ${pendingSeen.has(i) ? "PENDING " : "resolved"} ${p.path} ${p.id}: ${p.why}`);
    console.log(`[banned-phrases] claims: scanned ${files.length} new src file(s).\n${pendingLines.join("\n")}`);
    expect(problems, `banned claims in new src/ code (claims §4):\n${problems.join("\n")}`).toEqual([]);
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
