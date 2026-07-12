"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LAUNCH_PRICE, PREORDER_HREF } from "@/config/site";

/** Mobile-only sticky reserve bar (CMO review: the finale is many screens deep).
 *  R5 (founder 2026-07-10): the pre-order CTA stays visible through the ENTIRE
 *  journey — the duck-on-scroll behavior is retired. The one exception is while
 *  the #reserve form itself is on screen: a button pointing at the form the
 *  reader is already looking at is noise, not access. */
export function StickyMobileCTA() {
  const pathname = usePathname();
  const [reserveVisible, setReserveVisible] = useState(false);

  useEffect(() => {
    // Re-keyed by pathname: this component lives in the persistent root
    // layout, and every client-side navigation replaces the #reserve node
    // (QA 2026-07-10 -- stale observers left the bar sitting on the form).
    const reserve = document.getElementById("reserve");
    setReserveVisible(false);
    if (!reserve) return;
    const io = new IntersectionObserver(
      (entries) => setReserveVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(reserve);
    return () => io.disconnect();
  }, [pathname]);

  if (reserveVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <a
        href={PREORDER_HREF}
        // white label on orange-cta #C25210 (4.66:1): the R5 white-label rule
        className="block rounded-full border-2 border-white bg-orange-cta px-6 py-4 text-center text-[16px] font-bold leading-none text-white shadow-cta"
      >
        Reserve at {LAUNCH_PRICE}. No payment now.
      </a>
    </div>
  );
}
