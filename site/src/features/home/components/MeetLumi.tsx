import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { KheeluSays } from "@/components/molecules/KheeluSays";
import { PREORDER_HREF, RESERVE_LABEL, LAUNCH_PRICE } from "@/config/site";

/** Home S05 (~40% of the page's weight). Copy verbatim.
 *  R8 (founder): the single-plush portrait is replaced by the chosen
 *  three-SKU shop format — all colors side by side, every card leading to
 *  the Lumi page. Cutouts from the sanctioned product pipeline. */
const SKUS = [
  {
    name: "Lumi Green",
    img: "/product/lumi-green.png",
    tint: "bg-teal/15",
    alt: "Lumi Green, the pastel green Lumi plush with a striped party hat",
    w: 1473,
    h: 1954,
  },
  {
    name: "Lumi Pink",
    img: "/product/lumi-pink.png",
    tint: "bg-purple/15",
    alt: "Lumi Pink, the soft pink Lumi plush with a striped party hat",
    w: 617,
    h: 932,
  },
  {
    name: "Lumi Blue",
    img: "/product/lumi-blue.png",
    tint: "bg-blue/15",
    alt: "Lumi Blue, the sky blue Lumi plush with a striped party hat",
    w: 1113,
    h: 1600,
  },
] as const;

export function MeetLumi() {
  return (
    <Section wash="white" id="lumi">
      <CurveDivider from="cool" />
      {/* R9 rhythm: tighter top/bottom — the divider + narrator bubble carry
          the transition (reviewer: near-blank viewports between sections) */}
      <Container className="pb-12 pt-10 md:pb-14 md:pt-12">
        <Reveal>
          <KheeluSays
            line="Meet Lumi, my newest friend. Pick your favourite colour."
            pose="joy"
          />
          <SectionHeading
            title="Meet Lumi. The friend who listens first."
            titleClassName="mb-5"
            lede="Lumi is a smart toy for children aged 3 to 6. It is not a tablet. It is not a speaker. It is a talking toy that holds a real conversation with your child."
            ledeClassName="mb-4 max-w-[62ch]"
          />
          <p className="mb-12 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Say the wake word, and Lumi is ready. It asks questions. It
            remembers what your child said yesterday. It grows with them
            across the ages of 3 to 6.
          </p>
        </Reveal>

        {/* The three SKUs, side by side (founder-picked card format) */}
        <div className="mb-14 grid gap-5 sm:grid-cols-3">
          {SKUS.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.06}>
              {/* no TiltCard: whole-card links must not move under the
                  cursor (TiltCard.tsx hard rule, R10) */}
              <div className="h-full">
                <Link
                  href="/products/lumi"
                  aria-label={`${s.name}: see Lumi and reserve at ${LAUNCH_PRICE}`}
                  className="block h-full overflow-hidden rounded-(--radius-card) border border-line-soft bg-white transition-shadow duration-300 ease-(--ease-calm) hover:shadow-[0_16px_32px_rgba(216,95,27,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  <div className={`grid h-[250px] place-items-center p-6 ${s.tint}`}>
                    <Image
                      src={s.img}
                      alt={s.alt}
                      width={s.w}
                      height={s.h}
                      sizes="(max-width: 640px) 80vw, 300px"
                      className="h-[200px] w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-3 p-6">
                    <h3 className="font-display text-[22px] font-extrabold text-ink-head">
                      {s.name}
                    </h3>
                    <p className="text-[16px] font-bold text-orange-deep">
                      {LAUNCH_PRICE} at launch
                    </p>
                  </div>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <Card
              tilt={false}
              className="bg-cream p-9"
              title="Screen-free. A real conversation."
              titleClassName="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head"
            >
              <p className="text-[16px]">
                No display. No video. Nothing to stare at. Just a voice that
                talks back. Made to be kept, not outgrown. Lumi adapts to where
                your child is, not just how old they are.
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <Card
              tilt={false}
              className="bg-cool p-9"
              title="You see everything."
              titleClassName="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-extrabold text-ink-head"
            >
              <p className="text-[16px]">
                The parent app gives you a window into every conversation. A
                daily summary, the full conversation log, and complete control
                over topics, time, and languages.
              </p>
            </Card>
          </Reveal>
        </div>

        <Reveal>
          <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          {/* R9: varied reassurance (reviewer: the full line repeated ×5
              verbatim read as a template; hero + finale keep it whole) */}
          <p className="mt-4 text-[15px] text-ink-muted">
            First 500 units at {LAUNCH_PRICE}. No payment now.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
