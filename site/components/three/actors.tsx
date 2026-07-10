"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { stageStore } from "@/lib/three/store";
import { contentFadeTarget } from "@/lib/three/exclusion";
import { getShapeGeometry } from "@/lib/three/shape-geometry";
import type { ShapeKind } from "@/lib/shape-paths";

export const SPACING = 7; // world units between journey places

/* ---------------------------------------------------------------- pop-up --
   The D4 storybook element: actors rise out of the ground and unfold as the
   camera approaches their place, like paper craft standing up from a fold. */
export function usePopup(
  group: React.RefObject<THREE.Group | null>,
  place: number,
  stagger = 0,
) {
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const { journey } = stageStore.getState();
    const on = journey > place - 0.55 + stagger;
    const target = on ? 1 : 0;
    g.userData.pop = THREE.MathUtils.damp(g.userData.pop ?? 0, target, 4.5, delta);
    const p = g.userData.pop as number;
    g.scale.setScalar(Math.max(p, 0.0001));
    g.rotation.x = (1 - p) * -0.9;
  });
}

/* ------------------------------------------------------------- the mascot --
   Rigged, clip-less by decision (Tripo presets retarget-broke the chibi
   body). The idle lives here instead: breathing on the spine, a soft bob,
   and the head following the pointer with damped neck falloff. */
export function MascotModel({
  position = [0, 0, 0] as [number, number, number],
  rotationY = 0,
  height = 2.05,
  onReady,
}: {
  position?: [number, number, number];
  rotationY?: number;
  height?: number;
  onReady?: () => void;
}) {
  const { scene: model } = useGLTF("/models/kheelona-mascot.glb");
  const group = useRef<THREE.Group>(null);
  const bones = useRef<{
    head?: THREE.Object3D;
    headBase?: THREE.Quaternion;
    spine?: THREE.Object3D;
    spineBaseX?: number;
  }>({});

  useMemo(() => {
    // the GLTF scene is cached and shared across mounts: measure its RAW
    // size once and derive scale from that, or a remount would re-measure
    // the already-scaled model and undo itself (QA 2026-07-10)
    if (!model.userData.rawHeight) {
      model.scale.setScalar(1);
      model.position.set(0, 0, 0);
      const raw = new THREE.Box3().setFromObject(model);
      model.userData.rawHeight = raw.getSize(new THREE.Vector3()).y || 1;
    }
    const s = height / (model.userData.rawHeight as number);
    model.scale.setScalar(s);
    model.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(model);
    const c = box.getCenter(new THREE.Vector3());
    model.position.x -= c.x;
    model.position.z -= c.z;
    model.position.y -= box.min.y;
    model.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).frustumCulled = false;
    });
  }, [model, height]);

  useEffect(() => {
    const head = model.getObjectByName("Head") ?? undefined;
    const spine = model.getObjectByName("Spine01") ?? undefined;
    bones.current = {
      head,
      headBase: head?.quaternion.clone(),
      spine,
      spineBaseX: spine?.rotation.x,
    };
    onReady?.();
  }, [model, onReady]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { px, py } = stageStore.getState();

    // breathing idle
    const breathe = Math.sin(t * 1.5);
    const { head, headBase, spine, spineBaseX } = bones.current;
    if (spine && spineBaseX !== undefined) spine.rotation.x = spineBaseX + breathe * 0.022;
    g.position.y = position[1] + Math.sin(t * 1.15) * 0.015;

    // head follows the cursor (small by design), neck falloff via damping
    if (head && headBase) {
      const yaw = THREE.MathUtils.clamp(px * 0.38, -0.5, 0.5);
      const pitch = THREE.MathUtils.clamp(py * 0.16, -0.25, 0.25);
      const target = headBase
        .clone()
        .multiply(
          new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, 0, -yaw * 0.85)),
        );
      head.quaternion.slerp(target, 1 - Math.exp(-5 * delta));
    }
    // whole body leans a whisper toward the pointer
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rotationY + px * 0.1, 3, delta);
  });

  return (
    <group ref={group} position={position} rotation-y={rotationY}>
      <primitive object={model} />
    </group>
  );
}

/* -------------------------------------------------------------- the plush --
   Lumi at its home place: a slow, calm turn; leans a little toward the
   pointer, like it noticed you. */
export function LumiModel({
  position = [0, 0, 0] as [number, number, number],
  height = 1.55,
  fadeByDistance = false,
}: {
  position?: [number, number, number];
  height?: number;
  /** journey use: fade out while the camera is in transit between beats so
   *  the plush never crosses a neighboring section's copy (the inset canvas
   *  on /products/lumi keeps it always-on) */
  fadeByDistance?: boolean;
}) {
  const { scene: model } = useGLTF("/models/lumi-plush.glb");
  const group = useRef<THREE.Group>(null);
  const mats = useRef<THREE.Material[]>([]);

  useMemo(() => {
    // idempotent across remounts of the cached GLTF scene (QA 2026-07-10)
    if (!model.userData.rawHeight) {
      model.scale.setScalar(1);
      model.position.set(0, 0, 0);
      const raw = new THREE.Box3().setFromObject(model);
      model.userData.rawHeight = raw.getSize(new THREE.Vector3()).y || 1;
    }
    const s = height / (model.userData.rawHeight as number);
    model.scale.setScalar(s);
    model.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(model);
    const c = box.getCenter(new THREE.Vector3());
    model.position.x -= c.x;
    model.position.z -= c.z;
    model.position.y -= box.min.y;
  }, [model, height]);

  useEffect(() => {
    if (!fadeByDistance) return;
    const found: THREE.Material[] = [];
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        for (const m of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          m.transparent = true;
          found.push(m);
        }
      }
    });
    mats.current = found;
    return () => {
      // the GLB scene is cached by useGLTF and shared with LumiInset:
      // leave the materials the way the inset expects them
      for (const m of found) {
        m.opacity = 1;
        m.transparent = false;
      }
      mats.current = [];
    };
  }, [model, fadeByDistance]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // sway around the front (a full spin would show its back half the time)
    const t = state.clock.elapsedTime;
    const { px } = stageStore.getState();
    g.rotation.y = -0.15 + Math.sin(t * 0.32) * 0.55 + px * 0.12;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, px * -0.04, 2.5, delta);
    g.position.y = position[1] + Math.sin(t * 1.05) * 0.012;

    if (fadeByDistance && mats.current.length) {
      // full presence while the camera dwells at this place, softening on
      // approach, fully gone by the neighboring beat (a steeper curve made
      // the plush invisible while its own card was still arriving)
      const away = Math.abs(state.camera.position.z - 4.6 - position[2]) / SPACING;
      const target = THREE.MathUtils.clamp(1.45 - away * 1.5, 0, 1);
      const next = THREE.MathUtils.damp(mats.current[0].opacity, target, 6, delta);
      for (const m of mats.current) m.opacity = next;
      g.visible = next > 0.02;
    }
  });

  return (
    <group ref={group} position={position}>
      <primitive object={model} />
    </group>
  );
}

/* ---------------------------------------------------------- sprite cutout --
   Approved 2D art as an alpha plane in the world (feelings cast, finale
   lineup): cheap presence for beats that have no model. */
export function SpriteCutout({
  url,
  position,
  height = 1.4,
  aspect = 0.78,
  place,
  stagger = 0,
  sway = true,
}: {
  url: string;
  position: [number, number, number];
  height?: number;
  aspect?: number;
  place: number;
  stagger?: number;
  sway?: boolean;
}) {
  const tex = useTexture(url);
  const group = useRef<THREE.Group>(null);
  usePopup(group, place, stagger);

  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
  }, [tex]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    if (sway) {
      g.rotation.z = Math.sin(state.clock.elapsedTime * 0.9 + position[0] * 2.1) * 0.02;
    }
    // fade out as the camera passes so nothing ever flies through the lens
    if (mat.current) {
      const dist = position[2] - state.camera.position.z;
      mat.current.opacity = THREE.MathUtils.clamp((-dist - 1.1) / 1.4, 0, 1);
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[height * aspect, height]} />
        <meshBasicMaterial
          ref={mat}
          map={tex}
          transparent
          alphaTest={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------ brand shape --
   One extruded design-system shape: the soft toy blocks the world is made of. */
export function BrandShape({
  kind,
  color,
  position,
  scale = 1,
  rotation = [0, 0, 0] as [number, number, number],
  floatPhase = 0,
  floatAmp = 0.18,
  keepClear = true,
}: {
  kind: ShapeKind;
  color: string;
  position: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  floatPhase?: number;
  floatAmp?: number;
  /** ghost down when the projection crosses a copy rect (exclusion.ts) */
  keepClear?: boolean;
}) {
  const geo = useMemo(() => getShapeGeometry(kind), [kind]);
  const ref = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    m.position.y = position[1] + Math.sin(t * 0.5 + floatPhase) * floatAmp;
    m.rotation.z = rotation[2] + Math.sin(t * 0.3 + floatPhase) * 0.08;

    // the legibility contract: never sit vividly over copy. Radius covers
    // the extruded silhouette incl. bevel + corner reach, not the unit disc.
    if (keepClear && mat.current) {
      const target = contentFadeTarget(m.position, 0.75 * scale, state.camera);
      mat.current.opacity = THREE.MathUtils.damp(mat.current.opacity, target, 8, delta);
    }
  });

  return (
    <mesh ref={ref} geometry={geo} position={position} rotation={rotation} scale={scale}>
      <meshStandardMaterial
        ref={mat}
        color={color}
        roughness={0.65}
        metalness={0}
        transparent={keepClear}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------ shape field --
   The world dressing: brand shapes scattered along the whole path at varied
   depths. Deterministic layout (no Math.random: SSR/replay safety). */
const KINDS: ShapeKind[] = ["flower5", "flower13", "squircle"];

export function ShapeField({
  count,
  palette,
  depthRange = [6, 6 + 10.2 * SPACING],
}: {
  count: number;
  palette: string[];
  /** [near, far] distance in front of the camera line (z = -near..-far);
   *  the journey spreads along the whole path, interiors hold a static room */
  depthRange?: [number, number];
}) {
  const items = useMemo(() => {
    const out: {
      kind: ShapeKind;
      color: string;
      position: [number, number, number];
      scale: number;
      phase: number;
      rz: number;
    }[] = [];
    const [near, far] = depthRange;
    for (let i = 0; i < count; i++) {
      // golden-ratio driven pseudo-random, stable across renders
      const r1 = (i * 0.6180339887) % 1;
      const r2 = (i * 0.7548776662) % 1;
      const r3 = (i * 0.8191725133) % 1;
      const side = i % 2 === 0 ? 1 : -1;
      out.push({
        kind: KINDS[i % KINDS.length],
        color: palette[i % palette.length],
        position: [
          side * (2.7 + r1 * 2.3),
          0.5 + r2 * 3.0,
          -(near + r3 * (far - near)),
        ],
        scale: 0.28 + r1 * 0.42,
        phase: i * 1.7,
        rz: (r2 - 0.5) * 0.8,
      });
    }
    return out;
  }, [count, palette, depthRange]);

  return (
    <group>
      {items.map((it, i) => (
        <BrandShape
          key={i}
          kind={it.kind}
          color={it.color}
          position={it.position}
          scale={it.scale}
          floatPhase={it.phase}
          rotation={[0, 0, it.rz]}
        />
      ))}
    </group>
  );
}

// No module-scope useGLTF.preload here: it would fetch the 1.4MB mascot GLB
// on every tier the moment this chunk parses, including phones that never
// render the models (they keep DOM art). Suspense fetches on mount instead;
// the stage mounts post-idle, so the crossfade contract already tolerates it.
