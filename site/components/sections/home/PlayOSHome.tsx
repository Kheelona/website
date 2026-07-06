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
        <div className="mb-11 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-(--radius-card) bg-white p-9">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue/15">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#29A0D7" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="5" y="3" width="14" height="18" rx="3" />
                  <circle cx="12" cy="17" r="1.4" fill="#29A0D7" stroke="none" />
                </svg>
              </div>
              <h3 className="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head">
                Think about the device first.
              </h3>
              <p className="text-[16.5px]">
                When your child speaks, PlayOS processes the conversation on
                the device before anything goes anywhere. It reads the feeling
                behind the words, not just the words. Low latency. No long
                waits. No sending everything to a distant server.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-(--radius-card) bg-white p-9">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-teal/15">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#1ABC9C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head">
                Every response is the right response.
              </h3>
              <p className="text-[16.5px]">
                Before Lumi speaks, every response passes through an age-graded
                safety layer. On-device and cloud filters work together. No
                open internet. No random content. No surprises. PlayOS is what
                makes Lumi a cognitive development toy, not just a toy that
                plays sounds.
              </p>
            </div>
          </Reveal>
        </div>
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
