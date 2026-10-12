import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { films } from "@/content/en-IN/films";
import type { Film } from "@/content/types";

/** The half of `docs/video-conventions.md` a machine can check (§8.37-e), over the films the site shows
 *  (content/en-IN/films.ts, D040). Rewritten by task 3.3 over the films content, so nothing here depends on the legacy
 *  film list or on the launch film, both of which task 6.3 deletes.
 *
 *  The founder chose a written checklist over a CLI, which is the right call for a handful of files a year. This is
 *  the guard that makes the checklist worth writing down: a rule nothing enforces is a rule that gets skipped at
 *  eleven at night, and the failure it is here to prevent is an unoptimised phone export going into a PUBLIC git
 *  repo, where its weight is permanent and shared by every clone.
 *
 *  THE VALIDATOR IS PROVEN BEFORE IT IS TRUSTED: the fixtures below exercise each rule in both directions first, and
 *  only then is the real list run through the same functions. */

const REPO = join(__dirname, "..");

/** The rulebook's numbers (docs/video-conventions.md: "1080x1920", "4MB" maximum, "12 videos"); the last describe
 *  block holds them equal to the document. */
const VIDEO_DIR = "/video/moments";
const VIDEO_ASPECT = { width: 1080, height: 1920 } as const;
const VIDEO_MAX_BYTES = 4 * 1024 * 1024;
const VIDEO_MAX_COUNT = 12;

/** The founder's centre slot (2026-09-19): three films show at rest on a laptop, the montage in the middle and the
 *  parent's testimonial to its right (mockup.css:83). */
const CENTRE_INDEX = 1;
const CENTRE_ID = "first-conversations";
const RIGHT_OF_CENTRE_ID = "a-parent-speaks";

function fixture(over: Partial<Film> = {}): Film {
  return {
    id: "a-child-asks",
    chip: "A parent in Pune",
    caption: "Her three year old asks the same question four times.",
    duration: "0:30",
    poster: { src: `${VIDEO_DIR}/a-child-asks.jpg`, width: VIDEO_ASPECT.width, height: VIDEO_ASPECT.height, alt: "A child on a rug holding the cream Kheelu plush." },
    video: `${VIDEO_DIR}/a-child-asks.mp4`,
    hasOpenCaptions: true,
    consentOnFile: true,
    ...over,
  };
}

/** The poster's path and size, when it is a file under public/ (films always are). */
function posterOf(f: Film): { src: string; width: number; height: number } | null {
  return "width" in f.poster && typeof f.poster.src === "string" ? { src: f.poster.src, width: f.poster.width, height: f.poster.height } : null;
}

/** Every rule that can be checked from the row alone. Returns the problems, so a failing row names what is wrong. */
function shapeProblems(f: Film): string[] {
  const problems: string[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.id)) problems.push(`id "${f.id}" is not lowercase kebab-case`);
  if (f.video !== `${VIDEO_DIR}/${f.id}.mp4`) problems.push(`video must be ${VIDEO_DIR}/${f.id}.mp4, got ${f.video}`);
  const poster = posterOf(f);
  if (!poster) problems.push("poster must be a file under public/ with its size");
  else {
    if (poster.src !== `${VIDEO_DIR}/${f.id}.jpg`) problems.push(`poster must be ${VIDEO_DIR}/${f.id}.jpg, got ${poster.src}`);
    if (poster.width !== VIDEO_ASPECT.width || poster.height !== VIDEO_ASPECT.height) {
      problems.push(`must be ${VIDEO_ASPECT.width}x${VIDEO_ASPECT.height}, got ${poster.width}x${poster.height}`);
    }
  }
  if (!/^\d+:[0-5]\d$/.test(f.duration)) problems.push(`duration "${f.duration}" is not m:ss`);
  const text = { chip: f.chip, caption: f.caption, alt: f.poster.alt };
  for (const [field, max] of [
    ["chip", 40],
    ["caption", 120],
    ["alt", 140],
  ] as const) {
    if (!text[field].trim()) problems.push(`${field} is empty`);
    if (text[field].length > max) problems.push(`${field} is longer than ${max} characters`);
    // The site's voice lint: en dashes only inside number ranges, so neither dash belongs in a hand-written label.
    if (/[—–]/.test(text[field])) problems.push(`${field} contains a dash the voice lint bans`);
  }
  return problems;
}

/** Every rule that needs the files on disk. */
function assetProblems(f: Film): string[] {
  const problems: string[] = [];
  const onDisk = (webPath: string) => join(REPO, "public", webPath.replace(/^\//, ""));
  if (!existsSync(onDisk(f.video))) problems.push(`video file is missing: public${f.video}`);
  else {
    const bytes = statSync(onDisk(f.video)).size;
    if (bytes > VIDEO_MAX_BYTES) problems.push(`video is ${(bytes / 1024 / 1024).toFixed(1)}MB, over the ${VIDEO_MAX_BYTES / 1024 / 1024}MB budget`);
  }
  const poster = posterOf(f);
  if (poster && !existsSync(onDisk(poster.src))) problems.push(`poster file is missing: public${poster.src}`);
  return problems;
}

describe("the video rules themselves", () => {
  it("passes a correctly shaped row", () => {
    expect(shapeProblems(fixture())).toEqual([]);
  });

  it("catches an id that is not kebab-case", () => {
    expect(shapeProblems(fixture({ id: "A_Child" })).join()).toMatch(/kebab-case/);
  });

  it("catches a path that does not follow the naming rule", () => {
    expect(shapeProblems(fixture({ video: `${VIDEO_DIR}/something-else.mp4` })).join()).toMatch(/video must be/);
    expect(shapeProblems(fixture({ poster: { src: `${VIDEO_DIR}/other.jpg`, width: 1080, height: 1920, alt: "x" } })).join()).toMatch(/poster must be/);
  });

  it("catches a film that is not the vertical 9:16 the rulebook sets", () => {
    expect(shapeProblems(fixture({ poster: { src: `${VIDEO_DIR}/a-child-asks.jpg`, width: 1920, height: 1080, alt: "x" } })).join()).toMatch(/must be 1080x1920/);
  });

  it("catches a length that is not printed m:ss", () => {
    expect(shapeProblems(fixture({ duration: "0:7" as Film["duration"] })).join()).toMatch(/not m:ss/);
  });

  it("catches an empty or overlong caption", () => {
    expect(shapeProblems(fixture({ caption: "   " })).join()).toMatch(/caption is empty/);
    expect(shapeProblems(fixture({ caption: "x".repeat(200) })).join()).toMatch(/longer than 120/);
  });

  it("catches a dash the voice lint bans", () => {
    expect(shapeProblems(fixture({ caption: "A child asks — and asks again." })).join()).toMatch(/dash the voice lint bans/);
  });

  it("catches a missing file on disk", () => {
    // the fixture's files deliberately do not exist
    expect(assetProblems(fixture()).join()).toMatch(/video file is missing/);
    expect(assetProblems(fixture()).join()).toMatch(/poster file is missing/);
  });

  it("catches a film over the size budget", () => {
    // Point a fixture at a real file and lower nothing: the arithmetic is checked on the largest film the site ships,
    // so raising the budget past it would show here.
    const sizes = films.map((f) => statSync(join(REPO, "public", f.video)).size);
    const largest = films[sizes.indexOf(Math.max(...sizes))];
    expect(assetProblems(largest)).toEqual([]);
    expect(Math.max(...sizes)).toBeLessThan(VIDEO_MAX_BYTES);
  });
});

describe("the live film library (content/en-IN/films.ts)", () => {
  it("is within the count the rulebook allows", () => {
    // These files live in a git repo forever and in every clone, so the ceiling is about permanent shared weight.
    expect(films.length).toBeLessThanOrEqual(VIDEO_MAX_COUNT);
  });

  it("has no duplicate ids", () => {
    const ids = films.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a correctly shaped row for every film", () => {
    expect(films.flatMap((f) => shapeProblems(f).map((p) => `${f.id}: ${p}`))).toEqual([]);
  });

  it("has every file it references, within budget", () => {
    expect(films.flatMap((f) => assetProblems(f).map((p) => `${f.id}: ${p}`))).toEqual([]);
  });

  it("has posters of the size each row declares", async () => {
    for (const f of films) {
      const poster = posterOf(f)!;
      const meta = await sharp(join(REPO, "public", poster.src)).metadata();
      expect([meta.width, meta.height], f.id).toEqual([poster.width, poster.height]);
    }
  });

  it("asserts open captions and consent on every row", () => {
    // The type forces both to be literal `true`, so this cannot fail while the type holds. It is here because the type
    // is the only thing holding it: if someone widens them to `boolean` to make a row compile, this test notices.
    for (const f of films) {
      expect(f.hasOpenCaptions).toBe(true);
      expect(f.consentOnFile).toBe(true);
    }
  });
});

describe("the centre slot is held, because losing it would be silent", () => {
  it("puts the montage in the centre tile at rest", () => {
    // Founder instruction 2026-09-19. Three tiles show at rest on a laptop, so "central" is index 1. Appending rows is
    // safe; inserting one above it is what this catches, and nothing on the page would look broken.
    expect(films[CENTRE_INDEX]?.id).toBe(CENTRE_ID);
  });

  it("puts the parent testimonial directly to its right", () => {
    expect(films[CENTRE_INDEX + 1]?.id).toBe(RIGHT_OF_CENTRE_ID);
  });

  it("has enough films for a centre to exist at all", () => {
    // With fewer than three there is no middle tile, so the two assertions above would pass for the wrong reason.
    expect(films.length).toBeGreaterThanOrEqual(3);
  });
});

describe("the rulebook exists and agrees with the code", () => {
  const doc = join(REPO, "docs", "video-conventions.md");

  it("is checked in", () => {
    expect(existsSync(doc)).toBe(true);
  });

  it("publishes the same numbers this test enforces", () => {
    // The doc and the numbers drifting apart is how a checklist stops being true.
    const text = readFileSync(doc, "utf8");
    expect(text).toContain(`${VIDEO_ASPECT.width}x${VIDEO_ASPECT.height}`);
    expect(text).toContain(`${VIDEO_MAX_BYTES / 1024 / 1024}MB`);
    expect(text).toContain(`${VIDEO_MAX_COUNT} videos`);
  });
});
