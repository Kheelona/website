import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { Shape } from "@/components/atoms/Shapes";
import { HeroGlowBackground } from "@/components/vendor/animate-ui/backgrounds/hero-glow";
import { HeroConversation } from "@/features/home/components/HeroConversation";
import { PREORDER_HREF, RESERVE_LABEL, CAP_LINE } from "@/config/site";

/** Home S02 (R11, founder pick "show the conversation"): headline + ask on
 *  the left; the product DEMONSTRATING itself on the right — the plush with
 *  one real child-and-Lumi exchange playing out beneath it. The old lede
 *  rides under the exchange as its caption; the R10 folded paragraph moved
 *  to WhyWeExist (copy-reference R11). The plush Image stays the LCP
 *  element (R9: product owns the hero — that swap closed the mobile perf
 *  gate; do not reintroduce work before its paint). */
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
          <h1 className="mb-7 font-display text-[clamp(40px,5vw,64px)] font-extrabold leading-[1.06] text-ink-head">
            The smartest way to grow your child&apos;s brain is to understand
            their heart.
          </h1>
          <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          {/* R9 real cap, R11 compressed to one line ("we hold the price"
              closes the page at the finale — copy-reference R11) */}
          <p className="mt-4 max-w-[44ch] text-[15px] text-ink-muted">
            {CAP_LINE}
          </p>
        </Reveal>
        <div className="relative flex flex-col items-center self-center pb-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,162,59,0.16)_0%,rgba(241,162,59,0.3)_35%,transparent_70%)]"
          />
          {/* LCP law (R9, re-learned in R11 live verify): the plush must be
              the hero's LARGEST element so the priority image owns LCP. At
              300px it tied the H1 (~62k px² each) and the font-gated H1 won
              on phones — LCP 3.8s, mobile median 86. 340px restores a ~30%
              area margin (median back over the 90 gate). */}
          <Image
            src="/product/lumi-blue.png"
            alt="Lumi, the sky blue talking plush toy, wearing its striped party hat"
            width={1113}
            height={1600}
            priority
            sizes="(max-width: 768px) 58vw, 300px"
            className="relative h-[340px] w-auto md:h-[380px]"
          />
          <HeroConversation className="relative -mt-5 w-full max-w-[420px]" />
          {/* the PDF lede, now the demo's caption (left-aligned to the card
              edge — R5 law; copy-reference R11) */}
          <p className="relative mt-3 w-full max-w-[420px] text-[15px] text-ink-muted">
            Lumi is a screen-free AI robot toy that listens first, then talks
            back. Really talks.
          </p>
        </div>
      </Container>
    </Section>
  );
}
