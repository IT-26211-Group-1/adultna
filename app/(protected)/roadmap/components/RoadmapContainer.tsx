"use client";

import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { RoadmapClient } from "./RoadmapClient";
import { RoadmapNavigation } from "./RoadmapNavigation";
import { AddMilestoneModal } from "./AddMilestoneModal";
import { CameraView } from "./CameraViewSelector";

export function RoadmapContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [suggestedPosition, setSuggestedPosition] = useState<number | undefined>();
  const [currentCameraView, setCurrentCameraView] = useState<string>("top-vertical");
  const [selectedCameraView, setSelectedCameraView] = useState<CameraView | null>(null);

  const handleAddMilestone = (position?: number) => {
    setSuggestedPosition(position);
    onOpen();
  };

  const handleModalClose = () => {
    setSuggestedPosition(undefined);
    onClose();
  };

  const handleCameraViewChange = (view: CameraView) => {
    setCurrentCameraView(view.id);
    setSelectedCameraView(view);
  };

  return (
    <>
      <div className="relative z-10 flex h-screen flex-col">
        <RoadmapNavigation
          onAddMilestone={() => handleAddMilestone()}
          onCameraViewChange={handleCameraViewChange}
          currentCameraView={currentCameraView}
        />
        <main className="flex-1 overflow-hidden mt-14">
          <RoadmapClient
            onEmptyPositionClick={handleAddMilestone}
            selectedCameraView={selectedCameraView}
          />
        </main>
      </div>
      <AddMilestoneModal
        isOpen={isOpen}
        onClose={handleModalClose}
        suggestedPosition={suggestedPosition}
      />
    </>
  );
}
