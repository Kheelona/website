"use client";

import { useState } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { VideoMoment } from "@/lib/video-moments";

/* The mockup's tints, cycled so neighbouring tiles never match. */
const TINTS = ["bg-blush", "bg-sage", "bg-lav", "bg-soft"] as const;

/** The mockup's video wall (redesign 2026-10): one large stage, a list of the
 *  other films beside it (a swipe row on phones), and a dialog that plays the
 *  chosen film.
 *
 *  §8.37-a STILL BINDS: there is no `<video>` in the DOM until somebody
 *  presses play. The stage and the list are images and buttons; the player
 *  is mounted inside the dialog only while it is open, so axe's critical
 *  `video-caption` rule never sees a film at rest. Captions are burned into
 *  every file (§8.37-b).
 *
 *  Films are vertical (9:16), so the 16:9 stage shows the poster contained on
 *  a tint, the way the mockup draws its frames. */
export function VideoWall({ moments }: { moments: readonly VideoMoment[] }) {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const v = moments[current];
  if (!v) return null;

  return (
    <div className="grid gap-4 min-[900px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] min-[900px]:items-start min-[900px]:gap-8">
      <div>
        <Dialog.Root open={playing} onOpenChange={setPlaying}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label={`Play: ${v.chip}`}
              className={cn(
                "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-3xl",
                TINTS[current % TINTS.length],
              )}
            >
              <Image
                src={v.poster}
                alt=""
                width={v.width}
                height={v.height}
                sizes="(max-width: 900px) 50vw, 360px"
                className="h-full w-auto object-contain"
              />
              <span className="absolute flex h-[72px] w-[72px] items-center justify-center rounded-full bg-surface text-ink-head shadow-lg">
                <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden="true" />
              </span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[60] bg-[rgba(15,16,25,0.6)]" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed left-1/2 top-1/2 z-[60] flex max-h-[92vh] w-[min(92vw,460px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-3.5 rounded-3xl bg-surface p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <Dialog.Title className="text-[17px] font-bold text-ink-head">{v.chip}</Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Close video"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink-head"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
              {playing ? (
                <video
                  key={v.id}
                  src={v.src}
                  poster={v.poster}
                  controls
                  autoPlay
                  playsInline
                  className="block max-h-[72vh] w-full rounded-2xl bg-black object-contain"
                >
                  {/* Captions are burned into the file (§8.37-b). */}
                </video>
              ) : null}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <div className="mt-3 flex flex-col gap-1">
          <b className="font-display text-[22px] font-semibold leading-tight text-ink-head">{v.chip}</b>
          <span className="kh-note">{v.label}</span>
        </div>
      </div>

      {moments.length > 1 ? (
        <ul
          aria-label="More videos"
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 pt-1 [scrollbar-width:none] min-[900px]:mx-0 min-[900px]:flex-col min-[900px]:overflow-visible min-[900px]:p-0 min-[900px]:gap-2.5"
        >
          {moments.map((m, i) => (
            <li key={m.id} className="shrink-0 basis-[168px] snap-start min-[900px]:basis-auto">
              <button
                type="button"
                aria-current={i === current ? "true" : "false"}
                onClick={() => setCurrent(i)}
                className="group flex w-full flex-col gap-1.5 text-left min-[900px]:flex-row min-[900px]:items-center min-[900px]:gap-3 min-[900px]:rounded-2xl min-[900px]:border min-[900px]:border-line min-[900px]:bg-surface min-[900px]:p-2 min-[900px]:aria-[current=true]:border-ink-head"
              >
                <span
                  className={cn(
                    "flex aspect-video w-full items-center justify-center overflow-hidden rounded-[14px] border-[3px] border-transparent group-aria-[current=true]:border-ink-head min-[900px]:w-[120px] min-[900px]:shrink-0 min-[900px]:group-aria-[current=true]:border-transparent",
                    TINTS[i % TINTS.length],
                  )}
                >
                  <Image
                    src={m.poster}
                    alt=""
                    width={m.width}
                    height={m.height}
                    sizes="70px"
                    className="h-full w-auto object-contain"
                  />
                </span>
                <span className="flex flex-col gap-0.5">
                  <b className="text-[14px] leading-snug text-ink-head">{m.chip}</b>
                  <span className="hidden text-[13px] leading-snug text-ink-muted min-[900px]:block">
                    {m.label}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
