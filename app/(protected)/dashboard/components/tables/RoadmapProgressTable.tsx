"use client";

import { Button } from "@nextui-org/react";
import { useDashboardSummary } from "@/hooks/queries/useDashboardQueries";

export default function RoadmapProgressTable() {
  const { data, isLoading } = useDashboardSummary();
  const progress = data?.roadmapProgress;
  const percentage = progress?.progressPercentage || 0;
  const nextTasks = progress?.nextTasks || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          border: "border-l-red-500",
          text: "text-red-600",
          button: "danger" as const,
        };
      case "medium":
        return {
          border: "border-l-yellow-500",
          text: "text-yellow-600",
          button: "warning" as const,
        };
      default:
        return {
          border: "border-l-blue-500",
          text: "text-blue-600",
          button: "primary" as const,
        };
    }
  };

  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden"
      style={{ backgroundColor: "rgba(203, 203, 231, 0.30)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 pointer-events-none">
        📍
      </div>

      {/* Overall Progress Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Overall Progress</h2>
          {isLoading ? (
            <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
          ) : (
            <span className="text-3xl font-bold text-adult-green">
              {percentage}%
            </span>
          )}
        </div>

        <div className="w-full bg-white/30 rounded-full h-2 mb-3">
          {isLoading ? (
            <div className="bg-gray-200 h-2 rounded-full animate-pulse w-full" />
          ) : (
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          )}
        </div>

        {isLoading ? (
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        ) : (
          <p className="text-gray-700 text-sm">
            You&apos;ve completed{" "}
            <strong>
              {progress?.completedTasks} out of {progress?.totalTasks}
            </strong>{" "}
            essential adulting tasks. Keep going!
          </p>
        )}
      </div>

      {/* Your Next Steps Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Your Next Steps
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : nextTasks.length === 0 ? (
          <p className="text-gray-600 text-sm">
            No tasks available. Great job!
          </p>
        ) : (
          <div className="space-y-3">
            {nextTasks.map((task) => {
              const colors = getPriorityColor(task.priority);

              return (
                <div
                  key={task.id}
                  className={`backdrop-blur-md bg-white/60 h-16 border-white/40 border-t border-r border-b rounded-xl p-4 border-l-4 ${colors.border} flex items-center justify-between`}
                >
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {task.title}
                    </h4>
                    <p
                      className={`${colors.text} font-medium text-xs capitalize`}
                    >
                      {task.priority} Priority
                    </p>
                  </div>
                  <Button
                    className="font-medium text-xs h-6 min-h-6"
                    color={colors.button}
                    size="sm"
                    variant="bordered"
                  >
                    Start Now
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
