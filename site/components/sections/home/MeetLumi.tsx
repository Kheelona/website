import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PREORDER_HREF } from "@/lib/site";

/** Home S05 (~40% of the page's weight). Copy verbatim. */
export function MeetLumi() {
  return (
    <Section wash="white" id="lumi">
      <CurveDivider from="cool" />
      <Container className="py-16 md:py-20">
        <div className="mb-16 grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          <Reveal className="relative flex justify-center py-6">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[42%_58%_55%_45%/48%_44%_56%_52%] bg-cream"
            />
            <Image
              src="/product/lumi-blue.png"
              alt="Lumi, a soft blue talking toy with a striped party hat"
              width={584}
              height={843}
              className="relative w-full max-w-[330px] drop-shadow-[0_20px_26px_rgba(41,160,215,0.16)]"
            />
          </Reveal>
          <Reveal>
            <h2 className="mb-5 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Meet Lumi. The friend who listens first.
            </h2>
            <p className="mb-4 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi is a smart toy for children aged 3 to 6. It is not a tablet.
              It is not a speaker. It is a talking toy that holds a real
              conversation with your child.
            </p>
            <p className="max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
              Say the wake word, and Lumi is ready. It asks questions. It
              remembers what your child said yesterday. It grows with them
              across the ages of 3 to 6.
            </p>
          </Reveal>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-(--radius-card) bg-cream p-9">
              <h3 className="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head">
                Screen-free. A real conversation.
              </h3>
              <p className="text-[16.5px]">
                No display. No video. Nothing to stare at. Just a voice that
                talks back. Made to be kept, not outgrown. Lumi adapts to where
                your child is, not just how old they are.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-(--radius-card) bg-cool p-9">
              <h3 className="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head">
                You see everything.
              </h3>
              <p className="text-[16.5px]">
                The parent app gives you a window into every conversation. A
                daily summary, the full conversation log, and complete control
                over topics, time, and languages.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal className="text-center">
          <Button href={PREORDER_HREF}>Reserve Lumi at ₹4,999</Button>
        </Reveal>
      </Container>
    </Section>
  );
}
