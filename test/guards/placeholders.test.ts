// Guard for the placeholder build guard (task 2.9; architecture §6.2, §14; ADR-004; QA review N25).
//
// scripts/guards/placeholders.mjs scans src/ (prebuild step 30) and the prerendered output in
// .next/server/app (postbuild step 10) for an open placeholder: the inline token, the data
// helper's call, the visible marker and a draft legal document. A production build
// (resolveSiteEnv(process.env) === "production", imported from src/config/env.ts) stops on any of
// them; beta, preview and development print the count and the list and carry on.
//
// Every fixture is a throwaway tree in the OS temp folder: nothing here writes into the repo.
// This file lives outside src/, so the scan never reads it; the markers are still spelled in one
// piece only where a test plants them on purpose.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import {
  isHiddenPlaceholder,
  isPlaceholder,
  PLACEHOLDER_TOKEN_HINT,
  placeholder,
  placeholderText,
  withoutHiddenSlots,
} from "@/lib/content/placeholder";
import {
  EXCLUDED,
  decide,
  findPlaceholders,
  isNeverShipped,
  scanBuild,
  scanSource,
} from "../../scripts/guards/placeholders.mjs";

const REPO = join(__dirname, "..", "..");
const GUARD = join(REPO, "scripts", "guards", "placeholders.mjs");
const PREBUILD_STEP = join(REPO, "scripts", "steps", "prebuild", "30-placeholders.mjs");
const POSTBUILD_STEP = join(REPO, "scripts", "steps", "postbuild", "10-placeholders-html.mjs");

/* ── fixtures ─────────────────────────────────────────────────────────────── */

const made: string[] = [];
afterAll(() => {
  for (const dir of made) rmSync(dir, { recursive: true, force: true });
});

/** A throwaway repo root holding exactly these files (paths relative to the root). */
function tree(files: Record<string, string | Buffer>): string {
  const root = mkdtempSync(join(tmpdir(), "kh-placeholders-"));
  made.push(root);
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
}

const CLEAN_MODULE = `export const offer = { line: "Kheelu is {price:headline} (incl. GST)" };\n`;
const PLANTED_MODULE = `export const team = [\n  { term: "Recognition", value: "{ph:F11 proof of the recognition}" },\n];\n`;
const PLANTED_PATH = "src/content/en-IN/fixture-team.ts";

/** Runs a script under exactly these environment variables (the parent's are not inherited, so
 *  a KH_SITE_ENV or VERCEL_ENV in the shell running the tests cannot change the answer). */
function run(script: string, args: string[], vars: Record<string, string> = {}) {
  const r = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    // NODE_ENV only because Next's types require it on ProcessEnv; the guard never reads it.
    env: { PATH: process.env.PATH ?? "", NODE_ENV: "test" as const, ...vars },
  });
  return { code: r.status, out: r.stdout, err: r.stderr, all: `${r.stdout}${r.stderr}` };
}

/* ── the patterns ─────────────────────────────────────────────────────────── */

describe("the patterns are the syntax task 1.6 defines", () => {
  it("catches the marker placeholderText() renders, with and without an id", () => {
    for (const marker of [placeholderText(placeholder("F4", "size and weight")), placeholderText(placeholder(null, "region"))]) {
      expect(findPlaceholders(marker).map((h) => h.pattern), marker).toEqual(["marker"]);
    }
  });

  it("catches the inline token as authors are told to write it", () => {
    expect(findPlaceholders(PLACEHOLDER_TOKEN_HINT).map((h) => h.pattern)).toEqual(["token"]);
  });
});

describe("findPlaceholders: one text", () => {
  it.each([
    ["the inline token", `value: "{ph:F4 size and weight}"`, "token"],
    ["a token with no id", `"{ph:region}"`, "token"],
    ["the data helper's call", `approvedOn: placeholder("F4", "approval date"),`, "helper"],
    ["the visible marker", `<td>[PLACEHOLDER F4: size and weight]</td>`, "marker"],
    ["a draft legal document", `  status: "draft",`, "draft"],
    ["a draft in single quotes", `status: 'draft'`, "draft"],
    ["a draft as JSON", `{"status":"draft","approvedOn":"x"}`, "draft"],
    ["a draft in escaped flight data", `self.__next_f.push([1,"{\\"status\\":\\"draft\\"}"])`, "draft"],
    // Task 2.13: a template literal is a string too.
    ["a draft in backticks", "  status: `draft`,", "draft"],
    ["a draft in backticks, no spaces", "{status:`draft`}", "draft"],
  ])("red on %s", (_name, text, pattern) => {
    expect(findPlaceholders(text).map((h) => h.pattern)).toEqual([pattern]);
  });

  it.each([
    ["the token spelled in pieces (task 1.6's tests)", `const ph = (b: string) => "{" + "ph:" + b + "}";`],
    ["the marker spelled in pieces", `const OPEN = "[" + "PLACEHOLDER";`],
    ["the helper imported under another name", `import { placeholder as ph } from "./placeholder";`],
    ["the other helpers", `isPlaceholder(x) || placeholderText(x) || parsePlaceholderToken(b)`],
    ["the runtime tag", `kind: "placeholder"`],
    ["an input's placeholder attribute", `<input placeholder="Your name" />`],
    ["the CSS pseudo-element", `.kh-input::placeholder { color: var(--ink-3); }`],
    ["an approved legal document", `status: "approved",`],
    ["the hint's constant name", `PLACEHOLDER_TOKEN_HINT`],
  ])("green on %s", (_name, text) => {
    expect(findPlaceholders(text)).toEqual([]);
  });

  it("counts every occurrence and gives its 1-based line", () => {
    const text = `line one\n{ph:F4 size} and {ph:F4 weight}\nstatus: "draft"\n`;
    expect(findPlaceholders(text).map((h) => [h.pattern, h.line])).toEqual([
      ["token", 2],
      ["token", 2],
      ["draft", 3],
    ]);
  });
});

/* ── the source scan ──────────────────────────────────────────────────────── */

describe("scanSource: src/ before next build", () => {
  it("finds a token planted in a content module, by file and line", () => {
    const scan = scanSource(tree({ [PLANTED_PATH]: PLANTED_MODULE, "src/content/en-IN/offer.ts": CLEAN_MODULE }));
    expect(scan.missing).toBe(false);
    expect(scan.files).toBe(2);
    expect(scan.findings).toEqual([
      expect.objectContaining({ file: PLANTED_PATH, line: 2, pattern: "token", excerpt: expect.stringContaining("{ph:F11 proof of the recognition}") }),
    ]);
  });

  it("never trips on the two files that define the syntax, whatever they hold", () => {
    const all = `{ph:F11 x}\nplaceholder("F11", "x")\n[PLACEHOLDER F11: x]\nstatus: "draft"\n`;
    expect(EXCLUDED).toEqual(["src/lib/content/placeholder.ts", "src/content/types.ts"]);
    const scan = scanSource(tree({ "src/lib/content/placeholder.ts": all, "src/content/types.ts": all }));
    expect(scan.findings).toEqual([]);
    expect(scan.excluded).toEqual(EXCLUDED);
  });

  it("excludes by exact path only: the same names anywhere else are scanned", () => {
    const token = `export const x = "{ph:F11 x}";\n`;
    const scan = scanSource(
      tree({
        "src/lib/content/placeholder.tsx": token,
        "src/content/en-IN/placeholder.ts": token,
        "src/lib/types.ts": token,
        "src/content/types.tsx": token,
      }),
    );
    expect(scan.findings.map((f: { file: string }) => f.file).sort()).toEqual([
      "src/content/en-IN/placeholder.ts",
      "src/content/types.tsx",
      "src/lib/content/placeholder.tsx",
      "src/lib/types.ts",
    ]);
  });

  /* Wave-2 close ruling (task 2.13): files that never ship are not scanned, and their count is
     printed; the postbuild scan of the prerendered output still covers everything that ships. */
  const NEVER_SHIPPED_FILES = {
    "src/components/ui/X/X.test.tsx": "[PLACEHOLDER F4: x]",
    "src/lib/content/placeholder.test.ts": "{ph:F11 x}",
    "src/components/ui/X/X.spec.ts": "{ph:F11 x}",
    "src/components/ui/X/X.test-d.tsx": "{ph:F11 x}",
    "src/components/ui/X/X.stories.tsx": "[PLACEHOLDER F4: x]",
    "src/components/ui/X/X.stories.mdx": "{ph:F11 x}",
    "src/components/ui/X/__snapshots__/X.test.tsx.snap": "[PLACEHOLDER F4: x]",
    "src/lib/seo/schema/__snapshots__/notes.txt": "{ph:F11 x}",
    "src/lib/seo/schema/__fixtures__/schema-fixture.html": "[PLACEHOLDER F4: x]",
    "src/content/__fixtures__/legal/privacy.ts": `export const privacy = { status: "draft" };\n`,
  };

  it("skips the files that never ship: tests, specs, type tests, stories, snapshots, fixtures", () => {
    const scan = scanSource(tree({ ...NEVER_SHIPPED_FILES, "src/content/en-IN/offer.ts": CLEAN_MODULE }));
    expect(scan.findings).toEqual([]);
    expect(scan.files).toBe(1);
    expect(scan.notShipped).toBe(Object.keys(NEVER_SHIPPED_FILES).length);
  });

  it.each([
    ["a module whose name holds the word test", "src/lib/latest.ts"],
    ["a module named for a spec sheet", "src/content/en-IN/specs.ts"],
    ["a stories content module", "src/content/en-IN/stories/hub.ts"],
    ["a fixtures folder without the underscores", "src/content/fixtures/x.ts"],
    ["a snapshot-like name outside __snapshots__", "src/lib/x.snap.ts"],
  ])("still scans %s (%s)", (_name, path) => {
    const scan = scanSource(tree({ [path]: `export const x = "{ph:F11 x}";\n` }));
    expect(scan.findings.map((f: { file: string }) => f.file)).toEqual([path]);
    expect(scan.notShipped).toBe(0);
  });

  /* The 2.13 review: dynamic routes (/store/*, /api/*) are never prerendered, so the output scan
     never reads them; a shipped file importing a fixture slipped past both scans. A never-shipped
     file that shipped code imports (relative or @/, followed through every hop) ships, so it is
     scanned and named. */
  const FIXTURE_NOTE = `export const note = { text: "{ph:F11 recognition}", status: "draft" };\n`;

  it("scans a fixture a shipped store route imports, and production refuses it", () => {
    const root = tree({
      "src/app/store/x/page.tsx": `import { note } from "./__fixtures__/note";\nexport default function Page() { return <p>{note.text}</p>; }\n`,
      "src/app/store/x/__fixtures__/note.ts": FIXTURE_NOTE,
    });
    const scan = scanSource(root);
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`)).toEqual([
      "src/app/store/x/__fixtures__/note.ts token",
      "src/app/store/x/__fixtures__/note.ts draft",
    ]);
    expect(scan.files).toBe(2);
    expect(scan.notShipped).toBe(0);
    expect(scan.importedNeverShipped).toEqual([{ file: "src/app/store/x/__fixtures__/note.ts", by: "src/app/store/x/page.tsx" }]);
    expect(decide("production", scan).code).toBe(1);
  });

  it.each([
    ["an export-from", `export { note } from "./__fixtures__/note";`, "src/lib/__fixtures__/note.ts"],
    ["an export-star", `export * from "@/lib/__fixtures__/note";`, "src/lib/__fixtures__/note.ts"],
    ["a side-effect import", `import "./__fixtures__/note.css";`, "src/lib/__fixtures__/note.css"],
    ["a dynamic import", `export const load = () => import("./__fixtures__/note");`, "src/lib/__fixtures__/note.ts"],
    ["a require", `const n = require("../lib/__fixtures__/note.json");`, "src/lib/__fixtures__/note.json"],
    ["a folder's index", `import { note } from "@/lib/__fixtures__/dir";`, "src/lib/__fixtures__/dir/index.tsx"],
    ["a story by its full name", `import { meta } from "./X.stories.tsx";`, "src/lib/X.stories.tsx"],
    ["a multi-line import", `import {\n  note,\n} from "./__fixtures__/note";`, "src/lib/__fixtures__/note.ts"],
  ])("follows %s to the never-shipped file it names", (_name, importer, target) => {
    const scan = scanSource(
      tree({
        "src/lib/shipped.ts": `${importer}\n`,
        [target]: `export const note = "{ph:F11 x}";\n`,
        "src/lib/__fixtures__/other.ts": `export const other = "{ph:F11 y}";\n`,
      }),
    );
    expect(scan.findings.map((f: { file: string }) => f.file)).toEqual([target]);
    expect(scan.notShipped).toBe(1);
  });

  it("follows every hop: a pulled-in fixture's own imports ship too", () => {
    const scan = scanSource(
      tree({
        "src/lib/a.ts": `export { b } from "@/lib/__fixtures__/b";\n`,
        "src/lib/__fixtures__/b.ts": `export * from "./c.test-d";\n`,
        "src/lib/__fixtures__/c.test-d.ts": `export const c = "{ph:F11 c}";\n`,
      }),
    );
    expect(scan.findings.map((f: { file: string }) => f.file)).toEqual(["src/lib/__fixtures__/c.test-d.ts"]);
    expect(scan.importedNeverShipped).toEqual([
      { file: "src/lib/__fixtures__/b.ts", by: "src/lib/a.ts" },
      { file: "src/lib/__fixtures__/c.test-d.ts", by: "src/lib/__fixtures__/b.ts" },
    ]);
    expect(scan.notShipped).toBe(0);
  });

  it("leaves a fixture alone when only tests, stories or packages name it", () => {
    const scan = scanSource(
      tree({
        "src/lib/a.test.ts": `import { note } from "./__fixtures__/note";\n`,
        "src/lib/a.stories.tsx": `import { note } from "@/lib/__fixtures__/note";\n`,
        "src/lib/a.ts": `import x from "__fixtures__/note";\nimport y from "@ds/__fixtures__/note";\nimport z from "./__fixtures__/missing";\nexport const s = "./__fixtures__/note";\n`,
        "src/lib/__fixtures__/note.ts": FIXTURE_NOTE,
      }),
    );
    expect(scan.findings).toEqual([]);
    expect(scan.importedNeverShipped).toEqual([]);
    expect(scan.notShipped).toBe(3);
  });

  it.each([
    ["src/components/ui/X/X.test.tsx", true],
    ["src/components/ui/X/X.spec.ts", true],
    ["src/components/ui/X/X.test-d.ts", true],
    ["src/components/ui/X/X.stories.tsx", true],
    ["src/a/__snapshots__/b.snap", true],
    ["src/a/__fixtures__/b.html", true],
    ["src/content/en-IN/stories/hub.ts", false],
    ["src/lib/latest.ts", false],
    ["src/content/en-IN/specs.ts", false],
  ])("isNeverShipped(%s) is %s", (path, expected) => {
    expect(isNeverShipped(path)).toBe(expected);
  });

  it("reads every text file in src/: modules, components, CSS, markdown, JSON", () => {
    const scan = scanSource(
      tree({
        "src/components/ui/X/X.tsx": `export const X = () => <p>[PLACEHOLDER B24: founder photo]</p>;\n`,
        "src/components/ui/X/x.css": `/* {ph:G-20 colour} */\n`,
        "src/content/en-IN/legal/privacy.ts": `export const privacy = { status: "draft" };\n`,
        "src/notes.md": `placeholder("C6", "app store links")\n`,
        "src/data.json": `{ "status": "draft" }\n`,
      }),
    );
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`).sort()).toEqual([
      "src/components/ui/X/X.tsx marker",
      "src/components/ui/X/x.css token",
      "src/content/en-IN/legal/privacy.ts draft",
      "src/data.json draft",
      "src/notes.md helper",
    ]);
  });

  it("skips binary files and dot-files, and never reads outside src/", () => {
    const binary = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]), Buffer.from("{ph:F11 x}")]);
    const scan = scanSource(
      tree({
        "src/assets/app/shot.webp": binary,
        "src/.compose.tmp": "{ph:F11 x}",
        "src/.cache/x.ts": "{ph:F11 x}",
        "scripts/x.mjs": "{ph:F11 x}",
        "test/x.test.ts": "{ph:F11 x}",
        "src/content/en-IN/offer.ts": CLEAN_MODULE,
      }),
    );
    expect(scan.findings).toEqual([]);
    expect(scan.files).toBe(1);
  });

  it("says when there is no src/ to scan", () => {
    expect(scanSource(tree({ "README.md": "x" })).missing).toBe(true);
  });
});

/* ── D054 item 19: an F4 slot is hidden, not refused (task 6.7) ──────────── */

/* The founder's ruling: a row or line still waiting on an F4 value (the product's final specs) comes off the page
   instead of blocking the build. The content layer drops it before anything renders (withoutHiddenRows,
   src/lib/content/placeholder.ts), so the slot stays in the source, where its value lands, and the source scan lists it
   as hidden instead of refusing it. Nothing else changes: every other slot, a typed marker (F4 too) and a draft are
   refused as before, and the output scan refuses an F4 slot that reached a page, since nothing of it may render. */
describe("D054 item 19: the source scan lets an F4 slot stay, hidden, and refuses every other", () => {
  const HIDDEN_MODULE = [
    'import { placeholder, withoutHiddenRows } from "@/lib/content/placeholder";',
    "export const specs = withoutHiddenRows([",
    '  { term: "Size and weight", value: "{ph:F4 size and weight}" },',
    '  { term: "Net quantity", value: placeholder("F4", "net quantity") },',
    '  { term: "Charger", value: placeholder(\'F4\', "charger type") },',
    '], "value");',
    "",
  ].join("\n");
  const HIDDEN_PATH = "src/content/en-IN/fixture-specs.ts";

  it("lists the F4 slots as hidden, by file and line, and finds nothing to refuse", () => {
    const scan = scanSource(tree({ [HIDDEN_PATH]: HIDDEN_MODULE }));
    expect(scan.findings).toEqual([]);
    expect(scan.hidden.map((h: { file: string; line: number; label: string }) => `${h.file}:${h.line} ${h.label}`)).toEqual([
      `${HIDDEN_PATH}:3 {ph:} token`,
      `${HIDDEN_PATH}:4 placeholder() call`,
      `${HIDDEN_PATH}:5 placeholder() call`,
    ]);
  });

  it("lets a production build through on hidden slots alone, and says how many it hid", () => {
    const d = decide("production", scanSource(tree({ [HIDDEN_PATH]: HIDDEN_MODULE })));
    expect(d.code).toBe(0);
    const out = d.out.join("\n");
    expect(out).toMatch(/no open placeholders/i);
    expect(out).toContain("[placeholders] hidden until their value arrives, never rendered (D054 item 19): 3 F4 slots in 1 file");
    expect(d.err).toEqual([]);
  });

  it("names the hidden slots for the founder on beta, beside the open ones", () => {
    const scan = scanSource(tree({ [HIDDEN_PATH]: HIDDEN_MODULE, [PLANTED_PATH]: PLANTED_MODULE }));
    const out = decide("beta", scan).out.join("\n");
    expect(out).toContain("1 open placeholder");
    expect(out).toContain(`${HIDDEN_PATH}:3`);
    expect(out).toContain("{ph:F4 size and weight}");
  });

  it.each([
    ["an open item that is not F4", `"{ph:F11 proof of the recognition}"`, "token"],
    ["an id that only starts like F4", `"{ph:F41 a later item}"`, "token"],
    ["a slot with no open item", `"{ph:region}"`, "token"],
    ["a helper call that is not F4", `placeholder("B24", "founder photo")`, "helper"],
    ["a helper call with no id", `placeholder(null, "the approval date")`, "helper"],
    ["an F4 marker typed in the source (it would render)", `"[PLACEHOLDER F4: size and weight]"`, "marker"],
    ["a draft legal document", `status: "draft",`, "draft"],
  ])("still refuses %s in production", (_name, plant, pattern) => {
    const scan = scanSource(tree({ [HIDDEN_PATH]: HIDDEN_MODULE, "src/content/en-IN/other.ts": `export const x = ${plant};\n` }));
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`)).toEqual([`src/content/en-IN/other.ts ${pattern}`]);
    expect(scan.hidden).toHaveLength(3);
    expect(decide("production", scan).code).toBe(1);
  });

  /* Only the content layer drops a hidden slot (withoutHiddenRows), and the output scan never reads the dynamic routes
     (/store/*, /api/*): an F4 slot anywhere else in src/ would render, so it is refused like any other. */
  it.each([
    ["a store route (dynamic, never prerendered)", "src/app/store/not-found.tsx", `export const storeSpec = "{ph:F4 battery}";\n`, "token"],
    ["a component", "src/components/ui/X/X.tsx", `export const spec = placeholder("F4", "battery");\n`, "helper"],
    ["a folder that only starts like src/content", "src/contents/x.ts", `export const spec = "{ph:F4 battery}";\n`, "token"],
  ])("still refuses an F4 slot outside src/content/ in production: %s", (_name, file, text, pattern) => {
    const scan = scanSource(tree({ [HIDDEN_PATH]: HIDDEN_MODULE, [file]: text }));
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`)).toEqual([`${file} ${pattern}`]);
    expect(scan.hidden.map((h: { file: string }) => h.file)).toEqual([HIDDEN_PATH, HIDDEN_PATH, HIDDEN_PATH]);
    expect(decide("production", scan).code).toBe(1);
  });

  /* In a content module too, only a slot inside a withoutHiddenRows( … ) call, imported from the placeholder module,
     is dropped: a value no such call holds renders as it is (6.7 review, round 2: an F4 slot in a store summary's note
     was listed as hidden, and the dynamic /store route would have printed it in production). */
  const IMPORT = 'import { placeholder, withoutHiddenRows } from "@/lib/content/placeholder";\n';
  it.each([
    ["a value no withoutHiddenRows call holds (a store summary's note)", `export const delivery = { note: "{ph:F4 charger type}" };\n`, "token"],
    [
      "a slot after the call has closed",
      `${IMPORT}export const a = withoutHiddenRows([{ value: "x" }], "value");\nexport const b = "{ph:F4 x}";\n`,
      "token",
    ],
    [
      "a slot before the call opens",
      `${IMPORT}export const b = placeholder("F4", "x");\nexport const a = withoutHiddenRows([{ value: "x" }], "value");\n`,
      "helper",
    ],
    ["a call to a look-alike name", `${IMPORT}export const a = myWithoutHiddenRows([{ value: "{ph:F4 x}" }], "value");\n`, "token"],
    [
      "a call to a withoutHiddenRows the module never imports",
      `const withoutHiddenRows = (rows) => rows;\nexport const a = withoutHiddenRows([{ value: "{ph:F4 x}" }], "value");\n`,
      "token",
    ],
    ["a call opened only in comments", `${IMPORT}/* withoutHiddenRows( */ export const a = "{ph:F4 x}"; // )\n`, "token"],
    ["a call opened only in strings", `${IMPORT}export const a = ["withoutHiddenRows(", "{ph:F4 x}", ")"];\n`, "token"],
    ["a call that never closes", `${IMPORT}export const a = withoutHiddenRows([{ value: "{ph:F4 x}" }];\n`, "token"],
  ])("still refuses an F4 slot in a content module that no withoutHiddenRows call drops: %s", (_name, text, pattern) => {
    const file = "src/content/en-IN/store/order-summary.ts";
    const scan = scanSource(tree({ [HIDDEN_PATH]: HIDDEN_MODULE, [file]: text }));
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`)).toEqual([`${file} ${pattern}`]);
    expect(scan.hidden.map((h: { file: string }) => h.file)).toEqual([HIDDEN_PATH, HIDDEN_PATH, HIDDEN_PATH]);
    expect(decide("production", scan).code).toBe(1);
  });

  it("keeps a slot hidden past the brackets, strings, comments and template literals inside the call", () => {
    const text = [
      IMPORT.trimEnd(),
      "export const specs = withoutHiddenRows([",
      "  { term: \"Languages (at launch)\", value: `${names.slice(0, -1).join(\", \")} and more)` },",
      "  { term: \"Note\", value: 'a ) and a } inside a string' }, // a ) in a comment",
      "  /* and a ) here */",
      "  { term: \"Nested\", value: `x ${`y ${f(\")\")}`} z)` },",
      "  { term: \"Size and weight\", value: \"{ph:F4 size and weight}\" },",
      "  { term: \"Battery\", value: placeholder(\"F4\", \"battery\") },",
      "], \"value\");",
      "",
    ].join("\n");
    const scan = scanSource(tree({ [HIDDEN_PATH]: text }));
    expect(scan.findings).toEqual([]);
    expect(scan.hidden.map((h: { line: number }) => h.line)).toEqual([7, 8]);
  });

  it("stops the production prebuild step on an F4 slot in a content module that no withoutHiddenRows call drops", () => {
    const file = "src/content/en-IN/store/order-summary.ts";
    const root = tree({ [HIDDEN_PATH]: HIDDEN_MODULE, [file]: `export const delivery = { note: "{ph:F4 charger type}" };\n` });
    const r = run(PREBUILD_STEP, ["--root", root], { KH_SITE_ENV: "production" });
    expect(r.code, r.all).toBe(1);
    expect(r.all).toContain(`${file}:1`);
  });

  it("stops the production prebuild step on an F4 slot in a store route", () => {
    const root = tree({ [HIDDEN_PATH]: HIDDEN_MODULE, "src/app/store/not-found.tsx": `export const storeSpec = "{ph:F4 battery}";\n` });
    const r = run(PREBUILD_STEP, ["--root", root], { KH_SITE_ENV: "production" });
    expect(r.code, r.all).toBe(1);
    expect(r.all).toContain("src/app/store/not-found.tsx:1");
  });

  it("refuses an F4 slot that reached the prerendered output: nothing of it may render", () => {
    const APP = ".next/server/app";
    const scan = scanBuild(
      tree({
        [`${APP}/products/kheelu.html`]: "<main><dd>[PLACEHOLDER F4: size and weight]</dd></main>",
        [`${APP}/setup.html`]: `<main><script>self.__next_f.push([1,"{ph:F4 the charger type}"])</script></main>`,
      }),
    );
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`).sort()).toEqual([
      "products/kheelu.html marker",
      "setup.html token",
    ]);
    expect(decide("production", scan).code).toBe(1);
  });

  it("reads which items are hidden from src/lib/content/placeholder.ts, and restates none of them", () => {
    const source = readFileSync(GUARD, "utf8");
    expect(source).toMatch(/from "\.\.\/\.\.\/src\/lib\/content\/placeholder\.ts"/);
    expect(source).toContain("isHiddenPlaceholder(");
    expect(source.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "")).not.toMatch(/["'`]F4/);
  });

  it("runs as the prebuild step: green in production on hidden slots alone, with no Node warning", () => {
    const r = run(PREBUILD_STEP, ["--root", tree({ [HIDDEN_PATH]: HIDDEN_MODULE })], { KH_SITE_ENV: "production" });
    expect(r.code, r.all).toBe(0);
    expect(r.out).toContain("3 F4 slots in 1 file");
    expect(r.all).not.toMatch(/Warning/);
  });
});

/* The exemption is safe only while every hidden slot in the live tree is dropped before anything renders: the output
   scan never reads the dynamic routes (/store/*, /api/*), so an F4 slot a component printed there would reach a parent.
   So each one must sit in a content module, and no value that module exports may still hold it. */
describe("D054 item 19: every hidden slot in the live src/ is dropped before anything renders", () => {
  const live = scanSource(REPO);
  const files = [...new Set(live.hidden.map((h: { file: string }) => h.file))] as string[];

  /** Every string and placeholder a module exports, deep (images, functions and cycles skipped). */
  function values(value: unknown, seen = new Set<unknown>()): unknown[] {
    if (typeof value === "string" || isPlaceholder(value)) return [value];
    if (!value || typeof value !== "object" || seen.has(value)) return [];
    seen.add(value);
    return Object.values(value).flatMap((v) => values(v, seen));
  }

  it("finds the live tree's hidden slots, each in a content module", () => {
    expect(files.length).toBeGreaterThan(0);
    for (const file of files) expect(file, "a hidden slot outside src/content/ is never dropped").toMatch(/^src\/content\/.+\.ts$/);
  });

  it.each(files.map((file) => [file]))("%s exports no value that still holds a hidden slot", async (file) => {
    const mod: Record<string, unknown> = await import(/* @vite-ignore */ join(REPO, file));
    const held = values(mod).filter((v) => (typeof v === "string" ? withoutHiddenSlots(v) !== v : isHiddenPlaceholder(v)));
    expect(held).toEqual([]);
  }, 60_000);
});

/* ── the prerendered-output scan ──────────────────────────────────────────── */

describe("scanBuild: the prerendered output after next build", () => {
  const APP = ".next/server/app";
  const page = (body: string) => `<!DOCTYPE html><html><body><main>${body}</main></body></html>`;

  it("finds a marker in a prerendered page and in a prerendered route body, by output file", () => {
    const scan = scanBuild(
      tree({
        [`${APP}/products/kheelu.html`]: page("<dd>[PLACEHOLDER F4: size and weight]</dd>"),
        [`${APP}/llms.txt.body`]: "Size: [PLACEHOLDER F4: size and weight]\n",
        [`${APP}/index.html`]: page("Kheelu is ₹4,999"),
      }),
    );
    expect(scan.missing).toBe(false);
    expect(scan.files).toBe(3);
    expect(scan.findings.map((f: { file: string; excerpt: string }) => [f.file, f.excerpt]).sort()).toEqual([
      ["llms.txt.body", "[PLACEHOLDER F4: size and weight]"],
      ["products/kheelu.html", "[PLACEHOLDER F4: size and weight]"],
    ]);
  });

  it("finds a raw token, a marker split by React's text separator, and a draft in flight data", () => {
    const scan = scanBuild(
      tree({
        [`${APP}/a.html`]: page("<p>{ph:F4 size}</p>"),
        [`${APP}/b.html`]: page("<p>[<!-- -->PLACEHOLDER F4: size]</p>"),
        [`${APP}/privacy.html`]: page(`<script>self.__next_f.push([1,"{\\"status\\":\\"draft\\"}"])</script>`),
      }),
    );
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`).sort()).toEqual([
      "a.html token",
      "b.html marker",
      "privacy.html draft",
    ]);
  });

  it("reads only the prerendered HTML and route bodies, and skips binary bodies", () => {
    const scan = scanBuild(
      tree({
        [`${APP}/index.html`]: page("ok"),
        [`${APP}/index.rsc`]: "{ph:F4 x}",
        [`${APP}/index.meta`]: "{ph:F4 x}",
        [`${APP}/page.js`]: "{ph:F4 x}",
        [`${APP}/icon.png.body`]: Buffer.concat([Buffer.from([0x89, 0x00]), Buffer.from("[PLACEHOLDER F4: x]")]),
      }),
    );
    expect(scan.findings).toEqual([]);
    expect(scan.files).toBe(1);
  });

  it("says when there is no prerendered HTML to scan", () => {
    expect(scanBuild(tree({ "src/x.ts": CLEAN_MODULE })).missing).toBe(true);
    expect(scanBuild(tree({ [`${APP}/llms.txt.body`]: "ok" })).missing).toBe(true);
  });

  /* Vercel's layout (scripts/prerendered.mjs): with its adapter plugged in, next build leaves .next/server/app without
     HTML and writes each prerender under .next/server/route-cache/<kind>/<hash of the source route>/$/. The beta deploy
     of 2026-10-14 found this step's sibling reading only .next/server/app; this one would have stopped production. */
  const CACHE = ".next/server/route-cache";
  const vercel = {
    [`${CACHE}/APP_PAGE/${"a".repeat(64)}/$/products/kheelu.html`]: page("<dd>[PLACEHOLDER F4: size and weight]</dd>"),
    [`${CACHE}/APP_PAGE/${"b".repeat(64)}/$/index.html`]: page("Kheelu"),
    [`${CACHE}/APP_ROUTE/${"c".repeat(64)}/$/llms.txt.body`]: "{ph:F4 battery}\n",
    [`${APP}/(site)/page.js`]: "{ph:F4 x}",
  };

  it("finds a marker in Vercel's layout, by the same URL path", () => {
    const scan = scanBuild(tree(vercel));
    expect(scan.missing).toBe(false);
    expect(scan.files).toBe(3);
    expect(scan.findings.map((f: { file: string; pattern: string }) => `${f.file} ${f.pattern}`).sort()).toEqual([
      "llms.txt.body token",
      "products/kheelu.html marker",
    ]);
    expect(decide("production", scan).code).toBe(1);
  });

  it("vouches for a clean build in Vercel's layout: production passes", () => {
    const clean = Object.fromEntries(Object.keys(vercel).map((path) => [path, path.endsWith(".js") ? "" : page("ok")]));
    const scan = scanBuild(tree(clean));
    expect(scan.missing).toBe(false);
    expect(decide("production", scan).code).toBe(0);
  });
});

/* ── what each environment does ───────────────────────────────────────────── */

describe("decide: production refuses, every other environment reports", () => {
  const dirty = scanSource(tree({ [PLANTED_PATH]: PLANTED_MODULE }));
  const clean = scanSource(tree({ "src/content/en-IN/offer.ts": CLEAN_MODULE }));
  const nothing = scanBuild(tree({ "src/x.ts": CLEAN_MODULE }));

  it("production with an open placeholder: exit 1, the list on stderr, and why", () => {
    const d = decide("production", dirty);
    expect(d.code).toBe(1);
    const err = d.err.join("\n");
    expect(err).toContain("1 open placeholder");
    expect(err).toContain(`${PLANTED_PATH}:2`);
    expect(err).toMatch(/production build (?:refused|stops)/i);
  });

  it("production with none: exit 0", () => {
    const d = decide("production", clean);
    expect(d.code).toBe(0);
    expect(d.out.join("\n")).toMatch(/no open placeholders/i);
  });

  it.each(["beta", "preview", "development"] as const)("%s: exit 0, with the count and the list", (env) => {
    const d = decide(env, dirty);
    expect(d.code).toBe(0);
    const out = d.out.join("\n");
    expect(out).toContain("1 open placeholder");
    expect(out).toContain(`${PLANTED_PATH}:2`);
    expect(out).toContain("{ph:F11 proof of the recognition}");
    expect(d.err).toEqual([]);
  });

  it("prints the two excluded files on every source run", () => {
    for (const d of [decide("production", clean), decide("beta", dirty)]) {
      const text = [...d.out, ...d.err].join("\n");
      for (const path of EXCLUDED) expect(text).toContain(path);
    }
  });

  it("prints how many files were not scanned because they never ship, on every source run", () => {
    const withTests = (files: Record<string, string>) =>
      scanSource(tree({ ...files, "src/a/A.test.tsx": "{ph:F11 x}", "src/a/A.stories.tsx": "x", "src/a/__fixtures__/f.html": "x" }));
    const runs = [
      decide("production", withTests({ "src/content/en-IN/offer.ts": CLEAN_MODULE })),
      decide("production", withTests({ [PLANTED_PATH]: PLANTED_MODULE })),
      decide("beta", withTests({ [PLANTED_PATH]: PLANTED_MODULE })),
      decide("development", withTests({ "src/content/en-IN/offer.ts": CLEAN_MODULE })),
    ];
    for (const d of runs) {
      expect([...d.out, ...d.err].join("\n")).toContain("[placeholders] not scanned (never shipped): 3 files");
    }
    expect(runs.map((d) => d.code)).toEqual([0, 1, 0, 0]);
  });

  it("names each never-shipped file it scanned because shipped code imports it, and says nothing when none is", () => {
    const pulled = scanSource(
      tree({
        "src/app/store/x/page.tsx": `import { note } from "./__fixtures__/note";\n`,
        "src/app/store/x/__fixtures__/note.ts": `export const note = "ok";\n`,
      }),
    );
    for (const d of [decide("production", pulled), decide("beta", dirty)]) expect(d.code).toBe(0);
    expect(decide("production", pulled).out).toContain(
      "[placeholders] scanned as shipped (shipped code imports them): src/app/store/x/__fixtures__/note.ts (from src/app/store/x/page.tsx)",
    );
    expect(decide("beta", dirty).out.join("\n")).not.toContain("scanned as shipped");
  });

  it("says nothing about never-shipped files on an output scan (everything there ships)", () => {
    const d = decide("beta", scanBuild(tree({ ".next/server/app/index.html": "<main>ok</main>" })));
    expect([...d.out, ...d.err].join("\n")).not.toContain("never shipped");
  });

  it("production with nothing to scan: exit 1 (an empty scan cannot vouch for a build); elsewhere a note and exit 0", () => {
    expect(decide("production", nothing).code).toBe(1);
    expect(decide("production", nothing).err.join("\n")).toMatch(/nothing to scan/i);
    expect(decide("beta", nothing).code).toBe(0);
    expect(decide("beta", nothing).out.join("\n")).toMatch(/nothing to scan/i);
  });
});

/* ── the CLI and the one environment rule ─────────────────────────────────── */

describe("the CLI reads the environment through resolveSiteEnv (no second copy of the rule)", () => {
  const dirty = tree({ [PLANTED_PATH]: PLANTED_MODULE });

  it("is red on a planted token with KH_SITE_ENV=production, and green without it", () => {
    const red = run(GUARD, ["--source", "--root", dirty], { KH_SITE_ENV: "production" });
    expect(red.code, red.all).toBe(1);
    expect(red.err).toContain(PLANTED_PATH);
    const clean = run(GUARD, ["--source", "--root", tree({ "src/content/en-IN/offer.ts": CLEAN_MODULE })], { KH_SITE_ENV: "production" });
    expect(clean.code, clean.all).toBe(0);
  });

  it.each([
    ["KH_SITE_ENV=beta", { KH_SITE_ENV: "beta" }],
    ["no variables at all (development)", {}],
    ["Vercel's beta branch", { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "beta" }],
  ])("reports and exits 0 on %s", (_name, vars) => {
    const r = run(GUARD, ["--source", "--root", dirty], vars);
    expect(r.code, r.all).toBe(0);
    expect(r.out).toContain("1 open placeholder");
  });

  it("treats Vercel's production as production without any KH_SITE_ENV", () => {
    const r = run(GUARD, ["--source", "--root", dirty], { VERCEL: "1", VERCEL_ENV: "production" });
    expect(r.code, r.all).toBe(1);
  });

  it("stops with env.ts's own message when Vercel's system variables are off", () => {
    const r = run(GUARD, ["--source", "--root", dirty], { VERCEL: "1" });
    expect(r.code).not.toBe(0);
    expect(r.err).toContain("Vercel system environment variables are off");
  });

  it("imports resolveSiteEnv from src/config/env.ts and restates none of it", () => {
    const source = readFileSync(GUARD, "utf8");
    expect(source).toMatch(/src\/config\/env\.ts/);
    expect(source).toContain("resolveSiteEnv(process.env)");
    for (const name of ["VERCEL_ENV", "VERCEL_GIT_COMMIT_REF", '"production" ||']) expect(source).not.toContain(name);
  });

  it("refuses to guess what to scan", () => {
    expect(run(GUARD, []).code).toBe(2);
  });
});

/* ── the build steps ──────────────────────────────────────────────────────── */

describe("the build steps run the guard (prebuild 30 on src/, postbuild 10 on the output)", () => {
  const dirtySource = tree({ [PLANTED_PATH]: PLANTED_MODULE });
  const dirtyBuild = tree({ ".next/server/app/index.html": "<main>[PLACEHOLDER F4: size and weight]</main>" });

  it("prebuild 30: red in production, a report on beta, and no Node warning in the log", () => {
    const red = run(PREBUILD_STEP, ["--root", dirtySource], { KH_SITE_ENV: "production" });
    expect(red.code, red.all).toBe(1);
    expect(red.err).toContain(PLANTED_PATH);
    const beta = run(PREBUILD_STEP, ["--root", dirtySource], { KH_SITE_ENV: "beta" });
    expect(beta.code, beta.all).toBe(0);
    expect(beta.out).toContain(PLANTED_PATH);
    expect(red.all + beta.all).not.toMatch(/Warning/);
  });

  it("postbuild 10: red in production, a report on beta", () => {
    const red = run(POSTBUILD_STEP, ["--root", dirtyBuild], { KH_SITE_ENV: "production" });
    expect(red.code, red.all).toBe(1);
    expect(red.err).toContain("index.html");
    const beta = run(POSTBUILD_STEP, ["--root", dirtyBuild], { KH_SITE_ENV: "beta" });
    expect(beta.code, beta.all).toBe(0);
    expect(beta.out).toContain("[PLACEHOLDER F4: size and weight]");
    expect(red.all + beta.all).not.toMatch(/Warning/);
  });
});

/* ── verify's report ──────────────────────────────────────────────────────── */

describe("npm run verify reports the open placeholders in the live src/", () => {
  it("lists them in development and exits 0, naming the two excluded files (through the prebuild step)", () => {
    const r = run(PREBUILD_STEP, [], { KH_SITE_ENV: "development" });
    // Straight to stdout: this Vitest setup swallows console.log, and the report is the point.
    process.stdout.write(`${r.all.trim()}\n`);
    expect(r.code, r.all).toBe(0);
    expect(r.out).toMatch(/src\/: (?:no open placeholders|\d+ open placeholders?)/);
    for (const path of EXCLUDED) expect(r.out).toContain(path);
    expect(r.out).toMatch(/not scanned \(never shipped\): [1-9]\d* files/);
  });
});
