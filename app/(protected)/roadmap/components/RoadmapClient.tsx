"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useCallback } from "react";
import { useDisclosure, Spinner } from "@heroui/react";
import { CameraController } from "./CameraController";
import { RoadmapModel } from "./RoadmapModel";
import { MilestoneModal } from "./MilestoneModal";
import { useUserMilestones } from "@/hooks/queries/useRoadmapQueries";
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
  const [milestoneAnimation, setMilestoneAnimation] =
    useState<CameraAnimation | null>(null);

  const {
    data: milestones = [],
    isLoading,
    refetch: refetchMilestones,
  } = useUserMilestones();

  // Calculate camera position for milestone zoom
  const createMilestoneZoom = (milestone: Milestone): CameraAnimation => {
    const { x, y, z } = milestone.position;

    // Calculate optimal camera angle based on milestone position with top-down view
    const offsetX = x > 0 ? 1.2 : -1.2; // Reduced horizontal offset
    const offsetZ = z > 0 ? 1.2 : -1.2; // Reduced depth offset

    return {
      from: {
        position: [5, 8, 5], // Current camera position after initial animation
        fov: 40,
      },
      to: {
        position: [x + offsetX, y + 3.5, z + offsetZ], // Higher Y for top-down view
        fov: 30, // Less aggressive zoom
      },
      duration: 1200,
      delay: 0,
    };
  };

  const handleMilestoneClick = (interaction: RoadmapInteraction) => {
    console.log("🎯 handleMilestoneClick called with:", interaction);
    const milestone = milestones.find((m) => m.id === interaction.milestoneId);

    console.log("📊 Found milestone:", milestone);

    if (milestone) {
      setSelectedMilestone(milestone);
      const zoomAnimation = createMilestoneZoom(milestone);

      setMilestoneAnimation(zoomAnimation);
      onOpen();
      console.log("✅ Modal should open now with camera zoom");
    } else {
      console.log("❌ No milestone found for ID:", interaction.milestoneId);
    }
  };

  const handleMilestoneUpdated = useCallback(() => {
    refetchMilestones();
  }, [refetchMilestones]);

  const handleModalClose = () => {
    setMilestoneAnimation(null);
    setSelectedMilestone(null);
    onClose();
  };

  // Fallback click handler for the Canvas element
  const handleCanvasClick = (event: React.MouseEvent) => {
    console.log("🖱️  Canvas clicked at:", event.clientX, event.clientY);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <Spinner color="primary" size="lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [0, 5, 15], fov: 55 }}
          className="w-full h-full"
          resize={{ scroll: false, debounce: { scroll: 50, resize: 100 } }}
          onClick={handleCanvasClick}
        >
          <CameraController
            animation={CAMERA_ANIMATION}
            milestoneAnimation={milestoneAnimation}
          />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <ambientLight intensity={1.2} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <directionalLight intensity={2} position={[10, 15, 10]} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <pointLight intensity={1.5} position={[0, 20, 0]} />
          <Suspense fallback={null}>
            <RoadmapModel
              milestones={milestones}
              onMilestoneClick={handleMilestoneClick}
            />
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
        onClose={handleModalClose}
        onMilestoneUpdated={handleMilestoneUpdated}
      />
    </>
  );
}
