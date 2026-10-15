"use client";

import clsx from "clsx";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ICON_CARET_LEFT, ICON_CARET_RIGHT, ICON_PLAY } from "@/assets/icons.generated";
import { Chip } from "@/components/ui/Chip/Chip";
import { Glyph } from "@/components/ui/Icon/Glyph";
import { IconButton } from "@/components/ui/IconButton/IconButton";
import { imageSource } from "@/components/ui/Photo/image";
import { useFilmPlayback } from "./film-playback";
import { focusedTile, INITIAL_VIEW, positionText, stripView, type StripView } from "./films-view";
import type { FilmTile, FilmsStripConfig, FilmsStripLabels, SingleFilm } from "./films-strip.types";

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
  /** Each tile takes its film's id, and an in-page link to it plays the film here (task 8c.8). */
  readonly anchored?: boolean;
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
 *   one film at a time; once it has been at least half on screen it pauses when less than half of it is; the poster
 *   comes back when it ends, and focus returns to the button that started it;
 * - "Watch the film" under a parent's quote (task 8c.3) scrolls the strip to that film (smooth unless reduced motion)
 *   and plays it the same way; so does, where the strip is `anchored` (each tile carrying its film's id), an in-page link
 *   to a film's tile anywhere on the page (`#<film id>`; the product page's languages answer, task 8c.8), whose press
 *   keeps the address as it was (without JavaScript the link still takes the reader to the film);
 * - the film most inside the strip's central band takes `is-focus` (one observer whose root is the track), which
 *   motion.css scales to `--ks-film-focus` (nothing with reduced motion).
 * Icons only through `IconButton`, `Glyph` and the named `ICON_*` constants (client-safe, task 2.11); the quote's button
 * is the DS Button markup written out, as CopyLinkButton's is (an island never imports ui/Button).
 */
export function FilmsStripIsland({ films, labels, posters, sizes, quotes, anchored = false, children }: FilmsStripIslandProps) {
  const track = useRef<HTMLUListElement>(null);
  const frames = useRef(new Map<string, HTMLDivElement>());
  /** A film's own play button, where focus goes back when the film ends (unless a quote's button started it). */
  const controlOf = useCallback((id: string) => frames.current.get(id)?.querySelector("button"), []);
  const { video, playing, start: startFilm, ended } = useFilmPlayback(controlOf);
  const [view, setView] = useState<StripView>(INITIAL_VIEW);
  const [focus, setFocus] = useState<string | null>(null);

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

  // Playing (film-playback.ts): a tap mounts the film with the poster already on screen, focused and playing; a quote's
  // button that started it gets focus back at the end.
  const start = useCallback(
    (film: FilmTile, from: HTMLElement | null = null) => startFilm(film.id, frames.current.get(film.id)?.querySelector("img")?.currentSrc ?? "", from),
    [startFilm],
  );

  // "Watch the film" under a quote: bring the film's tile to the middle of the screen, then play it there.
  const watch = useCallback(
    (film: FilmTile, button: HTMLElement) => {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      frames.current.get(film.id)?.parentElement?.scrollIntoView?.({ block: "center", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
      start(film, button);
    },
    [start],
  );

  // An in-page link to one of these films (task 8c.8): a plain press plays it here as a quote's button does, and the
  // address stays as it was; a press that opens a new tab or window, or a link to anything else, is left to the browser.
  useEffect(() => {
    if (!anchored) return;
    const press = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      const film = link && films.find((f) => link.getAttribute("href") === `#${f.id}`);
      if (!link || !film) return;
      event.preventDefault();
      watch(film, link);
    };
    document.addEventListener("click", press);
    return () => document.removeEventListener("click", press);
  }, [anchored, films, watch]);

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
            <li key={film.id} id={anchored ? film.id : undefined} className={clsx("ks-film", focus === film.id && "is-focus")} data-video-id={film.id}>
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
                    onEnded={() => ended(film.id)}
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

export interface FilmClipIslandProps {
  readonly film: SingleFilm;
  /** The frame's rendered width at each layout, for the poster. */
  readonly sizes: string;
}

/** The single film's one id in the playback hook. */
const CLIP = "clip";

/**
 * The single film's island (task 8c.6; D061 items 12-13): the frame of FilmsStrip's `single` layout, the expert clip.
 * At rest the poster (lazy), the chip on it (hidden from screen readers: the play control says the same in words) and
 * the DS primary play control in the strip's place; no `<video>` and no byte of the film before the tap. A tap mounts
 * the film over the poster with native controls and sound, focused and playing, exactly as a strip film plays
 * (film-playback.ts); it pauses once it has been half on screen and leaves; at the end the poster is back and focus
 * returns to the play control. No autoplay, muted preview, loop or moving poster (D049); no tracking event.
 */
export function FilmClipIsland({ film, sizes }: FilmClipIslandProps) {
  const frame = useRef<HTMLDivElement>(null);
  const controlOf = useCallback(() => frame.current?.querySelector("button"), []);
  const { video, playing, start, ended } = useFilmPlayback(controlOf);
  return (
    <div className="ks-clip__frame" ref={frame}>
      <Image {...imageSource(film.poster)} alt={film.poster.alt} sizes={sizes} loading="lazy" />
      <p className="ks-clip__chip" aria-hidden="true">
        <Chip label={film.chip} />
      </p>
      <IconButton
        icon={ICON_PLAY}
        label={film.play}
        variant="primary"
        size="l"
        className="ks-film__play"
        hidden={playing !== null}
        onClick={() => start(CLIP, frame.current?.querySelector("img")?.currentSrc ?? "")}
      />
      {playing && (
        <video
          ref={video}
          src={film.video}
          poster={playing.poster || film.still}
          controls
          playsInline
          preload="none"
          aria-label={film.name}
          onEnded={() => ended(CLIP)}
        />
      )}
    </div>
  );
}
