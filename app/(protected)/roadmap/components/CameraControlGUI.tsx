"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

type CameraPosition = {
  x: number;
  y: number;
  z: number;
  fov: number;
};

export function CameraControlGUI() {
  const [position, setPosition] = useState<CameraPosition>({
    x: 0,
    y: 15,
    z: 0,
    fov: 45,
  });
  const [isVisible, setIsVisible] = useState(true);

  const updateCameraPosition = (newPos: Partial<CameraPosition>) => {
    const updatedPos = { ...position, ...newPos };

    setPosition(updatedPos);

    const camera = (window as any).__camera;

    if (camera) {
      camera.position.set(updatedPos.x, updatedPos.y, updatedPos.z);
      camera.fov = updatedPos.fov;
      camera.updateProjectionMatrix();
    }
  };

  const presetViews = {
    "Top View": { x: 6, y: 8, z: 0.2, fov: 48 },
    Isometric: { x: 15, y: 15, z: 15, fov: 50 },
    "Side View": { x: 0.2, y: 16, z: -2, fov: 31 },
    Current: { x: 5, y: 8, z: 5, fov: 40 },
  };

  const copyPosition = () => {
    const posText = `position: [${position.x}, ${position.y}, ${position.z}], fov: ${position.fov}`;

    navigator.clipboard.writeText(posText);
    alert("Position copied to clipboard!");
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          className="bg-blue-600 text-white"
          size="sm"
          onPress={() => setIsVisible(true)}
        >
          Show Camera Controls
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Camera Controls</h3>
        <Button size="sm" variant="light" onPress={() => setIsVisible(false)}>
          ✕
        </Button>
      </div>

      {/* Current Position Display */}
      <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
        <div>
          X: {position.x.toFixed(1)}, Y: {position.y.toFixed(1)}, Z:{" "}
          {position.z.toFixed(1)}
        </div>
        <div>FOV: {position.fov}</div>
      </div>

      {/* Position Sliders */}
      <div className="space-y-2 mb-3">
        <div>
          <label className="text-xs text-gray-600">
            X: {position.x.toFixed(1)}
          </label>
          <input
            className="w-full"
            max="30"
            min="-30"
            step="0.1"
            type="range"
            value={-position.x}
            onChange={(e) =>
              updateCameraPosition({ x: -parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">
            Y: {position.y.toFixed(1)}
          </label>
          <input
            className="w-full"
            max="40"
            min="1"
            step="0.1"
            type="range"
            value={position.y}
            onChange={(e) =>
              updateCameraPosition({ y: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">
            Z: {position.z.toFixed(1)}
          </label>
          <input
            className="w-full"
            max="30"
            min="-30"
            step="0.1"
            type="range"
            value={position.z}
            onChange={(e) =>
              updateCameraPosition({ z: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="text-xs text-gray-600">FOV: {position.fov}</label>
          <input
            className="w-full"
            max="100"
            min="10"
            step="1"
            type="range"
            value={position.fov}
            onChange={(e) =>
              updateCameraPosition({ fov: parseInt(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 gap-1 mb-3">
        {Object.entries(presetViews).map(([name, preset]) => (
          <Button
            key={name}
            className="text-xs"
            size="sm"
            variant="flat"
            onPress={() => updateCameraPosition(preset)}
          >
            {name}
          </Button>
        ))}
      </div>

      {/* Copy Position */}
      <Button
        className="w-full bg-green-600 text-white"
        size="sm"
        onPress={copyPosition}
      >
        Copy Position
      </Button>
    </div>
  );
}
