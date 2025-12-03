"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { PerspectiveCamera } from "three";
import { useSpring } from "@react-spring/three";
import { CameraAnimation } from "../../../../types/roadmap";

interface CameraControllerProps {
  onAnimationComplete?: () => void;
  milestoneAnimation?: CameraAnimation | null;
  introAnimation?: CameraAnimation | null;
  isMobile?: boolean;
}

export function CameraController({
  onAnimationComplete,
  milestoneAnimation,
  introAnimation,
  isMobile = false,
}: CameraControllerProps) {
  const { camera, size } = useThree();
  const [startIntroAnimation, setStartIntroAnimation] = useState(false);
  const [startMilestoneAnimation, setStartMilestoneAnimation] = useState(false);
  const [introComplete, setIntroComplete] = useState(isMobile); // Skip intro on mobile

  // Default positions based on device type
  const defaultPosition: [number, number, number] = isMobile ? [3, 6, 8] : [5, 8, 5];
  const defaultFov = isMobile ? 75 : 40;

  // Start intro animation on mount (desktop only)
  useEffect(() => {
    if (!isMobile && introAnimation && !introComplete) {
      const { position, fov } = introAnimation.from;
      camera.position.set(position[0], position[1], position[2]);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      const timer = setTimeout(
        () => setStartIntroAnimation(true),
        introAnimation.delay || 0,
      );

      return () => clearTimeout(timer);
    }
  }, [camera, introAnimation, isMobile, introComplete]);

  // Handle milestone animations
  useEffect(() => {
    if (milestoneAnimation) {
      setStartMilestoneAnimation(true);
    } else {
      setStartMilestoneAnimation(false);
    }
  }, [milestoneAnimation]);

  // Handle viewport resize
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  // Determine current animation target
  const getAnimationTarget = () => {
    if (milestoneAnimation && startMilestoneAnimation) {
      return {
        position: milestoneAnimation.to.position,
        fov: milestoneAnimation.to.fov,
      };
    }

    if (!isMobile && introAnimation && startIntroAnimation && !introComplete) {
      return {
        position: introAnimation.to.position,
        fov: introAnimation.to.fov,
      };
    }

    return {
      position: defaultPosition,
      fov: defaultFov,
    };
  };

  // Get starting position for animations
  const getAnimationFrom = () => {
    if (milestoneAnimation && startMilestoneAnimation) {
      return {
        position: milestoneAnimation.from.position,
        fov: milestoneAnimation.from.fov,
      };
    }

    if (!isMobile && introAnimation && !introComplete) {
      return {
        position: introAnimation.from.position,
        fov: introAnimation.from.fov,
      };
    }

    return {
      position: defaultPosition,
      fov: defaultFov,
    };
  };

  const target = getAnimationTarget();
  const from = getAnimationFrom();

  // Animation spring
  const { position, fov } = useSpring({
    from,
    to: target,
    config: { mass: 1, tension: 40, friction: 50 },
    onRest: () => {
      if (milestoneAnimation && startMilestoneAnimation) {
        onAnimationComplete?.();
      } else if (!isMobile && introAnimation && startIntroAnimation && !introComplete) {
        setIntroComplete(true);
      }
    },
  });

  // Update camera every frame and store reference for position logging
  useFrame(() => {
    // Store camera reference globally for console access
    (window as any).__camera = camera;

    // Only update camera position if there's an active animation
    const hasActiveAnimation = (milestoneAnimation && startMilestoneAnimation) ||
                              (!isMobile && introAnimation && startIntroAnimation && !introComplete);

    if (hasActiveAnimation) {
      camera.position.set(
        position.get()[0],
        position.get()[1],
        position.get()[2],
      );
      if (camera instanceof PerspectiveCamera) {
        camera.fov = fov.get();
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
