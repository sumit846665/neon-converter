"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function Core() {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.18;
      mesh.current.rotation.y += delta * 0.24;
    }
  });

  return (
    <Float speed={2.8} rotationIntensity={0.55} floatIntensity={1.4}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.55, 4]} />
        <MeshDistortMaterial
          color="#36f4ff"
          emissive="#1f85ff"
          emissiveIntensity={0.42}
          metalness={0.84}
          roughness={0.12}
          distort={0.28}
          speed={1.6}
        />
      </mesh>
      <mesh rotation={[0.8, 0.3, 0.2]}>
        <torusGeometry args={[2.15, 0.018, 16, 160]} />
        <meshBasicMaterial color="#ff4dff" />
      </mesh>
      <mesh rotation={[1.8, -0.6, 0.8]}>
        <torusGeometry args={[2.58, 0.014, 16, 180]} />
        <meshBasicMaterial color="#b8ff65" />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <div className="pointer-events-auto absolute inset-0 min-h-[620px] opacity-95">
      <Canvas camera={{ position: [0, 0, 6], fov: 48 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[4, 3, 4]} color="#36f4ff" intensity={16} />
        <pointLight position={[-3, -2, 3]} color="#ff4dff" intensity={10} />
        <Stars radius={80} depth={40} count={1400} factor={3} fade speed={1.2} />
        <Core />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.55} />
      </Canvas>
    </div>
  );
}
