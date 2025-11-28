"use client";

import { useCallback, memo } from "react";
import { Edit2, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DashboardCalendar from "./DashboardCalendar";
import DashboardNotifications from "./DashboardNotifications";
import { useAuth } from "@/hooks/queries/useAuthQueries";

function ProfileSidebar() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const isDataUrl = user?.profilePictureUrl?.startsWith("data:");

  return (
    <div className="transition-all duration-300 flex-shrink-0 w-80">
      <div
        className="h-[calc(100vh-3rem)] backdrop-blur-md border border-white/30 rounded-3xl relative overflow-hidden transition-all duration-300"
        style={{ backgroundColor: "rgba(17,85,63, 0.10)" }}
      >
        {/* Profile Header */}
        <div className="bg-transparent text-gray-900 p-2 pt-15 relative">
          <div className="flex flex-col items-center text-center">
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

        <div className="p-6 flex flex-col h-full">
          {/* Calendar */}
          <div className="flex-shrink-0 mb-4">
            <DashboardCalendar />
          </div>

          {/* My Notifications */}
          <div
            className="flex-1 overflow-hidden"
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
