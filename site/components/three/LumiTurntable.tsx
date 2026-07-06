"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";

const SRC = "/models/lumi-plush.glb";

/** A slow product turntable: one revolution roughly every 24 seconds, the
 *  pace of a toy on a shop shelf. No controls, no zoom; it is a moment, not
 *  a configurator. */
function Plush({ onReady }: { onReady?: () => void }) {
  const { scene: model } = useGLTF(SRC);
  const group = useRef<THREE.Group>(null);

  useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const s = 2.0 / size.y;
    model.scale.setScalar(s);
    box.setFromObject(model);
    const c = box.getCenter(new THREE.Vector3());
    model.position.x -= c.x;
    model.position.z -= c.z;
    model.position.y -= box.min.y;
  }, [model]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.26;
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

export default function LumiTurntable({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 30, position: [0, 1.25, 4.6] }}
      onCreated={({ camera }) => camera.lookAt(0, 0.95, 0)}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[2.5, 4, 3]} intensity={1.5} color="#fff6ea" />
      <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#3aa4e5" />
      <Plush onReady={onReady} />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={4} blur={2.6} far={2} color="#1c6d95" frames={1} />
    </Canvas>
  );
}

useGLTF.preload(SRC);
