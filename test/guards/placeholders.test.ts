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
import { PLACEHOLDER_TOKEN_HINT, placeholder, placeholderText } from "@/lib/content/placeholder";
import {
  EXCLUDED,
  decide,
  findPlaceholders,
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
const PLANTED_MODULE = `export const specs = [\n  { term: "Size and weight", value: "{ph:F4 size and weight}" },\n];\n`;
const PLANTED_PATH = "src/content/en-IN/fixture-specs.ts";

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
      expect.objectContaining({ file: PLANTED_PATH, line: 2, pattern: "token", excerpt: expect.stringContaining("{ph:F4 size and weight}") }),
    ]);
  });

  it("never trips on the two files that define the syntax, whatever they hold", () => {
    const all = `{ph:F4 x}\nplaceholder("F4", "x")\n[PLACEHOLDER F4: x]\nstatus: "draft"\n`;
    expect(EXCLUDED).toEqual(["src/lib/content/placeholder.ts", "src/content/types.ts"]);
    const scan = scanSource(tree({ "src/lib/content/placeholder.ts": all, "src/content/types.ts": all }));
    expect(scan.findings).toEqual([]);
    expect(scan.excluded).toEqual(EXCLUDED);
  });

  it("excludes by exact path only: the same names anywhere else are scanned", () => {
    const token = `export const x = "{ph:F4 x}";\n`;
    const scan = scanSource(
      tree({
        "src/lib/content/placeholder.test.ts": token,
        "src/content/en-IN/placeholder.ts": token,
        "src/lib/types.ts": token,
        "src/content/types.tsx": token,
      }),
    );
    expect(scan.findings.map((f: { file: string }) => f.file).sort()).toEqual([
      "src/content/en-IN/placeholder.ts",
      "src/content/types.tsx",
      "src/lib/content/placeholder.test.ts",
      "src/lib/types.ts",
    ]);
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
    const binary = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]), Buffer.from("{ph:F4 x}")]);
    const scan = scanSource(
      tree({
        "src/assets/app/shot.webp": binary,
        "src/.compose.tmp": "{ph:F4 x}",
        "src/.cache/x.ts": "{ph:F4 x}",
        "scripts/x.mjs": "{ph:F4 x}",
        "test/x.test.ts": "{ph:F4 x}",
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

/* ── the prerendered-output scan ──────────────────────────────────────────── */

describe("scanBuild: .next/server/app after next build", () => {
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
    expect(out).toContain("{ph:F4 size and weight}");
    expect(d.err).toEqual([]);
  });

  it("prints the two excluded files on every source run", () => {
    for (const d of [decide("production", clean), decide("beta", dirty)]) {
      const text = [...d.out, ...d.err].join("\n");
      for (const path of EXCLUDED) expect(text).toContain(path);
    }
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
  });
});
