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
import { CameraControlGUI } from "./CameraControlGUI";
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
}

export function RoadmapClient({ onEmptyPositionClick }: RoadmapClientProps = {}) {
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
        // 🔧 MOBILE CAMERA POSITION ADJUSTMENT [X, Y, Z]
        // X: Left(-) / Right(+) | Y: Down(-) / Up(+) | Z: Away(-) / Closer(+)
        position: [0, 12, 15] as [number, number, number], // Higher angle for better top-down view

        // 🔧 MOBILE FIELD OF VIEW ADJUSTMENT
        // Smaller number = zoomed in, Larger number = zoomed out
        fov: 55, // Balanced FOV for mobile visibility

        introAnimation: null, // No intro animation for mobile
      };
    } else {
      // 🖥️ DESKTOP SETTINGS (separate from mobile)
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

  // Handle clicks on empty positions
  const handleEmptyPositionClick = useCallback((positionNumber: number) => {
    logger.log(`🎯 Empty position ${positionNumber} clicked`);
    onEmptyPositionClick?.(positionNumber);
  }, [onEmptyPositionClick]);

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


  // Camera position tracking for finding optimal views
  React.useEffect(() => {
    // Function to log current camera position
    (window as any).logCameraPos = () => {
      const camera = (window as any).__camera;
      if (camera) {
        const pos = camera.position;
        const target = camera.controls?.target || { x: 0, y: 0, z: 0 };
        console.log(`Camera Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`);
        console.log(`Camera Target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`);
        console.log(`Camera FOV: ${camera.fov}`);
        console.log('Copy this for your settings:');
        console.log(`position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`);
      }
    };

    // Auto-tracking function
    let trackingInterval: NodeJS.Timeout;
    (window as any).trackCamera = () => {
      console.log('🎥 Starting camera position tracking...');
      trackingInterval = setInterval(() => {
        (window as any).logCameraPos();
      }, 2000);
    };

    (window as any).stopTracking = () => {
      console.log('⏹️ Stopping camera tracking');
      clearInterval(trackingInterval);
    };

    return () => {
      clearInterval(trackingInterval);
      delete (window as any).logCameraPos;
      delete (window as any).trackCamera;
      delete (window as any).stopTracking;
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
          camera={{ position: cameraSettings.position, fov: cameraSettings.fov }}
          className="w-full h-full"
          {...canvasWebGLSettings}
          onClick={handleCanvasClick}
        >
          {/* CameraController for camera reference storage only */}
          <CameraController
            introAnimation={null}
            milestoneAnimation={null}
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
              isMobile={isMobile}
              onEmptyPositionClick={handleEmptyPositionClick}
            />
          </Suspense>
          {/*
            🔧 MOBILE ADJUSTMENT GUIDE:
            - maxDistance: increase to zoom out more, decrease to limit zoom
            - minDistance: increase to prevent getting too close
            - maxPolarAngle: lower values prevent looking from below
          */}
          <OrbitControls
            enableDamping={true}
            dampingFactor={0.05}
            enablePan={true}
            enableRotate={true}
            enableZoom={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        </Canvas>
      </div>

      <MilestoneModal
        isOpen={isOpen}
        milestone={selectedMilestone}
        onClose={handleModalClose}
        onMilestoneUpdated={handleMilestoneUpdated}
      />

      {/* Camera Control GUI for position testing */}
      <CameraControlGUI />
    </>
  );
}
