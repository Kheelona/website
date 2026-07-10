"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "onDark";

/* R5 (founder 2026-07-10): button labels are WHITE. The fill is orange-cta
   #C25210, the lightest brand orange where white passes 4.5:1 at any size --
   both directives (white labels + a11y 100) hold at once. Hover lifts with
   shadow/transform instead of a lighter fill so contrast never dips. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-orange-cta text-white border-2 border-white shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.28)]",
  ghost:
    "bg-transparent text-ink-head border-2 border-ink-head hover:bg-ink-head hover:text-white",
  onDark:
    "bg-footer-cocoa text-white border-2 border-white shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.28)]",
};

type Ripple = { id: number; x: number; y: number };

/** Brand pill button (design system: pill radius, white keyline, single shadow,
 *  bouncy press). Renders a Link so every CTA is crawlable.
 *  R6: press ripple adapted from Animate UI `primitives-buttons-ripple`
 *  (imskyleen/animate-ui@efeb96ffd7a3, MIT + Commons Clause — see
 *  components/vendor/README.md): rebuilt for an anchor with a CSS keyframe
 *  instead of a motion span; skipped entirely under reduced motion. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 650);
  }, []);

  return (
    <Link
      href={href}
      onPointerDown={onPointerDown}
      className={cn(
        // nowrap: a pill label that wraps to two lines crowds whatever sits
        // beside it (seen with the navbar CTA in the 640-1023px band)
        "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full leading-none",
        "transition-[transform,box-shadow,background-color] duration-150 ease-(--ease-bounce) active:scale-[0.96]",
        size === "md" ? "px-7 py-4 text-[17px] font-bold" : "px-9 py-5 text-lg font-bold",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className="pointer-events-none absolute h-5 w-5 animate-(--animate-ripple) rounded-full bg-white/40"
          style={{ left: r.x - 10, top: r.y - 10 }}
        />
      ))}
    </Link>
  );
}
