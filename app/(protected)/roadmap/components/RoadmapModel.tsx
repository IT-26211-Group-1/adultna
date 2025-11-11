"use client";

import { useGLTF } from "@react-three/drei";
import { MilestoneHitbox } from "./MilestoneHitbox";
import { RoadmapInteraction } from "../../../../types/roadmap";

interface RoadmapModelProps {
  onMilestoneClick: (interaction: RoadmapInteraction) => void;
}

export function RoadmapModel({ onMilestoneClick }: RoadmapModelProps) {
  const { scene } = useGLTF("/models/roadmap.glb");

  // Final milestone positions (measured and confirmed)
  const milestonePositions: Record<string, [number, number, number]> = {
    "1": [2.6, 0.1, 1.0],
    "2": [1.6, 0.1, 1.1],
    "3": [0.6, 0.1, 1.0],
    "4": [0.5, 0.1, 0.0],
    "5": [0.4, 0.1, -0.9],
    "6": [-0.6, 0.1, -1.1],
    "7": [-1.6, 0.1, -1.0],
    "8": [-1.9, 0.1, 0.1],
  };

  const handleHitboxClick = (milestoneId: string) => {
    console.log(`✅ Milestone ${milestoneId} clicked!`);

    const interaction: RoadmapInteraction = {
      objectName: `milestone_${milestoneId}`,
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
      {Object.entries(milestonePositions).map(([id, position]) => (
        <MilestoneHitbox
          key={id}
          milestoneId={id}
          position={position}
          onClick={handleHitboxClick}
        />
      ))}
    </group>
  );
}
