import type { VideoProvider } from "@/content/types";

/* VideoEmbed's addresses (task 8b.2c; journal-pipeline §7; ported from main:src/components/molecules/VideoEmbed.tsx:10-20).
 * Built here from the provider and the id alone, never taken from a post, so a journal entry can only ever frame a
 * YouTube or Vimeo player. The two player origins are the ones the CSP admits in frame-src (src/lib/security-headers.ts
 * `videoPlayers`, D057 item 1; embed.test.ts holds the two together). An id that is not the provider's own shape fails
 * the render, and so the build (journal-pipeline §8.2 row 14 has the validator refuse it first). */

const ID_RULES: Readonly<Record<VideoProvider, { readonly pattern: RegExp; readonly shape: string }>> = {
  youtube: { pattern: /^[A-Za-z0-9_-]{11}$/, shape: "11 letters, digits, '-' or '_'" },
  vimeo: { pattern: /^[0-9]+$/, shape: "digits" },
};

/** The size of the still YouTube serves for every video ("hqdefault"). */
export const YOUTUBE_STILL = { width: 480, height: 360 } as const;

function checkedId(provider: VideoProvider, videoId: string): string {
  const rule = ID_RULES[provider];
  if (rule === undefined) throw new Error(`A journal video comes from YouTube or Vimeo, not "${String(provider)}"`);
  if (!rule.pattern.test(videoId)) throw new Error(`A ${provider} video id is ${rule.shape}, not "${videoId}"`);
  return videoId;
}

/** The player frame's address: YouTube's privacy-enhanced host, or Vimeo's player with do-not-track; it plays on load,
 *  which is the reader's press. */
export function playerUrl(provider: VideoProvider, videoId: string): string {
  const id = checkedId(provider, videoId);
  return provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`;
}

/** The still's address (YouTube only: Vimeo's need an API call), fetched by next/image on the server, never by the
 *  reader's browser. */
export function stillUrl(provider: VideoProvider, videoId: string): string | null {
  const id = checkedId(provider, videoId);
  return provider === "youtube" ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
