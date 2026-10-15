import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ROOT, readRepoFile } from "../../../test/e2e/support/repo";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import * as expertVideo from "./expert-video";
import { expertClip, expertFold } from "./expert-video";

/* The expert clip (task 8c.6; D061 items 12-13): a 34-second trimmed copy of the founder's own expert video, hosted like
 * the films, right after the offer on the product page. The founder chose the CMO's cut (0:00.0-0:24.5 and
 * 1:34.0-1:43.2 of the 720p download), the credit, the disclosure and "a video from an expert". Since task Q2.6 (D064
 * item 8) the clip carries no burned-in words: the founder removed the captions and the burned disclosure entirely
 * (accepted risk, the founder's: no captions, against DS 08-accessibility); the page's credit and disclosure lines stay.
 * This file pins the fold's words, the words the site never says about her (D061 item 13), and the file itself: H.264
 * and AAC, faststart, 1280 x 720, about 34 seconds, within the films' 4 MB budget, with its 1280 x 720 poster as JPEG and
 * WebP, and the exact encode the frame check below passed. */

/** Every string the module publishes: the fold's words. */
const published = (): string[] => [
  expertFold.heading.eyebrow,
  expertFold.heading.title,
  expertClip.chip,
  expertClip.play,
  expertClip.name,
  expertClip.credit,
  expertClip.disclosure,
  expertClip.poster.alt,
];

/** Seconds the clip runs: the cut's two stretches, 24.5 s and 9.2 s (D061 item 13). */
const CUT_SECONDS = 24.5 + 9.2;

describe("no burned-in words (task Q2.6; D064 item 8)", () => {
  it("holds no caption cards and no burned note for a build to draw into the clip: the fold and its film only", () => {
    expect(Object.keys(expertVideo).sort()).toEqual(["expertClip", "expertFold"]);
  });

  it("promises no captions the clip no longer has: the chip and the play control give its length only", () => {
    for (const line of published()) expect(line, line).not.toMatch(/caption/i);
    expect(expertClip.chip).toBe("0:34");
    expect(expertClip.play).toBe("Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds.");
  });
});

describe("the fold's words (tasks.md 8c.6; D061 items 12-13)", () => {
  it("are the plan's eyebrow, heading, credit and disclosure, word for word", () => {
    expect(expertFold.layout).toBe("single");
    expect(expertFold.id).toBe("expert");
    expect(expertFold.heading).toEqual({ id: "expert-title", eyebrow: "A video from an expert", title: "Watching isn’t {hand:talking.}" });
    expect(expertClip.credit).toBe("Chaitra, therapist and developmental coach");
    expect(expertClip.disclosure).toBe("Kheelona made this video with Chaitra and compensated her for it.");
  });

  it("names the play control as the plan does, never starting with the films' \"Play:\" (D040's autocapture measure)", () => {
    expect(expertClip.play.startsWith("Play the video from an expert: Chaitra, therapist and developmental coach.")).toBe(true);
    expect(expertClip.play.startsWith("Play:")).toBe(false);
    expect(expertClip.name).toBe("The video from an expert: Chaitra, therapist and developmental coach");
  });

  it("never says doctor, Dr., counsellor, paediatrician, recommended, approved or reviewed by an expert (D061 item 13)", () => {
    for (const line of published()) {
      expect(line, line).not.toMatch(/\bdr\b\.?|doctor|counsel+or|p(?:a)?ediatrician|recommended by|approved by|reviewed by an expert/i);
    }
  });

  it("never puts her and Kheelu together: no line names Kheelu, so nothing says Kheelu fills the gap she describes", () => {
    for (const line of published()) expect(line, line).not.toMatch(/kheelu/i);
  });

  it("never links to or names the full video: no YouTube address or title in the module", () => {
    const source = readRepoFile("src/content/en-IN/expert-video.ts");
    expect(source).not.toMatch(/youtu|helping kids/i);
  });

  it("passes the claims guard on every line", () => {
    for (const line of published()) expect(findBanned(line), line).toEqual([]);
  });

  it("says the clip's length where the chip and the play control say it", () => {
    expect(Math.round(CUT_SECONDS)).toBe(34);
    expect(expertClip.chip).toMatch(/^0:34\b/);
    expect(expertClip.play).toContain("34 seconds");
  });
});

/* The file, read as bytes: an MP4 is a list of boxes (size, type). Faststart puts "moov" (the index) before "mdat"
 * (the media), so playback can begin before the whole file has arrived. */
type Box = { type: string; start: number; size: number };
function boxes(buf: Buffer, from = 0, to = buf.length): Box[] {
  const out: Box[] = [];
  for (let at = from; at + 8 <= to; ) {
    let size = buf.readUInt32BE(at);
    const type = buf.toString("latin1", at + 4, at + 8);
    if (size === 1) size = Number(buf.readBigUInt64BE(at + 8));
    if (size === 0) size = to - at;
    if (size < 8) break;
    out.push({ type, start: at, size });
    at += size;
  }
  return out;
}
const child = (buf: Buffer, parent: Box, type: string) => boxes(buf, parent.start + 8, parent.start + parent.size).find((b) => b.type === type);

const onDisk = (webPath: string) => join(ROOT, "public", webPath.replace(/^\//, ""));
const VIDEO_MAX_BYTES = 4 * 1024 * 1024;
/** The SHA-256 of the encode the frame check below passed (task Q2.6). Where the check cannot run (no ffmpeg or no
 *  source: CI), this holds the file to that encode; a new encode passes the frame check where the source is, then pins
 *  its own hash here. */
const CLIP_SHA256 = "1df8a56d3eb8f8e5c375b4850b929c1a867aee79913ee863cf7ed3b6fbd78644";

describe("the clip's files (public/video/expert; assets.md)", () => {
  it("sit under /video/expert, the video, its poster and its still sharing one name", () => {
    expect(expertClip.video).toBe("/video/expert/expert-clip.mp4");
    expect(expertClip.poster.src).toBe("/video/expert/expert-clip.jpg");
    expect(expertClip.still).toBe("/video/expert/expert-clip.webp");
    for (const path of [expertClip.video, expertClip.poster.src, expertClip.still]) expect(existsSync(onDisk(path)), path).toBe(true);
  });

  it("weighs about 3 MB, within the films' 4 MB budget", () => {
    const bytes = statSync(onDisk(expertClip.video)).size;
    expect(bytes).toBeLessThanOrEqual(VIDEO_MAX_BYTES);
    expect(bytes).toBeGreaterThan(1024 * 1024);
  });

  it("is the encode the frame check passed, byte for byte, so a run without ffmpeg or the source still holds it (task Q2.6)", () => {
    expect(createHash("sha256").update(readFileSync(onDisk(expertClip.video))).digest("hex")).toBe(CLIP_SHA256);
  });

  it("is an MP4 with its index first (faststart), H.264 video and AAC audio", () => {
    const buf = readFileSync(onDisk(expertClip.video));
    const top = boxes(buf).map((b) => b.type);
    expect(top[0]).toBe("ftyp");
    expect(top.indexOf("moov")).toBeGreaterThan(-1);
    expect(top.indexOf("moov")).toBeLessThan(top.indexOf("mdat"));
    const moov = boxes(buf).find((b) => b.type === "moov")!;
    const index = buf.subarray(moov.start, moov.start + moov.size);
    expect(index.includes("avc1")).toBe(true);
    expect(index.includes("mp4a")).toBe(true);
  });

  it("runs the cut's 33.7 seconds, landscape 1280 x 720", () => {
    const buf = readFileSync(onDisk(expertClip.video));
    const moov = boxes(buf).find((b) => b.type === "moov")!;
    const mvhd = child(buf, moov, "mvhd")!;
    const v1 = buf.readUInt8(mvhd.start + 8) === 1;
    const timescale = buf.readUInt32BE(mvhd.start + (v1 ? 28 : 20));
    const duration = v1 ? Number(buf.readBigUInt64BE(mvhd.start + 32)) : buf.readUInt32BE(mvhd.start + 24);
    expect(duration / timescale).toBeCloseTo(CUT_SECONDS, 0);
    const sizes = boxes(buf, moov.start + 8, moov.start + moov.size)
      .filter((b) => b.type === "trak")
      .map((trak) => child(buf, trak, "tkhd")!)
      .map((tkhd) => [buf.readUInt32BE(tkhd.start + tkhd.size - 8) / 65536, buf.readUInt32BE(tkhd.start + tkhd.size - 4) / 65536]);
    expect(sizes).toContainEqual([1280, 720]);
  });

  it("has its poster and still at the size the content declares, 1280 x 720", async () => {
    expect([expertClip.poster.width, expertClip.poster.height]).toEqual([1280, 720]);
    for (const [path, format] of [
      [expertClip.poster.src, "jpeg"],
      [expertClip.still, "webp"],
    ] as const) {
      const meta = await sharp(onDisk(path)).metadata();
      expect([meta.format, meta.width, meta.height], path).toEqual([format, 1280, 720]);
    }
  });
});

/* The frame check (task Q2.6; D064 item 8): the clip's own frames against the source's, put through the same cut and
 * framing as the build (assets.md, the clip's row), with no words drawn on. Text burned in anywhere shows as a patch
 * far from the source; a clean encode differs only by its compression. It needs ffmpeg and the local source (git-ignored,
 * never committed: wiki/raw/feedback/advisor-homepage-2026-10-12/expert-video/, or KH_EXPERT_SOURCE), so it runs on the
 * machine that holds them and is skipped elsewhere (CI, a worktree without KH_EXPERT_SOURCE). */
const SOURCE = process.env.KH_EXPERT_SOURCE ?? join(ROOT, "wiki/raw/feedback/advisor-homepage-2026-10-12/expert-video/expert-720.mp4");
const FFMPEG = [process.env.FFMPEG, "ffmpeg", "/opt/homebrew/bin/ffmpeg"].find((bin) => bin && spawnSync(bin, ["-version"]).status === 0);
const FRAME_CHECK = Boolean(FFMPEG) && existsSync(SOURCE);

/** Frames compared at a quarter of the clip's size each way; a patch is 8 x 8 of those pixels, 32 x 32 of the clip's. */
const SMALL = { width: 320, height: 180 };
const PATCH = 8;
/** A patch further than this from the source, in mean absolute difference per channel (0-255), is drawn on. A clean
 *  encode stays under about 5 (CRF 28); the 8c.8 file's caption pills and disclosure measured 95-168. */
const DRAWN = 16;
/** Every tenth frame (a third of a second at 30 fps), from after the 0.15 s fade-in to before the 0.3 s fade-out
 *  (33.4 s is frame 1002): 100 frames. */
const SAMPLES = { first: 10, last: 1000, step: 10 };
const COUNT = (SAMPLES.last - SAMPLES.first) / SAMPLES.step + 1;
const SHRINK = `scale=${SMALL.width}:${SMALL.height}:flags=area,format=rgb24`;
const PICK = `select='between(n\\,${SAMPLES.first}\\,${SAMPLES.last})*not(mod(n\\,${SAMPLES.step}))',${SHRINK}`;
/** The build's cut and framing (assets.md): source 0-24.5 s, then 94-103.2 s through a 1114 x 626 window at (112, 0)
 *  scaled back to 1280 x 720, both at 30 fps. */
const CUT = [
  "[0:v]trim=start=0:end=24.5,setpts=PTS-STARTPTS,fps=30,format=yuv420p,setsar=1[v1]",
  "[0:v]trim=start=94:end=103.2,setpts=PTS-STARTPTS,crop=1114:626:112:0,scale=1280:720:flags=lanczos,fps=30,format=yuv420p,setsar=1[v2]",
  `[v1][v2]concat=n=2:v=1:a=0,${PICK}[out]`,
].join(";");

/** Raw RGB frames, at the small size, one Buffer each. */
function decode(args: string[]): Buffer[] {
  const raw = execFileSync(FFMPEG!, ["-v", "error", ...args, "-f", "rawvideo", "-fps_mode", "passthrough", "-"], { maxBuffer: 1 << 28 });
  const size = SMALL.width * SMALL.height * 3;
  return Array.from({ length: raw.length / size }, (_, i) => raw.subarray(i * size, (i + 1) * size));
}

/** The patch of `a` furthest from `b`: its mean absolute difference per channel, and where it sits (small pixels). */
function worstPatch(a: Buffer, b: Buffer): { diff: number; x: number; y: number } {
  let worst = { diff: 0, x: 0, y: 0 };
  for (let y = 0; y + PATCH <= SMALL.height; y += PATCH) {
    for (let x = 0; x + PATCH <= SMALL.width; x += PATCH) {
      let sum = 0;
      for (let row = y; row < y + PATCH; row++) {
        for (let i = (row * SMALL.width + x) * 3; i < (row * SMALL.width + x + PATCH) * 3; i++) sum += Math.abs(a[i] - b[i]);
      }
      const diff = sum / (PATCH * PATCH * 3);
      if (diff > worst.diff) worst = { diff, x, y };
    }
  }
  return worst;
}

describe.runIf(FRAME_CHECK)("the frame check: nothing drawn on the clip or its poster (task Q2.6; D064 item 8)", () => {
  it("shows every third of a second of the clip as the source's own picture, through the cut and framing, with no words on it", () => {
    const clip = decode(["-i", onDisk(expertClip.video), "-vf", PICK]);
    const source = decode(["-i", SOURCE, "-filter_complex", CUT, "-map", "[out]"]);
    expect([clip.length, source.length]).toEqual([COUNT, COUNT]);
    const drawn = clip.flatMap((frame, i) => {
      const worst = worstPatch(frame, source[i]);
      const at = ((SAMPLES.first + i * SAMPLES.step) / 30).toFixed(2);
      return worst.diff > DRAWN ? [`${at} s: the patch at (${worst.x * 4}, ${worst.y * 4}) differs by ${worst.diff.toFixed(1)}`] : [];
    });
    expect(drawn).toEqual([]);
  }, 60_000);

  it("keeps the poster and the still the source's front frame at 0:00.2, with no words on them", () => {
    const [front] = decode(["-ss", "0.2", "-i", SOURCE, "-frames:v", "1", "-vf", SHRINK]);
    for (const path of [expertClip.poster.src, expertClip.still]) {
      const [still] = decode(["-i", onDisk(path), "-vf", SHRINK]);
      expect(worstPatch(still, front).diff, path).toBeLessThanOrEqual(DRAWN);
    }
  }, 60_000);
});
