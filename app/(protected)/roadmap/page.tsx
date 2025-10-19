import { RoadmapHeader } from "./components/RoadmapHeader";
import { RoadmapClient } from "./components/RoadmapClient";

export default function RoadmapPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Static Header - Server Component */}
      <RoadmapHeader />

      {/* Main Content - Full viewport height for 3D roadmap */}
      <main className="flex-1 overflow-hidden">
        {/* 3D Model Container - Client Component */}
        <RoadmapClient />
      </main>
    </div>
  );
}
