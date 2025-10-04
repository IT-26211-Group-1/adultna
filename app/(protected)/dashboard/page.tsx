'use client'

import React, { useState } from "react"
import ProtectedPageWrapper from "../../../components/ui/ProtectedPageWrapper"
import DashboardHeader from "./components/DashboardHeader"
import DashboardTabs from "./components/DashboardTabs"
import DashboardCards from "./components/DashboardCards"
import ProfileSidebar from "./components/ProfileSidebar"

export default function Page() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <ProtectedPageWrapper>
      {({ sidebarCollapsed }) => (
        <>
          {/* Main Layout - Flex Container */}
          <div className={`flex p-6 gap-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-8' : 'ml-1'}`}>

            {/* Left Content Area */}
            <div className="flex-1 flex flex-col lg:h-[calc(100vh-3rem)]">
              {/* Header */}
              <DashboardHeader />

              {/* Category Tabs */}
              <DashboardTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Dashboard Cards */}
              <DashboardCards />
            </div>

            {/* Profile Sidebar */}
            <ProfileSidebar sidebarCollapsed={sidebarCollapsed} />
          </div>
        </>
      )}
    </ProtectedPageWrapper>
  )
}
