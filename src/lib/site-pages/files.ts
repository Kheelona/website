import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The redesign's build, as scripts/site/prepare.mjs left it for the route handlers (2026-10-22): build/site/site.json
 * (the page routes, the 404 page, the machine files, the tracking shell's URL), the pages under build/site/pages/ and
 * the machine files beside them. next.config.ts traces build/site/** into every function that reads it, so an ISR
 * revalidation on Vercel reads the same files the build did.
 */

export interface SitePage {
  readonly path: string;
  readonly file: string;
}

export interface SiteManifest {
  readonly env: string;
  readonly pages: readonly SitePage[];
  readonly notFound: string | null;
  readonly machine: readonly string[];
  readonly tracking: string;
  readonly digest: string;
}

/** Where prepare.mjs writes (relative to the project root, which is the working directory of `next build`, `next
 *  start` and a Vercel function alike). */
export const SITE_DIR = join(process.cwd(), "build", "site");

let cached: SiteManifest | undefined;

/** build/site/site.json. Throws with the command to run when the redesign was never prepared. */
export function siteManifest(): SiteManifest {
  if (cached) return cached;
  try {
    cached = JSON.parse(readFileSync(join(SITE_DIR, "site.json"), "utf8")) as SiteManifest;
  } catch {
    throw new Error(
      "build/site/site.json is missing: run `node --experimental-strip-types scripts/site/prepare.mjs` " +
        "(prebuild step 40) before next build or next dev",
    );
  }
  return cached;
}

/** Every page path the redesign built, "/" first. */
export function sitePagePaths(): string[] {
  return siteManifest().pages.map((p) => p.path);
}

/** The built HTML of a page path, or undefined when the redesign has no such page. */
export function readSitePage(path: string): string | undefined {
  const page = siteManifest().pages.find((p) => p.path === path);
  return page ? readFileSync(join(SITE_DIR, page.file), "utf8") : undefined;
}

/** The built 404 page, or undefined when the build has none (a quick local build). */
export function readNotFoundPage(): string | undefined {
  const file = siteManifest().notFound;
  return file ? readFileSync(join(SITE_DIR, file), "utf8") : undefined;
}

/** A machine file (sitemap.xml, robots.txt, llms.txt, pricing.md), or undefined when the build has none. */
export function readMachineFile(name: string): string | undefined {
  if (!siteManifest().machine.includes(name)) return undefined;
  return readFileSync(join(SITE_DIR, name), "utf8");
}

/** Test seam: forget the cached manifest. */
export function resetSiteManifestForTests(): void {
  cached = undefined;
}
