// Where `next build` leaves what it prerendered: each page's HTML (*.html) and each route body (*.body: llms.txt,
// pricing.md, sitemap.xml, robots.txt), under the page's URL path. Postbuild steps 10 (scripts/guards/placeholders.mjs
// --html) and 20 (scripts/journal/sync-posts.mjs --pages) read it through this file, because Next 16.3 has two layouts:
//
//   .next/server/app/<path>                                         next build on its own: local, CI, e2e
//   .next/server/route-cache/<kind>/<sha256 of the source route>/$/<path>
//                                                                   with a deployment adapter (`adapterPath`), which
//                                                                   Vercel always plugs in ("Applying modifyConfig
//                                                                   from Vercel" in its build log)
//
// The second is Next's getRouteCacheKey (node_modules/next/dist/server/lib/route-cache-key.js). Both steps read only the
// first until 2026-10-14, when the beta deploy failed on it (wiki/engineering/lessons.md). test/prerendered.test.ts
// holds this file to the installed Next, so an upgrade that moves the files again fails `npm run verify`.

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const APP_DIR = join(".next", "server", "app");
export const ROUTE_CACHE_DIR = join(".next", "server", "route-cache");
/** The folder under a source route's hash where its URL paths start (getRouteCacheKey's `$`). */
export const ROUTE_CACHE_ROOT = "$";

/**
 * The folders under `root` holding prerendered output, each laid out by URL path below it: .next/server/app, then one
 * per prerendered source route under .next/server/route-cache. None when nothing was built.
 * @param {string} root
 * @returns {string[]}
 */
export function prerenderedDirs(root) {
  const dirs = isDir(join(root, APP_DIR)) ? [join(root, APP_DIR)] : [];
  const cache = join(root, ROUTE_CACHE_DIR);
  for (const kind of subdirs(cache)) {
    for (const source of subdirs(join(cache, kind))) {
      const dir = join(cache, kind, source, ROUTE_CACHE_ROOT);
      if (isDir(dir)) dirs.push(dir);
    }
  }
  return dirs;
}

/**
 * The prerendered file for a URL path (e.g. "stories/<slug>.html", "llms.txt.body") in either layout, or undefined.
 * @param {string} root
 * @param {string} path
 * @returns {string | undefined}
 */
export function prerenderedFile(root, path) {
  return prerenderedDirs(root)
    .map((dir) => join(dir, path))
    .find((file) => {
      try {
        return statSync(file).isFile();
      } catch {
        return false;
      }
    });
}

function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function subdirs(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort();
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
}
