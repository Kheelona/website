import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/molecules/Reveal";
import { FAMILY, type FamilyMember } from "@/lib/family";
import { LAUNCH_PRICE } from "@/config/site";

/** The companion lineup as cards (revamp M4 extraction).
 *
 *  Home's family room and /playos both show this lineup; the markup was
 *  duplicated, so the two grids had already drifted apart in card height,
 *  columns, and whether "Coming soon" was shown at all. One component now,
 *  fed by the single `lib/family` source.
 *
 *  Lumi's card is a whole-card link, so it carries NO tilt (hard rule, §8.18:
 *  a surface that moves under the cursor drops clicks). */
export function FamilyGrid({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-5 md:grid-cols-4", className)}>
      {FAMILY.map((m, i) => (
        <Reveal as="li" key={m.name} delay={i * 0.06}>
          {m.here ? (
            <Link
              href="/products/lumi"
              aria-label={`Lumi: meet the friend who listens and reserve at ${LAUNCH_PRICE}`}
              className="block h-full overflow-hidden rounded-(--radius-card) border border-line-soft bg-white transition-shadow duration-300 ease-(--ease-calm) hover:shadow-(--shadow-room) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
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
      <div className={`grid h-[180px] place-items-center p-5 ${m.tint}`}>
        <Image
          src={m.img}
          alt={m.alt}
          width={m.w}
          height={m.h}
          sizes="(max-width: 640px) 45vw, 220px"
          className="h-[140px] w-auto object-contain"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-[20px] font-extrabold text-ink-head">
            {m.name}
          </h3>
          {!m.here && (
            <span className="rounded-full bg-cream px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
              Coming soon
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[14px] leading-snug text-ink-muted">{m.note}</p>
      </div>
    </>
  );
}
