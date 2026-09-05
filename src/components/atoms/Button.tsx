"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "onDark";

/* §8.29 (founder decision, 2026-08-24, supersedes V4 D1 and restores R5): the
   fill is BRAND orange #EF762F via the semantic action token, and the label is
   WHITE -- which is what .kh-button in the v3 design system specifies.
   THE HONEST NUMBER: white on #EF762F is 2.88:1 and fails WCAG AA at every
   size (the large-text floor is 3:1). That is a KNOWN, ACCEPTED deviation. The
   founder was shown the ratio and the passing alternative (orange-cta #C25210
   carries white at 4.66:1) and chose to keep brand orange. Do not raise the
   contrast here without reversing that decision first: docs/website-steps.md
   §8.29, and test/action-label.test.ts fails any bg-action carrying ink labels.
   The white keyline stays gone (a V4 item the reversal does not touch). Hover
   still lifts with shadow/transform rather than a fill change, so the ratio
   never drops BELOW the accepted one. */
const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-action text-white shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.28)]",
  // ghost is ink-on-transparent over a light wash, so §8.29 does not reach it;
  // its inverted hover (ink fill, white label) is 15.7:1 and stays as it is
  ghost:
    "bg-transparent text-ink-head border-2 border-ink-head hover:bg-ink-head hover:text-white",
  // the same action fill reads correctly on the cocoa footer; the variant
  // survives for call sites that want a darker hover shadow on dark ground
  onDark:
    "bg-action text-white shadow-cta hover:-translate-y-0.5 hover:shadow-[0_6px_10px_rgb(0_0_0/0.4)]",
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
        // "See the parent app on the Kheelu page" ran off the screen and widened
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
