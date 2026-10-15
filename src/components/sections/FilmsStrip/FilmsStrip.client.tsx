"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ICON_CARET_LEFT, ICON_CARET_RIGHT, ICON_PLAY } from "@/assets/icons.generated";
import { Chip } from "@/components/ui/Chip/Chip";
import { Glyph } from "@/components/ui/Icon/Glyph";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { imageSource } from "@/components/ui/Photo/image";
import { focusedTile, INITIAL_VIEW, positionText, stripView, type StripView } from "./films-view";
import type { FilmTile, FilmsStripConfig, FilmsStripLabels } from "./films-strip.types";

/** The strip's central band, the root of the focus observer: the middle third of the track (D049 pick 8). */
const CENTRAL_BAND = "0px -33% 0px -33%";
/** Fine enough that the focus follows a film as it slides through the band. */
const BAND_STEPS = Array.from({ length: 21 }, (_, i) => i / 20);

/** Parents' own words after the controls (task 8c.3): each quote's card, rendered by the server part (ui/Quote), beside
 *  the id of the film its button plays, and the button's words. */
export interface QuotedFilms {
  readonly watch: string;
  readonly items: readonly { readonly film: string; readonly card: ReactNode }[];
}

export interface FilmsStripIslandProps {
  readonly films: readonly FilmTile[];
  readonly labels: FilmsStripLabels;
  readonly posters: FilmsStripConfig["posters"];
  /** One tile's rendered width at each layout, for the posters. */
  readonly sizes: string;
  /** After the controls: the parents' quotes, each with the button that plays its film here. */
  readonly quotes?: QuotedFilms;
  /** Between the strip and its controls: the proof line, rendered by the server part. */
  readonly children?: ReactNode;
}

/** What is playing: the film, the poster it keeps on screen while the film loads, and whether it was started from a
 *  quote below the strip (then the strip is scrolled to it, and focusing it must not scroll a second time). */
type Playing = { id: string; poster: string; fromQuote: boolean };

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
 *   one film at a time; once it has been at least half on screen it pauses when less than half of it is; the poster
 *   comes back when it ends, and focus returns to the button that started it;
 * - "Watch the film" under a parent's quote (task 8c.3) scrolls the strip to that film (smooth unless reduced motion)
 *   and plays it the same way;
 * - the film most inside the strip's central band takes `is-focus` (one observer whose root is the track), which
 *   motion.css scales to `--ks-film-focus` (nothing with reduced motion).
 * Icons only through `IconButton`, `Glyph` and the named `ICON_*` constants (client-safe, task 2.11); the quote's button
 * is the DS Button markup written out, as CopyLinkButton's is (an island never imports ui/Button).
 */
export function FilmsStripIsland({ films, labels, posters, sizes, quotes, children }: FilmsStripIslandProps) {
  const track = useRef<HTMLUListElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frames = useRef(new Map<string, HTMLDivElement>());
  const returnFocus = useRef<string | null>(null);
  /** The quote's button that started the film playing, if one did: focus goes back to it when the film ends. */
  const origin = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<StripView>(INITIAL_VIEW);
  const [focus, setFocus] = useState<string | null>(null);
  const [playing, setPlaying] = useState<Playing | null>(null);

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

  // A film just mounted: focus it, play it (a refused autoplay leaves the native controls), and pause it off screen
  // once it has been on screen: a film started from a quote is still being scrolled to when the observer first reports.
  useEffect(() => {
    const v = video.current;
    if (!playing || !v) return;
    v.focus(playing.fromQuote ? { preventScroll: true } : undefined);
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

  // A film ended: its poster is back; give focus back to the button that started it.
  useEffect(() => {
    if (playing || !returnFocus.current) return;
    (origin.current ?? frames.current.get(returnFocus.current)?.querySelector("button"))?.focus();
    returnFocus.current = null;
    origin.current = null;
  }, [playing]);

  const start = useCallback((film: FilmTile, from: HTMLElement | null = null) => {
    origin.current = from;
    const poster = frames.current.get(film.id)?.querySelector("img")?.currentSrc ?? "";
    setPlaying({ id: film.id, poster, fromQuote: from !== null });
  }, []);

  // "Watch the film" under a quote: bring the film's tile to the middle of the screen, then play it there.
  const watch = useCallback(
    (film: FilmTile, button: HTMLElement) => {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      frames.current.get(film.id)?.parentElement?.scrollIntoView?.({ block: "center", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
      start(film, button);
    },
    [start],
  );

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
      {quotes && (
        <div className="kh-cols kh-cols--2 ks-film-quotes">
          {quotes.items.map(({ film: id, card }) => {
            const film = films.find((f) => f.id === id);
            if (!film) return null;
            return (
              <div key={id} className="ks-film-quote">
                {card}
                {/* DS Button markup (secondary, s) written out: an island never imports ui/Button (client-icons guard). The
                    name adds the film's chip, so each button says which film it plays. */}
                <button
                  type="button"
                  className="kh-btn kh-btn--secondary kh-btn--s"
                  aria-label={`${quotes.watch}: ${film.chip}`}
                  onClick={(event) => watch(film, event.currentTarget)}
                >
                  <Glyph d={ICON_PLAY} />
                  <span>{quotes.watch}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
