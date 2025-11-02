"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Group } from "three";

function RoadmapModelMesh() {
  const { scene } = useGLTF("/models/roadmap.glb");
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={[1.5, 1.5, 1.5]}
        position={[0, 1, 0]}
      />
    </group>
  );
}

function RoadmapModel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [6, 11, 12], fov: 40 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          <ambientLight intensity={0.6} />
          <directionalLight position={[8, 8, 5]} intensity={1} />
          <RoadmapModelMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function Roadmap() {
  return (
    <section id="roadmap-section" className="w-full bg-white h-[400px] md:h-[600px]">
      <RoadmapModel3D />
    </section>
  );
}
