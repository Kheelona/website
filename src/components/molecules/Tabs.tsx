"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PRESS_TINT } from "@/lib/interactions";

export type TabItem = { label: string; panel: React.ReactNode };

/** A row of tabs over one panel at a time (CMO merge, 2026-10-04: the
 *  mockup's age tabs, rebuilt on the v3 chip shape and the interaction
 *  contract instead of the branch's `kh-tabs` classes).
 *
 *  The WAI-ARIA tabs pattern: one tab in the tab order, arrow keys and
 *  Home/End move between tabs, each panel is labelled by its tab. EVERY panel
 *  stays in the DOM (`hidden`, never unmounted), so a crawler and a no-JS
 *  reader still get every panel's words, the same reason Faq moved to native
 *  `<details>` (V6). */
export function Tabs({
  items,
  label,
  className,
  panelClassName,
}: {
  items: readonly TabItem[];
  /** The tablist's accessible name. */
  label: string;
  className?: string;
  panelClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (to: number) => {
    const n = (to + items.length) % items.length;
    setActive(n);
    refs.current[n]?.focus();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="flex flex-wrap gap-2.5"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(active + 1);
          else if (e.key === "ArrowLeft") move(active - 1);
          else if (e.key === "Home") move(0);
          else if (e.key === "End") move(items.length - 1);
          else return;
          e.preventDefault();
        }}
      >
        {items.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            /* min-h-11: the 44px touch target. The selected tab is an ink
               fill with a white label (15.7:1); the others sit on white with
               ink text, like the parent-app chips. */
            className={cn(
              "min-h-11 rounded-full border px-5 text-[16px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
              PRESS_TINT,
              i === active
                ? "border-ink-head bg-ink-head text-white"
                : "border-line bg-white text-ink-head hover:border-ink-head",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {items.map((t, i) => (
        <div
          key={t.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          className={panelClassName}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
