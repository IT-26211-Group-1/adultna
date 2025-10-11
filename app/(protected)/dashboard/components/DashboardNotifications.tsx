"use client";

import { useState, useCallback, memo } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
}

function DashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New milestone unlocked!",
      message: "You completed the Financial Planning module",
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Reminder",
      message: "Tax filing deadline approaching",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Great job!",
      message: "You maintained your streak for 12 days",
      time: "3 hours ago",
    },
    {
      id: 4,
      title: "Skills Assessment Available",
      message: "Take the new career readiness quiz",
      time: "5 hours ago",
    },
    {
      id: 5,
      title: "Document Updated",
      message: "Your resume has been reviewed",
      time: "1 day ago",
    },
    {
      id: 6,
      title: "New Opportunity",
      message: "Job posting matches your profile",
      time: "2 days ago",
    },
    {
      id: 7,
      title: "Training Reminder",
      message: "Complete your professional development course",
      time: "3 days ago",
    },
  ]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

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
            onClick={clearNotifications}
          >
            Clear All
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
        {notifications.length > 0 ? (
          <div className="space-y-3 pr-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/100 transition-all shadow-sm"
              >
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-700 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
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
