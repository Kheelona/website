import { Check, Play } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { HeroStage } from "./HeroStage";
import {
  PREORDER_HREF,
  RESERVE_LABEL,
  PREORDER_OFFER_LINES,
  KHEELU_AGES,
  KHEELU_LANGUAGES,
} from "@/config/site";
import { hasVideoMoments } from "@/lib/video-moments";

/** The four things a parent checks before anything else (CMO merge,
 *  2026-10-04: the mockup's hero ticks). The language count is derived, so
 *  a ninth language needs no copy edit here. The same four facts are rows of
 *  the comparison further down, which the founder kept on purpose. */
export const HERO_TICKS = [
  "No screen, ever",
  `${KHEELU_LANGUAGES.length} home languages`,
  "No open internet",
  "Parents see everything",
] as const;

/** The research-anchored lead (founder decision 4, 2026-10-04): conversation
 *  helps a young brain grow, and Kheelu gives a child more of it. It never
 *  says Kheelu grows the brain, because the /how page states plainly that
 *  nobody has shown that yet, and the two pages must not disagree. */
export const HERO_LEAD =
  "Kheelu is a screen-free AI toy that answers your child's questions, then asks one back. It gives your child more of the back-and-forth conversation that helps a young brain grow.";

/** The Home hero (CMO merge, 2026-10-04): the mockup's sales-first hero,
 *  which the founder approved in its fuller form on 2026-10-02, on the v3
 *  hero grid. Two things are kept from the V6 hero on purpose:
 *  - THE OFFER CARD, one clause per line (founder, 2026-08-23). It carries the
 *    500-unit urgency, which the team once flagged as "not clearly visible";
 *    the mockup's small price caption alone would have buried it again.
 *  - HeroStage, unchanged. The priority plush image stays the hero's LARGEST
 *    element and owns the mobile LCP (two live regressions taught this).
 *  The outcome promise HERO_PROMISE leaves the hero; PacePanel still renders
 *  it on the Kheelu page, and the growth-arc closing line keeps the tutor
 *  idea on Home. */
export function Hero() {
  return (
    <section className="relative overflow-x-clip">
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-[clamp(20px,5vw,64px)] py-8 md:min-h-[560px] md:grid-cols-[1.02fr_0.98fr] md:py-10">
        <Reveal mode="rise" className="py-4 md:py-10">
          <span className="mb-5 inline-block rounded-full bg-orange/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] text-ink-head">
            AI toy for growing minds · Ages {KHEELU_AGES}
          </span>
          {/* Two sentences, two lines, the second in the action ink: the same
              rhythm and two-colour treatment the V6 hero established. */}
          <h1 className="mb-5 text-balance font-display text-[clamp(38px,4.8vw,60px)] font-extrabold leading-[1.06] text-ink-head">
            Screens make children watch.{" "}
            <span className="block text-action-ink">Kheelu makes them think.</span>
          </h1>
          <p className="mb-7 max-w-[46ch] text-[clamp(17px,1.5vw,20px)] text-ink">{HERO_LEAD}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Button href={PREORDER_HREF} track="hero">
              {RESERVE_LABEL}
            </Button>
            {/* Only while there are films to watch: a button promising a film
                above no film would be a lie the page tells by itself (§8.37-d). */}
            {hasVideoMoments() ? (
              <Button href="#watch" variant="ghost">
                <Play className="mr-2 h-[18px] w-[18px]" fill="currentColor" aria-hidden="true" />
                Watch a child meet Kheelu
              </Button>
            ) : null}
          </div>
          <p className="mt-4 inline-block max-w-[46ch] rounded-2xl border border-line bg-white px-4 py-3 text-[16px] font-semibold text-ink-head shadow-(--shadow-room-sm)">
            {PREORDER_OFFER_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
          <ul className="mt-5 grid max-w-[460px] grid-cols-2 gap-2.5">
            {HERO_TICKS.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-[15px] font-semibold text-ink-head"
              >
                <Check className="h-4 w-4 shrink-0 text-orange-ink" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
        <HeroStage />
      </div>
    </section>
  );
}
