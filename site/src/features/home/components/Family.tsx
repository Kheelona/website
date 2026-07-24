import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FAMILY } from "@/lib/family";
import { LAUNCH_PRICE } from "@/config/site";

/** Home room 5 (revamp M2): the companion family, Lumi first — copy-v2
 *  [seed] + published facts (lib/family shared with /playos). Replaces the
 *  three-SKU shop grid (colorways live on /products/lumi with the picker);
 *  founder redlines at preview if the SKU shelf should return. Lumi's card
 *  is the only link — whole-card, so no tilt (hard rule). */
export function Family() {
  return (
    <div>
      <Reveal>
        <SectionHeading
          title="Meet the family. Lumi comes first."
          titleClassName="mb-4 max-w-[18ch]"
          lede="The same friend lives inside each one. Lumi is the first your child will meet. Lori, Lua, and Robu are on the way."
          ledeClassName="mb-2 max-w-[58ch]"
        />
        <p className="mb-10 font-display text-[18px] font-bold text-ink-head">
          Made for a three-year-old. Still a friend at ten.
        </p>
      </Reveal>
      <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
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
    </div>
  );
}

function FamilyCardInner({ member: m }: { member: (typeof FAMILY)[number] }) {
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
