import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { KheeluSays } from "@/components/ui/KheeluSays";
import { PREORDER_HREF } from "@/lib/site";

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
          <h2 className="mb-5 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
            Meet Lumi. The friend who listens first.
          </h2>
          <p className="mb-4 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Lumi is a smart toy for children aged 3 to 6. It is not a tablet.
            It is not a speaker. It is a talking toy that holds a real
            conversation with your child.
          </p>
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
              <TiltCard className="h-full">
                <Link
                  href="/products/lumi"
                  aria-label={`${s.name}: see Lumi and reserve at ₹4,999`}
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
                      ₹4,999 at launch
                    </p>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
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

        <Reveal>
          <Button href={PREORDER_HREF}>Reserve Lumi at ₹4,999</Button>
          {/* R9: varied reassurance (reviewer: the full line repeated ×5
              verbatim read as a template; hero + finale keep it whole) */}
          <p className="mt-4 text-[15px] text-ink-muted">
            First 500 units at ₹4,999. No payment now.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
