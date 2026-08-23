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
  /** Shared across the list = exclusive open. One list per page today, so the
   *  default is fine; pass a distinct name if a page ever renders two. */
  name = "faq",
}: {
  items: FaqEntry[];
  name?: string;
}) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-(--radius-card) bg-white">
      {items.map((item, i) => (
        <details
          key={item.q}
          name={name}
          open={i === 0}
          className="faq-disclosure group"
        >
          <summary
            className={`flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-ink-head transition-colors hover:text-orange-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-inset [&::-webkit-details-marker]:hidden ${PRESS_TINT}`}
          >
            <h3 className="font-display text-[20px] font-bold">{item.q}</h3>
            <Plus
              aria-hidden="true"
              className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          <p className="px-6 pb-6 text-[16.5px] text-ink">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
