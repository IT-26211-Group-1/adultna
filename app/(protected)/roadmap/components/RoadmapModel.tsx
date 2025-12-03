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
}

export function RoadmapModel({
  onMilestoneClick,
  milestones,
}: RoadmapModelProps) {
  const { scene } = useGLTF("/models/final-roadmap-draco.glb");

  const positionCoordinates: Record<number, [number, number, number]> = useMemo(() => ({
    1: [2.6, 0.1, 1.0],
    2: [1.6, 0.1, 1.1],
    3: [0.6, 0.1, 1.0],
    4: [0.5, 0.1, 0.0],
    5: [0.4, 0.1, -0.9],
    6: [-0.6, 0.1, -1.1],
    7: [-1.6, 0.1, -1.0],
    8: [-1.9, 0.1, 0.1],
  }), []);

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

  return (
    <group>
      <primitive object={clonedScene} />
      {milestoneHitboxes}
    </group>
  );
}

useGLTF.preload("/models/final-roadmap-draco.glb");
