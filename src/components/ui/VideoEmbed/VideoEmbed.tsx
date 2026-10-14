import Image from "next/image";
import type { ReactNode } from "react";
import type { VideoProvider } from "@/content/types";
import { loadingFor } from "../Photo/image";
import { VideoEmbedPlayer } from "./VideoEmbed.client";
import { stillUrl, YOUTUBE_STILL } from "./embed";

export interface VideoEmbedProps {
  readonly provider: VideoProvider;
  /** An 11-character YouTube id, or a numeric Vimeo id; anything else fails the render. */
  readonly videoId: string;
  /** The video's own title, in plain words: the player frame's title and the end of the play button's name. */
  readonly title: string;
  /** The play button's words before the title ("Play video:"), from content. */
  readonly playLabel: string;
  readonly caption?: ReactNode;
  /** The still's rendered width at each layout (the reading column's), so the phone never fetches a laptop still. */
  readonly sizes: string;
}

/**
 * A journal video (task 8b.2c; D057 item 1; ADR-014, journal-pipeline §7; ported from
 * main:src/components/molecules/VideoEmbed.tsx into the DS): the DS photo frame at 16:9 (`kh-photo kh-photo--wide`, the
 * frame `Photo` renders, bundle.css:1150-1155) holding the video's still and the DS primary play button, then the
 * caption (`kh-caption`). A primitive the article body renders, like `Photo`.
 *
 * Nothing from YouTube or Vimeo loads before the press: the still (YouTube's own; Vimeo has none without an API call, so
 * its frame shows the button alone) is a lazy next/image, fetched by this site's optimiser, so the reader's browser
 * contacts neither host at rest (main's reasoning: about 500 KB and third-party connections for a video most readers
 * never play). The island (`VideoEmbed.client.tsx`) swaps the button for the player frame on the press. No `<video>`
 * element, no tracking event (none exists for a video), no motion of its own (architecture §11.3): the DS IconButton's
 * own tap feedback only. Server component.
 */
export function VideoEmbed({ provider, videoId, title, playLabel, caption, sizes }: VideoEmbedProps) {
  if (!title.trim()) throw new Error(`A journal video needs its title: it names the player and the play button (${provider} ${videoId})`);
  const still = stillUrl(provider, videoId);
  return (
    <figure className="kh-photo kh-photo--wide ks-video">
      <div className="ks-video__stage">
        {still !== null && <Image src={still} {...YOUTUBE_STILL} alt="" sizes={sizes} {...loadingFor(false)} />}
        <VideoEmbedPlayer provider={provider} videoId={videoId} title={title} label={`${playLabel} ${title}`} />
      </div>
      {caption ? <figcaption className="kh-caption">{caption}</figcaption> : null}
    </figure>
  );
}
