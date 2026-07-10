import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CompareTable } from "@/components/ui/CompareTable";
import { PREORDER_HREF } from "@/lib/site";

/** Home S07. Copy verbatim. */
export function Compare() {
  return (
    <Section wash="white">
      <CurveDivider from="cool" />
      {/* R9 rhythm: shorter tail into the safety callout */}
      <Container className="pb-12 pt-16 md:pb-14 md:pt-20">
        <Reveal>
          <h2 className="mb-2 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            How Lumi compares.
          </h2>
          <p className="mb-10 text-[clamp(18px,1.6vw,21px)]">
            A simple, honest look at what is out there.
          </p>
          <CompareTable />
        </Reveal>
        {/* the table is the conviction peak; give it an action (UX panel
            2026-07-10). R9: reassurance trimmed — the full line lives at the
            hero and finale only (reviewer: ×5 verbatim repeats). */}
        <Reveal className="mt-10">
          <Button href={PREORDER_HREF}>Reserve Lumi at ₹4,999</Button>
          <p className="mt-4 text-[15px] text-ink-muted">
            ₹9,999 after launch. No payment now.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
