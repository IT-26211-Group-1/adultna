"use client";

import { useDashboardSummary } from "@/hooks/queries/useDashboardQueries";
import { formatDistanceToNow } from "date-fns";

export default function DeadlinesTable() {
  const { data, isLoading } = useDashboardSummary();
  const deadlines = data?.upcomingDeadlines || [];

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return {
          dot: "bg-red-500",
          text: "text-red-600",
        };
      case "medium":
        return {
          dot: "bg-yellow-500",
          text: "text-yellow-600",
        };
      default:
        return {
          dot: "bg-blue-500",
          text: "text-blue-600",
        };
    }
  };

  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-x-hidden overflow-y-auto"
      style={{ backgroundColor: "rgba(172, 189, 111, 0.10)", height: "408px" }}
    >
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 pointer-events-none">
        ⏰
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Upcoming Deadlines
      </h2>
      {isLoading ? (
        <div className="divide-y divide-white/20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2 w-28 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
                <div className="h-2 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : deadlines.length === 0 ? (
        <p className="text-gray-600 text-sm">No upcoming deadlines</p>
      ) : (
        <div className="divide-y divide-white/20">
          {deadlines.map((deadline) => {
            const styles = getPriorityStyles(deadline.priority);

            return (
              <div
                key={deadline.id}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${styles.dot} rounded-full`} />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {deadline.title}
                    </h3>
                    {deadline.description && (
                      <p className="text-xs text-gray-600">
                        {deadline.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium ${styles.text}`}>
                    Due{" "}
                    {formatDistanceToNow(new Date(deadline.dueDate), {
                      addSuffix: true,
                    })}
                  </span>
                  <p className="text-xs text-gray-600 capitalize">
                    {deadline.priority} Priority
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
