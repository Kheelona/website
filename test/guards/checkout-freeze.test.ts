import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { FREEZE_TAG, ROOT, listFiles, readRepoBytes, readRepoFile, tagBytes, tagFiles, tagText } from "../e2e/support/repo";
import { parseSource } from "../e2e/support/source";

/* checkout-freeze (task 1.1; ADR-013 class 1, architecture §16.2 proof 1, QA review B3).
 *
 * The checkout's logic is frozen byte for byte against the tag archive/pre-reset-2026-10-10
 * (production before the reset). The only accepted changes are reviewed patches stored in
 * test/guards/fixtures/authorised-diffs/<path with "/" as "__">.patch, written with
 * `git diff archive/pre-reset-2026-10-10 -- <path>`:
 *   - the three D048 diffs (host.ts, env.ts, posthog-server.ts), task 1.3;
 *   - later founder-approved diffs to frozen logic (6.2, 6.4), each with a decision ID;
 *   - LITERAL-ONLY patches to the six checkout test files (and any frozen test file): the token
 *     stream must be unchanged once string, template and regular-expression literals are masked,
 *     so a selector may follow approved copy but no assertion can be added, removed or weakened;
 *   - a DELETION (`+++ /dev/null`) retires a frozen file whose subject a founder decision removed:
 *     accepted only for a path listed in RETIRED below, only when the patch's header cites that
 *     path's own decision, and the file must then stay deleted;
 *   - an ADDITION: a frozen folder may gain exactly the file ADDED lists, each with its founder decision (D075: the
 *     migration that adds a nullable column). It is the mirror of RETIRED and narrower: the path must be listed exactly,
 *     the file's own header must cite the decision, the decision must have its note in wiki/decisions, and a migration
 *     may only ADD a nullable column and comment on it.
 * A frozen folder that gains any other file fails too. Presentation files are not byte-frozen: their
 * proofs are checkout-signature and checkout-jsx-contract; a patch stored for one is a review
 * record and is printed, not applied.
 */

const FROZEN_DIRS = [
  "src/lib/store/",
  "src/app/api/",
  "src/features/preorder/lib/",
  "src/lib/email/",
  "supabase/migrations/",
];
const FROZEN_FILES = [
  "src/proxy.ts",
  "src/lib/fbq.ts",
  "src/lib/posthog.ts",
  "src/lib/campaign.ts",
  "src/lib/click-id.ts",
  "src/lib/trailing-slash.ts",
  "src/lib/security-headers.ts",
];
/** The six checkout test files (B3): frozen, literal-only reviewed patches allowed. */
const CHECKOUT_TESTS = [
  "src/features/preorder/components/PreorderForm.test.tsx",
  "src/features/preorder/components/OrderSummary.test.tsx",
  "src/features/preorder/components/AddressForm.test.tsx",
  "src/app/store/_components/NotFoundPanel.test.tsx",
  "src/app/store/thanks/page.test.tsx",
  "src/app/store/ideabaaz/page.test.tsx",
];
/** D048 (architecture §15.3): changed only by their reviewed patch, task 1.3. */
const AUTHORISED = ["src/lib/store/host.ts", "src/lib/store/env.ts", "src/lib/store/posthog-server.ts"];
/** Frozen files a founder decision retired, each with that decision: the only deletions accepted, and each one's
 *  reviewed deletion patch must cite it. D054 item 7 (2026-10-14, task 6.6): the Ideabaaz partner page is not needed,
 *  so /ideabaaz is a store dead end; its page and that page's frozen test go. */
const RETIRED: Readonly<Record<string, string>> = {
  "src/app/store/ideabaaz/page.tsx": "D054",
  "src/app/store/ideabaaz/page.test.tsx": "D054",
};
/** Files a founder decision ADDED to a frozen folder after the tag: the only additions accepted, each with that decision
 *  (the mirror of RETIRED). D075 (K-124b, 2026-11-26): migration 0005 adds `preorders.ph_session_id`, applied by hand
 *  BEFORE the code that writes it deploys. Listing a path here accepts that one path and nothing near it. */
const ADDED: Readonly<Record<string, string>> = {
  "supabase/migrations/0005_ph_session_id.sql": "D075",
};
/** Inside a frozen folder but owned by a task (guard-test ownership): 1.3 changes it with posthog-server.ts. */
const NOT_FROZEN = ["src/lib/store/posthog-server.test.ts"];
/** Presentation files (ADR-013 class 3): guarded by checkout-signature and checkout-jsx-contract. */
const isPresentation = (p: string) =>
  (/^src\/app\/store\/.+\.tsx$/.test(p) && !/\.(test|stories)\.tsx$/.test(p)) ||
  /^src\/features\/preorder\/components\/(PreorderForm|OrderSummary|AddressForm)\.tsx$/.test(p);

const SITE = "src/config/site.ts";
const MONEY_START = /^\/\* ── Money ─/;
const MONEY_END = /^export const CAP_UNITS_TEXT\b/;

const PATCH_DIR = join(ROOT, "test/guards/fixtures/authorised-diffs");

/* ── Unified-diff application: strict, every context and removed line must match ──────────── */

function applyPatch(original: string, patch: string): string {
  const src = original.split("\n");
  const out: string[] = [];
  let at = 0; // index into src
  const lines = patch.split("\n");
  let i = lines.findIndex((l) => l.startsWith("@@"));
  if (i < 0) throw new Error("patch has no hunks");
  let noNewlineAtEnd = false;
  while (i < lines.length && lines[i].startsWith("@@")) {
    const m = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/.exec(lines[i]);
    if (!m) throw new Error(`bad hunk header: ${lines[i]}`);
    const start = Math.max(0, Number(m[1]) - (m[2] === "0" ? 0 : 1));
    if (start < at) throw new Error("overlapping hunks");
    out.push(...src.slice(at, start));
    at = start;
    i++;
    while (i < lines.length && !lines[i].startsWith("@@") && !lines[i].startsWith("diff --git")) {
      const l = lines[i];
      if (l.startsWith("\\")) {
        if (lines[i - 1]?.startsWith("+") || lines[i - 1]?.startsWith(" ")) noNewlineAtEnd = true;
      } else if (l.startsWith(" ") || l.startsWith("-")) {
        if (src[at] !== l.slice(1)) {
          throw new Error(`patch does not apply at line ${at + 1}: expected ${JSON.stringify(l.slice(1))}, found ${JSON.stringify(src[at])}`);
        }
        if (l.startsWith(" ")) out.push(src[at]);
        at++;
      } else if (l.startsWith("+")) {
        out.push(l.slice(1));
      } else if (l === "" && i === lines.length - 1) {
        // trailing newline of the patch file
      } else {
        throw new Error(`unexpected patch line: ${JSON.stringify(l)}`);
      }
      i++;
    }
  }
  out.push(...src.slice(at));
  let text = out.join("\n");
  if (noNewlineAtEnd && text.endsWith("\n")) text = text.slice(0, -1);
  return text;
}

/** A reviewed patch that deletes its file (git's `deleted file mode`, `+++ /dev/null`). */
const isDeletion = (patch: string) => /^\+\+\+ \/dev\/null$/m.test(patch);
/** The reviewed patch's own words, above the diff: where it must cite its decision. */
const patchHeader = (patch: string) => patch.slice(0, Math.max(0, patch.search(/^diff --git /m)));

/** The files a frozen folder gained that no founder decision added: ADDED accepts a path only by exact match. */
const unauthorisedAdditions = (added: readonly string[]) => added.filter((p) => !Object.hasOwn(ADDED, p));

/** The statements of a migration, comments stripped, whitespace collapsed. (A `;` inside a quoted string would split
 *  one; the checks below then fail loudly rather than pass, so keep one out of an additive migration's comment text.) */
const sqlStatements = (sql: string) =>
  sql
    .split("\n")
    .filter((l) => !l.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((st) => st.replace(/\s+/g, " ").trim())
    .filter(Boolean);
const ADD_COLUMN = /^alter table public\.[a-z_]+ add column if not exists [a-z_]+ (?:text|jsonb|boolean|integer|timestamptz)$/i;
const COMMENT_COLUMN = /^comment on column public\.[a-z_]+\.[a-z_]+ is '(?:[^']|'')*'$/i;
/** An additive migration adds a nullable column (no default, no constraint) and comments on a column: nothing else. */
const additiveOnly = (sql: string) => {
  const statements = sqlStatements(sql);
  return statements.length > 0 && statements.every((st) => ADD_COLUMN.test(st) || COMMENT_COLUMN.test(st));
};

/* ── Literal-only: token streams equal once literals are masked ───────────────────────────── */

const LITERALS = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TemplateHead,
  ts.SyntaxKind.TemplateMiddle,
  ts.SyntaxKind.TemplateTail,
  ts.SyntaxKind.RegularExpressionLiteral,
]);

function maskedTokens(path: string, text: string): string[] {
  const sf = parseSource(path, text);
  const out: string[] = [];
  const visit = (node: ts.Node) => {
    const kids = node.getChildren(sf);
    if (kids.length === 0) {
      if (node.kind === ts.SyntaxKind.EndOfFileToken) return;
      out.push(LITERALS.has(node.kind) ? `${ts.SyntaxKind[node.kind]}:<literal>` : `${ts.SyntaxKind[node.kind]}:${node.getText(sf)}`);
      return;
    }
    kids.forEach(visit);
  };
  visit(sf);
  return out;
}

function literalOnlyDiff(path: string, before: string, after: string): string | null {
  const a = maskedTokens(path, before);
  const b = maskedTokens(path, after);
  const n = Math.max(a.length, b.length);
  for (let k = 0; k < n; k++) {
    if (a[k] !== b[k]) return `token ${k}: ${a[k] ?? "(end)"} → ${b[k] ?? "(end)"}`;
  }
  return null;
}

/* ── The money block of site.ts ───────────────────────────────────────────────────────────── */

function moneyBlock(text: string): string | null {
  const lines = text.split("\n");
  const s = lines.findIndex((l) => MONEY_START.test(l));
  const e = lines.findIndex((l, k) => k > s && MONEY_END.test(l));
  return s < 0 || e < 0 ? null : lines.slice(s, e + 1).join("\n");
}

/* ── Self-tests: the instrument records ───────────────────────────────────────────────────── */

describe("checkout-freeze instruments", () => {
  const base = "a\nb\nc\nd\n";
  it("applies a strict unified diff, and refuses one that does not apply", () => {
    const patch = "--- a/x\n+++ b/x\n@@ -2,2 +2,2 @@\n b\n-c\n+C\n";
    expect(applyPatch(base, patch)).toBe("a\nb\nC\nd\n");
    expect(() => applyPatch("a\nB\nc\nd\n", patch)).toThrow(/does not apply/);
  });

  it("accepts a copy change in a test and refuses a changed assertion", () => {
    const t = `expect(screen.getByText("Pay ₹499 and reserve")).toBeInTheDocument();`;
    expect(literalOnlyDiff("x.test.tsx", t, t.replace("Pay ₹499 and reserve", "Pay ₹499 to reserve"))).toBeNull();
    expect(literalOnlyDiff("x.test.tsx", t, t.replace("toBeInTheDocument", "toBeDefined"))).not.toBeNull();
    expect(literalOnlyDiff("x.test.tsx", t, `// ${t}`)).not.toBeNull();
    expect(literalOnlyDiff("x.test.tsx", "a(/x/);", "a(/y/);")).toBeNull();
  });

  it("tells a deletion patch from an edit, and reads the header above the diff", () => {
    const deletion = "Why: D054 item 7.\n\ndiff --git a/x b/x\ndeleted file mode 100644\n--- a/x\n+++ /dev/null\n@@ -1,1 +0,0 @@\n-a\n";
    expect(isDeletion(deletion)).toBe(true);
    expect(isDeletion("--- a/x\n+++ b/x\n@@ -2,2 +2,2 @@\n b\n-c\n+C\n")).toBe(false);
    expect(patchHeader(deletion)).toBe("Why: D054 item 7.\n\n");
  });

  it("accepts only the added file the guard lists, by exact path, and nothing next to it", () => {
    const listed = Object.keys(ADDED);
    expect(listed.length).toBeGreaterThan(0);
    expect(unauthorisedAdditions(listed)).toEqual([]);
    expect(unauthorisedAdditions(["supabase/migrations/0006_other.sql"])).toEqual(["supabase/migrations/0006_other.sql"]);
    expect(unauthorisedAdditions([`${listed[0]}.bak`, `x/${listed[0]}`, "src/lib/store/new-file.ts"])).toHaveLength(3);
  });

  it("calls a migration additive only when it adds a nullable column and comments on it", () => {
    const add = "alter table public.preorders\n  add column if not exists ph_session_id text;\n";
    const note = "comment on column public.preorders.ph_session_id is 'it''s a note';\n";
    expect(additiveOnly(`-- header\n${add}\n${note}`)).toBe(true);
    expect(additiveOnly(add)).toBe(true);
    for (const bad of [
      "drop table public.preorders;",
      "alter table public.preorders drop column email;",
      "alter table public.preorders add column ph_session_id text;",
      "alter table public.preorders add column if not exists ph_session_id text not null;",
      "alter table public.preorders add column if not exists ph_session_id text default 'x';",
      "update public.preorders set status = 'paid';",
      "grant select on public.preorders to anon;",
      `${add}\ndelete from public.preorders;`,
      "-- only a comment",
    ]) {
      expect(additiveOnly(bad), bad).toBe(false);
    }
  });

  it("finds the money block at the tag", () => {
    const block = moneyBlock(tagText(SITE)!);
    expect(block).toMatch(/LAUNCH_AMOUNT_PAISE = 499_900/);
    expect(block).toMatch(/CAP_UNITS_TEXT/);
  });
});

/* ── The freeze ───────────────────────────────────────────────────────────────────────────── */

const patches = new Map<string, string>();
if (existsSync(PATCH_DIR)) {
  for (const f of readdirSync(PATCH_DIR).filter((n) => n.endsWith(".patch"))) {
    patches.set(f.slice(0, -".patch".length).split("__").join("/"), readRepoFile(`test/guards/fixtures/authorised-diffs/${f}`));
  }
}

const frozenAtTag = [
  ...tagFiles(FROZEN_DIRS).filter((p) => !AUTHORISED.includes(p) && !NOT_FROZEN.includes(p)),
  ...FROZEN_FILES,
  ...CHECKOUT_TESTS,
];

function expectedBytes(path: string): Buffer {
  const then = tagBytes(path);
  if (then === null) throw new Error(`${path} is not in ${FREEZE_TAG}`);
  const patch = patches.get(path);
  if (!patch) return then;
  const patched = applyPatch(then.toString("utf8"), patch);
  if (/\.test\.tsx?$/.test(path)) {
    const why = literalOnlyDiff(path, then.toString("utf8"), patched);
    if (why) throw new Error(`${path}: the reviewed patch is not literal-only (${why})`);
  }
  return Buffer.from(patched, "utf8");
}

describe(`checkout-freeze: frozen logic equals ${FREEZE_TAG}`, () => {
  it("lists a real frozen set", () => {
    expect(frozenAtTag.length).toBeGreaterThan(40);
    expect(frozenAtTag).toContain("src/lib/store/fulfil.ts");
    expect(frozenAtTag).toContain("src/app/api/razorpay/webhook/route.ts");
    expect(frozenAtTag).toContain("src/features/preorder/lib/checkout.ts");
    console.log(
      `[checkout-freeze] ${frozenAtTag.length} frozen files, ${AUTHORISED.length} authorised (D048), ` +
        `${patches.size} reviewed patch(es)${patches.size ? `: ${[...patches.keys()].join(", ")}` : ""}.`,
    );
  });

  it.each([...frozenAtTag, ...AUTHORISED])("%s", (path) => {
    const patch = patches.get(path);
    if (patch && isDeletion(patch)) {
      expect(RETIRED[path], `${path}: a deletion is accepted only for a file RETIRED lists with its founder decision`).toBeDefined();
      return; // the retired files' own test below proves the rest
    }
    expect(existsSync(join(ROOT, path)), `${path} was deleted`).toBe(true);
    const now = readRepoBytes(path);
    const expected = expectedBytes(path);
    expect(
      now.equals(expected),
      patches.has(path)
        ? `${path} differs from ${FREEZE_TAG} + its reviewed patch`
        : `${path} differs from ${FREEZE_TAG} and has no reviewed patch in test/guards/fixtures/authorised-diffs/`,
    ).toBe(true);
  });

  it.each(Object.entries(RETIRED))("%s stays retired by its reviewed deletion, citing %s", (path, decision) => {
    const patch = patches.get(path);
    expect(patch && isDeletion(patch), `${path}: no reviewed deletion patch in test/guards/fixtures/authorised-diffs/`).toBe(true);
    expect(patchHeader(patch!), `${path}: a deletion must cite ${decision}, the founder decision that removed its subject`).toMatch(
      new RegExp(`\\b${decision}\\b`),
    );
    expect(existsSync(join(ROOT, path)), `${path} was retired by its reviewed deletion and must stay deleted`).toBe(false);
    console.log(`[checkout-freeze] ${path}: retired by its reviewed deletion (${decision})`);
  });

  it("no frozen folder has gained a file, except the ones a founder decision added (ADDED)", () => {
    const then = new Set(tagFiles(FROZEN_DIRS));
    const added = unauthorisedAdditions(listFiles(FROZEN_DIRS).filter((p) => !then.has(p)));
    expect(added, `new files inside frozen folders: ${added.join(", ")}`).toEqual([]);
  });

  it.each(Object.entries(ADDED))("%s is added by its founder decision, %s, and is only additive", (path, decision) => {
    expect(FROZEN_DIRS.some((d) => path.startsWith(d)), `${path} is not inside a frozen folder, so it needs no allowance`).toBe(true);
    expect(tagBytes(path), `${path} is in ${FREEZE_TAG}: a file the tag has is frozen, not added`).toBeNull();
    expect(existsSync(join(ROOT, path)), `${path} is listed in ADDED but is not there: drop the allowance with the file`).toBe(true);
    const text = readRepoFile(path);
    const header = text
      .split("\n")
      .filter((l) => l.startsWith("--"))
      .join("\n");
    expect(header, `${path}: its own header must cite ${decision}, the founder decision that added it`).toMatch(new RegExp(`\\b${decision}\\b`));
    expect(
      readdirSync(join(ROOT, "wiki/decisions")).some((f) => f.startsWith(`${decision}-`)),
      `${decision} has no note in wiki/decisions`,
    ).toBe(true);
    expect(additiveOnly(text), `${path} may only add a nullable column and comment on it`).toBe(true);
    console.log(`[checkout-freeze] ${path}: added by its founder decision (${decision})`);
  });

  it("keeps the money block of src/config/site.ts byte-identical", () => {
    const then = moneyBlock(tagText(SITE)!);
    const now = moneyBlock(readRepoFile(SITE));
    expect(now, "the money block's first or last line moved: /* ── Money … */ to CAP_UNITS_TEXT").not.toBeNull();
    expect(now).toBe(then);
  });

  it("stores reviewed patches only for frozen, authorised or presentation files", () => {
    const allowed = new Set([...frozenAtTag, ...AUTHORISED]);
    const records = [...patches.keys()].filter((p) => !allowed.has(p) && isPresentation(p));
    const stray = [...patches.keys()].filter((p) => !allowed.has(p) && !isPresentation(p));
    if (records.length) console.log(`[checkout-freeze] presentation review records (not applied): ${records.join(", ")}`);
    expect(stray, `patches for paths outside the checkout freeze: ${stray.join(", ")}`).toEqual([]);
  });
});
