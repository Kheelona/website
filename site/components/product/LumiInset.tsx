"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { LumiModel } from "@/components/three/actors";
import { stageStore } from "@/lib/three/store";

/** Mounts (and fires) only after the suspended model above it has resolved,
 *  so the static photo never fades before the plush exists. */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => onReady?.(), [onReady]);
  return null;
}

/** The product page's live Lumi: a small self-contained scene (no journey,
 *  no wash handoff), the plush swaying gently on a warm spot. */
export default function LumiInset({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      stageStore.setState({
        px: (e.clientX / window.innerWidth) * 2 - 1,
        py: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 30, position: [0, 0.95, 3.4] }}
      onCreated={({ camera }) => camera.lookAt(0, 0.78, 0)}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.25} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.6} color="#fff6ea" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#3aa4e5" />
      <Suspense fallback={null}>
        <LumiModel position={[0, 0, 0]} height={1.6} />
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  );
}
