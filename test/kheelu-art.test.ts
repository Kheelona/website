import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { KHEELU_ART, kheeluAlt } from "@/lib/kheelu-art";

/** Guards the Kheelu product artwork (2026-08-25, the blue dino to cream rabbit
 *  swap).
 *
 *  Two of these close a real gap the repo did not have before: NOTHING
 *  asserted that an image file referenced by the code exists, and nothing
 *  asserted that a `width`/`height` pair matched the file it described. That
 *  gap is how `og.png` shipped a retired age band ("ages 3 to 6") live on
 *  every social share through three copy rounds. Pixels carry claims, and the
 *  voice lint cannot read them. */

const REPO = join(__dirname, "..");

/** Read a PNG's true dimensions from the IHDR chunk. No dependency needed:
 *  8-byte signature, then a length + "IHDR", then width and height as
 *  big-endian uint32 at offsets 16 and 20. */
function pngSize(path: string): { width: number; height: number } {
  const buf = readFileSync(path);
  expect(buf.subarray(1, 4).toString("ascii")).toBe("PNG");
  expect(buf.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** Comments are stripped before scanning, and this file excludes itself. The
 *  strings below are DESCRIBED in prose in `HeroStage.tsx` (the instruction for
 *  restoring the composite) and quoted here, and a guard that trips on the
 *  documentation of the thing it guards is a guard nobody keeps — the same
 *  lesson `test/action-label.test.ts` learned. */
function stripComments(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}

const SELF = "test/kheelu-art.test.ts";
const sourceFiles = execFileSync("git", ["ls-files", "src", "test"], {
  cwd: REPO,
  encoding: "utf8",
})
  .split("\n")
  .filter((f) => /\.(ts|tsx)$/.test(f) && f !== SELF);

/** Every scanned file, comments removed. */
const SCAN = sourceFiles.map((f) => ({
  path: f,
  src: stripComments(readFileSync(join(REPO, f), "utf8")),
}));

describe("KHEELU_ART is the one source for the product artwork", () => {
  it("points at a file that actually exists in public/", () => {
    const path = join(REPO, "public", KHEELU_ART.src);
    expect(existsSync(path)).toBe(true);
  });

  it("declares the shipped file's REAL pixel dimensions", () => {
    /* A stale pair is a CLS bug, not a cosmetic one: Next computes the layout
       box from these numbers before the image has loaded. */
    const { width, height } = pngSize(join(REPO, "public", KHEELU_ART.src));
    expect({ width, height }).toEqual({
      width: KHEELU_ART.width,
      height: KHEELU_ART.height,
    });
  });

  it("keeps the asset path dot-bearing, so the /product redirect cannot eat it", () => {
    /* next.config.ts redirects `/product/:slug([^.]+)` to /products/kheelu, and
       redirects match BEFORE public/ is served. A dot-free path here would
       308 into the image optimizer, return 400, and blank the image live —
       which is exactly what happened on 2026-07-28. */
    expect(KHEELU_ART.src.startsWith("/product/")).toBe(true);
    expect(KHEELU_ART.src).toMatch(/\.[a-z0-9]+$/i);
  });

  it("composes a contextual alt without restating the description", () => {
    expect(kheeluAlt("sitting calmly")).toBe(
      "Kheelu, the cream talking plush rabbit, sitting calmly",
    );
    /* Alt text is not a sentence; a trailing stop is announced as a pause. */
    expect(kheeluAlt("sitting calmly").endsWith(".")).toBe(false);
  });
});

describe("no source file describes the retired blue plush", () => {
  const RETIRED_PATHS = /lumi-(blue|green|pink)-2/;
  /* Scoped to a PLUSH described as sky blue, not to the words "sky blue".
     A broader /sky blue/ was tried first and flagged three innocent lines:
     "Why is the sky blue?" is the child's question and one of the site's
     signature copy lines (KheeluOrbit, growth-arc, a journal article). A guard
     that cries wolf on the product's best copy gets deleted, not obeyed. */
  const RETIRED_WORDS = /sky blue[^.]{0,24}plush|plush[^.]{0,24}sky blue|party hat/i;

  it("finds files to scan, so a silent empty pass is impossible", () => {
    expect(SCAN.length).toBeGreaterThan(50);
  });

  it("references no retired colourway asset", () => {
    const offenders = SCAN.filter((f) => RETIRED_PATHS.test(f.src)).map((f) => f.path);
    expect(offenders).toEqual([]);
  });

  it("describes no plush as sky blue or hatted", () => {
    const offenders: string[] = [];
    for (const f of SCAN) {
      f.src.split("\n").forEach((line, i) => {
        if (RETIRED_WORDS.test(line)) offenders.push(`${f.path}:${i + 1} ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  it("has no reference left to the retired hero composite", () => {
    const offenders = SCAN.filter((f) => f.src.includes("/hero/kheelu-lumi.png")).map(
      (f) => f.path,
    );
    expect(offenders).toEqual([]);
  });
});
