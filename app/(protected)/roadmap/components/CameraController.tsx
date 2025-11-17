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
  const [currentAnimation, setCurrentAnimation] = useState(animation);

  // Update animation when milestone changes
  useEffect(() => {
    if (milestoneAnimation) {
      setCurrentAnimation(milestoneAnimation);
      setStartAnimation(true);
    } else {
      setCurrentAnimation(animation);
      setStartAnimation(true);
    }
  }, [milestoneAnimation, animation]);

  // Set initial camera position on mount
  useEffect(() => {
    if (!milestoneAnimation) {
      const { position, fov } = animation.from;

      camera.position.set(position[0], position[1], position[2]);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }

      const timer = setTimeout(
        () => setStartAnimation(true),
        animation.delay || 1000,
      );

      return () => clearTimeout(timer);
    }
  }, [camera, animation, milestoneAnimation]);

  // Handle viewport resize
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  // Animation spring
  const { position, fov } = useSpring({
    position: startAnimation
      ? currentAnimation.to.position
      : currentAnimation.from.position,
    fov: startAnimation ? currentAnimation.to.fov : currentAnimation.from.fov,
    config: { mass: 1, tension: 40, friction: 50 },
    onRest: onAnimationComplete,
  });

  // Update camera every frame
  useFrame(() => {
    camera.position.set(
      position.get()[0],
      position.get()[1],
      position.get()[2],
    );
    if (camera instanceof PerspectiveCamera) {
      camera.fov = fov.get();
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
