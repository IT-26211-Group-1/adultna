"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useCallback, useEffect } from "react";
import { useDisclosure } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { CameraController } from "./CameraController";
import { RoadmapModel } from "./RoadmapModel";
import { MilestoneModal } from "./MilestoneModal";
import { useUserMilestonesWithPolling } from "@/hooks/queries/useRoadmapQueries";
import {
  CameraAnimation,
  Milestone,
  RoadmapInteraction,
} from "../../../../types/roadmap";
import { logger } from "@/lib/logger";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

// Lazy load Three.js Canvas component
const Canvas = dynamic(
  () => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner fullScreen={false} size="xl" variant="default" />
      </div>
    ),
  }
);

// Lazy load OrbitControls
const OrbitControls = dynamic(
  () => import("@react-three/drei").then((mod) => ({ default: mod.OrbitControls })),
  { ssr: false }
);

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );
  const [milestoneAnimation, setMilestoneAnimation] =
    useState<CameraAnimation | null>(null);
  const [hasOpenedFromQuery, setHasOpenedFromQuery] = useState(false);

  const {
    data: milestones = [],
    isLoading,
    refetch: refetchMilestones,
  } = useUserMilestonesWithPolling(true);

  // Calculate camera position for milestone zoom
  const createMilestoneZoom = useCallback(
    (milestone: Milestone): CameraAnimation => {
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
    },
    [],
  );

  // Auto-open milestone modal from query parameter
  useEffect(() => {
    const milestoneId = searchParams.get("milestoneId");

    if (
      !isLoading &&
      milestones.length > 0 &&
      milestoneId &&
      !hasOpenedFromQuery
    ) {
      const milestone = milestones.find((m) => m.id === milestoneId);

      if (milestone) {
        logger.log("🎯 Auto-opening milestone from URL:", milestoneId);
        setSelectedMilestone(milestone);
        const zoomAnimation = createMilestoneZoom(milestone);

        setMilestoneAnimation(zoomAnimation);
        onOpen();
        setHasOpenedFromQuery(true);
      } else {
        logger.log("❌ Milestone not found in list:", milestoneId);
      }
    }
  }, [
    milestones,
    isLoading,
    searchParams,
    onOpen,
    hasOpenedFromQuery,
    createMilestoneZoom,
  ]);

  const handleMilestoneClick = (interaction: RoadmapInteraction) => {
    const milestone = milestones.find((m) => m.id === interaction.milestoneId);

    if (milestone) {
      setSelectedMilestone(milestone);
      const zoomAnimation = createMilestoneZoom(milestone);

      setMilestoneAnimation(zoomAnimation);
      onOpen();
    } else {
      logger.log("❌ No milestone found for ID:", interaction.milestoneId);
    }
  };

  const handleMilestoneUpdated = useCallback(() => {
    refetchMilestones();
  }, [refetchMilestones]);

  const handleModalClose = () => {
    setMilestoneAnimation(null);
    setSelectedMilestone(null);
    onClose();

    // Remove milestoneId query parameter when closing modal
    const milestoneId = searchParams.get("milestoneId");

    if (milestoneId) {
      router.replace("/roadmap", { scroll: false });
    }
  };

  // Fallback click handler for the Canvas element
  const handleCanvasClick = (event: React.MouseEvent) => {
    logger.log("🖱️  Canvas clicked at:", event.clientX, event.clientY);
  };

  if (isLoading || milestones.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner fullScreen={false} size="xl" variant="default" />
          <p className="text-gray-600 text-lg font-medium">
            {isLoading
              ? "Loading your roadmap..."
              : "Generating your personalized roadmap..."}
          </p>
          <p className="text-gray-500 text-sm">This may take a few moments</p>
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
