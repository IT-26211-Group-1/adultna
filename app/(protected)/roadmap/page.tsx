import { RoadmapClient } from "./components/RoadmapClient";

export default function RoadmapPage() {
  return (
    <>
      {/* Full viewport olivine background */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{ backgroundColor: "rgba(154,205,50, 0.08)" }}
      />

      <div className="relative z-10 flex h-screen flex-col">
        {/* Static Header - Server Component - Hidden for now */}
        {/* <RoadmapHeader /> */}

        {/* Main Content - Full viewport height for 3D roadmap */}
        <main className="flex-1 overflow-hidden">
          {/* 3D Model Container - Client Component */}
          <RoadmapClient />
        </main>

      </div>
    </>
  );
}
