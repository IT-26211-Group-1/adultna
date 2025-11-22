"use client";

import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
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
    <div className="mt-5 px-20">
      <Card className="h-full px-5 py-3">
        <CardHeader className="text-xl font-bold flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-md font-bold">Recent Activity</p>
            <p className="text-sm font-medium text-gray-600">
              Latest changes from audit logs
            </p>
          </div>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody className="flex items-start justify-center h-full">
          {isLoading ? (
            <div className="w-full space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : logs.length === 0 ? (
            <p className="text-gray-500 text-center w-full py-8">
              No recent activity
            </p>
          ) : (
            <ul className="w-full space-y-4">
              {logs.map((log) => (
                <li
                  key={log.timestamp}
                  className="p-4 border rounded hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
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
                      <p className="text-sm text-gray-600">
                        {log.userEmail} ({formatRole(log.userRole)})
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Resource: {log.resource}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {getTimeAgo(log.timestamp)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
