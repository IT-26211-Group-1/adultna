"use client";

import { memo } from "react";
import { useDashboardSummary } from "@/hooks/queries/useDashboardQueries";
import { RoadmapProgressCardSkeleton } from "./CardSkeletons";

function RoadmapProgressCard() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return <RoadmapProgressCardSkeleton />;
  }

  if (error) {
    return (
      <div
        className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
        style={{ backgroundColor: "rgba(203, 203, 231, 0.3)" }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-red-600 text-sm">Failed to load progress data</p>
        </div>
      </div>
    );
  }

  const progress = data?.roadmapProgress;
  const percentage = progress?.progressPercentage || 0;
  const strokeDasharray = `${percentage}, 100`;

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
            <span className="text-purple-600 font-semibold">
              {progress?.completedTasks || 0} out of {progress?.totalTasks || 0}
            </span>{" "}
            tasks
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
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
                strokeWidth="5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-gray-900">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RoadmapProgressCard);
