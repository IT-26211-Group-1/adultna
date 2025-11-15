"use client";

import { RoadmapClient } from "./components/RoadmapClient";
import { RoadmapNavigation } from "./components/RoadmapNavigation";

export default function RoadmapPage() {
  const handleAddMilestone = () => {
    console.log("🎯 Add Milestone clicked from page");
    // TODO: Implement add milestone modal or form
  };

  return (
    <>
      {/* Full viewport olivine background */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{ backgroundColor: "rgba(154,205,50, 0.08)" }}
      />

      <div className="relative z-10 flex h-screen flex-col">
        {/* Navigation Bar */}
        <RoadmapNavigation onAddMilestone={handleAddMilestone} />

        {/* Main Content - Account for navigation bar height */}
        <main className="flex-1 overflow-hidden mt-16">
          {/* 3D Model Container - Client Component */}
          <RoadmapClient />
        </main>
      </div>
    </>
  );
}
