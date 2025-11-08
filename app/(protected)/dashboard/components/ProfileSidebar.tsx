"use client";

import { useCallback, memo } from "react";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import DashboardCalendar from "./DashboardCalendar";
import DashboardNotifications from "./DashboardNotifications";
import Image from "next/image";

function ProfileSidebar() {
  const router = useRouter();

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

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
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                  height={80}
                  src="/member.jpg"
                  width={80}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Tricia Arellano</h3>
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
