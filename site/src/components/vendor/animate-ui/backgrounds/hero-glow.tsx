"use client";

/* Vendored from Animate UI (https://animate-ui.com), heavily adapted.
 * Source: registry item `components-backgrounds-bubble` @ imskyleen/animate-ui@efeb96ffd7a3
 * License: MIT + Commons Clause (index: components/vendor/README.md)
 * Brand modifications (the calm rebuild — see vendor/README.md):
 *  - goo/blur SVG filter chain removed: the radial-gradient blobs are soft
 *    already, and transform-only animation stays on the compositor
 *  - 6 saturated blobs -> 3 brand-warm blobs (yellow / orange-15 / blue-soft),
 *    30-70s loops instead of 20-40s
 *  - global `:root` style injection removed (colors are per-blob inline)
 *  - interactive pointer blob removed; `useReducedMotion` renders it static
 *  - decorative contract: aria-hidden, pointer-events-none, absolute fill */
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

type Blob = {
  /** brand color as "r,g,b" */
  rgb: string;
  alpha: number;
  size: string;
  pos: string;
  drift: { x?: number[]; y?: number[] };
  duration: number;
};

/* Brand palette in rgb triplets: yellow #F1A23B, orange #EF762F,
   blue-soft #3AA4E5 (tokens locked; see lib/three/tokens.ts). */
const BLOBS: Blob[] = [
  {
    rgb: "241,162,59",
    alpha: 0.4,
    size: "size-[70%]",
    pos: "left-[5%] top-[0%]",
    drift: { y: [-40, 40, -40] },
    duration: 38,
  },
  {
    rgb: "239,118,47",
    alpha: 0.28,
    size: "size-[60%]",
    pos: "right-[0%] top-[25%]",
    drift: { x: [30, -30, 30] },
    duration: 52,
  },
  {
    rgb: "58,164,229",
    alpha: 0.22,
    size: "size-[55%]",
    pos: "left-[30%] bottom-[-10%]",
    drift: { x: [-35, 35, -35], y: [15, -15, 15] },
    duration: 66,
  },
];

function HeroGlowBackground({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      data-slot="hero-glow-background"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className={cn("absolute rounded-full", b.size, b.pos)}
          style={{
            background: `radial-gradient(circle at center, rgba(${b.rgb},${b.alpha}) 0%, rgba(${b.rgb},0) 55%)`,
            willChange: reduced ? undefined : "transform",
          }}
          animate={reduced ? undefined : b.drift}
          transition={
            reduced
              ? undefined
              : { duration: b.duration, ease: "easeInOut", repeat: Infinity }
          }
        />
      ))}
    </div>
  );
}

export { HeroGlowBackground };
