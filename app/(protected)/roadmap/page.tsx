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

        {/* Add Button - Bottom Left */}
        <button
          className="fixed bottom-6 left-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20"
          style={{ backgroundColor: "rgba(34,197,94, 0.9)" }}
        >
          <svg
            fill="none"
            height="32"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="32"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </>
  );
}
