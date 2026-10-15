import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sitePath, useSitePath } from "./site-path";

/* The page path the shell components render from (task 8c.7; CMO wave 8c review m1). Vercel re-renders Home in its
 * runtime under the route segments ["", "index"], so usePathname() reads "/index" on the server and "/" in the browser,
 * and a component that renders from it (the buy bar: on "/" only) builds a different tree on each side: React error
 * #418 on every load of beta's Home. A trailing "/index" is folded into its parent, so both sides read the same path. */

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

afterEach(() => {
  nav.pathname = "/";
});

describe("sitePath", () => {
  it.each([
    ["/index", "/"],
    ["/stories/index", "/stories"],
    ["/products/kheelu/index", "/products/kheelu"],
  ])("folds %s into its parent, %s", (pathname, expected) => {
    expect(sitePath(pathname)).toBe(expected);
  });

  it.each(["/", "/safety", "/products/kheelu", "/stories/learning-toys-for-a-three-year-old", "/indexes", "/stories/index-of-toys", "/reindex"])(
    "leaves %s as it is",
    (pathname) => {
      expect(sitePath(pathname)).toBe(pathname);
    },
  );
});

describe("useSitePath", () => {
  it("reads the path from usePathname(), folded", () => {
    nav.pathname = "/index";
    expect(renderHook(() => useSitePath()).result.current).toBe("/");
    nav.pathname = "/safety";
    expect(renderHook(() => useSitePath()).result.current).toBe("/safety");
  });
});

/* The rule that keeps it so: a module under src/ that renders from the page path reads it through useSitePath, never
 * usePathname() itself, nor the segment readers that see the same "index" (useSelectedLayoutSegment(s), useParams), nor
 * a re-export, require() or import() of next/navigation that would hand them on. Two modules read the browser's path in
 * effects only and stay as they are (tracking parity): the Meta Pixel's page-view-on-route-change and the PostHog gate's
 * replay rule. */

const RAW_PATH_ALLOWED = new Set([
  "src/lib/site-path.ts",
  "src/components/tracking/MetaPixel.tsx",
  "src/components/tracking/PostHogGate.tsx",
]);
const SOURCE = /\.(?:tsx?|jsx?|mjs)$/;
const NOT_SHIPPED = /\.(?:test|test-d|spec|stories)\.[cm]?[jt]sx?$/;
/** The next/navigation hooks that read the route, which Vercel's runtime render of Home gives as ["", "index"]. */
const ROUTE_READERS = "usePathname|useSelectedLayoutSegments?|useParams";
/** An import or a re-export from next/navigation that names a route reader, one that takes the whole module (`* as`,
 * `export *`), or the module loaded by require() or import(). */
const IMPORTS_RAW_PATH = new RegExp(
  [
    String.raw`\b(?:import|export)\s*\{[^}]*\b(?:${ROUTE_READERS})\b[^}]*\}\s*from\s*["']next/navigation["']`,
    String.raw`\b(?:import|export)\s*\*\s*(?:as\s+[\w$]+\s*)?from\s*["']next/navigation["']`,
    String.raw`\b(?:require|import)\s*\(\s*["']next/navigation["']\s*\)`,
  ].join("|"),
);

/** The shipped modules, other than the allowed three, that read the route from next/navigation. */
function rawPathReaders(files: ReadonlyArray<{ path: string; text: string }>): string[] {
  return files
    .filter(({ path }) => SOURCE.test(path) && !NOT_SHIPPED.test(path) && !RAW_PATH_ALLOWED.has(path))
    .filter(({ text }) => IMPORTS_RAW_PATH.test(text))
    .map(({ path }) => path);
}

function sourceTree(): Array<{ path: string; text: string }> {
  return readdirSync("src", { recursive: true, encoding: "utf8" })
    .map((rel) => join("src", rel).split("\\").join("/"))
    .filter((path) => SOURCE.test(path))
    .map((path) => ({ path, text: readFileSync(path, "utf8") }));
}

describe("the page path: one reader (task 8c.7)", () => {
  it("no shipped module under src/ but site-path.ts and the two tracking gates reads the route from next/navigation", () => {
    const tree = sourceTree();
    expect(tree.length).toBeGreaterThan(100);
    expect(
      rawPathReaders(tree),
      "read the page path through useSitePath() (src/lib/site-path.ts): Vercel renders Home as /index (task 8c.7)",
    ).toEqual([]);
  });

  it("catches a planted reader (proof the rule can fail), and passes tests, stories and the allowed three", () => {
    const plant = (path: string, text: string) => rawPathReaders([{ path, text }]);
    expect(plant("src/components/chrome/X/X.client.tsx", `import { usePathname } from "next/navigation";`)).toEqual([
      "src/components/chrome/X/X.client.tsx",
    ]);
    expect(plant("src/components/chrome/X/X.client.tsx", `import {\n  useRouter,\n  usePathname,\n} from 'next/navigation';`)).toHaveLength(1);
    expect(plant("src/components/chrome/X/X.client.tsx", `import * as nav from "next/navigation";`)).toHaveLength(1);
    expect(plant("src/components/chrome/X/X.client.tsx", `import { useRouter } from "next/navigation";`)).toEqual([]);
    expect(plant("src/app/(site)/lp/[slug]/page.tsx", `import { notFound } from "next/navigation";`)).toEqual([]);
    expect(plant("src/components/chrome/X/X.test.tsx", `import { usePathname } from "next/navigation";`)).toEqual([]);
    expect(plant("src/components/chrome/X/X.stories.tsx", `import { usePathname } from "next/navigation";`)).toEqual([]);
    for (const path of RAW_PATH_ALLOWED) expect(plant(path, `import { usePathname } from "next/navigation";`)).toEqual([]);
  });

  /* The same segments reach every route reader, and a module can hand the hook on or load the whole module without an
     import statement: each is a reader outside site-path.ts. */
  it.each([
    ["a re-export", `export { usePathname } from "next/navigation";`],
    ["a re-export, renamed, over lines", `export {\n  useRouter,\n  usePathname as path,\n} from 'next/navigation';`],
    ["a re-export of the whole module", `export * from "next/navigation";`],
    ["a re-export of the whole module, named", `export * as nav from "next/navigation";`],
    ["require()", `const nav = require("next/navigation");`],
    ["a dynamic import()", `const nav = await import("next/navigation");`],
    ["useSelectedLayoutSegment", `import { useSelectedLayoutSegment } from "next/navigation";`],
    ["useSelectedLayoutSegments", `import { useRouter, useSelectedLayoutSegments } from "next/navigation";`],
    ["useParams", `import { useParams } from "next/navigation";`],
    ["useParams re-exported", `export { useParams } from "next/navigation";`],
  ])("catches a planted reader: %s", (_, text) => {
    const plant = (path: string) => rawPathReaders([{ path, text }]);
    expect(plant("src/components/chrome/X/X.client.tsx")).toEqual(["src/components/chrome/X/X.client.tsx"]);
    expect(plant("src/components/chrome/X/X.test.tsx")).toEqual([]);
    for (const path of RAW_PATH_ALLOWED) expect(plant(path)).toEqual([]);
  });

  it("passes the readers that never see the segments: useRouter, useSearchParams, notFound, redirect", () => {
    const plant = (text: string) => rawPathReaders([{ path: "src/components/chrome/X/X.client.tsx", text }]);
    expect(plant(`import { useRouter, useSearchParams } from "next/navigation";`)).toEqual([]);
    expect(plant(`export { notFound, redirect } from "next/navigation";`)).toEqual([]);
    expect(plant(`import { usePathnameLabel } from "@/lib/labels";`)).toEqual([]);
  });
});
