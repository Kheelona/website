/**
 * The redesign's files that replace a file of the app under the same URL (2026-10-22): prebuild step 40 lists them in
 * build/site/site.json (`overrides`), e.g. /og.png or /og/kheelu.jpg, whose beta versions sit in public/. Read by
 * next.config.ts when it loads, after the prebuild; no build/site/ (a test, a fresh clone) reads as none. Relative
 * imports only (next.config.ts's import graph).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface FileRewrite {
  source: string;
  destination: string;
}

export function siteOverrideRewrites(root: string = process.cwd()): FileRewrite[] {
  let overrides: unknown;
  try {
    overrides = JSON.parse(readFileSync(join(root, "build", "site", "site.json"), "utf8")).overrides;
  } catch {
    return [];
  }
  if (!Array.isArray(overrides)) return [];
  return overrides
    .filter((f): f is string => typeof f === "string" && /^[A-Za-z0-9._\-/]+$/.test(f) && !f.includes(".."))
    .map((f) => ({ source: `/${f}`, destination: `/_site/${f}` }));
}
