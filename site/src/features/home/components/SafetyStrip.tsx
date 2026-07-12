import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { MascotScene } from "@/components/organisms/MascotScene";

/** Home S08 (~20% of the page's weight). Copy verbatim. */
export function SafetyStrip() {
  return (
    <Section wash="teal" id="safety-strip">
      <CurveDivider from="cool" />
      <Container className="grid items-center gap-10 pb-16 pt-6 md:grid-cols-[1.2fr_0.8fr] md:pb-20 md:pt-8">
        <Reveal>
          <SectionHeading
            tone="white"
            title="Safe in their hands. Careful with their words."
            titleClassName="mb-6 max-w-[16ch]"
          />
          <p className="mb-3 max-w-[62ch] text-[17px] text-white">
            Lumi listens only when your child says the wake word. The
            microphone is off the rest of the time.
          </p>
          <p className="mb-3 max-w-[62ch] text-[17px] text-white">
            Every conversation passes a safety check before Lumi speaks. You
            can read and delete any conversation with one tap.
          </p>
          <p className="mb-6 max-w-[62ch] text-[17px] text-white">
            Your child&apos;s voice data is never sold.
          </p>
          <Button href="/safety">Read how we built safety in</Button>
        </Reveal>
        <Reveal className="flex justify-center">
          <MascotScene pose="bliss" width={280} parallax={30} />
        </Reveal>
      </Container>
    </Section>
  );
}
