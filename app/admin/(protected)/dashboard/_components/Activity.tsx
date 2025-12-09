"use client";

import { useAuditLogs } from "@/hooks/queries/admin/useAuditLogsQueries";
import Badge from "@/components/ui/Badge";

export function Activity() {
  const { data, isLoading } = useAuditLogs({ limit: 3 });
  const logs = data?.data?.logs || [];

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return "just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMonths === 1) return "1 month ago";

    return `${diffInMonths} months ago`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-none">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Recent Activity</h3>
          <p className="text-sm text-gray-600">Latest changes from audit logs</p>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-white/50 rounded-lg animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-2 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500 text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.timestamp}
                  className="p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {formatAction(log.action)} - {log.service}
                        </p>
                        <Badge
                          size="sm"
                          variant={
                            log.status.toLowerCase() === "success"
                              ? "success"
                              : "error"
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {log.userEmail} ({formatRole(log.userRole)})
                      </p>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Resource: {log.resource}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {getTimeAgo(log.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
