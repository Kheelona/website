import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CompareTable } from "@/components/ui/CompareTable";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION } from "@/lib/site";

/** Home S07. Copy verbatim. */
export function Compare() {
  return (
    <Section wash="white">
      <CurveDivider from="cool" />
      {/* R9 rhythm: shorter tail into the safety callout */}
      <Container className="pb-12 pt-16 md:pb-14 md:pt-20">
        <Reveal>
          <SectionHeading
            title="How Lumi compares."
            titleClassName="mb-2"
            lede="A simple, honest look at what is out there."
            ledeClassName="mb-10"
          />
          <CompareTable />
        </Reveal>
        {/* the table is the conviction peak; give it an action (UX panel
            2026-07-10). R9: reassurance trimmed — the full line lives at the
            hero and finale only (reviewer: ×5 verbatim repeats). */}
        <Reveal className="mt-10">
          <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          <p className="mt-4 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
        </Reveal>
      </Container>
    </Section>
  );
}
