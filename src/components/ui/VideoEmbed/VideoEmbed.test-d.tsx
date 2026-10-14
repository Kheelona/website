/**
 * Type tests for VideoEmbed and the content's video block (task 8b.2c; ADR-014, journal-pipeline §5.1, §7).
 * `npm run typecheck` (tsc --noEmit) checks this file, the Photo.test-d.tsx pattern: the accepted lines must
 * type-check, and every line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 */
import type { ProseBlock, VideoBlock } from "@/content/types";
import { VideoEmbed } from "./VideoEmbed";

const SIZES = "(min-width: 732px) 700px, calc(100vw - 32px)";

export const accepted = () => (
  <>
    <VideoEmbed provider="youtube" videoId="M7lc1UVf-VE" title="A title" playLabel="Play video:" sizes={SIZES} />
    <VideoEmbed provider="vimeo" videoId="76979871" title="A title" playLabel="Play video:" caption="A caption." sizes={SIZES} />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error YouTube or Vimeo only: the player address is built here, never taken from a post */}
    <VideoEmbed provider="dailymotion" videoId="x7tgad0" title="A title" playLabel="Play video:" sizes={SIZES} />
    {/* @ts-expect-error a video names itself: the title names the player and the play button */}
    <VideoEmbed provider="youtube" videoId="M7lc1UVf-VE" playLabel="Play video:" sizes={SIZES} />
    {/* @ts-expect-error the play button's word comes from content, never typed in the component */}
    <VideoEmbed provider="youtube" videoId="M7lc1UVf-VE" title="A title" sizes={SIZES} />
    {/* @ts-expect-error sizes is required: the phone never fetches a laptop still */}
    <VideoEmbed provider="youtube" videoId="M7lc1UVf-VE" title="A title" playLabel="Play video:" />
    {/* @ts-expect-error no address: the player and still addresses come from the provider and the id alone */}
    <VideoEmbed provider="youtube" videoId="M7lc1UVf-VE" title="A title" playLabel="Play video:" sizes={SIZES} src="https://example.org" />
  </>
);

/* The content's block, as the adapter writes it from a post's videoEmbed node (journal-pipeline §5.1). */
export const block = { kind: "video", provider: "youtube", videoId: "M7lc1UVf-VE", title: "A title" } satisfies ProseBlock;
export const captioned = { kind: "video", provider: "vimeo", videoId: "76979871", title: "A title", caption: "A caption." } satisfies VideoBlock;
// @ts-expect-error a video block names its video
export const untitled = { kind: "video", provider: "youtube", videoId: "M7lc1UVf-VE" } satisfies ProseBlock;
// @ts-expect-error YouTube or Vimeo only
export const otherHost = { kind: "video", provider: "dailymotion", videoId: "x7tgad0", title: "A title" } satisfies ProseBlock;
// @ts-expect-error no address in content: the provider and the id only
export const withUrl = { kind: "video", provider: "youtube", videoId: "M7lc1UVf-VE", title: "A title", src: "https://youtu.be/x" } satisfies VideoBlock;
