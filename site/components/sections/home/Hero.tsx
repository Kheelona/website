import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Shape } from "@/components/ui/Shapes";
import { MascotScene } from "@/components/mascot/MascotScene";
import { PREORDER_HREF } from "@/lib/site";

/** Home S02, slimmed by founder decision (2026-07-07): headline, the lede,
 *  and the ask. The rest of the PDF hero paragraph continues verbatim in
 *  StagedIntro directly below, so the page still carries every sentence. */
export function Hero() {
  return (
    <Section wash="cream" className="overflow-x-clip">
      <Shape kind="flower5" color="#F1A23B" className="absolute left-[4%] top-[8%] w-[90px] md:w-[130px]" />
      <Shape kind="flower13" color="#3AA4E5" className="absolute right-[6%] top-[16%] w-[64px] md:w-[90px]" />
      <Shape kind="squircle" color="#1ABC9C" className="absolute -left-10 bottom-[20%] w-[120px] md:w-[180px]" />
      <Container className="grid min-h-[600px] items-center gap-8 py-10 md:grid-cols-[1.05fr_0.95fr]">
        <Reveal mode="rise" className="py-6 md:py-14">
          <span className="mb-5 inline-block rounded-full bg-orange/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-ink-head">
            For ages 3 to 6
          </span>
          <h1 className="mb-5 font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.06] text-ink-head">
            The smartest way to grow your child&apos;s brain is to understand
            their heart.
          </h1>
          <p className="mb-8 max-w-[52ch] text-[clamp(18px,1.7vw,22px)]">
            Lumi is a screen-free AI robot toy that listens first, then talks
            back. Really talks.
          </p>
          <Button href={PREORDER_HREF}>Reserve Lumi at ₹4,999</Button>
          <p className="mt-4 text-[15px] text-ink-muted">
            ₹9,999 after launch. No payment now. We hold the price, you hold
            your place.
          </p>
        </Reveal>
        <div className="relative flex justify-center self-end">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,162,59,0.16)_0%,rgba(241,162,59,0.3)_35%,transparent_70%)]"
          />
          {/* Static LCP render; yields to the live model once the stage has
              painted (html.scene-3d, see globals.css). */}
          <div data-hero-fallback="">
            <MascotScene pose="hero-wink" width={290} parallax={48} priority className="relative" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
