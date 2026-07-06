"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const LumiTurntable = dynamic(() => import("./LumiTurntable"), { ssr: false });

/** Product-page hero visual: the photo cutout is the LCP and the fallback;
 *  capable browsers get the slow 3D turntable on top (same gating contract
 *  as MascotHero). */
export function LumiHero({ className }: { className?: string }) {
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
        src="/product/lumi-blue.png"
        alt="Lumi, a small blue talking toy with a striped party hat"
        width={588}
        height={854}
        priority
        sizes="(max-width: 768px) 80vw, 420px"
        className={`relative mx-auto h-auto w-full max-w-[360px] drop-shadow-[0_20px_26px_rgba(41,160,215,0.2)] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {mount3d && (
        // The 3D layer restates the photo, so it is decorative to AT.
        <div aria-hidden="true" className={`absolute inset-x-0 -inset-y-4 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
          <LumiTurntable onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
