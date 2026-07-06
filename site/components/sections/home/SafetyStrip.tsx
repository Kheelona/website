import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { MascotScene } from "@/components/mascot/MascotScene";

/** Home S08 (~20% of the page's weight). Copy verbatim. */
export function SafetyStrip() {
  return (
    <Section wash="teal" id="safety-strip">
      <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
        <Reveal>
          <h2 className="mb-6 max-w-[16ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-white">
            Safe in their hands. Careful with their words.
          </h2>
          <p className="mb-3 max-w-[62ch] text-[17.5px] text-white/95">
            Lumi listens only when your child says the wake word. The
            microphone is off the rest of the time.
          </p>
          <p className="mb-3 max-w-[62ch] text-[17.5px] text-white/95">
            Every conversation passes a safety check before Lumi speaks. You
            can read and delete any conversation with one tap.
          </p>
          <p className="mb-6 max-w-[62ch] text-[17.5px] text-white/95">
            Your child&apos;s voice data is never sold.
          </p>
          <Button href="/safety" variant="teal">
            Read how we built safety in
          </Button>
        </Reveal>
        <Reveal className="flex justify-center">
          <MascotScene pose="bliss" width={280} parallax={30} />
        </Reveal>
      </Container>
    </Section>
  );
}
