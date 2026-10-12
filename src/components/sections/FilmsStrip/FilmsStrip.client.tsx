"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ICON_CARET_LEFT, ICON_CARET_RIGHT, ICON_PLAY } from "@/assets/icons.generated";
import { Chip } from "@/components/ui/Chip/Chip";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { imageSource } from "@/components/ui/Photo/image";
import { focusedTile, INITIAL_VIEW, positionText, stripView, type StripView } from "./films-view";
import type { FilmTile, FilmsStripConfig, FilmsStripLabels } from "./films-strip.types";

/** The strip's central band, the root of the focus observer: the middle third of the track (D049 pick 8). */
const CENTRAL_BAND = "0px -33% 0px -33%";
/** Fine enough that the focus follows a film as it slides through the band. */
const BAND_STEPS = Array.from({ length: 21 }, (_, i) => i / 20);

export interface FilmsStripIslandProps {
  readonly films: readonly FilmTile[];
  readonly labels: FilmsStripLabels;
  readonly posters: FilmsStripConfig["posters"];
  /** One tile's rendered width at each layout, for the posters. */
  readonly sizes: string;
  /** Between the strip and its controls: the proof line, rendered by the server part. */
  readonly children?: ReactNode;
}

/** One step of the strip: a film plus the gap (mockup.js: the second film's left minus the first's). */
function pitchOf(track: HTMLElement): number {
  const items = track.children as HTMLCollectionOf<HTMLElement>;
  if (items.length > 1) return items[1].offsetLeft - items[0].offsetLeft;
  return items[0]?.offsetWidth ?? 0;
}

const sameView = (a: StripView, b: StripView) => a.from === b.from && a.to === b.to && a.atStart === b.atStart && a.atEnd === b.atEnd;

/**
 * The films strip's island (task 3.3; mockup.js sections 4 and 5; D040; D049 pick 8; architecture §10, §11.2 row 8):
 * - native scroll-snap; Previous and Next scroll one film (smooth unless reduced motion), stop at the ends (tolerant of
 *   half a film) and the line between them says where you are ("1 of 7" on a phone, "1–3 of 7" on a laptop);
 * - no `<video>` at rest: a tap swaps the poster for the film with native controls and plays it with sound, focused;
 *   one film at a time; it pauses when less than half of it is on screen; the poster comes back when it ends, and focus
 *   returns to its play button;
 * - the film most inside the strip's central band takes `is-focus` (one observer whose root is the track), which
 *   motion.css scales to `--ks-film-focus` (nothing with reduced motion).
 * Icons only through `IconButton` and the named `ICON_*` constants (client-safe, task 2.11).
 */
export function FilmsStripIsland({ films, labels, posters, sizes, children }: FilmsStripIslandProps) {
  const track = useRef<HTMLUListElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frames = useRef(new Map<string, HTMLDivElement>());
  const returnFocus = useRef<string | null>(null);
  const [view, setView] = useState<StripView>(INITIAL_VIEW);
  const [focus, setFocus] = useState<string | null>(null);
  const [playing, setPlaying] = useState<{ id: string; poster: string } | null>(null);

  // Where the strip is, on load, on every scroll and whenever the track changes size.
  useEffect(() => {
    const t = track.current;
    if (!t) return;
    const update = () => {
      const first = t.children[0] as HTMLElement | undefined;
      const next = stripView({
        scrollLeft: t.scrollLeft,
        scrollWidth: t.scrollWidth,
        clientWidth: t.clientWidth,
        tileWidth: first?.offsetWidth ?? 0,
        pitch: pitchOf(t),
        count: t.children.length,
      });
      setView((v) => (sameView(v, next) ? v : next));
    };
    update();
    t.addEventListener("scroll", update, { passive: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resize?.observe(t);
    return () => {
      t.removeEventListener("scroll", update);
      resize?.disconnect();
    };
  }, []);

  // The film in focus: the widest part inside the track's central band.
  useEffect(() => {
    const t = track.current;
    if (!t || typeof IntersectionObserver === "undefined") return;
    const order = films.map((f) => f.id);
    const widths = new Map<string, number>();
    const band = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.videoId;
          if (id) widths.set(id, entry.intersectionRect.width);
        }
        setFocus(focusedTile(widths, order));
      },
      { root: t, rootMargin: CENTRAL_BAND, threshold: BAND_STEPS },
    );
    for (const tile of t.children) band.observe(tile);
    return () => band.disconnect();
  }, [films]);

  // A film just mounted: focus it, play it (a refused autoplay leaves the native controls), pause it off screen.
  useEffect(() => {
    const v = video.current;
    if (!playing || !v) return;
    v.focus();
    v.play()?.catch(() => {});
    if (typeof IntersectionObserver === "undefined") return;
    const away = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.intersectionRatio < 0.5) (entry.target as HTMLVideoElement).pause();
      },
      { threshold: 0.5 },
    );
    away.observe(v);
    return () => away.disconnect();
  }, [playing]);

  // A film ended: its poster is back; give focus back to its play button.
  useEffect(() => {
    if (playing || !returnFocus.current) return;
    frames.current.get(returnFocus.current)?.querySelector("button")?.focus();
    returnFocus.current = null;
  }, [playing]);

  const start = useCallback((film: FilmTile) => {
    const poster = frames.current.get(film.id)?.querySelector("img")?.currentSrc ?? "";
    setPlaying({ id: film.id, poster });
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    const t = track.current;
    if (!t) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    t.scrollBy?.({ left: direction * pitchOf(t), behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <>
      <ul className="ks-films" data-films="" aria-label={labels.listLabel} ref={track}>
        {films.map((film, i) => {
          const isPlaying = playing?.id === film.id;
          const eager = posters === "eager-low" && i < 3;
          const name = `${film.chip}. ${film.caption}`;
          return (
            <li key={film.id} className={clsx("ks-film", focus === film.id && "is-focus")} data-video-id={film.id}>
              <p className="ks-film__meta">
                <Chip label={film.chip} onBand />
                <span className="kh-label-s ks-film__time">
                  <span className="kh-sr">{`${labels.length} `}</span>
                  {film.duration}
                </span>
              </p>
              <div
                className="ks-film__frame"
                ref={(el) => {
                  if (el) frames.current.set(film.id, el);
                  else frames.current.delete(film.id);
                }}
              >
                <Image
                  {...imageSource(film.poster)}
                  alt={film.poster.alt}
                  sizes={sizes}
                  loading={eager ? "eager" : "lazy"}
                  fetchPriority={eager ? "low" : undefined}
                />
                <IconButton
                  icon={ICON_PLAY}
                  label={`${labels.play} ${name}`}
                  variant="primary"
                  size="l"
                  className="ks-film__play"
                  hidden={isPlaying}
                  onClick={() => start(film)}
                />
                {isPlaying && (
                  <video
                    ref={video}
                    src={film.video}
                    poster={playing.poster || undefined}
                    controls
                    playsInline
                    preload="none"
                    aria-label={name}
                    onEnded={() => {
                      returnFocus.current = film.id;
                      setPlaying(null);
                    }}
                  />
                )}
              </div>
              <p className="kh-body-s ks-film__caption">{film.caption}</p>
            </li>
          );
        })}
      </ul>
      {children}
      <div className="ks-films-ctrl">
        <IconButton icon={ICON_CARET_LEFT} label={labels.previous} variant="outline" data-films-prev="" disabled={view.atStart} onClick={() => step(-1)} />
        <span className="kh-label-s" data-films-pos="" aria-live="polite">
          {positionText(view, films.length, labels.of)}
        </span>
        <IconButton icon={ICON_CARET_RIGHT} label={labels.next} variant="outline" data-films-next="" disabled={view.atEnd} onClick={() => step(1)} />
      </div>
    </>
  );
}
