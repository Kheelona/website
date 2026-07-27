import Image from "next/image";
import { cn } from "@/lib/cn";
import { KHEELU_POSES, kheeluPoseSrc } from "@/lib/kheelu-poses";

/** Home room 6 (revamp M2, founder brief 11b): Kheelu in the middle,
 *  surrounded by rotating day-moment cards (the Pinterest orbit reference,
 *  rebuilt calm). Server component; the orbit is pure CSS (globals.css
 *  .kheelu-orbit block): desktop + motion-ok gets the slow ring with
 *  counter-rotating upright cards, paused on hover/focus; phones and
 *  reduced-motion get a static two-column grid in the SAME DOM order, so
 *  reading order is always Morning to Bedtime. Height is reserved on
 *  desktop (no CLS). All behaviours here are already published product
 *  facts — no new claims. */
const MOMENTS = [
  { label: "Morning", text: "Why is the sky blue? Lumi answers, then asks one back." },
  { label: "After playschool", text: "A new story, made to order." },
  { label: "Counting time", text: "Numbers and rhymes that feel like a game." },
  { label: "Evening", text: "Songs you grew up with, and new ones too." },
  { label: "On the train", text: "No internet needed. Lumi plays offline." },
  { label: "Bedtime", text: "One last story, lights low." },
] as const;

export function KheeluOrbit({ className }: { className?: string }) {
  return (
    <div className={cn("kheelu-orbit", className)}>
      <Image
        src={kheeluPoseSrc("joy")}
        alt=""
        width={KHEELU_POSES.joy.w}
        height={KHEELU_POSES.joy.h}
        sizes="190px"
        className="kheelu-orbit-center mx-auto h-[150px] w-auto md:h-[190px]"
      />
      <ul className="orbit-cards">
        {MOMENTS.map((m, i) => (
          <li
            key={m.label}
            className="orbit-seat"
            style={{ "--a": `${i * 60 - 90}deg` } as React.CSSProperties}
          >
            <div className="orbit-card rounded-(--radius-card) border border-line-soft bg-white p-4 shadow-(--shadow-room-sm)">
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-action-ink">
                {m.label}
              </p>
              <p className="mt-1 text-[14px] leading-snug text-ink">{m.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
