"use client";

/* eslint-disable react/no-unknown-property */
import { ThreeEvent } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Mesh } from "three";

interface MilestoneHitboxProps {
  milestoneId: string;
  position: [number, number, number];
  onClick: (milestoneId: string) => void;
}

export function MilestoneHitbox({
  milestoneId,
  position,
  onClick,
}: MilestoneHitboxProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    console.log(`🎯 Hitbox clicked for milestone ${milestoneId}`);
    onClick(milestoneId);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
    >
      {/* Clickable area - flat cylinder */}
      <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
      {/* Invisible but shows faint yellow on hover */}
      <meshBasicMaterial
        transparent
        color="yellow"
        opacity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}
