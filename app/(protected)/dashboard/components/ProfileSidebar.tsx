"use client";

import { useCallback, memo, useState } from "react";
import { Edit2, User as UserIcon, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardCalendar from "./DashboardCalendar";
import DashboardNotifications from "./DashboardNotifications";
import { useAuth } from "@/hooks/queries/useAuthQueries";
import { useDashboardNotifications } from "@/hooks/queries/useDashboardQueries";
import NotificationsModal from "./NotificationsModal";

function ProfileSidebar() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { data: notifications = [] } = useDashboardNotifications(10);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] =
    useState(false);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const handleNotificationsClick = useCallback(() => {
    setIsNotificationsModalOpen(true);
  }, []);

  const handleCloseNotifications = useCallback(() => {
    setIsNotificationsModalOpen(false);
  }, []);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const isDataUrl = user?.profilePictureUrl?.startsWith("data:");

  return (
    <div className="transition-all duration-300 flex-shrink-0 w-full lg:w-80">
      <div
        className="h-[350px] lg:h-[calc(100vh-3rem)] backdrop-blur-md border border-white/30 rounded-2xl lg:rounded-3xl relative overflow-hidden transition-all duration-300"
        style={{ backgroundColor: "rgba(17,85,63, 0.10)" }}
      >
        {/* Profile Header */}
        <div className="bg-transparent text-gray-900 p-4 lg:p-2 lg:pt-15 relative">
          {/* Mobile Layout: Horizontal */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="w-12 h-12 bg-white/40 rounded-full flex items-center justify-center p-1 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative">
                {user?.profilePictureUrl ? (
                  <Image
                    fill
                    alt="Profile"
                    className="object-cover"
                    sizes="48px"
                    src={user.profilePictureUrl}
                    unoptimized={isDataUrl}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">
                  {isLoading ? "Loading..." : user?.displayName || "User"}
                </h3>
                <button
                  className="p-1 hover:bg-white/40 rounded-lg transition-colors"
                  title="Edit Profile"
                  onClick={handleProfileClick}
                >
                  <Edit2 className="text-gray-600" size={16} />
                </button>
              </div>
              <div className="relative">
                <button
                  className="p-2 hover:bg-white/40 rounded-lg transition-colors relative"
                  title="Notifications"
                  onClick={handleNotificationsClick}
                >
                  <Bell className="text-gray-600" size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Modal - Mobile Only (Positioned relative to button) */}
                <NotificationsModal
                  isOpen={isNotificationsModalOpen}
                  onClose={handleCloseNotifications}
                />
              </div>
            </div>
          </div>

          {/* Desktop Layout: Vertical (Original) */}
          <div className="hidden lg:flex flex-col items-center text-center">
            <div className="w-30 h-30 bg-white/40 rounded-full flex items-center justify-center mb-3 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 relative">
                {user?.profilePictureUrl ? (
                  <Image
                    fill
                    alt="Profile"
                    className="object-cover"
                    sizes="120px"
                    src={user.profilePictureUrl}
                    unoptimized={isDataUrl}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">
                {isLoading ? "Loading..." : user?.displayName || "User"}
              </h3>
              <button
                className="p-1 hover:bg-white/40 rounded-lg transition-colors"
                title="Edit Profile"
                onClick={handleProfileClick}
              >
                <Edit2 className="text-gray-600" size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 flex flex-col h-full">
          {/* Calendar */}
          <div className="flex-shrink-0 mb-3 lg:mb-4">
            <DashboardCalendar />
          </div>

          {/* My Notifications - Desktop Only */}
          <div
            className="hidden lg:block flex-1 overflow-hidden"
            style={{ height: "calc(100% - 200px)" }}
          >
            <DashboardNotifications />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProfileSidebar);
