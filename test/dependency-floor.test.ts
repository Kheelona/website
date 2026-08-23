import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Version floors we may not fall back below (F-02, security-review.md).
 *
 * A dependency bump made for a security advisory is invisible a month later: the
 * next person to touch package.json sees a version number with no story, and a
 * lockfile refresh or a merge can quietly take it back down. So each floor is
 * recorded here with the reason, and the suite fails if we ever drop under one.
 *
 * Raising a floor is normal. LOWERING one means re-opening the advisory, and
 * this test is where that argument has to be made out loud.
 */

const FLOORS: { name: string; min: string; why: string }[] = [
  {
    name: "next",
    min: "16.2.12",
    why:
      "16.2.11 fixed nine advisories in 16.2.x, four of them high: a middleware/proxy " +
      "bypass (GHSA-6gpp-xcg3-4w24), which is the layer this app's whole host split and the " +
      "store's noindex header run on; SSRF via rewrites (GHSA-p9j2-gv94-2wf4) and in Server " +
      "Actions (GHSA-89xv-2m56-2m9x); and a Server Actions DoS (GHSA-m99w-x7hq-7vfj). Plus " +
      "cache confusion on requests with bodies, an image-optimizer DoS, and unauthenticated " +
      "disclosure of internal server function endpoints.",
  },
];

/** Compare two x.y.z strings numerically. Enough for the exact pins this repo uses. */
function atLeast(actual: string, minimum: string): boolean {
  const clean = (v: string) => v.replace(/^[^0-9]*/, "").split("-")[0].split(".").map(Number);
  const [a, b] = [clean(actual), clean(minimum)];
  for (let i = 0; i < 3; i += 1) {
    if ((a[i] ?? 0) > (b[i] ?? 0)) return true;
    if ((a[i] ?? 0) < (b[i] ?? 0)) return false;
  }
  return true;
}

describe("security version floors", () => {
  const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };

  for (const floor of FLOORS) {
    it(`keeps ${floor.name} at ${floor.min} or above`, () => {
      const declared = pkg.dependencies[floor.name] ?? pkg.devDependencies[floor.name];
      expect(declared, `${floor.name} is not in package.json`).toBeTruthy();
      expect(atLeast(declared, floor.min), `${floor.name} ${declared}: ${floor.why}`).toBe(true);
    });

    it(`has ${floor.name} actually installed at that floor`, () => {
      /* The declaration and the tree can disagree, and the tree is what ships. */
      const installed = JSON.parse(
        readFileSync(join(process.cwd(), "node_modules", floor.name, "package.json"), "utf8"),
      ) as { version: string };
      expect(atLeast(installed.version, floor.min), `${floor.name} ${installed.version}`).toBe(true);
    });
  }

  it("compares versions the way a human would, not as strings", () => {
    /* "16.2.9" > "16.2.12" as strings, which is exactly the bug that would make
       this whole file pass while the advisory stayed open. */
    expect(atLeast("16.2.12", "16.2.12")).toBe(true);
    expect(atLeast("16.3.0", "16.2.12")).toBe(true);
    expect(atLeast("16.2.9", "16.2.12")).toBe(false);
    expect(atLeast("15.9.9", "16.2.12")).toBe(false);
    expect(atLeast("17.0.0", "16.2.12")).toBe(true);
  });
});
