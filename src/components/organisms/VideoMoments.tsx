"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import { PRESS } from "@/lib/interactions";
import {
  VIDEO_MOMENTS,
  isVideoCarousel,
  type VideoMoment,
} from "@/lib/video-moments";

/** Real families on film (§8.37). Three tiles at a time, advancing and looping.
 *
 *  THE ONE CONTRACT THAT EXPLAINS THE WHOLE SHAPE OF THIS FILE: there is NO
 *  `<video>` element on the page until somebody presses play.
 *
 *  Read from the installed axe-core 4.12.1 rather than remembered:
 *
 *      id: 'video-caption', impact: 'critical', selector: 'video',
 *      none: [ 'caption' ]
 *
 *  No matcher. EVERY `<video>` in the DOM fails that rule — muted, paused,
 *  silent, it makes no difference — and `qa:sweep` runs axe with default rules
 *  over every route. A tile holding a `<video>` at rest would therefore put a
 *  CRITICAL violation on the home page and on the page that takes money, and
 *  end the clean 34/34 sweep.
 *
 *  This is a DETECTION problem, not an accessibility one. Every file carries
 *  its subtitles burned into the frame (`hasOpenCaptions`, asserted per row),
 *  and open captions satisfy WCAG 1.2.2 on their own. axe cannot read a
 *  caption painted into a video, so it reports the absence of a `<track>`.
 *
 *  So a tile at rest is an image and a button. The `<video>` is mounted into
 *  the tile the moment a parent asks for it, which is also the fastest thing
 *  to do: nothing downloads on page load, on a product whose visitors are 60%
 *  on phones and often on mobile data. A played video does carry the rule's
 *  technical failure while it is open, and that is stated plainly rather than
 *  papered over: it exists only in a state the visitor explicitly asked for,
 *  and the content in it is captioned.
 *
 *  The rest of the contract:
 *  - ONE `<video>` at a time. Playing a second tile unmounts the first, so the
 *    one-voice-at-a-time rule AudioMoments holds is structural here, not a
 *    handler that has to remember to pause its siblings.
 *  - MOTION IS ONE SWITCH. `rotating` governs both the auto-advance and the
 *    centred tile's silent loop, so the single Pause control stops everything
 *    that moves (WCAG 2.2.2). It starts OFF and is enabled in an effect only
 *    when `prefers-reduced-motion` says motion is welcome, which also means the
 *    server and the first client render agree.
 *  - THE CENTRED TILE IS FOUND GEOMETRICALLY, never from a breakpoint. One
 *    IntersectionObserver with a thin band at the track's horizontal middle
 *    reports whichever tile is actually centred, so the same rule gives the
 *    middle of three on a desktop and the leading tile on a phone.
 *  - A FILE THAT WILL NOT LOAD degrades to its still and its label, never to a
 *    broken control (the AudioMoments law).
 *  - NOTHING HERE IS `priority`. The hero plush must stay the largest eager
 *    image on both pages (the LCP law; two live regressions taught it). */

/** How long a tile holds the centre before the track advances. Six seconds is
 *  long enough to read the label and decide, short enough that a visitor who
 *  is watching sees there is more than one. */
const ROTATE_MS = 6000;

/** Does this visitor welcome motion?
 *
 *  `useSyncExternalStore` rather than an effect, because a media query IS an
 *  external store and reading one with setState-in-an-effect is a cascading
 *  render (the lint rule that caught it is right). The server snapshot is
 *  `false`, so nothing moves until the client has actually asked the platform,
 *  which also makes the server and first client paint identical. */
function useMotionWelcome(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window.matchMedia !== "function") return () => {};
      const query = window.matchMedia("(prefers-reduced-motion: no-preference)");
      query.addEventListener?.("change", onChange);
      return () => query.removeEventListener?.("change", onChange);
    },
    () =>
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: no-preference)").matches
        : false,
    () => false,
  );
}

export function VideoMoments({
  moments = VIDEO_MOMENTS,
  className,
}: {
  moments?: readonly VideoMoment[];
  className?: string;
}) {
  /* One or two videos are a row, not a carousel (§8.37-j). Carousel chrome
     over a set that cannot advance is furniture pretending to be a control,
     and an auto-running loop with no Pause beside it fails WCAG 2.2.2, so the
     static state has no motion at all rather than motion without a switch. */
  const carousel = isVideoCarousel(moments);

  const trackRef = useRef<HTMLUListElement>(null);
  const tileRefs = useRef(new Map<string, HTMLLIElement>());

  /** Which tile is geometrically centred. Null until the observer first
   *  reports, which is one frame in a browser and forever in jsdom, so the
   *  still is the state every test sees. */
  const [centreId, setCentreId] = useState<string | null>(null);
  /** The one tile currently holding a `<video>`. */
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [broken, setBroken] = useState<ReadonlySet<string>>(new Set());
  /** null follows the operating system; true and false are the visitor saying
   *  so themselves with the Pause control. Kept separate from the OS reading
   *  so that someone who asks for reduced motion can still START the carousel
   *  deliberately, and so that pressing Pause is never undone by a media query
   *  re-evaluating. */
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const motionWelcome = useMotionWelcome();
  /** Both the auto-advance AND the centred tile's silent loop. */
  const rotating = carousel && (motionOverride ?? motionWelcome);
  /** Set once a pointer is over the section or focus is inside it. Suspends
   *  the advance without turning the visitor's Pause preference off. */
  const [held, setHeld] = useState(false);

  const ids = useMemo(() => moments.map((m) => m.id), [moments]);


  /** Scroll so tile `index` sits in the MIDDLE of the track.
   *
   *  Centring, not left-aligning, and a real defect is why. Left-aligning
   *  tile N puts N at the edge, which on a three-up desktop makes N+1 the
   *  centred one: pressing Next moved the centre from 1 to 3 and silently
   *  skipped a video. The relationship between "leftmost" and "centre"
   *  depends on how many tiles fit, which is exactly the thing this component
   *  refuses to know. Centring is the same instruction at every width, so the
   *  dots, the arrows and `aria-current` all agree on a phone and on a
   *  desktop without a breakpoint between them. */
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const tiles = Array.from(track.children) as HTMLElement[];
    const target = tiles[index];
    const first = tiles[0];
    if (!target || !first) return;
    const offset = target.offsetLeft - first.offsetLeft;
    const centred = offset - (track.clientWidth - target.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, centred), behavior: "smooth" });
  }, []);

  /** One step on, wrapping at the end. The end is read from the track's own
   *  scroll geometry rather than from an index, because how many tiles are
   *  visible is a question only the layout can answer. */
  const advance = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    const current = centreId ? ids.indexOf(centreId) : 0;
    if (atEnd || current >= ids.length - 1) {
      scrollToIndex(0);
      return;
    }
    scrollToIndex(current + 1);
  }, [centreId, ids, scrollToIndex]);

  /** Any deliberate act by the visitor ends the rotation. The Pause control is
   *  how it comes back, so "manual override" means exactly that rather than a
   *  carousel that starts moving again the moment you look away. */
  const takeOver = useCallback(() => setMotionOverride(false), []);

  /* Which tile is centred. The band is 2% of the track's width at its middle,
     so exactly one tile is inside it at any width and no breakpoint is ever
     consulted. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver !== "function") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.videoId;
          if (id) setCentreId(id);
        }
      },
      { root: track, rootMargin: "0px -49% 0px -49%", threshold: 0 },
    );
    tileRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [moments]);

  /* The advance itself. Suspended while a pointer or focus is inside the
     section, while a video is open, and while the tab is in the background. */
  useEffect(() => {
    if (!rotating || held || playingId) return;
    if (typeof document !== "undefined" && document.hidden) return;
    const timer = setInterval(advance, ROTATE_MS);
    return () => clearInterval(timer);
  }, [rotating, held, playingId, advance]);

  const markBroken = useCallback((id: string) => {
    setBroken((prev) => new Set(prev).add(id));
    setPlayingId((current) => (current === id ? null : current));
  }, []);

  if (moments.length === 0) return null;

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <ul
        ref={trackRef}
        className={cn(
          "flex gap-4 md:gap-5",
          carousel
            ? "video-track snap-x snap-mandatory overflow-x-auto pb-2"
            : "flex-wrap justify-center",
        )}
      >
        {moments.map((m) => {
          const isPlaying = playingId === m.id;
          const isBroken = broken.has(m.id);
          /* The silent loop runs on the centred tile only, and only while the
             section's motion is on. One flag, so Pause stops everything. */
          const showPreview =
            Boolean(m.preview) && rotating && centreId === m.id && !isPlaying;

          return (
            <li
              key={m.id}
              data-video-id={m.id}
              ref={(el) => {
                if (el) tileRefs.current.set(m.id, el);
                else tileRefs.current.delete(m.id);
              }}
              className={cn(
                "shrink-0",
                carousel
                  ? "w-[82%] snap-center sm:w-[46%] lg:w-[31.5%]"
                  : moments.length === 1
                    ? "w-full max-w-[360px]"
                    : "w-[82%] sm:w-[46%] lg:w-[31.5%]",
              )}
            >
              <div
                className="relative overflow-hidden rounded-(--radius-card) border border-line bg-ink-head"
                style={{ aspectRatio: `${m.width} / ${m.height}` }}
              >
                {isPlaying ? (
                  /* No <track>: subtitles are burned into the file
                     (`hasOpenCaptions`, asserted per row in
                     lib/video-moments.ts), which satisfies WCAG 1.2.2 on its
                     own. A caption track would print them twice. */
                  <video
                    src={m.src}
                    controls
                    autoPlay
                    playsInline
                    /* contain, never cover: the captions are painted into the
                       frame, so a crop would cut the words off. */
                    className="h-full w-full object-contain"
                    onEnded={() => setPlayingId(null)}
                    onError={() => markBroken(m.id)}
                  />
                ) : (
                  <Tile
                    moment={m}
                    showPreview={showPreview}
                    broken={isBroken}
                    onPlay={() => {
                      takeOver();
                      setPlayingId(m.id);
                    }}
                    onBroken={() => markBroken(m.id)}
                  />
                )}
              </div>

              <Eyebrow className="mb-0 mt-4">{m.chip}</Eyebrow>
              <p className="mt-1 text-[15px] leading-relaxed text-ink">
                {m.label}
              </p>
            </li>
          );
        })}
      </ul>

      {carousel && (
      <Controls
        moments={moments}
        centreId={centreId}
        rotating={rotating}
        onPrev={() => {
          takeOver();
          const current = centreId ? ids.indexOf(centreId) : 0;
          scrollToIndex(current <= 0 ? ids.length - 1 : current - 1);
        }}
        onNext={() => {
          takeOver();
          advance();
        }}
        onDot={(index) => {
          takeOver();
          scrollToIndex(index);
        }}
        onToggleMotion={() => setMotionOverride(!rotating)}
      />
      )}
    </div>
  );
}

/** One tile at rest: the still (or the silent loop) plus the play badge.
 *
 *  A BROKEN FILE LOSES THE BUTTON ENTIRELY rather than keeping a disabled one.
 *  Found by its own test: a disabled control still announces "Play: ..." to a
 *  screen reader, which promises something that cannot happen. The still and
 *  the label carry the card on their own, which is the AudioMoments law
 *  (degrade to copy, never to a broken control). */
function Tile({
  moment,
  showPreview,
  broken,
  onPlay,
  onBroken,
}: {
  moment: VideoMoment;
  showPreview: boolean;
  broken: boolean;
  onPlay: () => void;
  onBroken: () => void;
}) {
  const media = showPreview ? (
    /* The animated loop is a plain <img>, deliberately. next/image re-encodes
       an animated WebP into a still, and axe never looks at an image, which is
       the whole reason the tile can move without holding a <video>. <picture>
       carries the reduced-motion fallback in CSS, so it is correct before any
       script runs. */
    <picture>
      <source media="(prefers-reduced-motion: reduce)" srcSet={moment.poster} />
      <img
        src={moment.preview}
        alt={moment.alt}
        width={moment.width}
        height={moment.height}
        className="h-full w-full object-cover"
        onError={onBroken}
      />
    </picture>
  ) : (
    <Image
      src={moment.poster}
      alt={moment.alt}
      width={moment.width}
      height={moment.height}
      sizes="(max-width: 640px) 82vw, (max-width: 1024px) 46vw, 32vw"
      className="h-full w-full object-cover"
      onError={onBroken}
    />
  );

  if (broken) return media;

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play: ${moment.chip}. ${moment.label}`}
      className={`group block h-full w-full cursor-pointer ${PRESS} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`}
    >
      {media}
      {/* CENTRED, and it was moved once and moved back. A talking-head
          thumbnail puts the speaker's face across the whole middle band, so
          lowering the badge to ~66% took it off her eyes and onto her mouth.
          No vertical position clears a centred face; only a corner does, and
          a corner badge reads less like "press this" than the convention
          every video platform uses. Left centred deliberately, with the
          overlap accepted and raised with the founder rather than fixed by
          churn. Founder brief: soft, ~50% transparency. */}
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
        {/* Soft by founder direction (2026-09-19): visible over any frame,
            never competing with the footage underneath it. */}
        <span className="grid h-16 w-16 place-items-center rounded-full bg-white/55 text-action shadow-cta ring-1 ring-white/40 backdrop-blur-[2px] transition-colors duration-200 md:group-hover:bg-white">
          <Play className="h-6 w-6 translate-x-[2px]" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}

/** Arrows, dots and the one motion switch.
 *
 *  Arrows are `md:` and up because swipe is the affordance on a phone and two
 *  more tap targets there would crowd a 390px screen. Dots are on every width:
 *  they are the only thing that says how many videos exist. */
function Controls({
  moments,
  centreId,
  rotating,
  onPrev,
  onNext,
  onDot,
  onToggleMotion,
}: {
  moments: readonly VideoMoment[];
  centreId: string | null;
  rotating: boolean;
  onPrev: () => void;
  onNext: () => void;
  onDot: (index: number) => void;
  onToggleMotion: () => void;
}) {
  const arrow =
    "hidden h-11 w-11 cursor-pointer place-items-center rounded-full border border-line bg-white text-ink-head md:grid " +
    PRESS +
    " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2";

  return (
    <div className="mt-6 flex items-center gap-4">
      <button type="button" onClick={onPrev} aria-label="Previous video" className={arrow}>
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button type="button" onClick={onNext} aria-label="Next video" className={arrow}>
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      <ul className="flex flex-1 items-center gap-2">
        {moments.map((m, index) => {
          const isCurrent = centreId === m.id;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onDot(index)}
                aria-label={`Show video ${index + 1} of ${moments.length}`}
                aria-current={isCurrent ? "true" : undefined}
                /* The hit area is 44px; only the dot inside it is small. */
                className="grid h-11 w-6 cursor-pointer place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block h-2 rounded-full transition-all duration-300",
                    isCurrent ? "w-5 bg-action" : "w-2 bg-line",
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* WCAG 2.2.2. One control for everything that moves: it stops the
          advance AND returns the centred tile to its still. */}
      <button
        type="button"
        onClick={onToggleMotion}
        aria-pressed={!rotating}
        aria-label={rotating ? "Pause the video carousel" : "Play the video carousel"}
        className={
          "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full border border-line bg-white text-ink-head " +
          PRESS +
          " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
        }
      >
        {rotating ? (
          <Pause className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
