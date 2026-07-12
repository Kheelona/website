"use client";

import { Component, useEffect, useRef, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import type { Tier } from "@/lib/three/tier";

/* --------------------------------------------------------- error boundary -- */
class StageErrorBoundary extends Component<{ onFail: () => void; children: ReactNode }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The shared stage shell (§8.13): the fixed full-page holder, per-tier
 *  Canvas setup, error boundary and context-lost wiring. ThreeStage (the
 *  Home journey) and AmbientStage (interiors) both render inside it. */
export function StageShell({
  tier,
  onFail,
  children,
}: {
  tier: Tier;
  onFail: () => void;
  children: ReactNode;
}) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current?.querySelector("canvas");
    if (!el) return;
    const onLost = (e: Event) => {
      e.preventDefault();
      onFail();
    };
    el.addEventListener("webglcontextlost", onLost);
    return () => el.removeEventListener("webglcontextlost", onLost);
  }, [onFail]);

  return (
    // zIndex -1: inside main's stacking context the canvas must paint behind
    // every section (position:relative, z-index auto siblings would otherwise
    // lose to a later-in-DOM z-index:0 canvas and the page would be covered).
    <div
      ref={holder}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <StageErrorBoundary onFail={onFail}>
        <Canvas
          dpr={tier === "full" ? [1, 1.75] : [1, 1.35]}
          gl={{
            antialias: tier === "full",
            alpha: false,
            powerPreference: "low-power",
          }}
          camera={{ fov: 32, position: [0, 1.42, 4.6] }}
        >
          {children}
        </Canvas>
      </StageErrorBoundary>
    </div>
  );
}
