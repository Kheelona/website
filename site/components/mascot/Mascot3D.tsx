"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/** The one live-3D moment on the site (subtle by design): the rigged mascot GLB
 *  with its idle animation. Lazy (library + model load near viewport), gated
 *  (fine pointers, no Save-Data, no reduced motion), and resilient: the static
 *  wink render stays mounted underneath and only fades once the model has
 *  actually LOADED; any error keeps the render (design-review fix). */
export function Mascot3D({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const holder = useRef<HTMLDivElement>(null);
  const mvHolder = useRef<HTMLDivElement>(null);
  const [mount3d, setMount3d] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  // model-viewer emits DOM CustomEvents ("load"/"error"); attach real listeners.
  useEffect(() => {
    if (!mount3d) return;
    const mv = mvHolder.current?.querySelector("model-viewer");
    if (!mv) return;
    const onLoad = () => setModelReady(true);
    const onError = () => {
      setMount3d(false);
      setModelReady(false);
    };
    mv.addEventListener("load", onLoad);
    mv.addEventListener("error", onError);
    return () => {
      mv.removeEventListener("load", onLoad);
      mv.removeEventListener("error", onError);
    };
  }, [mount3d]);

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
            .then(() => setMount3d(true))
            .catch(() => setMount3d(false));
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={holder} className={className} style={{ position: "relative" }}>
      <Image
        src="/mascot/mascot-hero-wink.png"
        alt="The Kheelona mascot, a friendly fox with round blue glasses, winking and giving a thumbs up"
        width={419}
        height={808}
        priority
        className={`mx-auto h-auto w-full max-w-[360px] drop-shadow-[0_18px_24px_rgba(216,95,27,0.18)] transition-opacity duration-500 ${modelReady ? "opacity-0" : "opacity-100"}`}
      />
      {mount3d && (
        <div ref={mvHolder} className="absolute inset-0">
          {/* @ts-expect-error custom element registered by @google/model-viewer */}
          <model-viewer
            src="/models/kheelona-mascot.glb"
            autoplay
            animation-name="NlaTrack"
            camera-orbit="180deg 86deg 4m"
            disable-zoom
            interaction-prompt="none"
            camera-controls
            shadow-intensity="0.8"
            exposure="1.1"
            aria-label="The Kheelona mascot in 3D, gently idling. Drag to rotate."
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
}
