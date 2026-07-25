import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { HeroStage } from "./HeroStage";
import { PREORDER_HREF, RESERVE_LABEL, CAP_LINE } from "@/config/site";

/** Revamp M2 hero (theme B + founder brief pointer 2): minimal copy on the
 *  left, the Kheelu-talks-to-Lumi stage on the right. Sits directly on the
 *  SiteBackdrop (no wash) so the page opens INSIDE the world. The hero
 *  greets through the persistent guide via data-say (GATED:kheelu-line;
 *  sign-off queue in docs/revamp-2026-07/copy-v2.md).
 *  Copy: copy-v2 Home hero, all [seed]/[fact]. LCP law lives in HeroStage. */
export function Hero() {
  return (
    <section
      data-guide="hero-wink"
      data-say="Hi, I'm Kheelu. Come on in, I'll show you around."
      className="relative overflow-x-clip"
    >
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-8 md:min-h-[560px] md:grid-cols-[1.02fr_0.98fr] md:py-10">
        <Reveal mode="rise" className="py-4 md:py-10">
          <span className="mb-5 inline-block rounded-full bg-orange/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-ink-head">
            For ages 3 to 10
          </span>
          <h1 className="mb-5 font-display text-[clamp(38px,4.8vw,60px)] font-extrabold leading-[1.06] text-ink-head">
            A friend who listens.{" "}
            <span className="block text-action-ink">
              Made by people you can trust.
            </span>
          </h1>
          <p className="mb-7 max-w-[42ch] text-[clamp(17px,1.5vw,20px)] text-ink">
            Screen-free friends that talk with your child and grow with them.
            We do not sell your family&apos;s data.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
            <Button href="#warm" variant="ghost">
              Meet Kheelu
            </Button>
          </div>
          <p className="mt-4 max-w-[44ch] text-[15px] text-ink-muted">{CAP_LINE}</p>
          <p className="mt-6 hidden text-[14px] font-semibold text-ink-muted md:block">
            Your guide is waiting in the corner. Give Kheelu a poke.
          </p>
        </Reveal>
        <HeroStage />
      </div>
    </section>
  );
}
