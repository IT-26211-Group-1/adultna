"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { CameraController } from "./CameraController";
import { RoadmapModel } from "./RoadmapModel";
import { MilestoneModal } from "./MilestoneModal";
import { MilestoneService } from "../infrastructure/milestoneService";
import {
  CameraAnimation,
  Milestone,
  RoadmapInteraction,
} from "../../../../types/roadmap";

const CAMERA_ANIMATION: CameraAnimation = {
  from: {
    position: [55, 0, 10],
    fov: 6,
  },
  to: {
    position: [5, 8, 5],
    fov: 40,
  },
  duration: 2000,
  delay: 1000,
};

export function RoadmapClient() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );

  const handleMilestoneClick = (interaction: RoadmapInteraction) => {
    const milestone = MilestoneService.getMilestone(interaction.milestoneId);

    if (milestone) {
      setSelectedMilestone(milestone);
      onOpen();
    }
  };

  return (
    <>
      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 55 }}
          className="w-full h-full"
          resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
        >
          <CameraController animation={CAMERA_ANIMATION} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <ambientLight intensity={1.2} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <directionalLight intensity={2} position={[10, 15, 10]} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <pointLight intensity={1.5} position={[0, 20, 0]} />
          <Suspense fallback={null}>
            <RoadmapModel onMilestoneClick={handleMilestoneClick} />
          </Suspense>
          {/* OrbitControls with full freedom - no restrictions on movement */}
          <OrbitControls
            dampingFactor={0.05}
            enableDamping={true}
            enablePan={true}
            enableRotate={true}
            enableZoom={true}
            maxDistance={50}
            maxPolarAngle={Math.PI}
            minDistance={2}
          />
        </Canvas>
      </div>

      <MilestoneModal
        isOpen={isOpen}
        milestone={selectedMilestone}
        onClose={onClose}
      />
    </>
  );
}
