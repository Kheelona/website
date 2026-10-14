/* Legacy paths and routes the new-design guards skip (task 1.1; emptied by task 6.3).
 *
 * Two lists:
 *
 * LEGACY_PATHS: source files of the pre-reset site, matched by prefix. A listed file is skipped
 * only WHILE IT IS STILL LEGACY: unchanged since the freeze tag apart from its import lines (task
 * 2.6 re-points two import lines in legacy files; that does not make them new). The moment a task
 * rewrites a listed file in place (a page, a layout, a store presentation file), every new-design
 * guard applies to it, so a rewrite can never hide behind this list. A file that did not exist at
 * the tag is never legacy.
 *
 * LEGACY_ROUTES: URLs still served by legacy pages. The e2e specs skip such a route (printed as
 * "pending") while its <main> has no DS section; once its new page renders, the route is tested.
 * A route NOT listed here must render the new design or the spec fails.
 *
 * Task 6.3 emptied both lists when the legacy code was gone (no "pending" route or file is left), and
 * test/guards/legacy-paths.test.ts holds them empty. The helpers stay, so the guards that call them
 * keep compiling; each now answers "not legacy" for every file and route.
 */
import { FREEZE_TAG, git, readRepoFile, tagFiles, tagText } from "../e2e/support/repo";
import { withoutImports } from "../e2e/support/source";

/* Emptied by task 6.3 (2026-10-14): every route file was rewritten in place (waves 3-6) or deleted (the old product
   route in 5.2; /playos, the atomic-design folders, the old home feature, globals.css and the legacy lib modules in
   6.3), and the checkout presentation was restyled (5.15, 5.16). test/guards/legacy-paths.test.ts keeps it empty. */
export const LEGACY_PATHS: readonly string[] = [];

export type LegacyRoute = { host: "marketing" | "store"; path: string };

/* Emptied by task 6.3: every marketing and store route renders the new design, /ideabaaz included (the store's
   not-found page since 6.6, D054 item 7); /playos is a redirect (wave 1). legacy-paths.test.ts keeps it empty. */
export const LEGACY_ROUTES: readonly LegacyRoute[] = [];

export function isLegacyRoute(host: "marketing" | "store", path: string): boolean {
  return LEGACY_ROUTES.some(
    (r) =>
      r.host === host &&
      (r.path === path || (r.path.endsWith("/*") && path.startsWith(r.path.slice(0, -1)))),
  );
}

export function isListedLegacy(path: string): boolean {
  return LEGACY_PATHS.some((p) => (p.endsWith("/") ? path.startsWith(p) : path === p));
}

const cache = new Map<string, boolean>();
let atTag: Set<string> | null = null;
let changed: Set<string> | null = null;

/** True while a listed file is unchanged since the freeze tag apart from its imports. */
export function isStillLegacy(path: string): boolean {
  if (!isListedLegacy(path)) return false;
  const hit = cache.get(path);
  if (hit !== undefined) return hit;
  // One listing and one diff for the whole run, instead of a `git show` per file.
  atTag ??= new Set(tagFiles(["src"]));
  changed ??= new Set(git(["diff", "--name-only", "-z", FREEZE_TAG, "--", "src"]).split("\0").filter(Boolean));
  let legacy = false;
  if (atTag.has(path)) {
    if (!changed.has(path)) legacy = true;
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(path)) {
      const then = tagText(path);
      legacy = then !== null && withoutImports(path, readRepoFile(path)) === withoutImports(path, then);
    }
  }
  cache.set(path, legacy);
  return legacy;
}
