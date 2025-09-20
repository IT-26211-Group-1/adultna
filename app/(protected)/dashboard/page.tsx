import React from "react"
import DashboardWrapper from "./components/DashboardWrapper"
import ProfileDropdown from "./components/ProfileDropdown"
import Calendar from "./components/Calendar"
import ProgressCard from "./components/ProgressCard"
import RecentActivity from "./components/RecentActivity"
import UpcomingDeadlines from "./components/UpcomingDeadlines"
import AdultingToolkit from "./components/AdultingToolkit"

export default function Page() {
  return (
    <DashboardWrapper>
        {/* Welcome Section with Profile */}
        <div className="px-6 pt-6 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-1xl font-semibold text-gray-800 mb-1">Welcome back, (Name)! 👋</h1>
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
              </div>
              <ProfileDropdown />
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="transition-all duration-300">
          <div className="px-6">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  <ProgressCard />

                  {/* Recent Activity & Upcoming Deadlines */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <RecentActivity />
                    <UpcomingDeadlines />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <Calendar />
                  <AdultingToolkit />
                </div>
              </div>
            </div>
          </div>
        </main>
    </DashboardWrapper>
  )
}
          