import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";

/** Home S02b: the rest of the PDF hero paragraph, staged as three oversized
 *  lines (founder decision 2026-07-07: hero slims down, no sentence leaves
 *  the page). Copy verbatim and in reading order; only the presentation is
 *  staged. */
/* R5: the staggered indents flattened — every line starts on the same left
   rail (founder 2026-07-10: standardize left alignment). */
const LINES = [
  { text: "In the years a brain grows fastest.", indent: "" },
  {
    text: "The more Lumi understands how your child feels, the more they learn.",
    indent: "",
  },
] as const;

export function StagedIntro() {
  return (
    <Section wash="cream">
      {/* R9 rhythm: pb-28 read as a near-blank viewport on tall screens */}
      <Container className="pb-16 pt-4 md:pb-20">
        <div className="flex flex-col gap-7 md:gap-9">
          {LINES.map((l, i) => (
            <Reveal key={i} delay={i * 0.12} className={l.indent}>
              <p className="max-w-[26ch] font-display text-[clamp(28px,3.6vw,52px)] font-extrabold leading-[1.12] text-ink-head/90">
                {l.text}
              </p>
            </Reveal>
          ))}
          <Reveal delay={0.24}>
            {/* R9: display, not serif (the serif accent retreats to quotes);
                orange-deep is fine here — this is large text (3:1 rule) */}
            <p className="font-display text-[clamp(26px,3.2vw,46px)] font-extrabold leading-[1.2] text-orange-deep">
              In all 10 languages you speak at home.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
