"use client";

import { useState } from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ChevronDown, Camera } from "lucide-react";
import { CameraAnimation } from "../../../../types/roadmap";

export type CameraView = {
  id: string;
  name: string;
  position: [number, number, number];
  fov: number;
};

const CAMERA_VIEWS: CameraView[] = [
  {
    id: "top-vertical",
    name: "Top View",
    position: [0.3, 15, 0],
    fov: 31,
  },
  {
    id: "top-horizontal",
    name: "Top View (Horizontal)",
    position: [0, 15.7, -0.6],
    fov: 31,
  },
  {
    id: "isometric",
    name: "Isometric View",
    position: [4.6, 9.4, 3.9],
    fov: 39,
  },
];

interface CameraViewSelectorProps {
  onViewChange: (view: CameraView) => void;
  currentView?: string;
}

export function CameraViewSelector({ onViewChange, currentView = "top-vertical" }: CameraViewSelectorProps) {
  const [selectedViewId, setSelectedViewId] = useState(currentView);

  const handleViewChange = (viewId: string) => {
    const view = CAMERA_VIEWS.find(v => v.id === viewId);
    if (view) {
      setSelectedViewId(viewId);
      onViewChange(view);
    }
  };

  const selectedView = CAMERA_VIEWS.find(v => v.id === selectedViewId);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="flat"
          className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium px-3 py-2 rounded-lg shadow-sm"
          size="sm"
          startContent={<Camera className="w-4 h-4" />}
          endContent={<ChevronDown className="w-4 h-4" />}
        >
          {selectedView?.name || "View"}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Camera view options"
        onAction={(key) => handleViewChange(key as string)}
        selectedKeys={[selectedViewId]}
        selectionMode="single"
      >
        {CAMERA_VIEWS.map((view) => (
          <DropdownItem key={view.id}>
            {view.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}