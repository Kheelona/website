import { Reveal } from "@/components/molecules/Reveal";
import { Card } from "@/components/molecules/Card";
import { GROWTH_ARC, GROWTH_HEDGE, GROWTH_CLOSING } from "@/lib/growth-arc";

/** The year-by-year growth room (BUILD-V6 D2) — the direct answer to the
 *  parent feedback "what will a kid who gets this end up with". Four
 *  static stage cards (registry Card, tilt default, NO press/lift — a card
 *  that does nothing when tapped must not pretend otherwise, V5-1), then the
 *  honest hedge, then the display line that re-homes the old tutor hero. */
export function GrowthArc() {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {GROWTH_ARC.map((s, i) => (
          <Reveal key={s.kicker} delay={i * 0.08}>
            <Card className="border border-line">
              <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
                {s.kicker}
              </p>
              <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">
                {s.title}
              </h3>
              <p className="text-[16px]">{s.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-6">
        <p className="text-[15px] text-ink-muted">{GROWTH_HEDGE}</p>
      </Reveal>
      <Reveal className="mt-8">
        <p className="max-w-[46ch] font-display text-[19px] font-bold text-ink-head">
          {GROWTH_CLOSING}
        </p>
      </Reveal>
    </div>
  );
}
