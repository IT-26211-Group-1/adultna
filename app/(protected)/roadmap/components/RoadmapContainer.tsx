"use client";

import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { RoadmapClient } from "./RoadmapClient";
import { RoadmapNavigation } from "./RoadmapNavigation";
import { AddMilestoneModal } from "./AddMilestoneModal";

export function RoadmapContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [suggestedPosition, setSuggestedPosition] = useState<number | undefined>();

  const handleAddMilestone = (position?: number) => {
    setSuggestedPosition(position);
    onOpen();
  };

  const handleModalClose = () => {
    setSuggestedPosition(undefined);
    onClose();
  };

  return (
    <>
      <div className="relative z-10 flex h-screen flex-col">
        <RoadmapNavigation onAddMilestone={() => handleAddMilestone()} />
        <main className="flex-1 overflow-hidden mt-14">
          <RoadmapClient onEmptyPositionClick={handleAddMilestone} />
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
