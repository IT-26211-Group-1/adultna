"use client";

import { memo } from "react";
import { Bell } from "lucide-react";
import {
  useDashboardNotifications,
  useMarkAllNotificationsRead,
} from "@/hooks/queries/useDashboardQueries";
import { formatDistanceToNow } from "date-fns";
import type { DashboardNotification } from "@/types/dashboard";

function DashboardNotifications() {
  const { data: notifications = [], isLoading } = useDashboardNotifications(10);
  const markAllAsRead = useMarkAllNotificationsRead();

  const handleClearAll = () => {
    markAllAsRead.mutate();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "milestone":
        return "📍";
      case "achievement":
        return "🏆";
      case "reminder":
        return "⏰";
      default:
        return "🔔";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Bell className="text-gray-600" size={16} />
          <h4 className="font-semibold text-gray-900">My Notifications</h4>
        </div>
        {notifications.length > 0 && (
          <button
            className="text-xs text-adult-green hover:text-teal-700 font-medium"
            disabled={markAllAsRead.isPending}
            onClick={handleClearAll}
          >
            {markAllAsRead.isPending ? "Clearing..." : "Clear All"}
          </button>
        )}
      </div>

      <div
        className="overflow-y-auto scrollbar-thin"
        style={{
          height: "calc(100% - 40px)",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(156, 163, 175, 0.5) transparent",
          WebkitOverflowScrolling: "touch" as any,
          overscrollBehavior: "contain",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .scrollbar-thin::-webkit-scrollbar {
              width: 6px;
            }
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.5);
              border-radius: 3px;
            }
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.7);
            }
          `,
          }}
        />
        {isLoading ? (
          <div className="space-y-3 pr-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 bg-gray-200 rounded-xl animate-pulse"
                style={{ height: "80px" }}
              />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3 pr-2">
            {notifications.map((notification: DashboardNotification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-xl border transition-all shadow-sm ${
                  notification.isRead
                    ? "bg-white/80 backdrop-blur-md border-white/30 hover:bg-white/100"
                    : "bg-blue-50/80 backdrop-blur-md border-blue-200/50 hover:bg-blue-50/100"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(DashboardNotifications);
