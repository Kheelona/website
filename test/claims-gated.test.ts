import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Claims the CMO merge kept OFF the site (2026-10-04, founder decisions 3 and
 * 4; docs/checkpoints/cmo-merge-2026-10.md). The mockup and content doc v7
 * carried each of these; none is confirmed, or each is now known to be wrong.
 * A green build is no defence against a claim, so the words themselves are
 * pinned here. To ship one, the founder confirms the fact first, then this
 * list changes in the same commit, with the date and the decision.
 *
 * Code COMMENTS are stripped before matching: the reasoning behind each
 * removal quotes the retired wording on purpose, and that is documentation,
 * not copy. Journal articles are scanned like everything else.
 */
const BANNED: readonly [RegExp, string][] = [
  [/free for life/i, "NOT confirmed (2026-10-04): talking is free for life. Only 'smart features are yours for life' is sanctioned (KHEELONA_PLUS_LINE)."],
  [/the microphone is off|mic is off|Not muted\. Off|off the rest of the time, not muted/i, "retired 2026-10-04 (content doc v7 Appendix B): a wake-word toy listens for its word. Say it listens only for its wake word, and nothing is recorded or sent before it."],
  [/Kheelu (helps|grows|builds|develops|supports)[^.]{0,40}\bbrain/i, "founder decision 4 (2026-10-04): research-anchored. Conversation helps a young brain grow; Kheelu gives a child more of it. Never Kheelu's own effect."],
  [/supports your child'?s brain development/i, "founder decision 4: the mockup's /kheelu headline, not shipped as written"],
  [/helps (your child'?s|their) brain grow/i, "founder decision 4: the mockup's hero lead, not shipped as written"],
  [/Meet Kheelu on 20 October/i, "shipping STARTS on 20 October; nobody reserving today is promised delivery on it"],
  [/We plan to be here for years/i, "an unsigned continuity promise from the mockup's shut-down answer"],
  [/publish the results here,? good or bad/i, "an unsigned public commitment from the mockup's /how page"],
  [/Made in (Bengaluru|India)/i, "manufacture origin has never been claimed (lib/product-facts.ts)"],
  [/how long your child talks/i, "usage time in the parent app is not a published feature"],
  [/Bedtime stories only after 7/i, "an unconfirmed parent-app control from the mockup's sample screens"],
  [/whether or not you renew|keeps talking (even )?(if|without|after)/i, "NOT confirmed (2026-10-04): talking without Kheelona+ is 'free for life' in other words. Say 'smart features are yours for life' (KHEELONA_PLUS_LINE)."],
  [/designed and built here|built in Bengaluru|Made by parents in Bengaluru/i, "manufacture origin has never been claimed; say 'designed' (consistency pass 2026-10-04)"],
];

const ROOT = process.cwd();

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, out);
    else if (/\.tsx?$/.test(entry) && !/\.(test|stories)\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/** Drops block and line comments. Line comments only where `//` starts a
 *  token (not inside "https://"). Good enough for this codebase's copy. */
function stripComments(src: string) {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\w])\/\/.*$/gm, "$1");
}

const FILES = sourceFiles(join(ROOT, "src")).map((p) => ({
  path: p.slice(ROOT.length + 1),
  text: stripComments(readFileSync(p, "utf8")),
}));

describe("claims the CMO merge kept off the site stay off", () => {
  it("scans the whole source tree, comments stripped", () => {
    expect(FILES.length).toBeGreaterThan(50);
  });

  it.each(BANNED.map(([re, why]) => [re.source, re, why] as const))(
    "no visible copy matches /%s/",
    (_label, re, why) => {
      const hits = FILES.filter((f) => re.test(f.text)).map((f) => f.path);
      expect(hits, why).toEqual([]);
    },
  );
});

/* The three claims the founder DID confirm on 2026-10-04 are allowed, and
   this pins that they actually reached the pages the plan put them on, so a
   later edit cannot quietly drop the confirmed version and leave the gap. */
describe("the confirmed claims reached their pages", () => {
  const read = (p: string) => readFileSync(join(ROOT, p), "utf8");

  it("no camera: the comparison says so", () => {
    expect(read("src/lib/comparison.ts")).toMatch(/Camera in your home", values: \["None"/);
  });

  it("it says it is a toy: Home's safety room says so", () => {
    expect(read("src/features/home/components/TrustRoom.tsx")).toMatch(/It says it is a toy/);
  });

  it("our own servers, in India: Home and /safety both say so", () => {
    expect(read("src/features/home/components/TrustRoom.tsx")).toMatch(/Our own servers, in India/);
    expect(read("src/app/(site)/safety/page.tsx")).toMatch(/Our own servers, in India/);
  });
});
