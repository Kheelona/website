"use client";

import { useEffect, useRef, useState } from "react";
import { ICON_PLAY } from "@/assets/icons.generated";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import type { VideoProvider } from "@/content/types";
import { playerUrl } from "./embed";

export interface VideoEmbedPlayerProps {
  readonly provider: VideoProvider;
  readonly videoId: string;
  /** The player frame's title: the video's own. */
  readonly title: string;
  /** The play button's accessible name: the content's play word, then the title. */
  readonly label: string;
}

/**
 * VideoEmbed's island (task 8b.2c; journal-pipeline §7): the DS primary play button (`IconButton` with the named
 * `ICON_PLAY`, as the films strip draws it; it never imports `Icon`, `Button` or `PreorderButton`,
 * test/guards/client-icons.test.ts) until the reader presses it; then the player frame replaces it, plays (the press is
 * the gesture its autoplay needs) and takes focus, so a keyboard user lands in the player. The player's address is
 * built here from the provider and the id, so the page's HTML names neither host before the press. No tracking event.
 */
export function VideoEmbedPlayer({ provider, videoId, title, label }: VideoEmbedPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  if (!playing) {
    return <IconButton icon={ICON_PLAY} label={label} variant="primary" size="l" className="ks-video__play" onClick={() => setPlaying(true)} />;
  }
  return (
    <iframe
      ref={frame}
      className="ks-video__player"
      src={playerUrl(provider, videoId)}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
