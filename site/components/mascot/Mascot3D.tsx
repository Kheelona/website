"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** The one live-3D moment on the site (subtle by design): the rigged mascot GLB
 *  with its idle animation, playing in a <model-viewer> that is
 *  - lazy: the library and model load only when the slot nears the viewport,
 *  - gated: desktop-class pointers only, reduced-motion and Save-Data users
 *    (and any load error) get the pre-rendered wink instead.
 *  Never blocks first paint (blueprint §8.4 R3F-slot policy). */
export function Mascot3D({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const holder = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"static" | "3d">("static");

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection;
    if (conn?.saveData) return;

    const el = holder.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          import("@google/model-viewer")
            .then(() => setMode("3d"))
            .catch(() => setMode("static"));
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={holder} className={className}>
      {mode === "3d" ? (
        // @ts-expect-error custom element registered by @google/model-viewer
        <model-viewer
          src="/models/kheelona-mascot.glb"
          poster="/mascot/mascot-hero-wink.png"
          autoplay
          animation-name="NlaTrack"
          camera-orbit="180deg 86deg 4m"
          disable-zoom
          interaction-prompt="none"
          camera-controls
          shadow-intensity="0.8"
          exposure="1.1"
          aria-label="The Kheelona mascot in 3D, gently idling. Drag to rotate."
          style={{ width: "100%", height: "100%", minHeight: "420px" }}
        />
      ) : (
        <Image
          src="/mascot/mascot-hero-wink.png"
          alt="The Kheelona mascot, a friendly fox with round blue glasses, winking and giving a thumbs up"
          width={419}
          height={808}
          priority
          className="mx-auto h-auto w-full max-w-[360px] drop-shadow-[0_18px_24px_rgba(216,95,27,0.18)]"
        />
      )}
    </div>
  );
}
