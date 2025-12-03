"use client";

/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import { MilestoneHitbox } from "./MilestoneHitbox";
import { RoadmapInteraction, Milestone } from "../../../../types/roadmap";
import { logger } from "@/lib/logger";

interface RoadmapModelProps {
  onMilestoneClick: (interaction: RoadmapInteraction) => void;
  milestones: Milestone[];
  isMobile?: boolean;
  onEmptyPositionClick?: (positionNumber: number) => void;
}

export function RoadmapModel({
  onMilestoneClick,
  milestones,
  isMobile = false,
  onEmptyPositionClick,
}: RoadmapModelProps) {
  const { scene } = useGLTF("/models/final-roadmap-draco.glb");

  // 📍 MILESTONE POSITION COORDINATES [X, Y, Z] - RESTORED
  // These coordinates define the exact position of each milestone on the roadmap
  const positionCoordinates: Record<number, [number, number, number]> = useMemo(() => {
    return {
      1: [2.6, 0.1, 1.0],   // Top-right area
      2: [1.6, 0.1, 1.1],   // Right side
      3: [0.6, 0.1, 1.0],   // Center-right
      4: [0.5, 0.1, 0.0],   // Center
      5: [0.4, 0.1, -0.9],  // Center-left
      6: [-0.6, 0.1, -1.1], // Left side
      7: [-1.6, 0.1, -1.0], // Far left
      8: [-1.9, 0.1, 0.1],  // Bottom-left area
    };
  }, []);

  const handleHitboxClick = useMemo(() =>
    (milestoneId: string, positionNumber: number) => {
      logger.log(
        `✅ Milestone ${milestoneId} (position ${positionNumber}) clicked!`,
      );

      const interaction: RoadmapInteraction = {
        objectName: `milestone_${positionNumber}`,
        milestoneId,
        timestamp: new Date(),
      };

      onMilestoneClick(interaction);
    }, [onMilestoneClick]);

  // Get all milestone positions that are occupied
  const occupiedPositions = useMemo(() =>
    new Set(milestones.map(m => m.positionNumber || 1)), [milestones]);

  // Create hitboxes for existing milestones
  const milestoneHitboxes = useMemo(() => {
    return milestones.map((milestone) => {
      const position = positionCoordinates[milestone.positionNumber || 1];

      if (!position) return null;

      return (
        <MilestoneHitbox
          key={milestone.id}
          milestoneId={milestone.id}
          position={position}
          onClick={() =>
            handleHitboxClick(milestone.id, milestone.positionNumber || 1)
          }
        />
      );
    });
  }, [milestones, positionCoordinates, handleHitboxClick]);

  // Create hitboxes for empty positions (only if onEmptyPositionClick is provided)
  const emptyPositionHitboxes = useMemo(() => {
    if (!onEmptyPositionClick) return [];

    const allPositions = Object.keys(positionCoordinates).map(Number);
    const emptyPositions = allPositions.filter(pos => !occupiedPositions.has(pos));

    return emptyPositions.map((positionNumber) => {
      const position = positionCoordinates[positionNumber];

      return (
        <MilestoneHitbox
          key={`empty-${positionNumber}`}
          milestoneId={`empty-position-${positionNumber}`}
          position={position}
          onClick={() => onEmptyPositionClick(positionNumber)}
        />
      );
    });
  }, [positionCoordinates, occupiedPositions, onEmptyPositionClick]);

  const clonedScene = useMemo(() => {
    if (scene) {
      const cloned = scene.clone();
      cloned.traverse((child: any) => {
        if (child.isMesh) {
          child.frustumCulled = true;
          if (child.material) {
            child.material.transparent = false;
            child.material.alphaTest = 0;
          }
        }
      });
      return cloned;
    }
    return scene;
  }, [scene]);

  // 🔧 MOBILE ROADMAP SIZE ADJUSTMENT
  // Decrease first number to make roadmap smaller, increase to make bigger
  // Optimized to fit close to mobile screen borders
  const modelScale = isMobile ? 0.8 : 1;

  // 🔧 MOBILE ROADMAP POSITION ADJUSTMENT [X, Y, Z]
  // X: Left(-) / Right(+) | Y: Down(-) / Up(+) | Z: Away(-) / Closer(+)
  const modelPosition: [number, number, number] = isMobile ? [0, -0.8, 0] : [0, 0, 0];

  return (
    <group scale={modelScale} position={modelPosition}>
      <primitive object={clonedScene} />
      {milestoneHitboxes}
      {emptyPositionHitboxes}
    </group>
  );
}

useGLTF.preload("/models/final-roadmap-draco.glb");
