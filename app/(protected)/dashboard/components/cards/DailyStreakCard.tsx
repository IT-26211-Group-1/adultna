"use client";

import { memo } from "react";
import { useDashboardSummary } from "@/hooks/queries/useDashboardQueries";
import { DailyStreakCardSkeleton } from "./CardSkeletons";

function DailyStreakCard() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return <DailyStreakCardSkeleton />;
  }

  if (error) {
    return (
      <div
        className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
        style={{ backgroundColor: "rgba(252, 226, 169, 0.3)" }}
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-red-600 text-sm">Failed to load streak data</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(252, 226, 169, 0.3)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        🔥
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Daily Active Streak
          </h3>
          <p className="text-gray-700 mb-3 text-sm">
            Keep building your habits
          </p>
          <p className="text-xs text-gray-600">
            <span className="text-adult-green font-semibold">
              {data?.dailyStreak.completionRate || 0}%
            </span>{" "}
            roadmap completion rate
          </p>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-sm text-gray-600 mt-1">day</div>
          <div className="text-6xl font-bold text-adult-green">
            {data?.dailyStreak.currentStreak || 0}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(DailyStreakCard);
