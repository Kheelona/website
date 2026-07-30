"use client";

import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "@/components/atoms/Eyebrow";
import type { AudioMomentData } from "@/lib/audio-moments";

/** Real Lumi audio, playable in place (V4, team feedback 2026-07-30).
 *
 *  One card = the play control, a kicker chip naming what the exchange
 *  teaches, and the transcript in a speech bubble. The transcript IS the
 *  accessible content — a visitor who cannot (or does not) press play still
 *  gets the whole demo, which is also the no-JS and broken-file state.
 *
 *  Contracts:
 *  - `preload="none"`: nothing downloads until a parent asks (most visitors
 *    are on phones on mobile data).
 *  - One voice at a time: playing a card pauses the others.
 *  - No autoplay, ever.
 *  - A file that fails to load hides its play control and keeps the card
 *    (transcript-only), so a missing asset degrades to copy, never to a
 *    broken button.
 *  - The equaliser is decorative (aria-hidden) and animates only while
 *    playing AND motion is welcome (CSS-gated in globals.css). */
export function AudioMoments({
  moments,
  className,
}: {
  moments: readonly AudioMomentData[];
  className?: string;
}) {
  const [playing, setPlaying] = useState<string | null>(null);
  const [broken, setBroken] = useState<ReadonlySet<string>>(new Set());
  const audioRefs = useRef(new Map<string, HTMLAudioElement>());

  const toggle = (id: string) => {
    const el = audioRefs.current.get(id);
    if (!el) return;
    if (playing === id) {
      el.pause();
      return;
    }
    audioRefs.current.forEach((other, key) => {
      if (key !== id) other.pause();
    });
    const attempt = el.play();
    // jsdom's play() returns undefined; browsers return a promise that
    // rejects when the source is missing — treat that like a load error
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        setBroken((prev) => new Set(prev).add(id));
        setPlaying((current) => (current === id ? null : current));
      });
    }
  };

  return (
    <ul className={cn("grid gap-5 md:grid-cols-2", className)}>
      {moments.map((m) => {
        const isPlaying = playing === m.id;
        return (
          <li
            key={m.id}
            className="rounded-(--radius-card) border border-line-soft bg-white p-5 sm:p-6"
          >
            <div className="flex items-center gap-4">
              {!broken.has(m.id) && (
                <button
                  type="button"
                  onClick={() => toggle(m.id)}
                  aria-pressed={isPlaying}
                  aria-label={
                    isPlaying ? `Pause: ${m.chip}` : `Play: ${m.chip}`
                  }
                  className="grid h-12 w-12 shrink-0 cursor-pointer place-items-center rounded-full bg-action text-ink-head shadow-cta transition-transform duration-150 ease-(--ease-bounce) active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Play className="h-5 w-5 translate-x-[1px]" fill="currentColor" aria-hidden="true" />
                  )}
                </button>
              )}
              <Eyebrow className="mb-0">{m.chip}</Eyebrow>
              {/* the equaliser: pure decoration, bars scale only while playing */}
              <span
                aria-hidden="true"
                data-playing={isPlaying}
                className="audio-eq ml-auto flex h-5 items-end gap-[3px]"
              >
                {[0.55, 0.95, 0.7, 0.85].map((h, i) => (
                  <span
                    key={i}
                    className={cn(
                      "audio-eq-bar w-[3px] origin-bottom rounded-full transition-colors",
                      isPlaying ? "bg-orange" : "bg-line",
                    )}
                    style={{
                      height: `${h * 100}%`,
                      animationDelay: `${i * 0.12}s`,
                    }}
                  />
                ))}
              </span>
            </div>
            <blockquote className="relative mt-4 rounded-2xl bg-cool px-4 py-3">
              <span
                aria-hidden="true"
                className="absolute -top-[6px] left-6 h-3 w-3 rotate-45 bg-cool"
              />
              <p className="text-[16px] leading-relaxed text-ink-head">
                {m.transcript}
              </p>
            </blockquote>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption -- the
                full transcript is rendered beside the control */}
            <audio
              ref={(el) => {
                if (el) audioRefs.current.set(m.id, el);
                else audioRefs.current.delete(m.id);
              }}
              src={m.src}
              preload="none"
              onPlay={() => setPlaying(m.id)}
              onPause={() =>
                setPlaying((current) => (current === m.id ? null : current))
              }
              onEnded={() =>
                setPlaying((current) => (current === m.id ? null : current))
              }
              onError={() => {
                setBroken((prev) => new Set(prev).add(m.id));
                setPlaying((current) => (current === m.id ? null : current));
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}
