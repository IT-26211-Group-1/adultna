"use client";

import { memo, useState } from "react";
import { X, Bell } from "lucide-react";
import {
  useDashboardNotifications,
  useDeleteNotification,
} from "@/hooks/queries/useDashboardQueries";
import { formatDistanceToNow } from "date-fns";
import type { DashboardNotification } from "@/types/dashboard";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// NotificationsContent component without header (for modal use)
function NotificationsContent() {
  const { data: notifications = [], isLoading } = useDashboardNotifications(10);
  const deleteNotification = useDeleteNotification();
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(
    null,
  );

  const handleDeleteNotification = (notificationId: string) => {
    deleteNotification.mutate(notificationId);
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-3 bg-gray-200 rounded-lg animate-pulse"
            style={{ height: "60px" }}
          />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500 text-sm">No notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification: DashboardNotification) => (
        <div
          key={notification.id}
          className={`p-3 rounded-lg border transition-all shadow-sm relative group ${
            notification.isRead
              ? "bg-white/80 backdrop-blur-md border-white/30 hover:bg-white/100"
              : "bg-blue-50/80 backdrop-blur-md border-blue-200/50 hover:bg-blue-50/100"
          }`}
          onMouseEnter={() => setHoveredNotification(notification.id)}
          onMouseLeave={() => setHoveredNotification(null)}
        >
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {notification.title}
                </p>
                <div className="flex items-center gap-1">
                  {hoveredNotification === notification.id && (
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      disabled={deleteNotification.isPending}
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <X size={14} />
                    </button>
                  )}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">
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
  );
}

function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - for mobile only to close dropdown */}
      <div
        aria-label="Close notifications"
        className="lg:hidden fixed inset-0 z-40"
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Dropdown positioned under notification icon */}
      <div className="lg:hidden absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 w-80 max-h-96 z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="text-gray-600" size={16} />
            <h3 className="font-semibold text-gray-900 text-sm">
              Notifications
            </h3>
          </div>
          <button
            aria-label="Close notifications"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="text-gray-500" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          <div className="p-4">
            <NotificationsContent />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(NotificationsModal);
