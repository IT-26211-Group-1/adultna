'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { Suspense, useState } from 'react';
import { useDisclosure } from '@heroui/react';
import { CameraController } from './components/CameraController';
import { RoadmapModel } from './components/RoadmapModel';
import { MilestoneModal } from './components/MilestoneModal';
import { MilestoneService } from './infrastructure/milestoneService';
import { CameraAnimation, Milestone, RoadmapInteraction } from './domain/types';

const CAMERA_ANIMATION: CameraAnimation = {
  from: {
    position: [55, 0, 10],
    fov: 6
  },
  to: {
    position: [5, 8, 5],
    fov: 40
  },
  duration: 2000,
  delay: 1000
};

export default function RoadmapPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const handleMilestoneClick = (interaction: RoadmapInteraction) => {
    const milestone = MilestoneService.getMilestone(interaction.milestoneId);
    if (milestone) {
      setSelectedMilestone(milestone);
      onOpen();
    }
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-transparent px-6 py-4 dark:border-gray-700">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Roadmap
        </h1>
      </header>

      {/* Main Content - Full viewport height for 3D roadmap */}
      <main className="flex-1 overflow-hidden">
        {/* 3D Model Container */}
        <div className="w-full h-full relative">
            <Canvas
              camera={{ position: [0, 5, 15], fov: 55 }}
              className="w-full h-full"
              resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
            >
              <CameraController animation={CAMERA_ANIMATION} />
              <ambientLight intensity={1.2} />
              <directionalLight position={[10, 15, 10]} intensity={2} />
              <pointLight position={[0, 20, 0]} intensity={1.5} />
              <Suspense fallback={null}>
                <RoadmapModel onMilestoneClick={handleMilestoneClick} />
              </Suspense>
              {/* OrbitControls with full freedom - no restrictions on movement */}
              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                enableDamping={true}
                dampingFactor={0.05}
                minDistance={2}
                maxDistance={50}
                maxPolarAngle={Math.PI}
              />
            </Canvas>
        </div>
      </main>

      <MilestoneModal
        isOpen={isOpen}
        onClose={onClose}
        milestone={selectedMilestone}
      />
    </div>
  );
}
