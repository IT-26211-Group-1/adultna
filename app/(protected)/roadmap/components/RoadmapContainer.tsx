"use client";

import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { RoadmapClient } from "./RoadmapClient";
import { RoadmapNavigation } from "./RoadmapNavigation";
import { AddMilestoneModal } from "./AddMilestoneModal";
import { CameraView } from "./CameraViewSelector";

export function RoadmapContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [suggestedPosition, setSuggestedPosition] = useState<
    number | undefined
  >();
  const [currentCameraView, setCurrentCameraView] =
    useState<string>("top-vertical");
  const [selectedCameraView, setSelectedCameraView] =
    useState<CameraView | null>(null);

  // Mobile detection
  const isMobile =
    typeof window !== "undefined" &&
    (window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ));

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
      {/* AI Gabay Background - Clean white like chatbot */}
      <div className="fixed inset-0 bg-white -z-10" />

      <div className="relative z-10 flex h-screen flex-col">
        <RoadmapNavigation
          currentCameraView={currentCameraView}
          isMobile={isMobile}
          onAddMilestone={() => handleAddMilestone()}
          onCameraViewChange={handleCameraViewChange}
        />
        <main className="flex-1 overflow-hidden mt-16 sm:mt-20">
          <RoadmapClient
            selectedCameraView={selectedCameraView}
            onEmptyPositionClick={handleAddMilestone}
          />
        </main>
      </div>
      <AddMilestoneModal
        isOpen={isOpen}
        suggestedPosition={suggestedPosition}
        onClose={handleModalClose}
      />
    </>
  );
}
