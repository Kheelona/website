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
 *
 * ── 2026-09-05, the dependency sweep. Two new mechanisms, both earned. ───────
 *
 * A TRANSITIVE FLOOR CHECKS EVERY COPY, because one vulnerable copy is enough.
 * The original file could only floor a package named in package.json, and read
 * only the hoisted `node_modules/<name>`. Six of the eight packages in this
 * round are transitive, and `postcss` was vulnerable in TWO places for two
 * different reasons: the hoisted 8.5.16 from `@tailwindcss/postcss`, and an
 * 8.4.31 that `next` pinned EXACTLY inside its own node_modules. A floor that
 * checks one of two copies is a floor that lies. TRANSITIVE_FLOORS therefore
 * walks `package-lock.json` — which is committed, needs no install, and is the
 * same artefact Dependabot reads — and asserts every matching path.
 */

const FLOORS: { name: string; min: string; why: string }[] = [
  {
    name: "next",
    min: "16.3.4",
    why:
      "16.2.11 fixed nine advisories in 16.2.x, four of them high: a middleware/proxy " +
      "bypass (GHSA-6gpp-xcg3-4w24), which is the layer this app's whole host split and the " +
      "store's noindex header run on; SSRF via rewrites (GHSA-p9j2-gv94-2wf4) and in Server " +
      "Actions (GHSA-89xv-2m56-2m9x); and a Server Actions DoS (GHSA-m99w-x7hq-7vfj). Plus " +
      "cache confusion on requests with bodies, an image-optimizer DoS, and unauthenticated " +
      "disclosure of internal server function endpoints. " +
      "RAISED to 16.3.4 on 2026-09-05: next still carries no advisory of its OWN (npm audit " +
      "shows via: [postcss, sharp]), but 16.2.12 is the LAST 16.2.x release ever published, so " +
      "the patch-only-inside-16.2.x policy recorded in August had no path left. 16.3.4 declares " +
      "postcss 8.5.23 (was an exact 8.4.31) and sharp ^0.35.4 (was ^0.34.5), which is what " +
      "actually closes the two transitive advisories. Founder-approved as a minor bump.",
  },
  {
    name: "eslint-config-next",
    min: "16.3.4",
    why:
      "NOT a security floor: a coherence one. This package is exact-pinned to the same string " +
      "as `next` because @next/eslint-plugin-next ships inside it and lints against one " +
      "framework version's rules. Recording it here is what stops a future bump moving one and " +
      "not the other, which is a drift nothing else in the suite would notice.",
  },
];

/** Transitive floors, checked against EVERY copy in package-lock.json.
 *
 *  `min` is either a version string, or a map of major -> version when a package
 *  was patched separately on two release lines (see brace-expansion). */
const TRANSITIVE_FLOORS: {
  name: string;
  min: string | Record<number, string>;
  why: string;
}[] = [
  {
    name: "postcss",
    min: "8.5.23",
    why:
      "GHSA-r28c-9q8g-f849 HIGH path traversal in source-map auto-loading; GHSA-6g55-p6wh-862q " +
      "HIGH arbitrary file read via attacker-controlled sourceMappingURL; GHSA-fxqj-rqcc-2cmp " +
      "and GHSA-qx2v-qp2m-jg93 moderate. Build-time only, on CSS we wrote ourselves, so there is " +
      "no attacker-controlled input on our paths. TWO copies were vulnerable for different " +
      "reasons, which is why this floor walks every lockfile path: the hoisted one from " +
      "@tailwindcss/postcss and vite, and one `next` pinned at exactly 8.4.31.",
  },
  {
    name: "sharp",
    min: "0.35.4",
    why:
      "GHSA-f88m-g3jw-g9cj HIGH, inherited libvips CVE-2026-33327/33328/35590/35591 (<0.35.0). " +
      "The advisory's own wording is 'those processing UNTRUSTED INPUT are affected'; this app " +
      "configures no remotePatterns, so only our own files in public/ ever reach the optimizer, " +
      "and on Vercel the platform optimizer sits in front of it. Floored at 0.35.4 (what next " +
      "16.3.4 declares) rather than 0.35.0, so it cannot be satisfied by a version Next never " +
      "shipped with.",
  },
  {
    name: "nanoid",
    min: "3.3.18",
    why:
      "GHSA-28wg-ghj8-5hjv HIGH, non-secure generators loop indefinitely on a negative size " +
      "(<3.3.16); GHSA-2v37-7h3g-55p8 HIGH, custom generators loop indefinitely when size is " +
      "zero (<3.3.18). 3.3.16 IS NOT ENOUGH and is the easy mistake here, because 3.3.16 is the " +
      "number postcss@8.5.23 declares in its range. Reached only through postcss.",
  },
];

/** Packages that must not be in the tree at all, because no version of them is safe.
 *  Empty today; the mechanism exists because a floor cannot express "no version of
 *  this is ever acceptable", and one such package is arriving in this round. */
const BANNED: { name: string; why: string }[] = [];

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

/** Every version of `name` present anywhere in the lockfile, with its path. */
function lockedCopies(name: string): { path: string; version: string }[] {
  const lock = JSON.parse(readFileSync(join(process.cwd(), "package-lock.json"), "utf8")) as {
    packages: Record<string, { version?: string }>;
  };
  return Object.entries(lock.packages)
    .filter(([path]) => path.endsWith(`node_modules/${name}`))
    .map(([path, meta]) => ({ path, version: meta.version ?? "" }))
    .filter((copy) => copy.version !== "");
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

  /* `next` and `eslint-config-next` are exact-pinned on purpose. A caret here
     would let a lockfile refresh drift the framework a minor at a time without
     anyone deciding to, and `npm install <pkg>@<version>` writes a caret BY
     DEFAULT (save-prefix is ^, and this repo has no .npmrc) — so the pin is one
     forgotten --save-exact away from disappearing. */
  it("keeps the framework pins exact, not caret ranges", () => {
    expect(pkg.dependencies.next).toBe("16.3.4");
    expect(pkg.devDependencies["eslint-config-next"]).toBe("16.3.4");
  });

  for (const floor of TRANSITIVE_FLOORS) {
    it(`floors every copy of ${floor.name} in the lockfile`, () => {
      const copies = lockedCopies(floor.name);
      expect(copies.length, `${floor.name} is not in the lockfile at all`).toBeGreaterThan(0);

      for (const copy of copies) {
        if (typeof floor.min === "string") {
          expect(
            atLeast(copy.version, floor.min),
            `${copy.path} is ${copy.version}, below ${floor.min}: ${floor.why}`,
          ).toBe(true);
          continue;
        }
        /* Per-major floor. A copy on a major line with no recorded floor is a new
           supply-chain surface arriving unreviewed, so it fails loudly rather
           than passing by omission. */
        const major = Number(copy.version.split(".")[0]);
        const min = floor.min[major];
        expect(min, `${copy.path} is on ${floor.name} v${major}, which has no recorded floor`)
          .toBeTruthy();
        expect(
          atLeast(copy.version, min),
          `${copy.path} is ${copy.version}, below ${min}: ${floor.why}`,
        ).toBe(true);
      }
    });
  }

  for (const banned of BANNED) {
    it(`keeps ${banned.name} out of the tree entirely`, () => {
      const copies = lockedCopies(banned.name);
      expect(
        copies.map((c) => `${c.path}@${c.version}`),
        banned.why,
      ).toEqual([]);
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
    /* The arithmetic of THIS round, pinned because each one is a mistake someone
       would plausibly make. 3.3.16 is the number postcss declares and is a
       version too low; 8.4.31 is what next used to pin; 16.2.12 is where we
       started and must now read as below the floor. */
    expect(atLeast("3.3.16", "3.3.18")).toBe(false);
    expect(atLeast("8.4.31", "8.5.23")).toBe(false);
    expect(atLeast("0.34.5", "0.35.4")).toBe(false);
    expect(atLeast("16.2.12", "16.3.4")).toBe(false);
    /* And the one that forces per-major floors on brace-expansion. */
    expect(atLeast("1.1.18", "5.0.9")).toBe(false);
  });
});
