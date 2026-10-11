/* Repo helpers shared by the Vitest guards (test/guards) and the Playwright specs (test/e2e).
 * Task 1.1. Everything here reads the working tree or the git object store; nothing writes.
 *
 * Files are listed with `git ls-files --cached --others --exclude-standard`: tracked files plus
 * new files that are not ignored, so a guard also sees a file its author forgot to stage
 * (lessons §7, "the guard tests read the git index"), and never sees node_modules or build output.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Tests run from the repository root (Vitest and Playwright both start there). */
export const ROOT = process.cwd();

/** The tag every freeze compares with (D008): production as it was before the reset. */
export const FREEZE_TAG = "archive/pre-reset-2026-10-10";

export function git(args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
}

/** Repo-relative paths (forward slashes) under the pathspecs, existing on disk, sorted. */
export function listFiles(pathspecs: string[]): string[] {
  const out = git(["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", ...pathspecs]);
  return [...new Set(out.split("\0").filter(Boolean))]
    .filter((p) => existsSync(join(ROOT, p)))
    .sort();
}

export function readRepoFile(path: string): string {
  return readFileSync(join(ROOT, path), "utf8");
}

export function readRepoBytes(path: string): Buffer {
  return readFileSync(join(ROOT, path));
}

let tagChecked = false;
/** Fails loudly when the freeze tag is absent (a shallow CI clone, a missing fetch of tags). */
export function assertFreezeTag(): void {
  if (tagChecked) return;
  try {
    git(["rev-parse", "--verify", "--quiet", `${FREEZE_TAG}^{commit}`]);
  } catch {
    throw new Error(
      `The tag ${FREEZE_TAG} is not in this clone, so the freeze cannot be checked. ` +
        "Fetch it (CI: actions/checkout with fetch-depth: 0).",
    );
  }
  tagChecked = true;
}

/** A file's bytes at the freeze tag, or null when it did not exist there. */
export function tagBytes(path: string): Buffer | null {
  assertFreezeTag();
  try {
    return execFileSync("git", ["show", `${FREEZE_TAG}:${path}`], {
      cwd: ROOT,
      maxBuffer: 256 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

export function tagText(path: string): string | null {
  const bytes = tagBytes(path);
  return bytes === null ? null : bytes.toString("utf8");
}

/** Every path that existed at the freeze tag under the pathspecs. */
export function tagFiles(pathspecs: string[]): string[] {
  assertFreezeTag();
  return git(["ls-tree", "-r", "--name-only", "-z", FREEZE_TAG, "--", ...pathspecs])
    .split("\0")
    .filter(Boolean)
    .sort();
}

/** `src/app/store/layout.tsx` → `src__app__store__layout.tsx` (structure §2, guard fixtures). */
export function fixtureName(path: string): string {
  return path.split("/").join("__");
}
