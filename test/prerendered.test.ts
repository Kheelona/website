// Where `next build` leaves what it prerendered (scripts/prerendered.mjs; the beta deploy fix of 2026-10-14).
//
// Postbuild steps 10 and 20 read the prerendered pages through scripts/prerendered.mjs. Next 16.3 writes them to
// .next/server/app on its own, and under .next/server/route-cache when a deployment adapter is in use, which Vercel
// always plugs in. Both steps read only the first until the beta deploy failed on the second. This file holds the
// helper to the installed Next's own key function, so an upgrade that moves the files again fails `npm run verify`
// here rather than a deploy. Every tree is a throwaway folder in the OS temp folder.
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, sep } from "node:path";
import { getRouteCacheKey, ROUTE_CACHE_DIRECTORY } from "next/dist/server/lib/route-cache-key";
import type { RouteKind } from "next/dist/server/route-kind";
import { afterAll, describe, expect, it } from "vitest";
import { APP_DIR, prerenderedDirs, prerenderedFile, ROUTE_CACHE_DIR, ROUTE_CACHE_ROOT } from "../scripts/prerendered.mjs";

const REPO = join(__dirname, "..");
const posix = (p: string) => p.split(sep).join("/");
/** Next's RouteKind is a const enum (no runtime object under isolatedModules); its values are these strings. */
const APP_PAGE = "APP_PAGE" as RouteKind;
const APP_ROUTE = "APP_ROUTE" as RouteKind;

const made: string[] = [];
afterAll(() => {
  for (const dir of made) rmSync(dir, { recursive: true, force: true });
});

/** A throwaway root holding exactly these files (paths relative to the root). */
function tree(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "kh-prerendered-"));
  made.push(root);
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
}

/** Where Next puts a prerendered file under an adapter: `.next/server` + its route cache key + the file's suffix. */
const vercelPath = (pathname: string, sourceRoute: string, suffix: string, kind = APP_PAGE) =>
  `.next/server${getRouteCacheKey(pathname, { kind, sourceRoute })}${suffix}`;

describe("the installed Next's layouts", () => {
  it("keys a prerender under .next/server/route-cache/<kind>/<hash>/$/<URL path>, as scripts/prerendered.mjs reads it", () => {
    expect(posix(ROUTE_CACHE_DIR)).toBe(`.next/server/${ROUTE_CACHE_DIRECTORY}`);
    const key = getRouteCacheKey("/stories/a-guide", { kind: APP_PAGE, sourceRoute: "/(site)/stories/[slug]/page" });
    expect(key).toMatch(new RegExp(`^/${ROUTE_CACHE_DIRECTORY}/APP_PAGE/[0-9a-f]{64}/\\${ROUTE_CACHE_ROOT}/stories/a-guide$`));
    expect(getRouteCacheKey("/", { kind: APP_PAGE, sourceRoute: "/(site)/page" })).toMatch(/\/\$\/index$/);
    expect(getRouteCacheKey("/llms.txt", { kind: APP_ROUTE, sourceRoute: "/llms.txt/route" })).toMatch(/\/\$\/llms\.txt$/);
  });

  it("writes there only when an adapter is in use, and to .next/server/app otherwise", () => {
    const build = readFileSync(join(REPO, "node_modules/next/dist/build/index.js"), "utf8");
    expect(build).toMatch(/config\.adapterPath && config\.output !== 'export' \? \(0, _routecachekey\.getRouteCacheKey\)/);
    expect(posix(APP_DIR)).toBe(".next/server/app");
  });
});

describe("prerenderedDirs and prerenderedFile", () => {
  it("find nothing when nothing was built", () => {
    const root = tree({ "src/x.ts": "export {};\n" });
    expect(prerenderedDirs(root)).toEqual([]);
    expect(prerenderedFile(root, "index.html")).toBeUndefined();
  });

  it("find a page and a route body in next build's own layout", () => {
    const root = tree({ ".next/server/app/stories/a-guide.html": "<p>a</p>", ".next/server/app/llms.txt.body": "a" });
    expect(prerenderedDirs(root).map((d) => posix(d.slice(root.length)))).toEqual(["/.next/server/app"]);
    expect(prerenderedFile(root, "stories/a-guide.html")).toBe(join(root, ".next/server/app/stories/a-guide.html"));
    expect(prerenderedFile(root, "llms.txt.body")).toBe(join(root, ".next/server/app/llms.txt.body"));
  });

  it("find a page and a route body in Vercel's layout, by the same URL path", () => {
    const page = vercelPath("/stories/a-guide", "/(site)/stories/[slug]/page", ".html");
    const home = vercelPath("/", "/(site)/page", ".html");
    const body = vercelPath("/llms.txt", "/llms.txt/route", ".body", APP_ROUTE);
    const root = tree({ [page]: "<p>a</p>", [home]: "<p>home</p>", [body]: "a", ".next/server/app/(site)/page.js": "" });
    expect(prerenderedDirs(root)).toHaveLength(4);
    expect(prerenderedFile(root, "stories/a-guide.html")).toBe(join(root, page));
    expect(prerenderedFile(root, "index.html")).toBe(join(root, home));
    expect(prerenderedFile(root, "llms.txt.body")).toBe(join(root, body));
    expect(prerenderedFile(root, "stories/another.html")).toBeUndefined();
  });

  it("skip a route cache folder with no $ root, and a folder in place of a file", () => {
    const root = tree({
      ".next/server/route-cache/APP_PAGE/abc/stories/a-guide.html": "<p>a</p>",
      ".next/server/app/stories/a-guide.html/x": "",
    });
    expect(prerenderedFile(root, "stories/a-guide.html")).toBeUndefined();
  });
});
