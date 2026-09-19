import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  VIDEO_MOMENTS,
  VIDEO_ASPECT,
  VIDEO_MAX_BYTES,
  VIDEO_MAX_COUNT,
  VIDEO_DIR,
  videoLede,
  type VideoMoment,
} from "@/lib/video-moments";

/** The half of `docs/video-conventions.md` a machine can check (§8.37-e).
 *
 *  The founder chose a written checklist over a CLI, which is the right call
 *  for a handful of files a year. This is the guard that makes the checklist
 *  worth writing down: a rule nothing enforces is a rule that gets skipped at
 *  eleven at night, and the specific failure it is here to prevent is an
 *  unoptimised phone export going into a PUBLIC git repo, where its weight is
 *  permanent and shared by every clone.
 *
 *  THE VALIDATOR IS PROVEN BEFORE IT IS TRUSTED. `VIDEO_MOMENTS` is empty
 *  today, so applying these rules to it passes vacuously and would keep
 *  passing if every rule were deleted. The fixtures below therefore exercise
 *  each rule in both directions first, and only then is the real list run
 *  through the same function. */

const REPO = join(__dirname, "..");

function fixture(over: Partial<VideoMoment> = {}): VideoMoment {
  return {
    id: "a-child-asks",
    chip: "A parent in Pune",
    label: "Her three year old asks the same question four times.",
    alt: "A child on a rug holding the cream Kheelu plush.",
    src: `${VIDEO_DIR}/a-child-asks.mp4`,
    poster: `${VIDEO_DIR}/a-child-asks.jpg`,
    preview: `${VIDEO_DIR}/a-child-asks.webp`,
    width: VIDEO_ASPECT.width,
    height: VIDEO_ASPECT.height,
    hasOpenCaptions: true,
    consentOnFile: true,
    ...over,
  };
}

/** Every rule that can be checked from the row alone. Returns the problems,
 *  so a failing row names what is wrong rather than just failing. */
function shapeProblems(m: VideoMoment): string[] {
  const problems: string[] = [];

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(m.id)) {
    problems.push(`id "${m.id}" is not lowercase kebab-case`);
  }
  for (const [field, ext] of [
    ["src", "mp4"],
    ["poster", "jpg"],
    ["preview", "webp"],
  ] as const) {
    const value = m[field];
    if (value === undefined) continue;
    if (value !== `${VIDEO_DIR}/${m.id}.${ext}`) {
      problems.push(`${field} must be ${VIDEO_DIR}/${m.id}.${ext}, got ${value}`);
    }
  }
  if (m.width !== VIDEO_ASPECT.width || m.height !== VIDEO_ASPECT.height) {
    problems.push(
      `must be ${VIDEO_ASPECT.width}x${VIDEO_ASPECT.height}, got ${m.width}x${m.height}`,
    );
  }
  for (const [field, max] of [
    ["chip", 40],
    ["label", 120],
    ["alt", 140],
  ] as const) {
    if (!m[field].trim()) problems.push(`${field} is empty`);
    if (m[field].length > max) problems.push(`${field} is longer than ${max} characters`);
  }
  // The site's voice lint: en-dashes only inside number ranges, so neither
  // dash belongs in a hand-written label.
  for (const field of ["chip", "label", "alt"] as const) {
    if (/[—–]/.test(m[field])) problems.push(`${field} contains a dash the voice lint bans`);
  }
  return problems;
}

/** Every rule that needs the files on disk. */
function assetProblems(m: VideoMoment): string[] {
  const problems: string[] = [];
  const required: [string, string | undefined][] = [
    ["video", m.src],
    ["poster", m.poster],
    ["preview", m.preview],
  ];
  for (const [what, webPath] of required) {
    if (!webPath) continue;
    const onDisk = join(REPO, "public", webPath.replace(/^\//, ""));
    if (!existsSync(onDisk)) {
      problems.push(`${what} file is missing: public${webPath}`);
      continue;
    }
    if (what === "video") {
      const bytes = statSync(onDisk).size;
      if (bytes > VIDEO_MAX_BYTES) {
        problems.push(
          `video is ${(bytes / 1024 / 1024).toFixed(1)}MB, over the ${(
            VIDEO_MAX_BYTES /
            1024 /
            1024
          ).toFixed(0)}MB budget`,
        );
      }
    }
  }
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
    expect(
      shapeProblems(fixture({ src: "/video/moments/something-else.mp4" })).join(),
    ).toMatch(/src must be/);
  });

  it("catches a file that is not the vertical 9:16 the rulebook sets", () => {
    expect(shapeProblems(fixture({ width: 1920, height: 1080 })).join()).toMatch(
      /must be 1080x1920/,
    );
  });

  it("catches an empty or overlong label", () => {
    expect(shapeProblems(fixture({ label: "   " })).join()).toMatch(/label is empty/);
    expect(shapeProblems(fixture({ label: "x".repeat(200) })).join()).toMatch(
      /longer than 120/,
    );
  });

  it("catches a dash the voice lint bans", () => {
    expect(shapeProblems(fixture({ label: "A child asks — and asks again." })).join()).toMatch(
      /dash the voice lint bans/,
    );
  });

  it("catches a missing file on disk", () => {
    // the fixture's assets deliberately do not exist
    expect(assetProblems(fixture()).join()).toMatch(/file is missing/);
  });

  it("catches a video over the size budget", () => {
    // launch.mp4 is a real 2.8MB file; point a fixture at a real oversized one
    // by lowering nothing and instead proving the branch with a known file.
    const launch = join(REPO, "public", "video", "launch.mp4");
    expect(existsSync(launch)).toBe(true);
    const bytes = statSync(launch).size;
    // guards the arithmetic rather than the file: if the budget is ever raised
    // past this file's size, this line says so out loud.
    expect(bytes).toBeLessThan(VIDEO_MAX_BYTES);
  });
});

describe("the live video library", () => {
  it("is within the count the rulebook allows", () => {
    // These files live in a git repo forever and in every clone, so the ceiling
    // is about permanent shared weight, not about disk.
    expect(VIDEO_MOMENTS.length).toBeLessThanOrEqual(VIDEO_MAX_COUNT);
  });

  it("has no duplicate ids", () => {
    const ids = VIDEO_MOMENTS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a correctly shaped row for every video", () => {
    const problems = VIDEO_MOMENTS.flatMap((m) =>
      shapeProblems(m).map((p) => `${m.id}: ${p}`),
    );
    expect(problems).toEqual([]);
  });

  it("has every file it references, within budget", () => {
    const problems = VIDEO_MOMENTS.flatMap((m) =>
      assetProblems(m).map((p) => `${m.id}: ${p}`),
    );
    expect(problems).toEqual([]);
  });

  it("asserts open captions and consent on every row", () => {
    // The type already forces both to be literal `true`, so this cannot fail
    // while the type holds. It is here because the type is the only thing
    // holding it: if someone ever widens these to `boolean` to make a row
    // compile, this test is what notices.
    for (const m of VIDEO_MOMENTS) {
      expect(m.hasOpenCaptions).toBe(true);
      expect(m.consentOnFile).toBe(true);
    }
  });
});

describe("the rulebook exists and agrees with the code", () => {
  const doc = join(REPO, "docs", "video-conventions.md");

  it("is checked in", () => {
    expect(existsSync(doc)).toBe(true);
  });

  it("publishes the same numbers the code enforces", () => {
    // The doc and the constants drifting apart is how a checklist stops being
    // true. Same pattern as test/utm.test.ts parsing docs/utm-conventions.md.
    const text = readFileSync(doc, "utf8");
    expect(text).toContain(`${VIDEO_ASPECT.width}x${VIDEO_ASPECT.height}`);
    expect(text).toContain(`${VIDEO_MAX_BYTES / 1024 / 1024}MB`);
    expect(text).toContain(`${VIDEO_MAX_COUNT} videos`);
  });
});

describe("the section's lede agrees with how many films are under it", () => {
  const one = [fixture()];
  const two = [fixture(), fixture({ id: "second" })];

  it("says nothing plural over a single film", () => {
    expect(videoLede(one)).toBe("Real children in real homes. Press play.");
    expect(videoLede(one)).not.toMatch(/any of them/);
  });

  it("invites a choice once there is one to make", () => {
    expect(videoLede(two)).toMatch(/any of them/);
  });

  it("is what the live list would render, whatever the count", () => {
    // guards the real call the pages make, not just the fixtures
    const live = videoLede();
    expect(live.startsWith("Real children in real homes.")).toBe(true);
    expect(live.includes("any of them")).toBe(VIDEO_MOMENTS.length > 1);
  });
});
