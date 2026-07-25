"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Site-wide observer for [data-reveal] elements (see Reveal.tsx).
 *
 *  Re-arms per route: this lives in the persistent root layout, so a
 *  client-side navigation swaps in a whole page of unobserved [data-reveal]
 *  nodes while the effect from the first mount is still the only one that ever
 *  ran. The directional room variants are `opacity: 0` until `.reveal-in`, so
 *  without the pathname dependency a client nav can land on an invisible page
 *  (same lesson as KheeluGuide's section sensing). */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("reveal-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }
      },
      // Fire as soon as any part clears the bottom 8% of the viewport, so
      // even fast scrolling never lands on unrevealed content.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
