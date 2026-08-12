import Image from "next/image";
import Link from "next/link";
import { PRESS_LIFT } from "@/lib/interactions";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/molecules/Reveal";
import { FAMILY, type FamilyMember } from "@/lib/family";
import { LAUNCH_PRICE } from "@/config/site";

/** The pipeline lineup as cards (M4 extraction, V3 rebuild).
 *
 *  Home's pipeline room shows this lineup, fed by the single `lib/family`
 *  source (it was hand-typed twice before the M4 extraction and had drifted;
 *  /playos has since dropped its copy, keeping only the "Own the years" moat
 *  card).
 *
 *  V3: three bodies with an age chip each, and a hairline threaded behind them
 *  on md+ so the row reads as one arc from 2 to 14 rather than three unrelated
 *  products. Members without art yet (gate V3-c) render a calm placeholder
 *  instead of a stand-in render that could be mistaken for the real product.
 *
 *  Lumi's card is a whole-card link, so it carries NO tilt (hard rule, §8.18:
 *  a surface that moves under the cursor drops clicks). */
export function FamilyGrid({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        // the arc: a hairline behind the cards, aligned with the age chips.
        // Pure CSS, no JS, no animation (BUILD-V3 §5, pipeline row).
        "relative grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3",
        "md:before:absolute md:before:left-[8%] md:before:right-[8%] md:before:top-[38px] md:before:h-px md:before:bg-line-soft md:before:content-['']",
        className,
      )}
    >
      {FAMILY.map((m, i) => (
        <Reveal as="li" key={m.name} delay={i * 0.06} className="relative">
          {m.here ? (
            <Link
              href="/products/lumi"
              aria-label={`Lumi: meet the friend who listens and reserve at ${LAUNCH_PRICE}`}
              className={`block h-full overflow-hidden rounded-(--radius-card) border border-line-soft bg-white ${PRESS_LIFT} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`}
            >
              <FamilyCardInner member={m} />
            </Link>
          ) : (
            <div className="h-full overflow-hidden rounded-(--radius-card) border border-line-soft bg-white">
              <FamilyCardInner member={m} />
            </div>
          )}
        </Reveal>
      ))}
    </ul>
  );
}

function FamilyCardInner({ member: m }: { member: FamilyMember }) {
  return (
    <>
      <div className={`relative grid h-[180px] place-items-center p-5 ${m.tint}`}>
        <span className="absolute right-3 top-3 max-w-full rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-ink-head">
          Ages {m.ages}
        </span>
        {m.img ? (
          <Image
            src={m.img}
            alt={m.alt}
            width={m.w}
            height={m.h}
            sizes="(max-width: 640px) 80vw, 240px"
            className="h-[140px] w-auto object-contain"
          />
        ) : (
          /* Gate V3-c: the founder generates this art from the Gemini kit
             (gemini-handoff/pipeline-2026-07/). Until then, a calm mark. */
          <span
            role="img"
            aria-label={m.alt}
            /* text-ink, not text-ink-muted: at 13px on the 15% brand tints the
               muted grey lands at ~3.9:1 and axe fails it (caught in the V3 QA
               sweep). The tints are fixed by the palette, so the text darkens. */
            className="grid h-[124px] w-[124px] place-items-center rounded-full border border-dashed border-ink-muted/50 text-center text-[13px] font-semibold leading-tight text-ink"
          >
            In the workshop
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-[20px] font-extrabold text-ink-head">
            {m.name}
          </h3>
          {!m.here && (
            <span className="rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-orange-ink">
              Coming soon
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">{m.note}</p>
      </div>
    </>
  );
}
