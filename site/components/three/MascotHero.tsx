"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** The one live-3D moment on the site. Same resilience contract as the old
 *  model-viewer slot: the static wink render is mounted and visible from the
 *  first paint (it IS the LCP image) and only fades once the scene has a
 *  loaded model. Gates: fine pointers, no Save-Data, no reduced motion. */
export function MascotHero({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const holder = useRef<HTMLDivElement>(null);
  const [mount3d, setMount3d] = useState(false);
  const [ready, setReady] = useState(false);

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
          setMount3d(true);
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
        width={384}
        height={738}
        priority
        sizes="(max-width: 768px) 70vw, 400px"
        className={`mx-auto h-auto w-full max-w-[340px] drop-shadow-[0_18px_24px_rgba(216,95,27,0.18)] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {mount3d && (
        <div className={`absolute inset-x-0 -inset-y-6 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <HeroScene onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
