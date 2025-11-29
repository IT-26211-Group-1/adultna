"use client";

import UserSidebar from "@/components/ui/sidebar/UserSidebar";
import DashboardContent from "@/app/(protected)/dashboard/components/DashboardContent";

export default function DashboardBackground() {
  return (
    <div className="w-full h-screen">
      <UserSidebar>
        <DashboardContent />
      </UserSidebar>
    </div>
  );
}
