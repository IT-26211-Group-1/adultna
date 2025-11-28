
import DailyStreakCard from "./cards/DailyStreakCard";
import RoadmapProgressCard from "./cards/RoadmapProgressCard";
import RecentActivitiesCard from "./cards/RecentActivitiesCard";
import UpcomingDeadlinesCard from "./cards/UpcomingDeadlinesCard";
import RoadmapProgressTable from "./tables/RoadmapProgressTable";
import ActivitiesTable from "./tables/ActivitiesTable";
import DeadlinesTable from "./tables/DeadlinesTable";

interface DashboardCardsProps {
  activeTab: string;
}

export default function DashboardCards({ activeTab }: DashboardCardsProps) {
  if (activeTab === "roadmap") {
    return <RoadmapProgressTable />;
  }

  if (activeTab === "activities") {
    return <ActivitiesTable />;
  }

  if (activeTab === "deadlines") {
    return <DeadlinesTable />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      <DailyStreakCard />
      <RoadmapProgressCard />
      <RecentActivitiesCard />
      <UpcomingDeadlinesCard />
    </div>
  );
}
