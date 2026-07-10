import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

/** Home S03. Copy verbatim. */
export function WhyWeExist() {
  return (
    <Section wash="white">
      <CurveDivider from="cream" />
      <Container className="py-16 md:py-20">
        <Reveal>
          <Eyebrow>Why we exist</Eyebrow>
          <h2 className="mb-6 max-w-[21ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Your child&apos;s best years deserve more than a screen.
          </h2>
          <p className="mb-4 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Between the ages of 3 and 6, a child&apos;s brain builds faster
            than it ever will again. What they hear, what they feel, and who
            they talk to shape everything that follows.
          </p>
          <p className="max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Most toys do one thing. Screens do too much. Lumi does the one
            thing that matters: it listens to your child, understands how they
            feel, and talks back in a way that helps them grow.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
