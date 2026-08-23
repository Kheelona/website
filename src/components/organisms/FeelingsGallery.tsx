"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRESS_LIFT } from "@/lib/interactions";
import { FEELINGS, type Feeling } from "@/lib/feelings";
import { KHEELU_POSES, kheeluPoseSrc } from "@/lib/kheelu-poses";

/** App-store-style feeling character cards (revamp M2, founder brief 11c):
 *  each of the five feelings is a tappable character card; tapping opens a
 *  detail overlay, like an App Store "Today" card expanding. Radix Dialog
 *  supplies the contract (focus trap + restore, Esc, overlay click, Title/
 *  Description); the entrance scale is CSS and motion-gated
 *  (.feelings-dialog in globals.css). Cards are buttons, never links, and
 *  never tilt (whole-card interaction law). */
export function FeelingsGallery({
  feelings = FEELINGS,
  className,
}: {
  feelings?: readonly Feeling[];
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5", className)}>
      {feelings.map((f) => (
        <li key={f.name}>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className={cn(
                  `group block h-full w-full cursor-pointer rounded-(--radius-card) border border-line p-5 text-left ${PRESS_LIFT} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`,
                  f.card,
                )}
              >
                <span className="grid h-[150px] place-items-center md:h-[165px]">
                  <Image
                    src={kheeluPoseSrc(f.pose)}
                    alt={f.alt}
                    width={KHEELU_POSES[f.pose].w}
                    height={KHEELU_POSES[f.pose].h}
                    sizes="150px"
                    className="h-[130px] w-auto object-contain transition-transform duration-300 ease-(--ease-bounce) group-hover:-translate-y-1 md:h-[145px]"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className={cn("mt-4 block h-1.5 w-9 rounded-full", f.tick)}
                />
                <span className="mt-3 block font-display text-2xl font-extrabold text-ink-head">
                  {f.name}
                </span>
                <span className="mt-1 block text-[15px] leading-snug text-ink">
                  {f.line}
                </span>
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="feelings-dialog-overlay fixed inset-0 z-50 bg-ink-head/45" />
              <Dialog.Content
                className={cn(
                  "feelings-dialog fixed left-1/2 top-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 -translate-y-1/2 rounded-(--radius-card-lg) border border-line p-8 shadow-(--shadow-room)",
                  f.card,
                  "bg-white",
                )}
              >
                <div className="grid place-items-center">
                  <Image
                    src={kheeluPoseSrc(f.pose)}
                    alt={f.alt}
                    width={KHEELU_POSES[f.pose].w}
                    height={KHEELU_POSES[f.pose].h}
                    sizes="220px"
                    className="h-[200px] w-auto object-contain"
                  />
                </div>
                <Dialog.Title className="mt-5 font-display text-[28px] font-extrabold text-ink-head">
                  {f.name}
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-[16px] leading-snug text-ink">
                  {f.line}
                </Dialog.Description>
                <p className="mt-3 text-[16px] leading-relaxed text-ink">{f.detail}</p>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label={`Close ${f.name}`}
                    className="absolute right-3 top-3 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ink-head hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </li>
      ))}
    </ul>
  );
}
