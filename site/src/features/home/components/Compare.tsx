import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { CompareTable } from "@/components/molecules/CompareTable";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION } from "@/config/site";

/** The honest-comparison moment (kept by founder brief pointer 6; table
 *  wording went parent-first in M2). `bare` renders content-only for the
 *  Room grammar; the legacy Section shell remains for non-room routes. */
export function Compare({ bare = false }: { bare?: boolean }) {
  const content = (
    <>
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
          hero and finale only. */}
      <Reveal className="mt-10">
        {/* V3: the line that reframes the price against what a parent already
            pays for tutoring, without attacking tutors (the Khanmigo lesson —
            position as always-available, not as cheaper) */}
        <p className="mb-6 max-w-[42ch] font-display text-[19px] font-bold text-ink-head">
          A tutor runs out of time and patience. Lumi does not.
        </p>
        <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
        <p className="mt-4 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
      </Reveal>
    </>
  );

  if (bare) return content;

  return (
    <Section wash="white">
      <CurveDivider from="cool" />
      <Container className="pb-12 pt-16 md:pb-14 md:pt-20">{content}</Container>
    </Section>
  );
}
