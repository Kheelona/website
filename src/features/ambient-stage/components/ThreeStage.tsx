"use client";

import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Shadow, Sparkles } from "@react-three/drei";
import { initStageTracking, stageStore } from "@/features/ambient-stage/lib/store";
import { TOKENS } from "@/features/ambient-stage/lib/tokens";
import type { Tier } from "@/features/ambient-stage/lib/tier";
import { StageShell } from "./StageShell";
import { Sun, WashBackdrop } from "./backdrop";
import {
  BrandShape,
  KheeluModel,
  MascotModel,
  ShapeField,
  SPACING,
} from "./actors";

/* Beat index -> place. Must match the <Beat> order in app/page.tsx:
   0 hero · 1 intro · 2 film · 3 why · 4 feelings · 5 lumi · 6 playos
   7 compare · 8 safety · 9 journal · 10 reserve */
const P = (i: number) => -i * SPACING;

/* ------------------------------------------------------------- camera rig --
   The journey: a slow dolly along the path, gentle sway, pointer parallax.
   Reads the store transiently; damped so native scroll stays sharp while the
   world glides a breath behind it. */
function CameraRig() {
  const camera = useThree((s) => s.camera);
  const look = useRef(new THREE.Vector3(0, 1.05, 0));

  useFrame((_, delta) => {
    const { journey, px, py } = stageStore.getState();
    const sway = Math.sin(journey * 0.85) * 0.55;
    const targetZ = 4.6 - journey * SPACING;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.4, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, sway + px * 0.22, 2.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 1.42 - py * 0.1, 2.2, delta);
    look.current.set(sway * 0.35, 1.02, camera.position.z - 5.2);
    camera.lookAt(look.current);
  });
  return null;
}

/* Lite tier has no model to wait for: readiness is the first painted frame,
   so the wash handoff still only happens once the sky is really there. */
function FirstFrameReady({ onReady }: { onReady: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current) return;
    fired.current = true;
    onReady();
  });
  return null;
}

/* --------------------------------------------------------------- chapters -- */
function World({ tier, onReady }: { tier: Tier; onReady: () => void }) {
  const full = tier === "full";
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.7} color="#fff6ea" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#3aa4e5" />

      <CameraRig />
      <WashBackdrop mode="journey" />
      <Sun />
      <ShapeField
        count={full ? 30 : 14}
        palette={[TOKENS.yellow, TOKENS.blueSoft, TOKENS.teal, TOKENS.purple, TOKENS.orange]}
      />

      {/* place 0: the hero clearing. The live mascot; the DOM PNG crossfades
          out only after this model has actually loaded (onReady chain).
          full tier only: phones keep their DOM art, so shipping them the two
          GLBs (1.3MB transfer) would be invisible weight. Lite readiness is
          the first painted frame instead. */}
      {full ? (
        <Suspense fallback={null}>
          <MascotModel position={[1.12, 0, P(0) - 0.6]} rotationY={-0.14} onReady={onReady} />
          {/* soft contact shadow grounds the mascot in the clearing (design
              panel 2026-07-10: without it frame one reads as a flat cutout) */}
          <Shadow
            position={[1.12, 0.02, P(0) - 0.55]}
            scale={[1.5, 0.5, 1]}
            colorStop={0.2}
            opacity={0.18}
          />
          {/* one intentional cluster arcing around the hero, sizes stepping
              down for depth, so the first frame declares the dimensional
              world instead of scattered confetti */}
          <BrandShape kind="flower13" color={TOKENS.yellow} position={[-3.1, 2.4, P(0) - 4.5]} scale={1.15} floatPhase={0.8} />
          <BrandShape kind="squircle" color={TOKENS.blueSoft} position={[3.4, 3.0, P(0) - 6]} scale={0.85} floatPhase={2.6} />
          <BrandShape kind="flower5" color={TOKENS.teal} position={[-2.6, 0.6, P(0) - 2.2]} scale={0.5} floatPhase={4.1} />
          <Sparkles
            count={14}
            scale={[2.4, 2.2, 1.2]}
            position={[1.18, 1.3, P(0) - 0.4]}
            size={2}
            speed={0.25}
            opacity={0.4}
            color={TOKENS.yellow}
          />

          {/* place 4: the feelings grove. The DOM cast lineup is the artwork
              here (a 3D echo of the same five read as ghosting, not depth);
              the world contributes the grove itself: low flowers in the five
              feeling colors standing in the cool light. */}

          {/* place 5: Kheelu's home. The DOM product photo hands off to the
              plush turning live on its mound (data-scene-hide). */}
          <KheeluModel position={[-1.05, 0, P(5) - 0.6]} height={1.7} fadeByDistance />

          {/* place 10 (the sunset finale) needs no 3D cast: the finale section
              keeps its own opaque orange (white text + the conversion moment
              never depend on the canvas) and carries the DOM lineup. The world
              contributes the sunset approach: sky and sun turn orange through
              the journal meadow on the way in. */}
        </Suspense>
      ) : (
        <FirstFrameReady onReady={onReady} />
      )}

      {/* place 6: the PlayOS sky, voice particles drifting between clouds.
          Clouds are white: cream under the cool sky light read as gray smudge
          (design panel 2026-07-10). */}
      {full && (
        <Sparkles
          count={34}
          scale={[6, 3.4, 3]}
          position={[0, 1.8, P(6)]}
          size={2.6}
          speed={0.32}
          opacity={0.5}
          color={TOKENS.blueSoft}
        />
      )}
      <BrandShape kind="squircle" color={TOKENS.white} position={[-2.6, 2.7, P(6) - 2]} scale={1.3} floatPhase={2} />
      <BrandShape kind="squircle" color={TOKENS.white} position={[2.8, 3.2, P(6) - 3]} scale={1.6} floatPhase={4.5} />

      {/* place 4 dressing: the grove's flowers, one per feeling color */}
      <BrandShape kind="flower5" color={TOKENS.blue} position={[-2.2, 0.42, P(4) - 2.6]} scale={0.5} floatAmp={0.05} floatPhase={0.5} />
      <BrandShape kind="flower13" color={TOKENS.orange} position={[-1.1, 0.3, P(4) - 3.1]} scale={0.36} floatAmp={0.05} floatPhase={1.4} />
      <BrandShape kind="flower5" color={TOKENS.purple} position={[0.15, 0.36, P(4) - 2.4]} scale={0.4} floatAmp={0.05} floatPhase={2.2} />
      <BrandShape kind="flower13" color={TOKENS.yellow} position={[1.2, 0.32, P(4) - 3.0]} scale={0.38} floatAmp={0.05} floatPhase={3.1} />
      <BrandShape kind="flower5" color={TOKENS.teal} position={[2.3, 0.44, P(4) - 2.7]} scale={0.48} floatAmp={0.05} floatPhase={4} />

      {/* place 8: the safety garden canopy (teal, sheltering) */}
      <BrandShape kind="flower5" color={TOKENS.teal} position={[0, 3.7, P(8) - 2.2]} scale={3.4} floatAmp={0.06} floatPhase={1} />
      {full && (
        <Sparkles
          count={12}
          scale={[4, 2.4, 2]}
          position={[0, 1.4, P(8)]}
          size={2.2}
          speed={0.18}
          opacity={0.45}
          color={TOKENS.teal}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------- the stage -- */
export default function ThreeStage({
  tier,
  onReady,
  onFail,
}: {
  tier: Tier;
  onReady: () => void;
  onFail: () => void;
}) {
  useEffect(() => initStageTracking(), []);

  return (
    <StageShell tier={tier} onFail={onFail}>
      <World tier={tier} onReady={onReady} />
    </StageShell>
  );
}
