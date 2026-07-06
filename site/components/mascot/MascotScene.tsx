"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/cn";

export type MascotPose =
  | "hero-wink"
  | "curious"
  | "grumpy"
  | "sad"
  | "silly"
  | "joy"
  | "bliss";

const ALT: Record<MascotPose, string> = {
  "hero-wink":
    "The Kheelona mascot, a friendly fox with round blue glasses, winking and giving a thumbs up",
  curious: "The mascot sitting with wide, curious eyes",
  grumpy: "The mascot frowning with hands on hips",
  sad: "The mascot holding its cheeks through a hard moment",
  silly: "The mascot laughing with its head thrown back",
  joy: "The mascot dancing with one arm in the air",
  bliss: "The mascot standing calm and content, eyes closed",
};

/** The site-wide dimensional mascot (blueprint §8.4): a pre-rendered cutout with
 *  pointer tilt, scroll parallax, and idle float. Collapses to a static image
 *  under prefers-reduced-motion. Keep it subtle: small angles, slow drift. */
export function MascotScene({
  pose,
  width = 360,
  parallax = 40,
  priority = false,
  className,
}: {
  pose: MascotPose;
  width?: number;
  /** px of scroll drift across the section; 0 disables */
  parallax?: number;
  priority?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: 80, damping: 14 });
  const sTiltY = useSpring(tiltY, { stiffness: 80, damping: 14 });

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    tiltX.set(((e.clientY - r.top) / r.height - 0.5) * -8);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const img = (
    <Image
      src={`/mascot/mascot-${pose}.png`}
      alt={ALT[pose]}
      width={width}
      height={Math.round(width * 1.5)}
      priority={priority}
      sizes="(max-width: 768px) 70vw, 360px"
      className="h-auto w-full drop-shadow-[0_18px_24px_rgba(216,95,27,0.18)]"
    />
  );

  if (reduce) {
    return (
      <div ref={ref} className={cn("relative", className)} style={{ width }}>
        {img}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ y, rotateX: sTiltX, rotateY: sTiltY, width, perspective: 800 }}
      animate={{ translateY: [0, -10, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn("relative will-change-transform", className)}
    >
      {img}
    </motion.div>
  );
}
