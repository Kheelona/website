import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MascotScene } from "@/components/mascot/MascotScene";

export default function NotFound() {
  return (
    <Section wash="cream">
      <Container className="grid min-h-[60vh] items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <SectionHeading
            as="h1"
            title="This page wandered off."
            titleClassName="mb-4"
            lede="Even Curious gets lost sometimes. The good stuff is one tap away."
            ledeClassName="mb-8 max-w-[48ch] text-[19px]"
          />
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
