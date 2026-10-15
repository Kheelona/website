import { useCallback, useEffect, useRef, useState } from "react";

/* The films' playback, written once for both of FilmsStrip's islands (task 3.3, moved here by task 8c.6): the strip of
 * parent films and the single film on its own (the expert clip). Client code, imported only by FilmsStrip.client.tsx,
 * so it carries no "use client" of its own (structure §2: the `.client.tsx` file is the one boundary). */

/** What is playing: the film, the poster it keeps on screen while the film loads, and whether something other than its
 *  own play control started it (a parent's quote below the strip: then the page is scrolled to it, and focusing it must
 *  not scroll a second time). */
export type Playing = { readonly id: string; readonly poster: string; readonly fromElsewhere: boolean };

/**
 * One film at a time, mounted only once it is asked for:
 * - `start` mounts it with its poster; the effect focuses it and plays it with sound (a refused autoplay leaves the
 *   native controls); once it has been at least half on screen, it pauses whenever less than half of it is;
 * - `ended` brings the poster back and gives focus to whatever started it: the element passed to `start`, or the
 *   film's own play control (`controlOf`, a stable callback).
 */
export function useFilmPlayback(controlOf: (id: string) => HTMLElement | null | undefined) {
  const video = useRef<HTMLVideoElement>(null);
  const returnFocus = useRef<string | null>(null);
  /** The element that started the film, when it was not the film's own play control. */
  const origin = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState<Playing | null>(null);

  // A film just mounted: focus it, play it, and pause it off screen once it has been on screen: a film started from
  // elsewhere is still being scrolled to when the observer first reports.
  useEffect(() => {
    const v = video.current;
    if (!playing || !v) return;
    v.focus(playing.fromElsewhere ? { preventScroll: true } : undefined);
    v.play()?.catch(() => {});
    if (typeof IntersectionObserver === "undefined") return;
    let seen = false;
    const away = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.5) seen = true;
          else if (seen) (entry.target as HTMLVideoElement).pause();
        }
      },
      { threshold: 0.5 },
    );
    away.observe(v);
    return () => away.disconnect();
  }, [playing]);

  // A film ended: its poster is back; give focus back to what started it.
  useEffect(() => {
    if (playing || !returnFocus.current) return;
    (origin.current ?? controlOf(returnFocus.current))?.focus();
    returnFocus.current = null;
    origin.current = null;
  }, [playing, controlOf]);

  const start = useCallback((id: string, poster: string, from: HTMLElement | null = null) => {
    origin.current = from;
    setPlaying({ id, poster, fromElsewhere: from !== null });
  }, []);

  const ended = useCallback((id: string) => {
    returnFocus.current = id;
    setPlaying(null);
  }, []);

  return { video, playing, start, ended };
}
