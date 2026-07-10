"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { detectTier } from "@/lib/three/tier";

// via the single three-stack entry (see components/three/Stage.tsx): a
// direct dynamic import here would re-create the twin-chunk fiber split
const LumiInset = dynamic(() => import("../three/Stage").then((m) => m.LumiInset), {
  ssr: false,
});

/** Product hero with the MascotHero resilience contract: the approved static
 *  render is mounted and visible from first paint (it is this page's LCP
 *  image); the live plush (the founder's new v3 model, which replaced the
 *  rejected v1 turntable) mounts behind the same gates as the home stage and
 *  cross-fades in once its first frame exists. */
export function LumiHero({ className }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const [mount3d, setMount3d] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (detectTier() === "static") return;
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
  }, []);

  return (
    <div ref={holder} className={className} style={{ position: "relative" }}>
      <Image
        src="/product/lumi-blue.png"
        alt="Lumi, a small blue talking toy with a striped party hat"
        width={1113}
        height={1600}
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 80vw, 420px"
        className={`relative mx-auto h-full w-auto object-contain drop-shadow-[0_20px_26px_rgba(41,160,215,0.2)] transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      {mount3d && (
        // decorative: restates the static render as a live model
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 -inset-y-4 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <LumiInset onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
