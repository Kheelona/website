import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Reveal } from "@/components/molecules/Reveal";
import { KheeluSays } from "@/components/molecules/KheeluSays";

/** R7: the "first question, answered" callout from the kheelona.ai home page.
 *  Body line verbatim (founder: "this is a strong line, we should include
 *  it"). Teal-deep lead instead of raw teal: 5.47:1 on white. R9: the lead
 *  is all display (serif retreats to quotes); Kheelu hands the section to
 *  the parents. */
export function SafetyCallout() {
  return (
    <Section wash="cool">
      <CurveDivider from="white" />
      <Container className="pb-12 pt-4 md:pb-14">
        <Reveal>
          <KheeluSays
            line="This part is for your grown-ups. It matters the most."
            pose="bliss"
          />
        </Reveal>
        <Reveal>
          <div className="items-center gap-8 rounded-(--radius-card-lg) border border-teal-deep/40 bg-white p-7 md:flex md:p-9">
            <p className="mb-4 max-w-[13ch] shrink-0 font-display text-[26px] font-extrabold leading-[1.15] text-teal-deep md:mb-0">
              The first question, answered
            </p>
            {/* R11 voice-lint: "it's" de-contracted — the .ai line arrived
                verbatim, but the contraction gate outranks the reference
                (founder can revert on live read; copy-reference R11) */}
            <p className="mb-5 max-w-[58ch] text-[17px] md:mb-0">
              In 2026, the first question about any AI toy is whether it is
              safe. We built the answer into the OS, so safety is the first
              thing you point to, not the last thing you worry about.
            </p>
            <Link
              href="/safety"
              className="inline-flex shrink-0 items-center gap-1.5 rounded font-bold text-orange-deep underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
            >
              See how we built safety in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
