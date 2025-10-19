"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useState, useEffect } from "react";
import { PerspectiveCamera } from "three";
import { useSpring } from "@react-spring/three";
import { CameraAnimation } from "../../../../types/roadmap";

interface CameraControllerProps {
  animation: CameraAnimation;
  onAnimationComplete?: () => void;
}

export function CameraController({
  animation,
  onAnimationComplete,
}: CameraControllerProps) {
  const { camera, size } = useThree();
  const [startAnimation, setStartAnimation] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Set initial camera position immediately
  useEffect(() => {
    const { position, fov } = animation.from;

    camera.position.set(position[0], position[1], position[2]);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    // Start animation after delay
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, animation.delay || 1000);

    return () => clearTimeout(timer);
  }, [camera, animation]);

  // Handle viewport resize to prevent canvas glitches when sidebar toggles
  useEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  // Animation spring for smooth camera movement
  const { position, fov } = useSpring({
    position: startAnimation ? animation.to.position : animation.from.position,
    fov: startAnimation ? animation.to.fov : animation.from.fov,
    config: { mass: 1, tension: 30, friction: 40 },
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
