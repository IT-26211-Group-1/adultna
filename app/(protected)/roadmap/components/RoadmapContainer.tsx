"use client";

import { useDisclosure } from "@heroui/react";
import { RoadmapClient } from "./RoadmapClient";
import { RoadmapNavigation } from "./RoadmapNavigation";
import { AddMilestoneModal } from "./AddMilestoneModal";

export function RoadmapContainer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddMilestone = () => {
    onOpen();
  };

  return (
    <>
      <div className="relative z-10 flex h-screen flex-col">
        <RoadmapNavigation onAddMilestone={handleAddMilestone} />
        <main className="flex-1 overflow-hidden mt-16">
          <RoadmapClient />
        </main>
      </div>
      <AddMilestoneModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}
