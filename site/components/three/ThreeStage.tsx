"use client";

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { initStageTracking, stageStore } from "@/lib/three/store";
import { BEAT_WASHES, TOKENS } from "@/lib/three/tokens";
import type { Tier } from "@/lib/three/tier";
import {
  BrandShape,
  LumiModel,
  MascotModel,
  ShapeField,
  SpriteCutout,
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

/* --------------------------------------------------------- wash backdrop --
   The wash handoff: the sky itself glides through the same tokens the flat
   site painted as opaque section washes. Fog matches, so distant places sit
   as soft silhouettes ahead on the path. */
function WashBackdrop() {
  const scene = useThree((s) => s.scene);
  const colors = useRef(BEAT_WASHES.map((c) => new THREE.Color(c)));
  const current = useRef(new THREE.Color(BEAT_WASHES[0]));

  useEffect(() => {
    scene.background = current.current;
    // tight fog: the next place stays a soft silhouette until you approach
    scene.fog = new THREE.Fog(current.current, 8, 21);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const { journey } = stageStore.getState();
    const i = Math.min(Math.floor(journey), colors.current.length - 2);
    const t = THREE.MathUtils.clamp(journey - i, 0, 1);
    const target = colors.current[i].clone().lerp(colors.current[i + 1], t);
    current.current.lerp(target, 1 - Math.exp(-3 * delta));
    if (scene.fog) (scene.fog as THREE.Fog).color = current.current;
  });
  return null;
}

/* The sun: rides ahead of the camera all journey, sinks and grows into the
   sunset the finale happens inside. */
function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  const color = useRef(new THREE.Color(TOKENS.yellow));

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const { journey } = stageStore.getState();
    const camZ = state.camera.position.z;
    const sink = THREE.MathUtils.clamp((journey - 7.5) / 2.5, 0, 1); // sinks after safety
    m.position.set(Math.sin(journey * 0.5) * 3, 6.2 - sink * 4.6, camZ - 26);
    const s = 3.6 + sink * 4.2;
    m.scale.setScalar(s);
    color.current.lerp(new THREE.Color(sink > 0.5 ? TOKENS.orangeDeep : TOKENS.yellow), delta);
    (m.material as THREE.MeshBasicMaterial).color = color.current;
  });

  return (
    <mesh ref={ref}>
      <circleGeometry args={[1, 40]} />
      <meshBasicMaterial transparent opacity={0.4} />
    </mesh>
  );
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
      <WashBackdrop />
      <Sun />
      <ShapeField
        count={full ? 30 : 14}
        palette={[TOKENS.yellow, TOKENS.blueSoft, TOKENS.teal, TOKENS.purple, TOKENS.orange]}
      />

      {/* place 0: the hero clearing. The live mascot; the DOM PNG crossfades
          out only after this model has actually loaded (onReady chain). */}
      <Suspense fallback={null}>
        <MascotModel position={[1.12, 0, P(0) - 0.6]} rotationY={-0.14} onReady={onReady} />
        {full && (
          <Sparkles
            count={14}
            scale={[2.4, 2.2, 1.2]}
            position={[1.18, 1.3, P(0) - 0.4]}
            size={2}
            speed={0.25}
            opacity={0.4}
            color={TOKENS.yellow}
          />
        )}

        {/* place 4: the feelings grove. The DOM cast lineup is the artwork
            here (a 3D echo of the same five read as ghosting, not depth);
            the world contributes the grove itself: low flowers in the five
            feeling colors standing in the cool light. */}

        {/* place 5: Lumi's home. The DOM product photo hands off to the
            plush turning live on its mound (data-scene-hide). */}
        <LumiModel position={[-1.05, 0, P(5) - 0.6]} height={1.7} />

        {/* place 10 (the sunset finale) needs no 3D cast: the finale section
            keeps its own opaque orange (white text + the conversion moment
            never depend on the canvas) and carries the DOM lineup. The world
            contributes the sunset approach: sky and sun turn orange through
            the journal meadow on the way in. */}
      </Suspense>

      {/* place 6: the PlayOS sky, voice particles drifting between clouds */}
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
      <BrandShape kind="squircle" color={TOKENS.cream} position={[-2.6, 2.7, P(6) - 2]} scale={1.3} floatPhase={2} />
      <BrandShape kind="squircle" color={TOKENS.cream} position={[2.8, 3.2, P(6) - 3]} scale={1.6} floatPhase={4.5} />

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
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => initStageTracking(), []);

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
          <World tier={tier} onReady={onReady} />
        </Canvas>
      </StageErrorBoundary>
    </div>
  );
}
