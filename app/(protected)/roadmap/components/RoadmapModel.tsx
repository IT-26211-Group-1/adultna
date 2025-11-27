"use client";

/* eslint-disable react/no-unknown-property */
import { useGLTF } from "@react-three/drei";
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
  const { scene } = useGLTF("/models/roadmap.glb");

  // Final milestone positions (measured and confirmed) - indexed by positionNumber
  const positionCoordinates: Record<number, [number, number, number]> = {
    1: [2.6, 0.1, 1.0],
    2: [1.6, 0.1, 1.1],
    3: [0.6, 0.1, 1.0],
    4: [0.5, 0.1, 0.0],
    5: [0.4, 0.1, -0.9],
    6: [-0.6, 0.1, -1.1],
    7: [-1.6, 0.1, -1.0],
    8: [-1.9, 0.1, 0.1],
  };

  const handleHitboxClick = (milestoneId: string, positionNumber: number) => {
    logger.log(
      `✅ Milestone ${milestoneId} (position ${positionNumber}) clicked!`,
    );

    const interaction: RoadmapInteraction = {
      objectName: `milestone_${positionNumber}`,
      milestoneId,
      timestamp: new Date(),
    };

    onMilestoneClick(interaction);
  };

  return (
    <group>
      {/* The 3D roadmap model */}
      <primitive object={scene} />


      {/* Invisible clickable hitboxes for each milestone */}
      {milestones.map((milestone) => {
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
      })}
    </group>
  );
}
