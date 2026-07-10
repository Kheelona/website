import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { KheeluSays } from "@/components/ui/KheeluSays";

/** Home S03. Copy verbatim — R8 restaged as an editorial spread (founder:
 *  the single text column read as an unstructured wall). The statement owns
 *  the left, the argument owns the right, and the strongest sentence gets
 *  the accent register (display since R9 — serif retreats to quotes).
 *  No sentence changed. */
export function WhyWeExist() {
  return (
    <Section wash="white">
      <CurveDivider from="cream" />
      <Container className="py-16 md:py-20">
        <Reveal>
          <KheeluSays line="Let me tell you why we made Lumi." pose="curious" />
        </Reveal>
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <Reveal>
            <Eyebrow>Why we exist</Eyebrow>
            <h2 className="max-w-[15ch] font-display text-[clamp(34px,4.4vw,56px)] font-extrabold leading-[1.08] text-ink-head">
              Your child&apos;s best years deserve more than a screen.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="md:pt-12">
            <p className="mb-5 max-w-[44ch] border-l-[3px] border-orange pl-5 font-display text-[clamp(21px,2.2vw,27px)] font-bold leading-[1.35] text-ink-head">
              Between the ages of 3 and 6, a child&apos;s brain builds faster
              than it ever will again.
            </p>
            <p className="mb-4 max-w-[54ch] text-[clamp(18px,1.6vw,21px)]">
              What they hear, what they feel, and who they talk to shape
              everything that follows.
            </p>
            <p className="max-w-[54ch] text-[clamp(18px,1.6vw,21px)]">
              Most toys do one thing. Screens do too much. Lumi does the one
              thing that matters: it listens to your child, understands how
              they feel, and talks back in a way that helps them grow.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
