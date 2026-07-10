import Image from "next/image";
import { cn } from "@/lib/cn";

/** R9 narrator device (founder 2026-07-10: the site is told by Kheelu, the
 *  Kheelona brand mascot). One consistent motif — Kheelu beside a speech
 *  bubble, above the section heading — keeps the full-narrator mandate
 *  inside the R5 calm laws: left-aligned, zero italics, one white card
 *  surface. Kheelu's speech is the one sanctioned contraction zone (his
 *  founder-published card voice); body copy keeps the house rules.
 *  The render is decorative (alt="") because the speech is real text. */
const POSES = {
  "hero-wink": { w: 384, h: 737 },
  curious: { w: 505, h: 595 },
  grumpy: { w: 459, h: 757 },
  sad: { w: 430, h: 664 },
  silly: { w: 468, h: 649 },
  joy: { w: 513, h: 696 },
  bliss: { w: 423, h: 726 },
} as const;

export type KheeluPose = keyof typeof POSES;

export function KheeluSays({
  line,
  pose = "hero-wink",
  className,
}: {
  line: string;
  pose?: KheeluPose;
  className?: string;
}) {
  const dim = POSES[pose];
  return (
    <div className={cn("mb-9 flex items-end", className)}>
      <Image
        src={`/mascot/mascot-${pose}.png`}
        alt=""
        width={dim.w}
        height={dim.h}
        sizes="80px"
        className="h-[76px] w-auto shrink-0 md:h-[88px]"
      />
      <div className="relative mb-5 ml-4 max-w-[46ch] rounded-2xl border border-line-soft bg-white px-5 py-3">
        {/* classic tooltip tail: rotated square, two borders form the notch */}
        <span
          aria-hidden="true"
          className="absolute -left-[7px] bottom-[13px] h-3.5 w-3.5 rotate-45 border-b border-l border-line-soft bg-white"
        />
        <p className="font-display text-[16.5px] font-bold leading-snug text-ink-head md:text-[17.5px]">
          {line}
        </p>
      </div>
    </div>
  );
}
