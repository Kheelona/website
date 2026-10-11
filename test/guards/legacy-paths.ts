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
 * Task 6.3 empties both lists when the legacy code is gone; nothing else edits them.
 */
import { FREEZE_TAG, git, readRepoFile, tagFiles, tagText } from "../e2e/support/repo";
import { withoutImports } from "../e2e/support/source";

export const LEGACY_PATHS: readonly string[] = [
  // Every route file of the pre-reset site: rewritten in place in waves 3-6, or deleted
  // (playos, the old product route) in 5.2 and 6.3.
  "src/app/",
  // The atomic-design component folders and the old home feature (6.3).
  "src/components/atoms/",
  "src/components/molecules/",
  "src/components/organisms/",
  "src/components/templates/",
  "src/components/vendor/",
  "src/features/home/",
  // Checkout presentation, restyled by 5.15 and 5.16 under ADR-013.
  "src/features/preorder/components/",
  // The retired v3 token sheet and the legacy content and helper modules (6.3).
  "src/styles/globals.css",
  "src/lib/cn.ts",
  "src/lib/family.ts",
  "src/lib/feelings.ts",
  "src/lib/growth-arc.ts",
  "src/lib/interactions.ts",
  "src/lib/kheelu-art.ts",
  "src/lib/kheelu-poses.ts",
  "src/lib/legal.ts",
  "src/lib/product-facts.ts",
  "src/lib/seo.ts",
  "src/lib/setup-steps.ts",
  "src/lib/shape-paths.ts",
  "src/lib/stories.ts",
  "src/lib/stories-expansion.ts",
  "src/lib/video-moments.ts",
];

export type LegacyRoute = { host: "marketing" | "store"; path: string };

/** Routes served by legacy pages on 2026-10-12 (url-map §1, §2). */
export const LEGACY_ROUTES: readonly LegacyRoute[] = [
  ...[
    "/",
    "/products/kheelu",
    "/safety",
    "/ai-toys-for-kids-in-india",
    "/stories",
    "/team",
    "/setup",
    "/contact",
    "/privacy",
    "/terms",
    "/refund",
    "/shipping",
    "/playos",
    // The root not-found page renders every unmatched marketing URL (5.10).
    "/__not-found__",
  ].map((path) => ({ host: "marketing" as const, path })),
  // Every article: one legacy template serves them all until 4.2 lands.
  { host: "marketing", path: "/stories/*" },
  ...["/", "/thanks", "/ideabaaz", "/e/*", "/__not-found__"].map((path) => ({
    host: "store" as const,
    path,
  })),
];

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
