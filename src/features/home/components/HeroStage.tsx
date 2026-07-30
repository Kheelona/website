import Image from "next/image";
import { cn } from "@/lib/cn";

/** The hero art stage (revamp M2, founder brief pointer 2): Kheelu talking
 *  to Lumi on the right.
 *
 *  V4 (team feedback 2026-07-30): the three floating fact bubbles are GONE —
 *  the team asked for them off, and the claims they carried live on in the
 *  audio room (languages + footnote), the trust room, and the parents room.
 *
 *  INTERIM ART: two existing cutouts composed side by side (Kheelu leaning
 *  toward the plush) until the founder-generated single artwork lands
 *  (gemini-handoff/hero-2026-07, FOUNDER-TODO REV-a). The swap is local to
 *  this file: replace the two Images with one priority Image of
 *  /hero/kheelu-lumi.png; the layout stays.
 *
 *  LCP LAW (R9/R11, twice re-learned live): the PLUSH is the priority image
 *  and must stay the hero's largest element. */
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
    </div>
  );
}
