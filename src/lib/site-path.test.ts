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
 * usePathname() itself. Two modules read the browser's path in effects only and stay as they are (tracking parity): the
 * Meta Pixel's page-view-on-route-change and the PostHog gate's replay rule. */

const RAW_PATH_ALLOWED = new Set([
  "src/lib/site-path.ts",
  "src/components/tracking/MetaPixel.tsx",
  "src/components/tracking/PostHogGate.tsx",
]);
const SOURCE = /\.(?:tsx?|jsx?|mjs)$/;
const NOT_SHIPPED = /\.(?:test|test-d|spec|stories)\.[cm]?[jt]sx?$/;
/** Any import from next/navigation that names usePathname, or takes the whole module. */
const IMPORTS_RAW_PATH = /import\s*(?:\{[^}]*\busePathname\b[^}]*\}|\*\s*as\s+\w+)\s*from\s*["']next\/navigation["']/;

/** The shipped modules, other than the allowed three, that import usePathname from next/navigation. */
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
  it("no shipped module under src/ but site-path.ts and the two tracking gates imports usePathname", () => {
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
    expect(plant("src/components/chrome/X/X.test.tsx", `import { usePathname } from "next/navigation";`)).toEqual([]);
    expect(plant("src/components/chrome/X/X.stories.tsx", `import { usePathname } from "next/navigation";`)).toEqual([]);
    for (const path of RAW_PATH_ALLOWED) expect(plant(path, `import { usePathname } from "next/navigation";`)).toEqual([]);
  });
});
