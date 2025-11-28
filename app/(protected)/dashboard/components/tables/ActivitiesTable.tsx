"use client";

import { useDashboardSummary } from "@/hooks/queries/useDashboardQueries";
import { formatDistanceToNow } from "date-fns";

export default function ActivitiesTable() {
  const { data, isLoading } = useDashboardSummary();
  const activities = data?.recentActivities || [];

  const getActivityColor = (title: string) => {
    const titleLower = title.toLowerCase();

    if (titleLower.includes("complete")) return "bg-green-500";
    if (titleLower.includes("create")) return "bg-blue-500";
    if (titleLower.includes("update")) return "bg-purple-500";
    if (titleLower.includes("delete")) return "bg-red-500";

    return "bg-orange-500";
  };

  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-x-hidden overflow-y-auto"
      style={{ backgroundColor: "rgba(241, 111, 51, 0.06)", height: "408px" }}
    >
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 pointer-events-none">
        ⚡
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Recent Activities
      </h2>
      {isLoading ? (
        <div className="divide-y divide-white/20">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                  <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <p className="text-gray-600 text-sm">No recent activities</p>
      ) : (
        <div className="divide-y divide-white/20">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 ${getActivityColor(activity.title)} rounded-full`}
                />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-xs text-gray-600">
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-600">
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
