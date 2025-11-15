"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import React, { useRef, useEffect } from "react";
import { Group, Vector2 } from "three";
import { MilestoneService } from "../infrastructure/milestoneService";
import { RoadmapInteraction } from "../../../../types/roadmap";
import { logger } from "@/lib/logger";

interface RoadmapModelProps {
  onMilestoneClick: (interaction: RoadmapInteraction) => void;
}

export function RoadmapModel({ onMilestoneClick }: RoadmapModelProps) {
  const { scene } = useGLTF("/models/roadmap.glb");
  const { raycaster, camera } = useThree();
  const meshRef = useRef<Group>(null);

  // Log the 3D model structure for debugging
  useEffect(() => {
    if (scene) {
      logger.log("=== 3D Model Structure ===");
      logger.log("Scene:", scene);

      const logObject = (obj: any, depth = 0) => {
        const indent = "  ".repeat(depth);

        logger.log(
          `${indent}${obj.type}: "${obj.name}" (${obj.children.length} children)`,
        );

        if (obj.children && obj.children.length > 0) {
          obj.children.forEach((child: any) => logObject(child, depth + 1));
        }
      };

      logObject(scene);
      logger.log("========================");
    }
  }, [scene]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    if (!meshRef.current) return;

    // Convert mouse position to 3D world coordinates
    const mouse = new Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast to find what object was clicked
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      meshRef.current.children,
      true,
    );

    logger.log("=== Click Debug ===");
    logger.log("Intersects found:", intersects.length);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      const objectName = clickedObject.name || clickedObject.parent?.name || "";

      logger.log("Clicked object:", clickedObject);
      logger.log("Object name:", objectName);
      logger.log("Object type:", clickedObject.type);
      logger.log("Parent name:", clickedObject.parent?.name);

      const isMS = MilestoneService.isMilestone(objectName);

      logger.log("Is milestone?", isMS);

      // Debug logging to help understand the 3D model structure
      let parent = clickedObject.parent;
      let level = 1;

      while (parent && level <= 3) {
        logger.log(`Parent level ${level}:`, parent.name, parent.type);
        parent = parent.parent;
        level++;
      }

      if (MilestoneService.isMilestone(objectName)) {
        const milestoneId =
          MilestoneService.getMilestoneIdFromObjectName(objectName);

        if (milestoneId) {
          logger.log("Milestone clicked - opening modal");
          const interaction: RoadmapInteraction = {
            objectName,
            milestoneId,
            timestamp: new Date(),
          };

          onMilestoneClick(interaction);
        }
      } else {
        logger.log("Non-milestone object clicked - no action taken");
      }
    } else {
      logger.log("No intersects found");
    }
    logger.log("=================");
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();

    if (!meshRef.current) return;

    const mouse = new Vector2();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      meshRef.current.children,
      true,
    );

    if (intersects.length > 0) {
      const hoveredObject = intersects[0].object;
      const objectName = hoveredObject.name || hoveredObject.parent?.name || "";

      if (MilestoneService.isMilestone(objectName)) {
        document.body.style.cursor = "pointer";
      }
    }
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    document.body.style.cursor = "default";
  };

  return (
    <primitive
      ref={meshRef}
      // eslint-disable-next-line react/no-unknown-property
      object={scene}
      onClick={handleClick}
      onPointerOut={handlePointerOut}
      onPointerOver={handlePointerOver}
    />
  );
}
