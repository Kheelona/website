import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ROOT, readRepoFile } from "../../../test/e2e/support/repo";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { expertBurnedDisclosure, expertCaptions, expertClip, expertFold } from "./expert-video";

/* The expert clip (task 8c.6; D061 items 12-13): a 34-second trimmed copy of the founder's own expert video, hosted like
 * the films, on the product page right after the offer. The founder chose the CMO's cut (0:00.0-0:24.5 and
 * 1:34.0-1:43.2 of the 720p download), the credit, the disclosure and "a video from an expert". This file pins the
 * eleven burned-in caption cards and the fold's words exactly as tasks.md 8c.6 gives them, the words the site never
 * says about her (D061 item 13), and the file itself: H.264 and AAC, faststart, 1280 x 720, about 34 seconds, within
 * the films' 4 MB budget, with its 1280 x 720 poster as JPEG and WebP. The clip's own transcription (whisper, run by
 * hand: no word outside the captions, no "Dr", no "scary") is in the task report; it cannot run here. */

/** The eleven caption cards of tasks.md 8c.6, word for word, " / " between a card's two lines. */
const CAPTIONS = [
  "Hey, have you ever noticed, / in a room full of people,",
  "children can be completely / silent and isolated?",
  "Not to the peaceful / kind of silence,",
  "but a heavy digital silence.",
  "You look around, and every child / is looking into a glowing screen.",
  "They aren’t talking. / They aren’t playing.",
  "They’re just consuming.",
  "I see this every single day / in my practice.",
  "A child with a tablet / isn’t busy.",
  "They’re often just alone / in the digital world",
  "that doesn’t talk back.",
];

/** Every string the module publishes: the captions, the burned disclosure and the fold's words. */
const published = (): string[] => [
  ...expertCaptions.flatMap((c) => c.lines),
  ...expertBurnedDisclosure.lines,
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

describe("the burned-in captions (tasks.md 8c.6; DS 08-accessibility)", () => {
  it("are the eleven cards of the plan, word for word, in order, each at most two lines", () => {
    expect(expertCaptions.map((c) => c.lines.join(" / "))).toEqual(CAPTIONS);
    for (const c of expertCaptions) expect(c.lines.length).toBeLessThanOrEqual(2);
  });

  it("follow each other through the clip without overlapping, inside its length", () => {
    let last = 0;
    for (const c of expertCaptions) {
      expect(c.from, c.lines.join(" / ")).toBeGreaterThanOrEqual(last);
      expect(c.to, c.lines.join(" / ")).toBeGreaterThan(c.from);
      last = c.to;
    }
    expect(last).toBeLessThanOrEqual(CUT_SECONDS);
  });

  it("carry the disclosure in the first five seconds, so the file can travel without the page", () => {
    expect(expertBurnedDisclosure.lines.join(" ")).toBe("Made with Kheelona. Chaitra was compensated.");
    expect(expertBurnedDisclosure.from).toBe(0);
    expect(expertBurnedDisclosure.to).toBe(5);
  });

  /* Task 8c.8 (the CMO's wave 8c review, m4): drawn at caption size so a phone can read it (it was about 7 px tall at
     390), top left. At 52 px a pill of "Chaitra was compensated." is 702 px wide, over her face (which spans about 45-61 %
     of the frame's width in the first seconds); in these four lines the widest pill, "compensated.", is 393 px, so the
     block stays over the blinds, left of her face, the words unchanged. */
  it("breaks the disclosure into four short lines, so at caption size it stays top left, clear of her face (task 8c.8, m4)", () => {
    expect(expertBurnedDisclosure.lines).toEqual(["Made with", "Kheelona.", "Chaitra was", "compensated."]);
  });
});

describe("the fold's words (tasks.md 8c.6; D061 items 12-13)", () => {
  it("are the plan's eyebrow, heading, chip, credit and disclosure, word for word", () => {
    expect(expertFold.layout).toBe("single");
    expect(expertFold.id).toBe("expert");
    expect(expertFold.heading).toEqual({ id: "expert-title", eyebrow: "A video from an expert", title: "Watching isn’t {hand:talking.}" });
    expect(expertClip.chip).toBe("0:34 · With captions");
    expect(expertClip.credit).toBe("Chaitra, therapist and developmental coach");
    expect(expertClip.disclosure).toBe("Kheelona made this video with Chaitra and compensated her for it.");
  });

  it("names the play control as the plan does, never starting with the films' \"Play:\" (D040's autocapture measure)", () => {
    expect(expertClip.play).toBe("Play the video from an expert: Chaitra, therapist and developmental coach. 34 seconds, with captions.");
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
