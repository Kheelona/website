import { Plus } from "lucide-react";
import { PRESS_TINT } from "@/lib/interactions";

export type FaqEntry = { q: string; a: string };

/** FAQ disclosure list on the browser's OWN `<details>`/`<summary>`
 *  (V6 handoff, founder decision 2026-07-31 — replaces the Radix accordion).
 *
 *  WHY IT CHANGED. The Radix version only rendered the OPEN answer, so Home's
 *  eight questions served exactly ONE answer in the HTML: a reader with
 *  JavaScript off, and any AI crawler that does not execute JS, got the
 *  questions and nothing else. The FAQPage schema carried all eight, which kept
 *  Google happy and hid the gap from every earlier check. Native details puts
 *  every answer in the markup, expands with zero JS, and lets this component
 *  ship no client JavaScript at all.
 *
 *  The `name` attribute buys the exclusive one-open-at-a-time behaviour that
 *  Radix's `type="single"` provided, natively; where a browser does not support
 *  it yet, several rows may sit open, which costs nothing. The open/close height
 *  animation rides `::details-content` where supported (globals.css) and is
 *  instant elsewhere. The question stays an `<h3>` inside the `<summary>`, so
 *  the question-led heading outline the AEO work depends on is unchanged, and
 *  the summary keeps the shared PRESS_TINT so touch still answers (§8.23-1).
 *
 *  `ArchitectureStack` deliberately KEEPS the Radix accordion: its rows are a
 *  layered diagram where roving arrow keys earn the JavaScript. */
export function Faq({
  items,
  name = "faq",
  openFirst = true,
}: {
  items: FaqEntry[];
  name?: string;
  /** The mockup opens the first question on Home and none on /faq. */
  openFirst?: boolean;
}) {
  /* Redesign 2026-10 (the mockup's FAQ): one bordered card per question,
     a + that turns into ×. Still native <details> with a shared `name`, so it
     works without JavaScript and opens one answer at a time (§8.24-6). */
  return (
    <div className="flex max-w-[820px] flex-col gap-2.5">
      {items.map((item, i) => (
        <details
          key={item.q}
          name={name}
          open={openFirst && i === 0}
          className="faq-disclosure group rounded-2xl border border-line bg-surface"
        >
          <summary
            className={`flex min-h-[58px] cursor-pointer list-none items-center justify-between gap-3 px-[18px] py-3.5 text-ink-head focus-visible:outline-3 focus-visible:outline-accent [&::-webkit-details-marker]:hidden ${PRESS_TINT}`}
          >
            <h3 className="text-[17px] font-semibold leading-snug">{item.q}</h3>
            <Plus
              aria-hidden="true"
              className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="px-[18px] pb-[18px] text-[16px] leading-[1.6] text-ink-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
