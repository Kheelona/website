"use client";

import Image from "next/image";
import { useState } from "react";
import { PRESS } from "@/lib/interactions";
import { cn } from "@/lib/cn";

export type VideoProvider = "youtube" | "vimeo";

/** The player URL for an id. Built here, never taken from the post, so a journal
 *  entry can only ever embed a YouTube or Vimeo video and nothing else. */
export function embedUrl(provider: VideoProvider, id: string): string {
  return provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`
    : `https://player.vimeo.com/video/${encodeURIComponent(id)}?autoplay=1&dnt=1`;
}

export function thumbnailUrl(provider: VideoProvider, id: string): string | null {
  return provider === "youtube" ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : null;
}

/** A journal video, as a still image with a play button until a reader presses it.
 *
 *  WHY A FACADE. A YouTube iframe pulls ~500 KB of script and opens third-party
 *  connections on load, which costs the article its LCP and Performance score (the
 *  one Lighthouse number that feeds ranking, §8.34-h) for a video most readers never
 *  play. So nothing from YouTube or Vimeo loads until the press, and then only from
 *  youtube-nocookie.com / Vimeo with `dnt=1`, which set no tracking cookie before
 *  play. There is still no `<video>` element at rest (§8.37-a). */
export function VideoEmbed({
  provider,
  videoId,
  title,
  caption,
}: {
  provider: VideoProvider;
  videoId: string;
  title?: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const name = title || caption || `${provider === "youtube" ? "YouTube" : "Vimeo"} video`;
  const thumb = thumbnailUrl(provider, videoId);

  return (
    <figure className="my-9">
      <div className="relative aspect-video w-full overflow-hidden rounded-(--radius-card-lg) bg-ink-head">
        {playing ? (
          <iframe
            src={embedUrl(provider, videoId)}
            title={name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${name}`}
            className={cn("group absolute inset-0 flex items-center justify-center", PRESS)}
          >
            {thumb && (
              <Image
                src={thumb}
                alt=""
                fill
                sizes="(max-width: 768px) 90vw, 720px"
                className="object-cover"
              />
            )}
            <span
              aria-hidden="true"
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-(--shadow-room-sm)"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-ink-head">
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-[14.5px] text-ink-muted">{caption}</figcaption>}
    </figure>
  );
}
