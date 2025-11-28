"use client";

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import DashboardCards from "./DashboardCards";
import ProfileSidebar from "./ProfileSidebar";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 transition-all duration-300 min-h-screen">
      {/* Left Content Area */}
      <div className="flex flex-1 flex-col lg:h-[calc(100vh-3rem)]">
        {/* Header */}
        <DashboardHeader />

        {/* Bottom Content Area */}
        <div className="flex-1 flex flex-col justify-end space-y-4 sm:space-y-6">
          {/* Category Tabs */}
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Dashboard Cards */}
          <DashboardCards activeTab={activeTab} />
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar />
    </div>
  );
}
