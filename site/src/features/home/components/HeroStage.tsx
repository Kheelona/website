import Image from "next/image";
import { cn } from "@/lib/cn";
import { Footnote } from "@/components/molecules/FootnotesRow";

/** The hero art stage (revamp M2, founder brief pointer 2): Kheelu talking
 *  to Lumi on the right, a few fact bubbles around them.
 *
 *  INTERIM ART: two existing cutouts composed side by side (Kheelu leaning
 *  toward the plush) until the founder-generated single artwork lands
 *  (gemini-handoff/hero-2026-07, FOUNDER-TODO REV-a). The swap is local to
 *  this file: replace the two Images with one priority Image of
 *  /hero/kheelu-lumi.png; bubbles and layout stay.
 *
 *  LCP LAW (R9/R11, twice re-learned live): the PLUSH is the priority image
 *  and must stay the hero's largest element. Bubbles are SSR-visible text
 *  chips — no opacity entrances — floated (transform only) on motion-friendly
 *  desktops and hidden on phones so nothing competes with the LCP paint. */
const BUBBLES = [
  { text: "No screen, ever.", pos: "left-[-6%] top-[4%]", delay: "0s" },
  { text: "Up to 10 home languages.", pos: "right-[-4%] top-[28%]", delay: "2s", footnote: 1 },
  { text: "You read every word.", pos: "left-[-2%] bottom-[14%]", delay: "4s" },
] as const;

export function HeroStage({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-end justify-center pb-4", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,162,59,0.16)_0%,rgba(241,162,59,0.3)_35%,transparent_70%)]"
      />
      <Image
        src="/mascot/mascot-hero-wink.png"
        alt="Kheelu, the Kheelona mascot, winking beside Lumi"
        width={384}
        height={737}
        sizes="(max-width: 768px) 30vw, 170px"
        className="relative -mr-5 h-[210px] w-auto translate-y-1 md:h-[250px]"
      />
      <Image
        src="/product/lumi-blue-2.png"
        alt="Lumi, the sky blue talking plush toy, wearing its striped party hat"
        width={1113}
        height={1600}
        priority
        sizes="(max-width: 768px) 58vw, 320px"
        className="relative h-[340px] w-auto md:h-[400px]"
      />
      {BUBBLES.map((b) => (
        <p
          key={b.text}
          className={cn(
            "hero-bubble absolute hidden rounded-full border border-line-soft bg-white/95 px-4 py-2 text-[14px] font-bold text-ink-head shadow-(--shadow-room-sm) md:block",
            b.pos,
          )}
          style={{ animationDelay: b.delay }}
        >
          {b.text}
          {/* V3: the languages claim carries its footnote marker — the full
              list is founder-gated, and saying so is the trust signal */}
          {"footnote" in b && b.footnote ? (
            <Footnote n={b.footnote} id="fn-languages" />
          ) : null}
        </p>
      ))}
    </div>
  );
}
