"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { detectTier, type Tier } from "@/features/ambient-stage/lib/tier";

// ONE dynamic entry for both stages (see Stage.tsx: sibling dynamic imports
// duplicated the three/fiber/store singletons and broke the ambient canvas)
const Stage = dynamic(() => import("./Stage"), { ssr: false });

/** The whole-page stage gate: the MascotHero resilience contract promoted to
 *  the full journey. Server + first client render return null (no hydration
 *  mismatch). The stage mounts only when every gate passes, and only after
 *  window load + an idle slot, so it can never compete with LCP. When the
 *  scene has painted its first frame it sets html.scene-3d and the DOM washes
 *  hand off to the world (CSS in globals.css). Any failure path removes the
 *  class: the flat washes fade back, never a blank screen.
 *  stage="journey" is the Home world; stage="ambient" is the per-route
 *  interior room (AmbientStage + ambient-configs). */
export function StageGate({ stage = "journey" }: { stage?: "journey" | "ambient" }) {
  const [tier, setTier] = useState<Tier | null>(null);

  useEffect(() => {
    let cancelled = false;
    let idleId: number | undefined;
    let signalCleanup: (() => void) | undefined;

    const idle = (cb: () => void) =>
      "requestIdleCallback" in window
        ? (window as Window & typeof globalThis).requestIdleCallback(cb, { timeout: 1500 })
        : (setTimeout(cb, 250) as unknown as number);

    const arm = () => {
      const t = detectTier();
      if (t === "static" || cancelled) return;
      // Wait for the first real user signal before paying for the three.js
      // chunk, so it never lands inside the initial load at all: phones on
      // every stage (the DOM art is the phone experience), and ambient
      // interiors on every tier (a static room loses nothing by fading in on
      // the first scroll or mouse move). Only the desktop journey mounts
      // unprompted -- the hero mascot is the star and must be there.
      if (t === "lite" || stage === "ambient") {
        const onSignal = () => {
          signalCleanup?.();
          signalCleanup = undefined;
          // re-detect at mount time: the signal can arrive minutes after
          // load, and reduced-motion/saveData may have flipped since (QA)
          idleId = idle(() => {
            if (cancelled) return;
            const now = detectTier();
            if (now !== "static") setTier(now);
          }) as number;
        };
        window.addEventListener("scroll", onSignal, { once: true, passive: true });
        window.addEventListener("pointerdown", onSignal, { once: true, passive: true });
        window.addEventListener("pointermove", onSignal, { once: true, passive: true });
        signalCleanup = () => {
          window.removeEventListener("scroll", onSignal);
          window.removeEventListener("pointerdown", onSignal);
          window.removeEventListener("pointermove", onSignal);
        };
        return;
      }
      idleId = idle(() => !cancelled && setTier(t)) as number;
    };

    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    // reduced-motion flipped mid-session: tear the stage down live
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mq.matches) {
        setTier(null);
        document.documentElement.classList.remove("scene-3d", "scene-3d-full");
      }
    };
    mq.addEventListener("change", onChange);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", onChange);
      signalCleanup?.();
      if (idleId !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleId);
      document.documentElement.classList.remove("scene-3d", "scene-3d-full");
    };
  }, []);

  if (!tier) return null;
  return (
    <Stage
      stage={stage}
      tier={tier}
      onReady={() => {
        document.documentElement.classList.add("scene-3d");
        // the DOM-art handoff (globals.css) keys on this: only the full-tier
        // journey actually has live models to hand off to
        if (stage === "journey" && tier === "full") {
          document.documentElement.classList.add("scene-3d-full");
        }
      }}
      onFail={() => {
        document.documentElement.classList.remove("scene-3d", "scene-3d-full");
        setTier(null);
      }}
    />
  );
}
