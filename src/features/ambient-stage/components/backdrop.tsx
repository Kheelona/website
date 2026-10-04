"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { stageStore } from "@/features/ambient-stage/lib/store";
import { BEAT_WASHES, TOKENS } from "@/features/ambient-stage/lib/tokens";

/* --------------------------------------------------------- wash backdrop --
   The wash handoff: the sky glides through the same tokens the flat site
   painted as opaque section washes. Fog matches, so distant things sit as
   soft silhouettes.
   - journey mode: stops are the Home BEAT_WASHES, driven by `journey`
   - ambient mode: stops are measured from the page's own [data-wash]
     sections (lib/three/ambient.ts), driven by `washJourney` */
export function WashBackdrop({ mode = "journey" }: { mode?: "journey" | "ambient" }) {
  const scene = useThree((s) => s.scene);
  const colors = useRef<THREE.Color[]>([]);
  const stopsKey = useRef("");
  const current = useRef(new THREE.Color("#FFF7EE"));

  useEffect(() => {
    scene.background = current.current;
    // tight fog: what is far away stays a soft silhouette until approached
    scene.fog = new THREE.Fog(current.current, 8, 21);
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene]);

  useFrame((_, delta) => {
    const state = stageStore.getState();
    const stops = mode === "journey" ? BEAT_WASHES : state.washStops;
    if (!stops.length) return;

    // (re)parse only when the stop list actually changes
    const key = stops.join();
    if (key !== stopsKey.current) {
      stopsKey.current = key;
      colors.current = stops.map((c) => new THREE.Color(c));
    }
    if (!colors.current.length) return;

    const pos = mode === "journey" ? state.journey : state.washJourney;
    const i = Math.max(0, Math.min(Math.floor(pos), colors.current.length - 2));
    const t = THREE.MathUtils.clamp(pos - i, 0, 1);
    const target =
      colors.current.length === 1
        ? colors.current[0]
        : colors.current[i].clone().lerp(colors.current[i + 1], t);
    current.current.lerp(target, 1 - Math.exp(-3 * delta));
    if (scene.fog) (scene.fog as THREE.Fog).color = current.current;
  });
  return null;
}

/* The sun: rides ahead of the camera all journey, sinks and grows into the
   sunset the finale happens inside. Journey-only (interiors keep a bare sky). */
export function Sun() {
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
