import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { HeroStage } from "./HeroStage";
import { PREORDER_HREF, RESERVE_LABEL, CAP_LINE, LUMI_AGES } from "@/config/site";
import { lumiAgeEndpoints } from "@/lib/growth-arc";

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
  const [ageStart, ageEnd] = lumiAgeEndpoints();
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
          {/* V6 hero (BUILD-V6 D1, founder-approved): the outcome arc. It
              answers the feedback that drove this round ("what will a kid who
              gets this at 2 GET at 5") in the first two lines of the site.
              The tutor claim moved out of the hero (it confused readers) and
              lives in Compare, PacePanel, the growth room's closing line, and
              the metadata title (BUILD-V6 §1). Ages render from LUMI_AGES via
              lumiAgeEndpoints. The 5-second test still holds: what it is
              (a friend that gives a head start), who it is for (2 to 5), the
              offer (cap card), the risk (none, no payment). Two lines per
              sentence is still the rhythm, paired with the two-colour
              treatment; `text-balance` keeps the pairs even. */}
          <h1 className="mb-5 text-balance font-display text-[clamp(38px,4.8vw,60px)] font-extrabold leading-[1.06] text-ink-head">
            A best friend at {ageStart}.{" "}
            <span className="block text-action-ink">A head start by {ageEnd}.</span>
          </h1>
          <p className="mb-7 max-w-[42ch] text-[clamp(17px,1.5vw,20px)] text-ink">
            Lumi listens, remembers, and grows with your child. Stories,
            numbers, and the languages you speak at home, at their pace.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          </div>
          {/* V5-5: `bg-yellow/15` on the warm backdrop was nearly the same
              value as the page behind it, so the offer still did not read —
              which is what the team meant by "not clearly visible", and what
              V4's chip only half-fixed. White card + a keyline lifts it off the
              wash without adding another colour to the palette. */}
          <p className="mt-4 inline-block max-w-[46ch] rounded-2xl border border-line-soft bg-white px-4 py-3 text-[16px] font-semibold text-ink-head shadow-(--shadow-room-sm)">
            {CAP_LINE}
          </p>
          {/* V5-5: "Your guide is waiting in the corner. Give Kheelu a poke."
              was REMOVED here. It became literally untrue the moment the guide
              started holding back during the hero — it pointed at an empty
              corner. It was also the kind of line that explains the interface
              instead of selling the product, and Kheelu introduces himself with
              a speech bubble the moment he does arrive. */}
        </Reveal>
        <HeroStage />
      </div>
    </section>
  );
}
