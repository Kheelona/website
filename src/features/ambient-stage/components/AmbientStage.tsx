"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { initAmbientTracking } from "@/features/ambient-stage/lib/ambient";
import { ambientConfigFor } from "@/features/ambient-stage/lib/ambient-configs";
import { stageStore } from "@/features/ambient-stage/lib/store";
import type { Tier } from "@/features/ambient-stage/lib/tier";
import { StageShell } from "./StageShell";
import { WashBackdrop } from "./backdrop";
import { BrandShape, ShapeField } from "./actors";

/* Static camera with pointer parallax and a slow breath — the room is alive,
   nothing travels. */
function AmbientRig() {
  const camera = useThree((s) => s.camera);
  const look = useRef(new THREE.Vector3(0, 1.05, -1));

  useFrame((state, delta) => {
    const { px, py } = stageStore.getState();
    const t = state.clock.elapsedTime;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.22, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      1.42 - py * 0.1 + Math.sin(t * 0.4) * 0.02,
      2.2,
      delta,
    );
    look.current.set(camera.position.x * 0.35, 1.02, camera.position.z - 5.2);
    camera.lookAt(look.current);
  });
  return null;
}

/* Readiness = the first painted frame (there is no model to wait for). */
function FirstFrameReady({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady();
  });
  return null;
}

/** The interior ambient stage (§8.13): a lighter room per route — measured
 *  washes as the sky, a corridor-faded shape field, one optional accent.
 *  No GLBs, no camera dolly. Dressing comes from ambient-configs.ts. */
export default function AmbientStage({
  tier,
  onReady,
  onFail,
}: {
  tier: Tier;
  onReady: () => void;
  onFail: () => void;
}) {
  const pathname = usePathname();
  const config = ambientConfigFor(pathname ?? "");

  useEffect(() => {
    if (!config) return;
    return initAmbientTracking();
  }, [config]);

  if (!config) return null;
  const count = tier === "full" ? config.density : Math.round(config.density * 0.6);

  return (
    <StageShell tier={tier} onFail={onFail}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.7} color="#fff6ea" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#3aa4e5" />

      <AmbientRig />
      <WashBackdrop mode="ambient" />
      <FirstFrameReady onReady={onReady} />

      <ShapeField count={count} palette={config.palette} depthRange={[6, 17]} />
      {config.accents.map((a, i) => (
        <BrandShape
          key={i}
          kind={a.kind}
          color={a.color}
          position={a.position}
          scale={a.scale}
          floatPhase={a.floatPhase ?? i * 1.9}
          floatAmp={0.08}
        />
      ))}
    </StageShell>
  );
}
