import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { MascotScene } from "@/components/mascot/MascotScene";

export default function NotFound() {
  return (
    <Section wash="cream">
      <Container className="grid min-h-[60vh] items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="mb-4 font-display text-[clamp(36px,4.5vw,56px)] font-extrabold leading-[1.08] text-ink-head">
            This page wandered off.
          </h1>
          <p className="mb-8 max-w-[48ch] text-[19px]">
            Even Curious gets lost sometimes. The good stuff is one tap away.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/">Back to the start</Button>
            <Button href="/products/lumi" variant="ghost">
              Meet Lumi
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <MascotScene pose="curious" width={280} parallax={0} />
        </div>
      </Container>
    </Section>
  );
}
