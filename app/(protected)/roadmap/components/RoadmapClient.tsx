"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useCallback, useEffect, useMemo } from "react";
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

// Desktop intro animation
const DESKTOP_CAMERA_ANIMATION: CameraAnimation = {
  from: {
    position: [55, 0, 10],
    fov: 6,
  },
  to: {
    position: [5, 8, 5],
    fov: 40,
  },
  duration: 800,
  delay: 200,
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

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }, []);

  // Camera positions optimized for each device type
  const cameraSettings = useMemo(() => {
    if (isMobile) {
      return {
        position: [3, 6, 8] as [number, number, number], // Closer, higher angle for mobile
        fov: 75, // Wider FOV for mobile screens
        introAnimation: null, // No intro animation for mobile
      };
    } else {
      return {
        position: [0, 5, 15] as [number, number, number], // Starting position for desktop animation
        fov: 55, // Standard FOV for desktop
        introAnimation: DESKTOP_CAMERA_ANIMATION,
      };
    }
  }, [isMobile]);

  const canvasWebGLSettings = useMemo(() => {
    const baseSettings = {
      resize: { scroll: false, debounce: { scroll: 50, resize: 100 } },
      dpr: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2) : 1,
      performance: { min: isMobile ? 0.3 : 0.5 },
      gl: {
        antialias: !isMobile,
        alpha: true,
        powerPreference: "default" as const,
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      }
    };

    if (isMobile) {
      baseSettings.gl = {
        ...baseSettings.gl,
        powerPreference: "default" as const,
      };
    }

    return baseSettings;
  }, [isMobile]);

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

      const fromPosition: [number, number, number] = isMobile ? cameraSettings.position : [5, 8, 5];
      const fromFov = isMobile ? cameraSettings.fov : 40;

      return {
        from: {
          position: fromPosition,
          fov: fromFov,
        },
        to: {
          position: [x + offsetX, y + 3.5, z + offsetZ],
          fov: isMobile ? 60 : 30, // Less aggressive zoom for mobile
        },
        duration: isMobile ? 400 : 600, // Faster animations on mobile
        delay: 0,
      };
    },
    [isMobile, cameraSettings],
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
          camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
          className="w-full h-full"
          {...canvasWebGLSettings}
          onClick={handleCanvasClick}
        >
          <CameraController
            introAnimation={cameraSettings.introAnimation}
            milestoneAnimation={milestoneAnimation}
            isMobile={isMobile}
          />
          {/* Optimized lighting setup for mobile performance */}
          {/* eslint-disable-next-line react/no-unknown-property */}
          <ambientLight intensity={isMobile ? 1.2 : 1.0} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <directionalLight intensity={isMobile ? 1.2 : 1.5} position={[10, 15, 10]} />
          {!isMobile && (
            /* eslint-disable-next-line react/no-unknown-property */
            <hemisphereLight intensity={0.4} groundColor="#444444" />
          )}
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[1, 0.1, 1]} />
                <meshBasicMaterial color="#e5e7eb" />
              </mesh>
            }
          >
            <RoadmapModel
              milestones={milestones}
              onMilestoneClick={handleMilestoneClick}
            />
          </Suspense>
          <OrbitControls
            dampingFactor={isMobile ? 0.08 : 0.05}
            enableDamping={true}
            enablePan={!isMobile}
            enableRotate={true}
            enableZoom={true}
            maxDistance={isMobile ? 30 : 50}
            maxPolarAngle={Math.PI}
            minDistance={isMobile ? 3 : 2}
            rotateSpeed={isMobile ? 0.8 : 1}
            zoomSpeed={isMobile ? 0.8 : 1}
            touches={{
              ONE: 1, // Rotate
              TWO: 2, // Zoom
            }}
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
