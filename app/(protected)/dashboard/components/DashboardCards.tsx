import DailyStreakCard from './cards/DailyStreakCard'
import RoadmapProgressCard from './cards/RoadmapProgressCard'
import RecentActivitiesCard from './cards/RecentActivitiesCard'
import UpcomingDeadlinesCard from './cards/UpcomingDeadlinesCard'
import RoadmapProgressTable from './tables/RoadmapProgressTable'
import ActivitiesTable from './tables/ActivitiesTable'
import DeadlinesTable from './tables/DeadlinesTable'

interface DashboardCardsProps {
  activeTab: string
}

export default function DashboardCards({ activeTab }: DashboardCardsProps) {
  // Render specific tab view
  if (activeTab === 'roadmap') {
    return <RoadmapProgressTable />
  }

  if (activeTab === 'activities') {
    return <ActivitiesTable />
  }

  if (activeTab === 'deadlines') {
    return <DeadlinesTable />
  }

  // Default "all" view with cards
  return (
    <div className="grid grid-cols-2 gap-4">
      <DailyStreakCard />
      <RoadmapProgressCard />
      <RecentActivitiesCard />
      <UpcomingDeadlinesCard />
    </div>
  )
}