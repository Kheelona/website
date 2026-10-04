"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { PRESS_TINT } from "@/lib/interactions";
import { KHEELU_ART } from "@/lib/kheelu-art";

/** The colorway picker (revamp M3, from wireframe B's lhero): a real
 *  radiogroup (B's span-buttons fixed). All plush images stay mounted and
 *  pre-decoded; picking flips visibility classes, so there is no decode flash
 *  and no CLS. The first colourway is the priority image (page LCP). Swatch
 *  fills are the PRODUCT's fabric colours sampled from the render (product
 *  representation, like a photo — not design-system palette entries).
 *
 *  2026-08-25: ONE colourway. The plush changed from the blue dino to the
 *  cream rabbit and only one colour exists so far, so Blue/Green/Pink went
 *  with it. The founder chose to KEEP the picker rather than remove it, so a
 *  second colourway is a row in this array and nothing else — the keyboard
 *  handling, the priority rule and the mounted-and-hidden trick all already
 *  generalise. `move()` is a no-op with one entry, deliberately left in place
 *  for the same reason. */
const COLORWAYS = [
  {
    id: "cream",
    label: "Cream",
    swatch: "#f0e2d2",
    img: KHEELU_ART.src,
    alt: KHEELU_ART.alt,
    w: KHEELU_ART.width,
    h: KHEELU_ART.height,
  },
] as const;

type ColorwayId = (typeof COLORWAYS)[number]["id"];

export function ColorwayPicker({ className }: { className?: string }) {
  const [active, setActive] = useState<ColorwayId>(COLORWAYS[0].id);
  const refs = useRef<Partial<Record<ColorwayId, HTMLButtonElement | null>>>({});

  const move = (dir: 1 | -1) => {
    const i = COLORWAYS.findIndex((c) => c.id === active);
    const next = COLORWAYS[(i + dir + COLORWAYS.length) % COLORWAYS.length];
    setActive(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative flex h-[380px] items-end justify-center md:h-[440px]">
        {COLORWAYS.map((c, i) => (
          <Image
            key={c.id}
            src={c.img}
            alt={c.alt}
            width={c.w}
            height={c.h}
            priority={i === 0}
            sizes="(max-width: 768px) 70vw, 380px"
            className={cn("h-full w-auto object-contain", c.id === active ? "block" : "hidden")}
          />
        ))}
      </div>
      <div
        role="radiogroup"
        aria-label="Pick Kheelu's colour"
        className="mt-5 flex items-center gap-3"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            move(1);
          } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        {COLORWAYS.map((c) => (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[c.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={c.id === active}
            tabIndex={c.id === active ? 0 : -1}
            onClick={() => setActive(c.id)}
            className={cn(
              `flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-bold text-ink-head ${PRESS_TINT} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2`,
              c.id === active
                ? "border-ink-head bg-white shadow-(--shadow-room-sm)"
                : "border-line bg-white/70",
            )}
          >
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full border border-line"
              style={{ backgroundColor: c.swatch }}
            />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
