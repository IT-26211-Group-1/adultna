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
    "1": [2.60, 0.10, 1.00],
    "2": [1.60, 0.10, 1.10],
    "3": [0.60, 0.10, 1.00],
    "4": [0.50, 0.10, 0.00],
    "5": [0.40, 0.10, -0.90],
    "6": [-0.60, 0.10, -1.10],
    "7": [-1.60, 0.10, -1.00],
    "8": [-1.90, 0.10, 0.10],
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