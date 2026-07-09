"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { detectTier, type Tier } from "@/lib/three/tier";

const ThreeStage = dynamic(() => import("./ThreeStage"), { ssr: false });

/** The whole-page stage gate: the MascotHero resilience contract promoted to
 *  the full journey. Server + first client render return null (no hydration
 *  mismatch). The stage mounts only when every gate passes, and only after
 *  window load + an idle slot, so it can never compete with LCP. When the
 *  scene has painted its first frame it sets html.scene-3d and the DOM washes
 *  hand off to the world (CSS in globals.css). Any failure path removes the
 *  class: the flat washes fade back, never a blank screen. */
export function StageGate() {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;

    const arm = () => {
      const t = detectTier();
      if (t === "static" || cancelled) return;
      const idle = (cb: () => void) =>
        "requestIdleCallback" in window
          ? (window as Window & typeof globalThis).requestIdleCallback(cb, { timeout: 1500 })
          : (setTimeout(cb, 250) as unknown as number);
      idleId = idle(() => !cancelled && setTier(t)) as number;
    };

    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    // reduced-motion flipped mid-session: tear the stage down live
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) {
        setTier(null);
        document.documentElement.classList.remove("scene-3d");
      }
    };
    mq.addEventListener("change", onChange);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", onChange);
      if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      document.documentElement.classList.remove("scene-3d");
    };
  }, []);

  if (!tier) return null;
  return (
    <ThreeStage
      tier={tier}
      onReady={() => document.documentElement.classList.add("scene-3d")}
      onFail={() => {
        document.documentElement.classList.remove("scene-3d");
        setTier(null);
      }}
    />
  );
}
