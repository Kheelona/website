"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { label: string; panel: React.ReactNode };

/** The mockup's tab row + panel (redesign 2026-10), with the WAI-ARIA tabs
 *  pattern: one tab in the tab order, arrow keys move between tabs, and each
 *  panel is labelled by its tab. Panels stay in the DOM (hidden), so a crawler
 *  and a no-JS reader still get every panel's words. */
export function Tabs({
  items,
  label,
  className,
  panelClassName = "kh-panel",
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
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="kh-tabs"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
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
            className="kh-tab"
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
