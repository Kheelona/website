import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Shape } from "@/components/ui/Shapes";
import { MascotScene } from "@/components/mascot/MascotScene";
import { PREORDER_HREF } from "@/lib/site";

/** Home S02. Copy verbatim from the homepage content doc (₹ per prompt §1.10). */
export function Hero() {
  return (
    <Section wash="cream" className="overflow-x-clip">
      <Shape kind="flower5" color="#F1A23B" className="absolute left-[4%] top-[8%] w-[90px] md:w-[130px]" />
      <Shape kind="flower13" color="#3AA4E5" className="absolute right-[6%] top-[16%] w-[64px] md:w-[90px]" />
      <Shape kind="squircle" color="#1ABC9C" className="absolute -left-10 bottom-[20%] w-[120px] md:w-[180px]" />
      <Container className="grid min-h-[560px] items-center gap-8 py-10 md:grid-cols-[1.15fr_0.85fr]">
        <Reveal mode="rise" className="py-6 md:py-14">
          <span className="mb-5 inline-block rounded-full bg-orange/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-ink-head">
            For ages 3 to 6
          </span>
          <h1 className="mb-5 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
            The smartest way to grow your child&apos;s brain is to understand
            their heart.
          </h1>
          <p className="mb-3 max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
            Lumi is a screen-free AI robot toy that listens first, then talks
            back. Really talks. In the years a brain grows fastest. The more
            Lumi understands how your child feels, the more they learn.
          </p>
          <p className="mb-7 text-[clamp(18px,1.6vw,21px)] font-semibold text-ink-head">
            In all 10 languages you speak at home.
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
            className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,162,59,0.15)_0%,rgba(241,162,59,0.28)_35%,transparent_70%)]"
          />
          {/* Interim static mascot; the R3F hero scene replaces this slot
              once the regenerated GLB lands (visual-rework sprint 3). */}
          <MascotScene pose="hero-wink" width={360} parallax={24} priority className="relative" />
        </div>
      </Container>
    </Section>
  );
}
