import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Reveal } from "@/components/ui/Reveal";
import { CompareTable } from "@/components/ui/CompareTable";

/** Home S07. Copy verbatim. */
export function Compare() {
  return (
    <Section wash="white">
      <CurveDivider from="cool" />
      <Container className="py-16 md:py-20">
        <Reveal>
          <h2 className="mb-2 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            How Lumi compares.
          </h2>
          <p className="mb-10 text-[clamp(18px,1.6vw,21px)]">
            A simple, honest look at what is out there.
          </p>
          <CompareTable />
        </Reveal>
      </Container>
    </Section>
  );
}
