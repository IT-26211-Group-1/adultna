import { memo } from "react";

function RoadmapProgressCard() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(203, 203, 231, 0.3)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        📍
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Roadmap Progress
          </h3>
          <p className="text-gray-700 mb-3 text-sm">
            <span className="text-purple-600 font-semibold">8 out of 12</span>{" "}
            milestones
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="relative w-20 h-20 mb-2">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
              />
              <path
                className="text-purple-600"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray="67, 100"
                strokeLinecap="round"
                strokeWidth="5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RoadmapProgressCard);
