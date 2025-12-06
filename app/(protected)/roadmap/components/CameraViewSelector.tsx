"use client";

import { useState } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { ChevronDown, Camera } from "lucide-react";

export type CameraView = {
  id: string;
  name: string;
  position: [number, number, number];
  fov: number;
};

// Create camera views with mobile-optimized FOV
const createCameraViews = (isMobile: boolean): CameraView[] => [
  {
    id: "top-vertical",
    name: "Top View",
    position: [0.3, 15, 0],
    fov: isMobile ? 40 : 31, // Moderate FOV for mobile to fit screen borders
  },
  {
    id: "top-horizontal",
    name: "Top View (Horizontal)",
    position: [0, 15.7, -0.6],
    fov: isMobile ? 40 : 31, // Moderate FOV for mobile to fit screen borders
  },
  {
    id: "isometric",
    name: "Isometric View",
    position: [4.6, 9.4, 3.9],
    fov: isMobile ? 50 : 39, // Balanced FOV for mobile isometric view
  },
];

interface CameraViewSelectorProps {
  onViewChange: (view: CameraView) => void;
  currentView?: string;
  isMobile?: boolean;
}

export function CameraViewSelector({
  onViewChange,
  currentView = "top-vertical",
  isMobile = false,
}: CameraViewSelectorProps) {
  const [selectedViewId, setSelectedViewId] = useState(currentView);

  // Get device-appropriate camera views
  const CAMERA_VIEWS = createCameraViews(isMobile);

  const handleViewChange = (viewId: string) => {
    const view = CAMERA_VIEWS.find((v) => v.id === viewId);

    if (view) {
      setSelectedViewId(viewId);
      onViewChange(view);
    }
  };

  const selectedView = CAMERA_VIEWS.find((v) => v.id === selectedViewId);

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className="bg-gray-50/60 border border-gray-200/50 text-gray-700 hover:bg-gray-100/60 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 shadow-sm"
          endContent={<ChevronDown className="w-4 h-4" />}
          size="sm"
          startContent={<Camera className="w-4 h-4" />}
          variant="flat"
        >
          <span className="hidden sm:inline">
            {selectedView?.name || "View"}
          </span>
          <span className="sm:hidden">
            {selectedView?.name?.split(" ")[0] || "View"}
          </span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Camera view options"
        selectedKeys={[selectedViewId]}
        selectionMode="single"
        onAction={(key) => handleViewChange(key as string)}
      >
        {CAMERA_VIEWS.map((view) => (
          <DropdownItem key={view.id}>{view.name}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
