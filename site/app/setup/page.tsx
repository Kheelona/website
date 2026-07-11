import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { StepList } from "@/components/ui/StepList";
import { Reveal } from "@/components/ui/Reveal";
import { MascotScene } from "@/components/mascot/MascotScene";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { FinaleCTA } from "@/components/sections/shared/FinaleCTA";
import { StageGate } from "@/components/three/StageGate";
import { SETUP_STEPS } from "@/lib/setup-steps";

export const metadata: Metadata = {
  title: "Setup: day one with Lumi",
  description:
    "How simple day one will be: charge Lumi, open the parent app, set your languages and topics, and let your child say hello.",
  alternates: { canonical: "/setup" },
};

/* Copy per prompt §5.2: show how simple day one will be. The steps moved to
   lib/setup-steps.ts in R9 — the Home "How it works" band renders the same
   four, so the sequences can never drift apart. */

export default function SetupPage() {
  return (
    <>
      <Section wash="cool">
        <PageHero
          media={<MascotScene pose="joy" width={300} parallax={34} priority />}
        >
          <SectionHeading
            as="h1"
            eyebrow="Day one"
            title="Set up in minutes. Then get out of the way."
            titleClassName="mb-5"
            lede="Lumi is made for homes, not IT departments. Day one is four small steps, and only one of them is yours to do alone."
            ledeClassName="max-w-[56ch]"
          />
        </PageHero>
      </Section>

      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <KheeluSays
            line="I will be right here while you set up."
            pose="curious"
          />
          {/* steps sit directly under the h1, so their titles are h2 */}
          <StepList items={SETUP_STEPS} as="h2" />
          <Reveal className="mt-8">
            {/* TODO(claims-specs): add wake word + charger details when final. */}
            <p className="max-w-[62ch] text-[16px] text-ink-muted">
              The exact wake word and charger details will be published here
              with the final specs, before Lumi ships.
            </p>
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="white" />
      <StageGate stage="ambient" />
    </>
  );
}
