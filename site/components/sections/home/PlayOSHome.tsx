import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Shape } from "@/components/ui/Shapes";
import { PREORDER_HREF } from "@/lib/site";

/** Home S06 (~40% of the page's weight). Copy verbatim. */
export function PlayOSHome() {
  return (
    <Section wash="cool" id="playos-home" className="overflow-x-clip">
      <CurveDivider from="white" />
      <Shape kind="flower13" color="#3AA4E5" className="absolute -right-14 top-24 w-[220px]" />
      <Container className="py-16 md:py-20">
        <Reveal>
          <h2 className="mb-4 max-w-[18ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            The technology behind the talking.
          </h2>
          <p className="mb-12 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Lumi runs on PlayOS, Kheelona&apos;s own voice engine built from
            the ground up for children aged 3 to 6. One platform. One set of
            safety rules. Every product in the family runs on the same soul.
          </p>
        </Reveal>
        {/* Numbered editorial rows (design review: breaks the tinted-card
            monotony mid-page; treatment borrowed from /playos). Copy verbatim. */}
        <ol className="mb-11 border-t border-line">
          <Reveal as="li" className="grid items-start gap-4 border-b border-line py-8 md:grid-cols-[80px_1fr_1.4fr] md:gap-7">
            <span aria-hidden="true" className="font-display text-4xl font-extrabold text-blue">01</span>
              <h3 className="font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-tight text-ink-head">
                Think about the device first.
              </h3>
              <p className="text-[16.5px]">
                When your child speaks, PlayOS processes the conversation on
                the device before anything goes anywhere. It reads the feeling
                behind the words, not just the words. Low latency. No long
                waits. No sending everything to a distant server.
              </p>
          </Reveal>
          <Reveal as="li" className="grid items-start gap-4 border-b border-line py-8 md:grid-cols-[80px_1fr_1.4fr] md:gap-7">
            <span aria-hidden="true" className="font-display text-4xl font-extrabold text-teal">02</span>
              <h3 className="font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-tight text-ink-head">
                Every response is the right response.
              </h3>
              <p className="text-[16.5px]">
                Before Lumi speaks, every response passes through an age-graded
                safety layer. On-device and cloud filters work together. No
                open internet. No random content. No surprises. PlayOS is what
                makes Lumi a cognitive development toy, not just a toy that
                plays sounds.
              </p>
          </Reveal>
        </ol>
        <Reveal className="flex flex-wrap items-center gap-5">
          <Button href={PREORDER_HREF}>Join the pre-order list</Button>
          <span className="text-[15px] text-ink-muted">
            Building on PlayOS? See{" "}
            <Link href="https://kheelona.ai" className="font-semibold text-blue">
              kheelona.ai
            </Link>
          </span>
        </Reveal>
      </Container>
    </Section>
  );
}
