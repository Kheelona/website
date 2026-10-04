import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import ts from "typescript";
import { describe, expect, it } from "vitest";

/**
 * Every Storybook story must be syntactically valid TypeScript.
 *
 * WHY THIS EXISTS. `src/components/templates/PageHero.stories.tsx` carried a
 * syntax error for an unknown length of time:
 *
 *     media: (
 *       {\/* Real aspect: the asset is portrait … *\/}
 *       <img … />
 *     ),
 *
 * `{\/* … *\/}` is only valid as a JSX CHILD. In expression position it parses
 * as an empty object literal followed by an element, which is not JavaScript.
 *
 * NOTHING IN THIS REPO WAS LOOKING. `tsconfig.json` excludes `**\/*.stories.tsx`
 * (so neither `tsc --noEmit` nor `next build` reads them), Vitest only loads the
 * stories a test imports, and Storybook 10.5.0's indexer happened to tolerate
 * it. Upgrading to 10.6.0 on 2026-09-05 turned it into a hard build failure —
 * the dependency bump did not cause the bug, it revealed it.
 *
 * A story is the component catalog this repo requires for every component
 * (COMPONENT_GUIDELINES §2). A catalog entry that cannot parse is an entry that
 * silently is not in the catalog, which is the same failure as not writing one.
 *
 * This parses each file rather than typechecking it: type errors in a story are
 * a different, softer problem, and a fast syntax gate is what was missing.
 */

const stories = execFileSync("git", ["ls-files", "*.stories.tsx", "*.stories.ts"], {
  encoding: "utf8",
})
  .split("\n")
  .filter(Boolean);

describe("every Storybook story parses", () => {
  it("finds the story files at all", () => {
    /* If the glob ever stops matching, this test would pass vacuously over an
       empty list — the exact shape of a guard that reports green while blind. */
    expect(stories.length).toBeGreaterThan(50);
    expect(stories).toContain("src/components/templates/PageHero.stories.tsx");
  });

  it.each(stories)("%s is syntactically valid", (file) => {
    const source = readFileSync(file, "utf8");
    const { diagnostics } = ts.transpileModule(source, {
      reportDiagnostics: true,
      compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ESNext },
      fileName: file,
    });
    const syntactic = (diagnostics ?? []).map((d) =>
      ts.flattenDiagnosticMessageText(d.messageText, " "),
    );
    expect(syntactic, `${file} does not parse: ${syntactic.join("; ")}`).toEqual([]);
  });
});
