"use client";

import { useEffect, useState } from "react";
import { LAUNCH_PRICE, PREORDER_HREF } from "@/lib/site";

/** Mobile-only sticky reserve bar (CMO review: the finale is many screens deep).
 *  Hides itself while the #reserve section is on screen. */
export function StickyMobileCTA() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("reserve");
    if (!target) return;
    const io = new IntersectionObserver(
      (entries) => setHidden(entries.some((e) => e.isIntersecting)),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
      <a
        href={PREORDER_HREF}
        className="block rounded-full border-2 border-white bg-orange px-6 py-4 text-center text-[16px] font-bold leading-none text-ink-head shadow-cta"
      >
        Reserve at {LAUNCH_PRICE}. No payment now.
      </a>
    </div>
  );
}
