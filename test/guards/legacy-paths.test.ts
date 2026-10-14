// The legacy lists stay empty (task 6.3). Task 1.1 let the new-design guards skip the pre-reset files and routes
// while the build replaced them (legacy-paths.ts); task 6.3 deleted the last of that code and emptied both lists, so
// every guard now reads all of src/ and every route. A list that fills again would let a file or a route hide from
// every guard at once, so this holds both empty and proves the helpers answer "not legacy" for every file and route.
import { describe, expect, it } from "vitest";
import { listFiles } from "../e2e/support/repo";
import { LEGACY_PATHS, LEGACY_ROUTES, isLegacyRoute, isListedLegacy, isStillLegacy } from "./legacy-paths";

describe("legacy-paths.ts after task 6.3", () => {
  it("lists no legacy source path", () => {
    expect(LEGACY_PATHS).toEqual([]);
  });

  it("lists no legacy route", () => {
    expect(LEGACY_ROUTES).toEqual([]);
  });

  it("calls no file under src/ legacy, so every guard reads all of src/", () => {
    const files = listFiles(["src"]);
    expect(files.length).toBeGreaterThan(100);
    expect(files.filter((p) => isListedLegacy(p) || isStillLegacy(p))).toEqual([]);
  });

  it("calls no route legacy, on either host", () => {
    for (const [host, path] of [
      ["marketing", "/"],
      ["marketing", "/stories/learning-toys-for-a-three-year-old"],
      ["marketing", "/playos"],
      ["store", "/"],
      ["store", "/ideabaaz"],
      ["store", "/e/ideabaaz-2026"],
    ] as const) {
      expect(isLegacyRoute(host, path), `${host} ${path}`).toBe(false);
    }
  });
});
