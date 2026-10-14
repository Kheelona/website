import { describe, expect, it } from "vitest";
import { contentSecurityPolicy } from "@/lib/security-headers";
import { playerUrl, stillUrl, YOUTUBE_STILL } from "./embed";

/* VideoEmbed's addresses (task 8b.2c; journal-pipeline §7, ported from main:src/components/molecules/VideoEmbed.tsx:10-20).
   Built here from the provider and the id alone, never taken from a post, so a journal entry can only ever frame a
   YouTube or Vimeo player and nothing else; an id that is not one of theirs fails the render (and so the build), as
   journal-pipeline §8.2 row 14 has the validator refuse it before. */

const YOUTUBE_ID = "M7lc1UVf-VE";
const VIMEO_ID = "76979871";

describe("VideoEmbed addresses: the player", () => {
  it("YouTube: the privacy-enhanced host, autoplay on the press, no related videos from other channels", () => {
    expect(playerUrl("youtube", YOUTUBE_ID)).toBe(`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`);
  });

  it("Vimeo: the player host, autoplay on the press, do-not-track", () => {
    expect(playerUrl("vimeo", VIMEO_ID)).toBe(`https://player.vimeo.com/video/${VIMEO_ID}?autoplay=1&dnt=1`);
  });

  /* The other half of the same contract: the CSP admits these two origins in frame-src (D057 item 1, the reviewed
     patch to src/lib/security-headers.ts). A player on any other origin would be refused once the policy enforces. */
  it("frames only origins the content security policy admits in frame-src", () => {
    const frameSrc = contentSecurityPolicy().split("; ").find((d) => d.startsWith("frame-src "))!.split(" ");
    for (const url of [playerUrl("youtube", YOUTUBE_ID), playerUrl("vimeo", VIMEO_ID)]) {
      expect(frameSrc).toContain(new URL(url).origin);
    }
  });
});

describe("VideoEmbed addresses: the still", () => {
  it("YouTube: the video's own still, 480 x 360", () => {
    expect(stillUrl("youtube", YOUTUBE_ID)).toBe(`https://i.ytimg.com/vi/${YOUTUBE_ID}/hqdefault.jpg`);
    expect(YOUTUBE_STILL).toEqual({ width: 480, height: 360 });
  });

  it("Vimeo: none (its stills need an API call; the frame shows the play button alone)", () => {
    expect(stillUrl("vimeo", VIMEO_ID)).toBeNull();
  });
});

describe("VideoEmbed addresses: refused ids", () => {
  it.each([
    ["a YouTube id that is too short", "youtube", "M7lc1UVf-V"],
    ["a YouTube id that is too long", "youtube", "M7lc1UVf-VEx"],
    ["a YouTube id with a character YouTube never uses", "youtube", "M7lc1UVf.VE"],
    ["a YouTube watch address instead of an id", "youtube", "https://youtu.be/M7lc1UVf-VE"],
    ["markup", "youtube", '"><script>'],
    ["a Vimeo id with a letter", "vimeo", "7697987a"],
    ["a Vimeo address instead of an id", "vimeo", "https://vimeo.com/76979871"],
    ["an empty id", "vimeo", ""],
  ] as const)("%s", (_name, provider, id) => {
    expect(() => playerUrl(provider, id)).toThrow(/video id/);
    expect(() => stillUrl(provider, id)).toThrow(/video id/);
  });

  it("refuses any other host", () => {
    expect(() => playerUrl("dailymotion" as never, "x7tgad0")).toThrow(/YouTube or Vimeo/);
  });
});
