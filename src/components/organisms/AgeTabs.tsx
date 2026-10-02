import { Tabs } from "@/components/molecules/Tabs";
import { GROWTH_ARC } from "@/lib/growth-arc";

/* "At 3 years" → "Age 3": the mockup's tab wording, derived from the arc. */
const tabLabel = (kicker: string) => kicker.replace(/^At (\d+) years$/, "Age $1");

/** What Kheelu looks like at each age (the mockup's age tabs). The words are
 *  the published growth arc (`lib/growth-arc.ts`), not the mockup's draft,
 *  which the mockup itself flagged as unconfirmed. The open-ended last stage
 *  stays on the /how page, where there is room for it. */
export function AgeTabs() {
  return (
    <Tabs
      label="Ages"
      items={GROWTH_ARC.slice(0, 3).map((s) => ({
        label: tabLabel(s.kicker),
        panel: (
          <>
            <h3 className="kh-h3">{s.title}</h3>
            <p className="kh-body">{s.body}</p>
          </>
        ),
      }))}
    />
  );
}
