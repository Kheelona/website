import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { HeroStage } from "./HeroStage";
import { PREORDER_HREF, RESERVE_LABEL, CAP_LINE, LUMI_AGES } from "@/config/site";

/** Revamp M2 hero (theme B + founder brief pointer 2): minimal copy on the
 *  left, the Kheelu-talks-to-Lumi stage on the right. Sits directly on the
 *  SiteBackdrop (no wash) so the page opens INSIDE the world. The hero
 *  greets through the persistent guide via data-say (GATED:kheelu-line).
 *  V4 (team feedback 2026-07-30, founder decision D2): the tutor positioning
 *  leads. One button — the team asked for a single CTA — and the cap line is
 *  PROMOTED to a chip because "not clearly visible" was a direct finding.
 *  The three floating fact bubbles are gone (their claims live on in the
 *  audio room, the trust room, and the parents room). LCP law lives in
 *  HeroStage. */
export function Hero() {
  return (
    <section
      data-guide="hero-wink"
      data-say="Hi, I'm Kheelu. Come in, I'll show you around."
      className="relative overflow-x-clip"
    >
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-8 md:min-h-[560px] md:grid-cols-[1.02fr_0.98fr] md:py-10">
        <Reveal mode="rise" className="py-4 md:py-10">
          <span className="mb-5 inline-block rounded-full bg-orange/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-ink-head">
            For ages {LUMI_AGES}
          </span>
          {/* V4 hero (D2): the team's claim, polished to the voice law. Line
              one names the role parents are shopping for; line two keeps the
              brand's soul (a friend before a lesson) and the 40% fun in the
              positioning mix. Both halves are published behaviour. The
              5-second test: what it is (tutor in a plush), who it is for
              (2 to 5), the offer (cap chip), the risk (none, no payment). */}
          <h1 className="mb-5 font-display text-[clamp(38px,4.8vw,60px)] font-extrabold leading-[1.06] text-ink-head">
            Your kid&rsquo;s favourite tutor.{" "}
            <span className="block text-action-ink">Their best friend first.</span>
          </h1>
          <p className="mb-7 max-w-[42ch] text-[clamp(17px,1.5vw,20px)] text-ink">
            A smart plush companion that listens, remembers, and adapts. It
            guides your child through stories, numbers, and languages at their
            own natural speed.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          </div>
          <p className="mt-4 inline-block max-w-[44ch] rounded-2xl bg-yellow/15 px-4 py-2.5 text-[16px] font-semibold text-ink-head">
            {CAP_LINE}
          </p>
          <p className="mt-6 hidden text-[14px] font-semibold text-ink-muted md:block">
            Your guide is waiting in the corner. Give Kheelu a poke.
          </p>
        </Reveal>
        <HeroStage />
      </div>
    </section>
  );
}
