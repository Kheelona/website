// The build hooks are wired (task 2.9; ADR-011 "where they run", architecture §14, structure §1).
//
// scripts/run-steps.mjs (task 1.1) runs every scripts/steps/<hook>/NN-name.mjs in name order, and
// stops at the first that fails. A guard only blocks a deploy if its step file exists, the runner
// accepts its name, and the hook actually runs around the production build. This test pins all
// three for the steps the deploy depends on: DS checksums (prebuild 10, task 1.1), compose.css
// (prebuild 20, task 1.2), and the placeholder guard on src/ (prebuild 30) and on the prerendered
// output (postbuild 10), both task 2.9.
import { existsSync, globSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const REPO = join(__dirname, "..", "..");
const STEPS = join(REPO, "scripts", "steps");

const REQUIRED = [
  "prebuild/10-ds-checksums.mjs",
  "prebuild/20-compose-css.mjs",
  "prebuild/30-placeholders.mjs",
  "postbuild/10-placeholders-html.mjs",
];

/* The runner's own naming rule (scripts/run-steps.mjs): a misnamed .mjs stops the hook. */
const STEP_NAME = /^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*\.mjs$/;

const pkg = JSON.parse(readFileSync(join(REPO, "package.json"), "utf8")) as { scripts: Record<string, string> };

describe("the build steps the deploy depends on", () => {
  it.each(REQUIRED)("%s exists", (step) => {
    expect(existsSync(join(STEPS, step)), `scripts/steps/${step} is missing`).toBe(true);
  });

  it.each(["predev", "prebuild", "postbuild"])("every .mjs in %s/ is named as the runner requires", (hook) => {
    const dir = join(STEPS, hook);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".mjs")) : [];
    for (const f of files) expect(f, `${hook}/${f}`).toMatch(STEP_NAME);
  });

  it("runs the placeholder steps after DS checksums and compose.css, in name order", () => {
    const prebuild = readdirSync(join(STEPS, "prebuild")).filter((f) => f.endsWith(".mjs")).sort();
    expect(prebuild.indexOf("30-placeholders.mjs")).toBeGreaterThan(prebuild.indexOf("20-compose-css.mjs"));
    expect(prebuild.indexOf("20-compose-css.mjs")).toBeGreaterThan(prebuild.indexOf("10-ds-checksums.mjs"));
  });
});

/* Vercel runs a `vercel-build` script (or the legacy `now-build`) INSTEAD of `build` when
   package.json has one, and npm then runs that script's own pre and post hooks, not prebuild and
   postbuild: DS checksums and both placeholder scans would silently never run on a deploy
   (task 2.13). */
const BUILD_OVERRIDES = ["vercel-build", "now-build"] as const;

/** Every script that would make Vercel skip `npm run build` and its hooks. */
function buildOverrides(scripts: Readonly<Record<string, string>>): string[] {
  return BUILD_OVERRIDES.filter((name) => Object.hasOwn(scripts, name)).map((name) => `"${name}": "${scripts[name]}"`);
}

describe("the build-override detector", () => {
  it.each([
    ["a vercel-build script", { build: "next build", "vercel-build": "next build" }],
    ["a now-build script", { build: "next build", "now-build": "npm run build" }],
    ["an empty vercel-build script", { build: "next build", "vercel-build": "" }],
  ])("red on %s", (_name, scripts) => {
    expect(buildOverrides(scripts)).toHaveLength(1);
  });

  it("green on build with its hooks, and on names that only look alike", () => {
    expect(buildOverrides({ build: "next build", prebuild: "x", postbuild: "y", "build-storybook": "z", "vercel-builds": "w" })).toEqual([]);
  });
});

describe("the hooks run around the production build", () => {
  it("npm runs prebuild and postbuild around build, and both call the step runner", () => {
    expect(pkg.scripts.build).toBe("next build");
    expect(pkg.scripts.prebuild).toBe("node scripts/run-steps.mjs prebuild");
    expect(pkg.scripts.postbuild).toBe("node scripts/run-steps.mjs postbuild");
  });

  it("package.json has no vercel-build or now-build script, which Vercel would run instead of build", () => {
    const found = buildOverrides(pkg.scripts);
    expect(found, `package.json: ${found.join(", ")} would skip prebuild and postbuild on Vercel`).toEqual([]);
  });

  it("vercel.json leaves the build command to package.json, so Vercel's npm run build runs the hooks", () => {
    const vercel = JSON.parse(readFileSync(join(REPO, "vercel.json"), "utf8")) as { buildCommand?: string };
    expect([undefined, "npm run build"]).toContain(vercel.buildCommand);
  });

  it("no .npmrc switches lifecycle scripts off", () => {
    const npmrc = join(REPO, ".npmrc");
    const text = existsSync(npmrc) ? readFileSync(npmrc, "utf8") : "";
    expect(text).not.toMatch(/^\s*ignore-scripts\s*=\s*true/m);
  });
});

/* ── npm run typecheck reads every test (tsconfig.guards.json; tasks 1.1b and 2.13) ─────────────
   `npm run verify` type-checks the tests, stories and harness through tsconfig.guards.json, which
   leaves out, by name, the files that do not type-check today. An exclusion that matches no file
   is a dead line that hides the next file given that name (the moved PostHogGate.test.tsx stayed
   listed after task 2.6), so it fails here. Each exclusion also says why it stays: the task that
   deletes or rewrites the file, or "for good" for a frozen test kept byte-identical to the tag
   (ruling 2026-10-12). A comment may head a group of entries. */

const GUARDS_TSCONFIG = "tsconfig.guards.json";
/** A task id ("6.3", "5.15", "1.1b") or the frozen-for-good wording. */
const REASON = /\b[1-7]\.\d+[a-z]?\b|\bfor good\b/;
const QUOTED_ENTRY = /^\s*"[^"]*",?\s*$/;

type Exclusion = { entry: string; line: number; comment: string };

/** The exclude entries of a tsconfig (JSON with comments), each with its 1-based line and the
 *  `//` comment block above it or above the group of entries it belongs to. */
function exclusions(text: string): Exclusion[] {
  const { config, error } = ts.parseConfigFileTextToJson(GUARDS_TSCONFIG, text);
  if (error) throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  const entries: string[] = (config as { exclude?: string[] }).exclude ?? [];
  const lines = text.split("\n");
  const start = lines.findIndex((l) => /^\s*"exclude"\s*:/.test(l));
  return entries.map((entry) => {
    const at = lines.findIndex((l, i) => i > start && l.trim().replace(/,$/, "") === JSON.stringify(entry));
    const comment: string[] = [];
    for (let i = at - 1; i > start; i--) {
      const l = lines[i].trim();
      if (l.startsWith("//")) comment.unshift(l.replace(/^\/\/\s?/, ""));
      else if (comment.length === 0 && QUOTED_ENTRY.test(lines[i])) continue;
      else break;
    }
    return { entry, line: at + 1, comment: comment.join(" ") };
  });
}

/** An exclusion that matches no file or folder under root (a glob is expanded). */
function staleExclusions(list: readonly Exclusion[], root: string): string[] {
  const matches = (entry: string) => (/[*?[{]/.test(entry) ? globSync(entry, { cwd: root }).length > 0 : existsSync(join(root, entry)));
  return list.filter((x) => !matches(x.entry)).map((x) => `${GUARDS_TSCONFIG}:${x.line} "${x.entry}" matches no file`);
}

/** An exclusion (node_modules apart) whose comment names neither a task nor "for good". */
function unexplainedExclusions(list: readonly Exclusion[]): string[] {
  return list
    .filter((x) => x.entry !== "node_modules" && !REASON.test(x.comment))
    .map((x) => `${GUARDS_TSCONFIG}:${x.line} "${x.entry}": its comment names no task and does not say "for good"`);
}

describe("the tsconfig exclusion detector", () => {
  const fixture = (exclude: string) => `{\n  "include": ["test/**/*.ts"],\n  // By name only.\n  "exclude": [\n${exclude}\n  ]\n}\n`;

  it("reads each entry with its line and the comment above its group", () => {
    const text = fixture(
      ['    "node_modules",', "    // 6.3 deletes these.", '    "test/a.test.ts",', '    "test/b.test.ts",', "    // Frozen: excluded for good.", '    "test/c.test.ts"'].join("\n"),
    );
    expect(exclusions(text)).toEqual([
      { entry: "node_modules", line: 5, comment: "" },
      { entry: "test/a.test.ts", line: 7, comment: "6.3 deletes these." },
      { entry: "test/b.test.ts", line: 8, comment: "6.3 deletes these." },
      { entry: "test/c.test.ts", line: 10, comment: "Frozen: excluded for good." },
    ]);
  });

  it("red on an exclusion that matches no file (the moved PostHogGate test)", () => {
    const list = exclusions(fixture(['    "node_modules",', "    // 2.6 moves it.", '    "src/components/molecules/PostHogGate.test.tsx"'].join("\n")));
    expect(staleExclusions(list, REPO)).toEqual([
      `${GUARDS_TSCONFIG}:7 "src/components/molecules/PostHogGate.test.tsx" matches no file`,
    ]);
  });

  it("red on a glob that matches nothing; green on a file, a folder and a glob that match", () => {
    const list = exclusions(fixture(['    "test/nothing-here/**/*.ts",', '    "node_modules",', '    "test/guards",', '    "test/guards/*.test.ts",', '    "package.json"'].join("\n")));
    expect(staleExclusions(list, REPO)).toEqual([`${GUARDS_TSCONFIG}:5 "test/nothing-here/**/*.ts" matches no file`]);
  });

  it("red on an exclusion whose comment gives no reason, or that has no comment", () => {
    const list = exclusions(fixture(['    "node_modules",', "    // Does not type-check.", '    "test/a.test.ts",', "    // 6.3 retires it.", '    "test/b.test.ts"'].join("\n")));
    expect(unexplainedExclusions(list)).toEqual([`${GUARDS_TSCONFIG}:7 "test/a.test.ts": its comment names no task and does not say "for good"`]);
    const bare = exclusions(fixture(['    "node_modules",', '    "test/a.test.ts"'].join("\n")));
    expect(unexplainedExclusions(bare)).toHaveLength(1);
  });
});

describe("npm run typecheck reads every test (tsconfig.guards.json)", () => {
  const list = exclusions(readFileSync(join(REPO, GUARDS_TSCONFIG), "utf8"));

  it("runs the guards program after the app's own check", () => {
    expect(pkg.scripts.typecheck).toBe(`tsc --noEmit && tsc --noEmit -p ${GUARDS_TSCONFIG}`);
  });

  it("excludes nothing that matches no file", () => {
    expect(list.length, `${GUARDS_TSCONFIG} lists no exclusion; re-point this guard`).toBeGreaterThan(1);
    expect(staleExclusions(list, REPO)).toEqual([]);
  });

  it("says, for every exclusion, which task removes it or that it stays for good", () => {
    expect(unexplainedExclusions(list)).toEqual([]);
  });
});
