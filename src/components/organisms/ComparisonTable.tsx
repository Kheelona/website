"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { COMPARISON_COLUMNS, COMPARISON_ROWS } from "@/lib/comparison";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

const OTHERS = COMPARISON_COLUMNS.slice(1);

/** Kheelu against the product types a parent weighs it with (content doc v7).
 *
 *  Phone (below 900px): a five-column table will not fit, so three chips swap
 *  the right-hand column and the Kheelu column stays on the left, tinted
 *  green; the page never scrolls sideways. Desktop: the whole table.
 *  Both are in the DOM, so a crawler and a no-JS reader get every cell. */
export function ComparisonTable() {
  const [other, setOther] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Phone: chips + two columns */}
      <div className="flex flex-col gap-4 min-[900px]:hidden">
        <div role="group" aria-label="Compare Kheelu with" className="flex flex-wrap gap-2">
          <span className="w-full text-[14px] font-semibold text-ink-head">Compare Kheelu with:</span>
          {OTHERS.map((c, i) => (
            <button
              key={c}
              type="button"
              aria-pressed={other === i}
              onClick={() => setOther(i)}
              className="min-h-11 rounded-full border border-line bg-surface px-3.5 text-[14px] font-semibold text-ink-head aria-[pressed=true]:border-ink aria-[pressed=true]:bg-ink aria-[pressed=true]:text-bg"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="overflow-hidden rounded-[18px] border border-line bg-surface">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  What matters
                </th>
                <th scope="col" className="bg-sage p-3 text-left font-bold text-ink-head">
                  Kheelu
                </th>
                <th scope="col" className="bg-bg p-3 text-left font-bold text-ink-head">
                  {OTHERS[other]}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th
                    scope="row"
                    className="w-[34%] p-3 text-left align-top font-semibold text-ink-head"
                  >
                    {r.label}
                  </th>
                  <td className="bg-sage/60 p-3 align-top font-semibold text-ink-head">{r.values[0]}</td>
                  <td className="p-3 align-top text-ink-muted">{r.values[other + 1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desktop: the whole table */}
      <div className="hidden overflow-hidden rounded-[18px] border border-line bg-surface min-[900px]:block">
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr>
              <th scope="col" className="bg-bg p-4 text-left">
                <span className="sr-only">What matters</span>
              </th>
              {COMPARISON_COLUMNS.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={cn("p-4 text-left font-bold text-ink-head", i === 0 ? "bg-sage" : "bg-bg")}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="p-4 text-left align-top font-semibold text-ink-head">
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={i}
                    className={cn(
                      "p-4 align-top",
                      i === 0 ? "bg-sage/60 font-semibold text-ink-head" : "text-ink-muted",
                    )}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="kh-note">
        Based on typical products in each group. See something out of date?{" "}
        <a href={SUPPORT_WHATSAPP_HREF} className="font-semibold text-ink-head underline underline-offset-4">
          Tell us on WhatsApp
        </a>
        .
      </p>
    </div>
  );
}
