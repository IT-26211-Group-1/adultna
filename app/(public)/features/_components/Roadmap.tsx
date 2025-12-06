"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Group } from "three";

function RoadmapModelMesh() {
  const { scene } = useGLTF("/models/final-roadmap-draco.glb");
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <primitive object={scene} position={[0, 1, 0]} scale={[1.5, 1.5, 1.5]} />
    </group>
  );
}

function RoadmapModel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [6, 11, 12], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Environment preset="sunset" />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <ambientLight intensity={0.6} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <directionalLight intensity={1} position={[8, 8, 5]} />
          <RoadmapModelMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function Roadmap() {
  return (
    <section
      className="w-full bg-white h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]"
      id="roadmap-section"
    >
      <RoadmapModel3D />
    </section>
  );
}
