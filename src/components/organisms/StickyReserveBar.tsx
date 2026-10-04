"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import {
  PREORDER_HREF,
  RESERVE_SHORT_LABEL,
  TOKEN_PRICE,
  SHIP_DATE_TEXT,
} from "@/config/site";

/** "20 October 2026" → "20 October": the bar has one line of room. */
const SHIP_SHORT = SHIP_DATE_TEXT.replace(/\s\d{4}$/, "");

/** The phone-only reserve bar (CMO merge, 2026-10-04). It replaces the Kheelu
 *  guide's mobile dock, which the founder retired with the guide, and it
 *  INHERITS the dock's contract, the one the CMO branch's version lost: it
 *  hides while the `#reserve` finale is on screen, because a second reserve
 *  button floating over the one being read is noise (the StickyMobileCTA
 *  lesson, 2026-07-10). It also hides over the footer, so the seller-of-record
 *  lines are never covered.
 *
 *  Re-armed on every route change: client navigation swaps the page's
 *  `#reserve` node, and an observer on the old one would watch nothing.
 *
 *  `track="sticky-bar"` is the PostHog `cta` value (§8.40-h). The dock never
 *  carried one, so this is the first time this surface is measurable. */
export function StickyReserveBar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
    const targets = [document.getElementById("reserve"), document.querySelector("footer")].filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setHidden(visible.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center gap-3 px-4 pb-[calc(10px+env(safe-area-inset-bottom,0px))] pt-2.5">
        <p className="min-w-0 flex-1 text-[13px] leading-[1.3] text-ink-muted">
          <span className="block font-display text-[15px] font-bold text-ink-head">
            {TOKEN_PRICE} reserves Kheelu
          </span>
          Refundable. Ships from {SHIP_SHORT}.
        </p>
        <Button
          href={PREORDER_HREF}
          track="sticky-bar"
          className="shrink-0 px-5 py-3 text-[15px]"
        >
          {RESERVE_SHORT_LABEL}
        </Button>
      </div>
    </div>
  );
}
