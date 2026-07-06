"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Sparkles, useAnimations, useGLTF } from "@react-three/drei";

const SRC = "/models/kheelona-mascot.glb";

/** The mascot with feet on y=0, height ~2.1 units, idling. Plays the baked
 *  clip when the GLB has one; otherwise a soft procedural bob so the scene
 *  never feels frozen. Yaw follows scroll (the mascot "turns to watch you
 *  leave"), tilt follows the pointer; both damped, both small by design. */
function Mascot({ onReady }: { onReady?: () => void }) {
  const { scene: model, animations } = useGLTF(SRC);
  const { actions } = useAnimations(animations, model);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const s = 2.1 / size.y;
    model.scale.setScalar(s);
    box.setFromObject(model);
    const c = box.getCenter(new THREE.Vector3());
    model.position.x -= c.x;
    model.position.z -= c.z;
    model.position.y -= box.min.y;
  }, [model]);

  useEffect(() => {
    onReady?.();
    const first = Object.values(actions)[0];
    first?.reset().fadeIn(0.4).play();
    return () => {
      first?.fadeOut(0.2);
    };
  }, [actions, onReady]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const hasClip = animations.length > 0;

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    // scroll progress across the first viewport only
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    const targetYaw = scroll * 0.55 + pointer.current.x * 0.14;
    const targetPitch = pointer.current.y * 0.05;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetYaw, 3, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetPitch, 3, delta);
    if (!hasClip) {
      g.position.y = Math.sin(state.clock.elapsedTime * 1.4) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 32, position: [0, 1.35, 4.4] }}
      onCreated={({ camera }) => camera.lookAt(0, 1.05, 0)}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.7} color="#fff6ea" />
      <directionalLight position={[-3, 2, -2]} intensity={0.5} color="#3aa4e5" />
      <Mascot onReady={onReady} />
      <Sparkles count={16} scale={[2.6, 2.4, 1.4]} position={[0, 1.3, 0]} size={2.2} speed={0.25} opacity={0.4} color="#f1a23b" />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.32} scale={4.4} blur={2.8} far={2.2} color="#8a4a1c" frames={1} />
    </Canvas>
  );
}

useGLTF.preload(SRC);
