import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { listFiles, readRepoBytes } from "../e2e/support/repo";

/* asset-dupes (task 1.1; architecture §10, brief §9.12 "asset hash checks").
 *
 * Every file in public/ and src/assets/ is hashed. Two failures:
 *   1. two files with the same bytes (one asset, one URL: a second copy is waste and drift);
 *   2. a byte-for-byte copy of a design-system file outside the generated folders. DS assets are
 *      imported from design-system/ itself (`@ds/…`, ADR-010); only the generated derivatives
 *      (fonts, Open Graph and stable media images, the logo mark) live in public/, written by
 *      their scripts (structure §8).
 */

/** Folders and files the asset scripts write (tasks 1.2 and 1.5); a DS byte-copy is allowed there. */
const GENERATED: readonly RegExp[] = [
  /^public\/fonts\//,
  /^public\/og\//,
  /^public\/og\.png$/,
  /^public\/media\//,
  /^public\/brand\/logo-mark\.png$/,
  /^src\/assets\/[^/]*\.generated\.[^/]+$/,
];

const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

function findProblems(site: { path: string; hash: string }[], ds: Map<string, string>): string[] {
  const problems: string[] = [];
  const byHash = new Map<string, string[]>();
  for (const f of site) byHash.set(f.hash, [...(byHash.get(f.hash) ?? []), f.path]);
  for (const paths of byHash.values()) {
    if (paths.length > 1) problems.push(`duplicate bytes: ${paths.join(" = ")}`);
  }
  for (const f of site) {
    const original = ds.get(f.hash);
    if (original && !GENERATED.some((re) => re.test(f.path))) {
      problems.push(`${f.path} is a byte copy of ${original}: import it from @ds/ instead`);
    }
  }
  return problems;
}

describe("asset-dupes detector", () => {
  const ds = new Map([["h-ds", "design-system/project/assets/Kheelu/kheelu-front.png"]]);
  it("red on two identical files", () => {
    expect(findProblems([{ path: "public/a.png", hash: "h1" }, { path: "src/assets/b.png", hash: "h1" }], ds)).toHaveLength(1);
  });
  it("red on a DS copy outside the generated folders", () => {
    expect(findProblems([{ path: "public/kheelu.png", hash: "h-ds" }], ds)).toHaveLength(1);
  });
  it("green on a generated derivative and on distinct files", () => {
    expect(findProblems([{ path: "public/media/kheelu.png", hash: "h-ds" }, { path: "public/x.png", hash: "h2" }], ds)).toEqual([]);
  });
});

describe("asset-dupes: public/ and src/assets/", () => {
  it("has no duplicate asset and no stray design-system copy", () => {
    const site = listFiles(["public", "src/assets"]).map((path) => ({ path, hash: sha(readRepoBytes(path)) }));
    const ds = new Map<string, string>();
    for (const path of listFiles(["design-system"])) {
      const h = sha(readRepoBytes(path));
      if (!ds.has(h)) ds.set(h, path);
    }
    expect(site.length, "public/ should hold the films, posters and brand files").toBeGreaterThan(10);
    expect(ds.size).toBeGreaterThan(500);
    console.log(`[asset-dupes] hashed ${site.length} site file(s) against ${ds.size} design-system file(s).`);
    const problems = findProblems(site, ds);
    expect(problems, problems.join("\n")).toEqual([]);
  });
});
