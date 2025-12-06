"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useState, useCallback, useEffect, useMemo } from "react";
import React from "react";
import { useDisclosure } from "@heroui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { CameraController } from "./CameraController";
import { RoadmapModel } from "./RoadmapModel";
import { MilestoneModal } from "./MilestoneModal";
import { CameraView } from "./CameraViewSelector";
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

interface RoadmapClientProps {
  onEmptyPositionClick?: (positionNumber: number) => void;
  selectedCameraView?: CameraView | null;
}

export function RoadmapClient({
  onEmptyPositionClick,
  selectedCameraView,
}: RoadmapClientProps = {}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );
  const [milestoneAnimation, setMilestoneAnimation] =
    useState<CameraAnimation | null>(null);
  const [cameraViewAnimation, setCameraViewAnimation] =
    useState<CameraAnimation | null>(null);

  // Debug animation states
  React.useEffect(() => {
    console.log(
      "🔄 Animation states changed - milestoneAnimation:",
      milestoneAnimation,
      "cameraViewAnimation:",
      cameraViewAnimation,
    );
  }, [milestoneAnimation, cameraViewAnimation]);
  const [hasOpenedFromQuery, setHasOpenedFromQuery] = useState(false);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;

    return (
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    );
  }, []);

  // Default camera view (top view vertical)
  const DEFAULT_CAMERA_VIEW: CameraView = {
    id: "top-vertical",
    name: "Top View",
    position: [0.3, 15, 0],
    fov: 31,
  };

  // Camera positions optimized for each device type
  const cameraSettings = useMemo(() => {
    if (isMobile) {
      return {
        // 🔧 MOBILE CAMERA POSITION ADJUSTMENT [X, Y, Z]
        // X: Left(-) / Right(+) | Y: Down(-) / Up(+) | Z: Away(-) / Closer(+)
        // Optimized height to fit roadmap close to screen borders
        position: [0.3, 16, 0] as [number, number, number], // Closer position for mobile

        // 📱 MOBILE FIELD OF VIEW ADJUSTMENT - FIT TO BORDERS
        // Smaller number = zoomed in, Larger number = zoomed out
        // Desktop: 31, Mobile: 45 (balanced view to fit screen borders)
        fov: 45, // Balanced FOV to fit roadmap close to mobile screen borders

        introAnimation: null, // No intro animation for mobile
      };
    } else {
      // 🖥️ DESKTOP SETTINGS (separate from mobile)
      return {
        position: [0, 5, 15] as [number, number, number], // Starting position for desktop animation
        fov: 55, // Standard FOV for desktop
        introAnimation: {
          ...DESKTOP_CAMERA_ANIMATION,
          to: {
            position: DEFAULT_CAMERA_VIEW.position,
            fov: DEFAULT_CAMERA_VIEW.fov,
          },
        },
      };
    }
  }, [isMobile]);

  const canvasWebGLSettings = useMemo(() => {
    const baseSettings = {
      resize: { scroll: false, debounce: { scroll: 50, resize: 100 } },
      dpr:
        typeof window !== "undefined"
          ? Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
          : 1,
      performance: { min: isMobile ? 0.3 : 0.5 },
      gl: {
        antialias: !isMobile,
        alpha: true,
        powerPreference: "default" as const,
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
      },
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

  // 🎯 SIMPLIFIED: No camera animation for now - just focus on modal
  const createMilestoneZoom = useCallback(
    (milestone: Milestone): CameraAnimation | null => {
      console.log("🔍 Milestone clicked:", milestone);
      console.log("🔍 Milestone position:", milestone.position);

      // Return null for now to skip animation and focus on modal functionality
      console.log("⏭️ Skipping camera animation for debugging");

      return null;
    },
    [isMobile, DEFAULT_CAMERA_VIEW],
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

  // Handle camera view changes
  useEffect(() => {
    if (selectedCameraView) {
      const camera = (window as any).__camera;

      if (camera) {
        // Get current camera position
        const currentPosition: [number, number, number] = [
          camera.position.x,
          camera.position.y,
          camera.position.z,
        ];
        const currentFov = camera.fov;

        // Create animation to new view
        const viewAnimation: CameraAnimation = {
          from: {
            position: currentPosition,
            fov: currentFov,
          },
          to: {
            position: selectedCameraView.position,
            fov: selectedCameraView.fov,
          },
          duration: 600,
          delay: 0,
        };

        setCameraViewAnimation(viewAnimation);
      }
    }
  }, [selectedCameraView]);

  const handleMilestoneClick = (interaction: RoadmapInteraction) => {
    console.log("🔥 MILESTONE CLICK HANDLER CALLED!", interaction);
    logger.log("🔥 MILESTONE CLICK HANDLER CALLED!", interaction);

    const milestone = milestones.find((m) => m.id === interaction.milestoneId);

    console.log("🔍 Found milestone:", milestone);

    if (milestone) {
      setSelectedMilestone(milestone);
      console.log("✅ About to create zoom animation...");

      const zoomAnimation = createMilestoneZoom(milestone);

      console.log("🎯 Created zoom animation:", zoomAnimation);

      // Only set animation if it's not null
      if (zoomAnimation) {
        setMilestoneAnimation(zoomAnimation);
      }

      onOpen();
      console.log("📤 Modal opened and animation set");
    } else {
      console.log("❌ No milestone found for ID:", interaction.milestoneId);
      logger.log("❌ No milestone found for ID:", interaction.milestoneId);
    }
  };

  const handleMilestoneUpdated = useCallback(() => {
    refetchMilestones();
  }, [refetchMilestones]);

  // Handle clicks on empty positions
  const handleEmptyPositionClick = useCallback(
    (positionNumber: number) => {
      logger.log(`🎯 Empty position ${positionNumber} clicked`);
      onEmptyPositionClick?.(positionNumber);
    },
    [onEmptyPositionClick],
  );

  const handleModalClose = () => {
    console.log("🚪 Modal closing...");

    // Simply reset milestone animation - let the camera stay where it is
    setMilestoneAnimation(null);
    setSelectedMilestone(null);
    onClose();

    // Remove milestoneId query parameter when closing modal
    const milestoneId = searchParams.get("milestoneId");

    if (milestoneId) {
      router.replace("/roadmap", { scroll: false });
    }

    console.log("✅ Modal closed, returning to default view");
  };

  // Fallback click handler for the Canvas element
  const handleCanvasClick = (event: React.MouseEvent) => {
    logger.log("🖱️  Canvas clicked at:", event.clientX, event.clientY);
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      delete (window as any).__camera;
    };
  }, []);

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
          camera={{
            position: cameraSettings.position,
            fov: cameraSettings.fov,
          }}
          className="w-full h-full"
          {...canvasWebGLSettings}
          onClick={handleCanvasClick}
        >
          {/* CameraController for animations and camera reference */}
          <CameraController
            introAnimation={cameraSettings.introAnimation}
            isMobile={isMobile}
            milestoneAnimation={milestoneAnimation || cameraViewAnimation}
            onAnimationComplete={() => {
              console.log(
                "🏁 Animation completed! milestoneAnimation:",
                milestoneAnimation,
                "cameraViewAnimation:",
                cameraViewAnimation,
              );
              if (cameraViewAnimation) {
                setCameraViewAnimation(null);
              }
            }}
          />
          {/* Optimized lighting setup for mobile performance */}
          {/* eslint-disable react/no-unknown-property */}
          <ambientLight intensity={isMobile ? 1.2 : 1.0} />
          <directionalLight
            intensity={isMobile ? 1.2 : 1.5}
            position={[10, 15, 10]}
          />
          {!isMobile && (
            <hemisphereLight groundColor="#444444" intensity={0.4} />
          )}
          {/* eslint-enable react/no-unknown-property */}
          <Suspense
            fallback={
              <mesh>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <boxGeometry args={[1, 0.1, 1]} />
                <meshBasicMaterial color="#e5e7eb" />
              </mesh>
            }
          >
            <RoadmapModel
              isMobile={isMobile}
              milestones={milestones}
              onEmptyPositionClick={handleEmptyPositionClick}
              onMilestoneClick={handleMilestoneClick}
            />
          </Suspense>
          {/*
            🔧 MOBILE ADJUSTMENT GUIDE:
            - maxDistance: increase to zoom out more, decrease to limit zoom
            - minDistance: increase to prevent getting too close
            - maxPolarAngle: lower values prevent looking from below
          */}
          <OrbitControls
            enableDamping={false}
            enablePan={false}
            enableRotate={false}
            enableZoom={false}
          />
        </Canvas>
      </div>

      <MilestoneModal
        isOpen={isOpen}
        milestone={selectedMilestone}
        onClose={handleModalClose}
        onMilestoneUpdated={handleMilestoneUpdated}
      />

      {/* Camera Control GUI for debugging - hidden for production */}
      {/* <CameraControlGUI /> */}
    </>
  );
}
