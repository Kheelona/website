"use client";

import { useState } from "react";

export type FaqEntry = { q: string; a: string };

/** Accessible FAQ accordion (native disclosure pattern, keyboard-friendly). */
export function Faq({ items }: { items: FaqEntry[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line-soft rounded-(--radius-card) bg-white">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIdx(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-display text-[20px] font-bold text-ink-head transition-colors hover:text-orange-deep"
              >
                {item.q}
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                >
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </h3>
            {open && (
              <p className="px-6 pb-6 text-[16.5px] text-ink">{item.a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
