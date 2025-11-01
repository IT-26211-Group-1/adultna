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
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        scale={[1.2, 1.2, 1.2]}
        position={[0, -0.5, 0]}
      />
    </group>
  );
}

function RoadmapModel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [10, 5, 5], fov: 60 }}
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
    <section className="w-full bg-white relative min-h-screen">
      {/* Full-width 3D Model Background */}
      <div className="absolute inset-0 w-full h-full">
        <RoadmapModel3D />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center min-h-[800px]">
            {/* Left Content */}
            <div className="w-full lg:w-1/2">
              <div className="space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-lg">
                <h2 className="text-4xl md:text-5xl text-gray-900 leading-tight font-playfair">
                  Navigate your future, <br/> <span className="text-adult-green">step by step</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-inter">
                  Get your personal and professional life running smoothly with our AI-powered roadmap solution.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-adult-green text-lg">✓</span>
                    <span className="text-gray-700 font-inter">Create personalized career and life plans</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-adult-green text-lg">✓</span>
                    <span className="text-gray-700 font-inter">Set and track meaningful goals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-adult-green text-lg">✓</span>
                    <span className="text-gray-700 font-inter">Get AI-powered guidance and recommendations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
