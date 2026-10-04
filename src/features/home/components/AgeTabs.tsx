import { Tabs } from "@/components/molecules/Tabs";
import { GROWTH_ARC } from "@/lib/growth-arc";

/* "At 3 years" → "Age 3": the mockup's tab wording, derived from the arc. */
const tabLabel = (kicker: string) => kicker.replace(/^At (\d+) years$/, "Age $1");

/** What Kheelu looks like at each age (CMO merge, 2026-10-04: the mockup's
 *  age tabs). The words are the PUBLISHED growth arc (`lib/growth-arc.ts`),
 *  not the mockup's draft, which the mockup itself flagged as unconfirmed.
 *  Home shows the three named ages; the open-ended "every year after" stage
 *  lives with the full arc on /how, where there is room for it. */
export function AgeTabs() {
  return (
    <Tabs
      label="Ages"
      items={GROWTH_ARC.slice(0, 3).map((s) => ({
        label: tabLabel(s.kicker),
        panel: (
          <>
            <h4 className="mb-2 font-display text-[21px] font-extrabold leading-snug text-ink-head">
              {s.title}
            </h4>
            <p className="max-w-[58ch] text-[16px]">{s.body}</p>
          </>
        ),
      }))}
    />
  );
}
