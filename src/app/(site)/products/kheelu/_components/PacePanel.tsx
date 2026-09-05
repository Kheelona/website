import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Shape } from "@/components/atoms/Shapes";
import { HERO_PROMISE } from "@/lib/growth-arc";

/** "School teaches the class. Kheelu teaches one child." (founder call,
 *  2026-07-28.)
 *
 *  Why this fold exists: our comparison table argues against other toys, which
 *  is the wrong frame for the money. A parent's real spend is school plus
 *  tuition, and the founder's own pricing insight is that we price against
 *  tutoring, not toys. This panel moves the comparison there.
 *
 *  ADDITION, NOT INDICTMENT — a hard rule for this copy. Indian parents are
 *  loyal to their schools and often to a tutor they trust; a fold that attacks
 *  either loses the room. So the left side is stated as a fact of arithmetic
 *  (one teacher, thirty children) with no blame in it, and the right side is
 *  what Kheelu adds. The word "replace" appears nowhere.
 *
 *  Drawn with the brand shape primitives rather than a stock classroom photo:
 *  a photo of a real classroom would either be a stock lie or a school we have
 *  no permission to show. Decorative shapes carry no claim. */
const CONTRAST = [
  {
    kind: "flower13" as const,
    tint: "bg-cool",
    color: "#29A0D7",
    label: "A classroom",
    heading: "One lesson, thirty children.",
    body: "A teacher has one hour and a whole room to carry. The lesson moves at the pace of the room, because it has to.",
    seats: 12,
  },
  {
    kind: "flower5" as const,
    tint: "bg-sun",
    color: "#EF762F",
    label: "Kheelu",
    heading: "One lesson, one child.",
    body: "Kheelu answers the fourth why with the same patience as the first, remembers where your child stopped, and picks up there tomorrow.",
    seats: 1,
  },
] as const;

export function PacePanel() {
  return (
    <div>
      <Reveal>
        <SectionHeading
          eyebrow="Their own pace"
          title="School teaches the class. Kheelu teaches your child."
          titleClassName="mb-4 max-w-[24ch]"
          lede="Nothing here is a criticism of teachers, and Kheelu does not replace anyone. It is arithmetic: one adult cannot move at thirty paces at once. Kheelu only ever has one child to keep up with."
          ledeClassName="mb-10 max-w-[58ch]"
        />
      </Reveal>
      <div className="grid gap-5 md:grid-cols-2">
        {CONTRAST.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.08}>
            <div className={`h-full rounded-(--radius-card) border border-line p-7 ${c.tint}`}>
              {/* V6: ink-muted measured 4.31 to 4.37:1 on these two card
                  tints and had to go. Founder call at the handoff review —
                  one kicker language site-wide, so small uppercase labels are
                  orange-ink (the guarded orange that clears 4.5:1 on every
                  wash), not dark ink. */}
              <p className="mb-5 text-[13px] font-bold uppercase tracking-[0.1em] text-orange-ink">
                {c.label}
              </p>
              {/* the seats: many small marks for a room, one large for a child.
                  Decorative only, so it is aria-hidden and carries no claim. */}
              <div
                aria-hidden="true"
                className="mb-6 flex min-h-[68px] flex-wrap items-end gap-1.5"
              >
                {Array.from({ length: c.seats }).map((_, s) => (
                  <Shape
                    key={s}
                    kind={c.kind}
                    color={c.color}
                    opacity={c.seats === 1 ? 0.9 : 0.35}
                    className={c.seats === 1 ? "h-16 w-16" : "h-[18px] w-[18px]"}
                  />
                ))}
              </div>
              <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">
                {c.heading}
              </h3>
              <p className="text-[16px]">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <p className="max-w-[46ch] font-display text-[19px] font-bold text-ink-head">
          Every answer. Every day. At exactly the pace they set.
        </p>
      </Reveal>
      {/* V6 D5: the pace argument extended from days to years, closing on the
          hero promise verbatim — one promise, said identically on both pages,
          rendered from the same HERO_PROMISE source since the 3+ re-anchor. */}
      <Reveal className="mt-10">
        <p className="max-w-[58ch] text-[16px] text-ink">
          The memory that picks up where your child stopped tomorrow keeps
          picking up for years. First questions at 3 become stories, numbers,
          and bigger questions, one day at a time.
        </p>
        <p className="mt-4 font-display text-[19px] font-bold text-ink-head">
          {HERO_PROMISE.join(" ")}
        </p>
      </Reveal>
    </div>
  );
}
