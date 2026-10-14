"use client";

import { lazy, Suspense } from "react";
import type { VideoEmbedPlayerProps } from "./player";

export type { VideoEmbedPlayerProps } from "./player";

/* The player's code (the play button, the frame, the addresses) is its own chunk. A client module that a route's server
 * components import ships in that route's chunks whether it renders or not, and ProseBlocks reaches every article,
 * legal page and answer; an eager island put about 1.5 KB gzip on each article (three copies, one per chunk) for a video
 * no page had yet (task 8b.2c, production build). Lazy, only a page that renders a video fetches it (journal-pipeline §7,
 * Performance). A static page is prerendered with the button in its HTML (Next waits for the boundary); the browser
 * fetches the chunk when it hydrates the boundary, and React replays a press made before then. */
const Player = lazy(() => import("./player"));

/** VideoEmbed's island (task 8b.2c): the lazy player, with nothing in its place until it loads on the client. */
export function VideoEmbedPlayer(props: VideoEmbedPlayerProps) {
  return (
    <Suspense fallback={null}>
      <Player {...props} />
    </Suspense>
  );
}
