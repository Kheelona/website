"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "onDark";

/* V4 (founder decision D1, 2026-07-30, supersedes R5): the fill is BRAND
   orange #EF762F via the semantic action token, the label is dark ink
   (ink-head on #EF762F measures 5.9:1 -- the team's colour and the a11y-100
   gate hold at once; white on #EF762F is 2.9:1 and fails at every size).
   The white keyline is gone by the same feedback item. Hover still lifts
   with shadow/transform instead of a fill change so contrast never dips. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-action text-ink-head shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.28)]",
  ghost:
    "bg-transparent text-ink-head border-2 border-ink-head hover:bg-ink-head hover:text-white",
  // the same action fill reads correctly on the cocoa footer; the variant
  // survives for call sites that want a darker hover shadow on dark ground
  onDark:
    "bg-action text-ink-head shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.4)]",
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
        // ...but BELOW sm it must wrap (M4 mobile pass): a room's content box
        // is only ~290px wide on a 390px phone, so a long ghost label like
        // "See the parent app on the Lumi page" ran off the screen and widened
        // the layout viewport. The 640px band that wanted nowrap is untouched.
        "max-sm:whitespace-normal max-sm:text-center max-sm:leading-tight",
        // R11: the shared brand focus ring (audit: only 4 card links had one;
        // every other control fell back to the UA outline — incoherent)
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2",
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
