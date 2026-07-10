"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LAUNCH_PRICE, PREORDER_HREF } from "@/lib/site";

/** Mobile-only sticky reserve bar (CMO review: the finale is many screens deep).
 *  Hides itself while the #reserve section is on screen, and ducks away while
 *  the reader scrolls down (UX panel 2026-07-10: a bar that never leaves eats
 *  ~90px of every stopping point) — it returns on the first scroll up. */
export function StickyMobileCTA() {
  const pathname = usePathname();
  const [reserveVisible, setReserveVisible] = useState(false);
  const [ducked, setDucked] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    // hide while the reserve section OR the footer is on screen: the bar has
    // no job over the form itself, and it must not sit on the footer's print.
    // Re-keyed by pathname: this component lives in the persistent root
    // layout, and every client-side navigation replaces the #reserve node
    // (QA 2026-07-10 -- stale observers left the bar sitting on the form).
    const targets = [document.getElementById("reserve"), document.querySelector("footer")]
      .filter(Boolean) as Element[];
    setReserveVisible(false);
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
        setReserveVisible(visible.size > 0);
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    lastY.current = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const dy = y - lastY.current;
        // small dead-band so tiny jitters don't toggle it
        if (dy > 8 && y > 400) setDucked(true);
        else if (dy < -8 || y <= 400) setDucked(false);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  if (reserveVisible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 p-3 transition-transform duration-300 ease-(--ease-calm) md:hidden"
      style={{ transform: ducked ? "translateY(110%)" : "translateY(0)" }}
    >
      <a
        href={PREORDER_HREF}
        className="block rounded-full border-2 border-white bg-orange px-6 py-4 text-center text-[16px] font-bold leading-none text-ink-head shadow-cta"
      >
        Reserve at {LAUNCH_PRICE}. No payment now.
      </a>
    </div>
  );
}
