// The build hooks are wired and the type check reads every test (task 2.9; checks added by 2.13;
// ADR-011 "where they run", architecture §14, structure §1). Three groups of checks:
//
// 1. The build steps. scripts/run-steps.mjs (task 1.1) runs every scripts/steps/<hook>/NN-name.mjs in
//    name order, and stops at the first that fails. A guard only blocks a deploy if its step file
//    exists, the runner accepts its name, and the hook actually runs around the production build.
//    This test pins all three for the steps the deploy depends on: DS checksums (prebuild 10, task
//    1.1), compose.css (prebuild 20, task 1.2), and the placeholder guard on src/ (prebuild 30) and
//    on the prerendered output (postbuild 10), both task 2.9.
// 2. Nothing replaces `npm run build` on Vercel: package.json has no `vercel-build` or `now-build`
//    script (task 2.13: Vercel would run it instead of build, and npm its own pre and post hooks, so
//    the steps above would silently never run), vercel.json sets no build command, and no .npmrc
//    switches lifecycle scripts off.
// 3. The tsconfig.guards.json exclusions (task 2.13): `npm run typecheck` reads every test, story
//    and harness file through it, and it leaves out, by name only, the files that do not type-check
//    today. Every exclusion matches a file, says which task removes it (or "for good", for the four
//    frozen tests only), is in the 2.13 snapshot (the list only shrinks), and, if legacy, holds only
//    while its file is unchanged since the freeze tag.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { FREEZE_TAG, readRepoFile, tagText } from "../e2e/support/repo";
import { isStillLegacy } from "./legacy-paths";

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
   listed after task 2.6), so it fails here, and so does a glob (the list is by name only). Each
   exclusion also says why it stays: the task that deletes or rewrites the file, or "for good" for
   one of the four frozen tests kept byte-identical to the tag, and only for them (ruling
   2026-10-12). A comment may head a group of entries.
   The 2.13 review: a comment check alone let a new line take any file out of the typecheck (any
   N.N number read as a task id), so the list is pinned to its 2.13 snapshot and only shrinks; each
   line's comment must name the reason the snapshot gives it, as a whole id; and a legacy line holds
   only while its file is the tag's (imports apart, legacy-paths.ts): a rewritten file type-checks,
   so its line leaves with the rewrite. A frozen test's reviewed patch (5.11, 5.15, 6.4) changes no
   type, so its line is not tied to the tag's bytes here (the freeze guards pin those). */

const GUARDS_TSCONFIG = "tsconfig.guards.json";
const QUOTED_ENTRY = /^\s*"[^"]*",?\s*$/;
/** The frozen tests (structure §7, ADR-013): byte-identical to the tag, excluded for good. */
const FROZEN_FOR_GOOD = [
  "src/features/preorder/components/PreorderForm.test.tsx",
  "src/features/preorder/lib/analytics.test.ts",
  "src/lib/email/templates.test.ts",
  "test/analytics-tags.test.ts",
] as const;
/** The legacy lines as of 2.13, each with the task that deletes or rewrites its file. */
const LEGACY_EXCLUSIONS: Readonly<Record<string, string>> = {
  "src/components/atoms/Room.stories.tsx": "6.3",
  "src/components/atoms/Section.stories.tsx": "6.3",
  "src/components/organisms/FinaleCTA.stories.tsx": "6.3",
  "src/components/organisms/ParentQuotes.stories.tsx": "6.3",
  "src/features/home/components/ParentAppSection.stories.tsx": "6.3",
  "test/action-label.test.ts": "6.3",
  "test/utm.test.ts": "6.3",
};
const FOR_GOOD = "for good";
/** The 2.13 snapshot: every exclusion allowed (node_modules apart) and the reason its comment gives.
 *  A line may leave; none may join. Never add an entry here. */
const EXCLUSION_SNAPSHOT: Readonly<Record<string, string>> = {
  ...LEGACY_EXCLUSIONS,
  ...Object.fromEntries(FROZEN_FOR_GOOD.map((path) => [path, FOR_GOOD])),
};

/** The reason as a whole word or id: "6.3" matches "by 6.3." but not "16.3", "6.31" or "6.3b". */
function namesReason(comment: string, reason: string): boolean {
  if (reason === FOR_GOOD) return /\bfor good\b/.test(comment);
  return new RegExp(`(?<![\\w.])${reason.replaceAll(".", "\\.")}(?!\\w|\\.\\d)`).test(comment);
}

/** True while the file is the tag's: imports apart for a listed legacy source file
 *  (legacy-paths.ts), byte for byte otherwise. */
function unchangedSinceTag(path: string): boolean {
  return isStillLegacy(path) || (existsSync(join(REPO, path)) && tagText(path) === readRepoFile(path));
}

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

/** An exclusion that names no file or folder under root. The list is by name only, so a glob is
 *  refused outright: it would also hide whatever file later takes a matching name. */
function staleExclusions(list: readonly Exclusion[], root: string): string[] {
  return list.flatMap((x) =>
    /[*?[{]/.test(x.entry)
      ? [`${GUARDS_TSCONFIG}:${x.line} "${x.entry}" is a glob; exclusions are by name only`]
      : existsSync(join(root, x.entry))
        ? []
        : [`${GUARDS_TSCONFIG}:${x.line} "${x.entry}" matches no file`],
  );
}

/** An exclusion (node_modules apart) that the snapshot does not list: the list only shrinks. */
function unlistedExclusions(list: readonly Exclusion[], snapshot: Readonly<Record<string, string>> = EXCLUSION_SNAPSHOT): string[] {
  return list
    .filter((x) => x.entry !== "node_modules" && !Object.hasOwn(snapshot, x.entry))
    .map((x) => `${GUARDS_TSCONFIG}:${x.line} "${x.entry}" is not in the 2.13 snapshot: the list only shrinks, never add a file here`);
}

/** A listed exclusion whose comment does not name the reason the snapshot gives it (an unlisted
 *  one fails unlistedExclusions instead). */
function unexplainedExclusions(list: readonly Exclusion[], snapshot: Readonly<Record<string, string>> = EXCLUSION_SNAPSHOT): string[] {
  return list
    .filter((x) => Object.hasOwn(snapshot, x.entry) && !namesReason(x.comment, snapshot[x.entry]))
    .map((x) => `${GUARDS_TSCONFIG}:${x.line} "${x.entry}": its comment does not name ${snapshot[x.entry]}, the reason the 2.13 snapshot gives it`);
}

/** A legacy exclusion (its reason a task) whose file is no longer the tag's. */
function rewrittenLegacy(
  list: readonly Exclusion[],
  unchanged: (path: string) => boolean,
  snapshot: Readonly<Record<string, string>> = EXCLUSION_SNAPSHOT,
): string[] {
  return list
    .filter((x) => Object.hasOwn(snapshot, x.entry) && snapshot[x.entry] !== FOR_GOOD && !unchanged(x.entry))
    .map(
      (x) =>
        `${GUARDS_TSCONFIG}:${x.line} "${x.entry}" changed since ${FREEZE_TAG}: a rewritten legacy file must type-check, so its line leaves with the rewrite (${snapshot[x.entry]})`,
    );
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

  it("red on a glob, even one that matches; green on a file and a folder that exist", () => {
    const list = exclusions(fixture(['    "test/nothing-here/**/*.ts",', '    "node_modules",', '    "test/guards",', '    "test/guards/*.test.ts",', '    "package.json"'].join("\n")));
    expect(staleExclusions(list, REPO)).toEqual([
      `${GUARDS_TSCONFIG}:5 "test/nothing-here/**/*.ts" is a glob; exclusions are by name only`,
      `${GUARDS_TSCONFIG}:8 "test/guards/*.test.ts" is a glob; exclusions are by name only`,
    ]);
  });

  const snapshot = { "test/a.test.ts": "6.3", "test/b.test.ts": "6.3", "test/c.test.ts": "for good" };

  it("red on an exclusion whose comment gives no reason, or that has no comment", () => {
    const list = exclusions(fixture(['    "node_modules",', "    // Does not type-check.", '    "test/a.test.ts",', "    // 6.3 retires it.", '    "test/b.test.ts"'].join("\n")));
    expect(unexplainedExclusions(list, snapshot)).toEqual([`${GUARDS_TSCONFIG}:7 "test/a.test.ts": its comment does not name 6.3, the reason the 2.13 snapshot gives it`]);
    const bare = exclusions(fixture(['    "node_modules",', '    "test/a.test.ts"'].join("\n")));
    expect(unexplainedExclusions(bare, snapshot)).toHaveLength(1);
  });

  /* The 2.13 review: any N.N number passed as a task id, so "Does not type-check under TypeScript
     5.9." let a new exclusion take a guard out of the typecheck. The comment must name the task the
     snapshot gives that line, as a whole id. */
  it("red on a comment that names another number than its task, or its task inside a longer id", () => {
    const list = exclusions(
      fixture(['    // Does not type-check under TypeScript 5.9.', '    "test/a.test.ts",', "    // 16.3 or 6.31 rewrites it.", '    "test/b.test.ts",', "    // 6.3 retires it. Frozen: excluded for good.", '    "test/c.test.ts"'].join("\n")),
    );
    expect(unexplainedExclusions(list, snapshot).map((p) => p.split(" ")[1])).toEqual(['"test/a.test.ts":', '"test/b.test.ts":']);
  });

  it("green on a comment that names its task at the end of a sentence, or says for good", () => {
    const list = exclusions(fixture(['    "node_modules",', "    // Legacy: deleted by 6.3.", '    "test/a.test.ts",', "    // Frozen: excluded for good.", '    "test/c.test.ts"'].join("\n")));
    expect(unexplainedExclusions(list, snapshot)).toEqual([]);
  });

  it("red on an exclusion the 2.13 snapshot does not list, whatever its comment says: the list only shrinks", () => {
    const list = exclusions(
      fixture(['    "node_modules",', "    // Does not type-check under TypeScript 5.9.", '    "test/guards/build-steps.test.ts",', "    // 6.3 retires it, or it stays for good.", '    "test/d.test.ts",', "    // 6.3 retires it.", '    "test/a.test.ts"'].join("\n")),
    );
    expect(unlistedExclusions(list, snapshot)).toEqual([
      `${GUARDS_TSCONFIG}:7 "test/guards/build-steps.test.ts" is not in the 2.13 snapshot: the list only shrinks, never add a file here`,
      `${GUARDS_TSCONFIG}:9 "test/d.test.ts" is not in the 2.13 snapshot: the list only shrinks, never add a file here`,
    ]);
  });

  it("red on a legacy exclusion whose file changed since the freeze tag; a frozen test's reviewed patch is not checked", () => {
    const list = exclusions(fixture(['    // 6.3 retires these.', '    "test/a.test.ts",', '    "test/b.test.ts",', "    // Frozen: excluded for good.", '    "test/c.test.ts"'].join("\n")));
    const unchanged = (path: string) => path !== "test/b.test.ts" && path !== "test/c.test.ts";
    expect(rewrittenLegacy(list, unchanged, snapshot)).toEqual([
      `${GUARDS_TSCONFIG}:7 "test/b.test.ts" changed since ${FREEZE_TAG}: a rewritten legacy file must type-check, so its line leaves with the rewrite (6.3)`,
    ]);
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

  it("lists nothing the 2.13 snapshot does not (the list only shrinks)", () => {
    expect(unlistedExclusions(list)).toEqual([]);
  });

  it("excludes a legacy file only while it is unchanged since the freeze tag", () => {
    expect(rewrittenLegacy(list, unchangedSinceTag)).toEqual([]);
  });

  /* Ruling 2026-10-12: the frozen tests stay byte-identical to the tag, so they never type-check
     and stay excluded for good; every other line is legacy and leaves with the task named. */
  it("keeps the four frozen tests excluded for good, and only them", () => {
    const forGood = list.filter((x) => /\bfor good\b/.test(x.comment)).map((x) => x.entry);
    expect(forGood.sort()).toEqual([...FROZEN_FOR_GOOD].sort());
  });
});
