import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { StageGate } from "@/features/ambient-stage";

export type LegalSection = { readonly h: string; readonly ps: readonly string[] };

/** The quiet legal-page shell (privacy + terms were byte-level clones of
 *  each other before R11): narrow measure, prose loop, and the mandatory
 *  reserve finale (#reserve must exist on every page — R9 law). Pages
 *  shrink to a data array + one call. */
export function LegalDoc({
  eyebrow = "The fine print, unfine",
  title,
  lede,
  sections,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <Section wash="cream">
        <Container className="py-14 md:py-16">
          <div className="mx-auto max-w-[760px]">
            <SectionHeading
              as="h1"
              eyebrow={eyebrow}
              title={title}
              titleClassName="mb-4"
              lede={lede}
              ledeClassName="text-[18px]"
            />
          </div>
        </Container>
      </Section>
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-12 md:py-16">
          <div className="mx-auto max-w-[720px]">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="mb-3 mt-9 font-display text-[24px] font-extrabold text-ink-head">
                  {s.h}
                </h2>
                {s.ps.map((p, i) => (
                  <p key={i} className="mb-4 text-[17px] leading-[1.65]">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <FinaleCTA variant="compact" from="white" />
      <StageGate stage="ambient" />
    </>
  );
}
