import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Shape } from "@/components/ui/Shapes";
import { HeroGlowBackground } from "@/components/vendor/animate-ui/backgrounds/hero-glow";
import { PREORDER_HREF } from "@/lib/site";

/** Home S02, slimmed by founder decision (2026-07-07): headline, the lede,
 *  and the ask. The rest of the PDF hero paragraph continues verbatim in
 *  StagedIntro directly below, so the page still carries every sentence.
 *  R9 (founder 2026-07-10): the hero figure is the PRODUCT — the Lumi plush,
 *  Blue leads — not the mascot (reviewer: "the thing you're selling doesn't
 *  appear until well down the page"). Kheelu moved to guide roles; if the
 *  dormant 3D journey returns, the hero gets retuned in that pass (the old
 *  data-hero-fallback contract left with the mascot). This image is the
 *  page's LCP element. */
export function Hero() {
  return (
    <Section wash="cream" className="overflow-x-clip">
      {/* R6 signature backdrop: warm drifting glow (vendored calm rebuild,
          components/vendor/README.md). First child, so every later positioned
          sibling paints above it. */}
      <HeroGlowBackground />
      <Shape kind="flower5" color="#F1A23B" className="opacity-40 absolute left-[4%] top-[8%] w-[90px] md:w-[130px]" />
      <Shape kind="flower13" color="#3AA4E5" className="opacity-40 absolute right-[6%] top-[16%] w-[64px] md:w-[90px]" />
      <Shape kind="squircle" color="#1ABC9C" className="opacity-40 absolute -left-10 bottom-[20%] w-[120px] md:w-[180px]" />
      <Container className="relative grid min-h-[600px] items-center gap-8 py-10 md:grid-cols-[1.05fr_0.95fr]">
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
          {/* R9: the real launch cap (founder-supplied) leads the reassurance
              line; the rest stays verbatim (copy-reference.md). */}
          <p className="mt-4 text-[15px] text-ink-muted">
            First 500 units at ₹4,999. ₹9,999 after launch. No payment now. We
            hold the price, you hold your place.
          </p>
        </Reveal>
        <div className="relative flex justify-center self-end">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-140px] left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,162,59,0.16)_0%,rgba(241,162,59,0.3)_35%,transparent_70%)]"
          />
          <Image
            src="/product/lumi-blue.png"
            alt="Lumi, the sky blue talking plush toy, wearing its striped party hat"
            width={1113}
            height={1600}
            priority
            sizes="(max-width: 768px) 62vw, 340px"
            className="relative h-[380px] w-auto md:h-[470px]"
          />
        </div>
      </Container>
    </Section>
  );
}
