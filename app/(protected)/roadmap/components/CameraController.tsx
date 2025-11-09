"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { PerspectiveCamera } from "three";
import { useSpring } from "@react-spring/three";
import { CameraAnimation } from "../../../../types/roadmap";

interface CameraControllerProps {
  animation: CameraAnimation;
  onAnimationComplete?: () => void;
  milestoneAnimation?: CameraAnimation | null;
}

export function CameraController({
  animation,
  onAnimationComplete,
  milestoneAnimation,
}: CameraControllerProps) {
  const { camera, size } = useThree();
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(animation);

  // Update current animation when milestone animation changes
  useEffect(() => {
    if (milestoneAnimation) {
      setCurrentAnimation(milestoneAnimation);
      setStartAnimation(false);
      setAnimationComplete(false);
      // Start milestone animation immediately
      setTimeout(() => setStartAnimation(true), 100);
    } else {
      setCurrentAnimation(animation);
    }
  }, [milestoneAnimation, animation]);

  // Set initial camera position immediately
  useEffect(() => {
    const { position, fov } = currentAnimation.from;

    camera.position.set(position[0], position[1], position[2]);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Start animation after delay (only for initial animation)
    if (!milestoneAnimation) {
      const timer = setTimeout(() => {
        setStartAnimation(true);
      }, currentAnimation.delay || 1000);

      return () => clearTimeout(timer);
    }
  }, [camera, currentAnimation, milestoneAnimation]);

  // Handle viewport resize to prevent canvas glitches when sidebar toggles
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  // Animation spring for smooth camera movement
  const { position, fov } = useSpring({
    position: startAnimation ? currentAnimation.to.position : currentAnimation.from.position,
    fov: startAnimation ? currentAnimation.to.fov : currentAnimation.from.fov,
    config: milestoneAnimation
      ? { mass: 1, tension: 60, friction: 50 } // Faster for milestone zoom
      : { mass: 1, tension: 30, friction: 40 }, // Slower for initial animation
    onRest: () => {
      setAnimationComplete(true);
      onAnimationComplete?.();
    },
  });

  // Update camera position and FOV every frame during animation
  useFrame(() => {
    if (startAnimation && !animationComplete) {
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
