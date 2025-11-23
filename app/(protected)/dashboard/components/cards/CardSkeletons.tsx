export function DailyStreakCardSkeleton() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(252, 226, 169, 0.3)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        🔥
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Daily Active Streak
          </h3>
          <p className="text-gray-700 mb-3 text-sm">
            Keep building your habits
          </p>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-sm text-gray-600 mt-1">day</div>
          <div className="h-16 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function RoadmapProgressCardSkeleton() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(203, 203, 231, 0.3)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        📍
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Roadmap Progress
          </h3>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="h-20 w-20 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function RecentActivitiesCardSkeleton() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(241, 111, 51, 0.2)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        ⚡
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Recent Activities
          </h3>
          <p className="text-gray-700 mb-3 text-sm">
            Stay updated with progress
          </p>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="space-y-1">
            <div className="flex gap-1">
              <div className="w-3 h-8 bg-gray-300 rounded-sm animate-pulse" />
              <div className="w-3 h-12 bg-gray-300 rounded-sm animate-pulse" />
              <div className="w-3 h-6 bg-gray-300 rounded-sm animate-pulse" />
              <div className="w-3 h-16 bg-gray-300 rounded-sm animate-pulse" />
            </div>
            <div className="text-xs text-gray-600 text-center">
              activity trend
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpcomingDeadlinesCardSkeleton() {
  return (
    <div
      className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48"
      style={{ backgroundColor: "rgba(172, 189, 111, 0.3)" }}
    >
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">
        ⏰
      </div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Upcoming Deadlines
          </h3>
          <p className="text-gray-700 mb-3 text-sm">
            Never miss important dates
          </p>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="space-y-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <div className="w-12 h-1.5 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <div className="w-8 h-1.5 bg-gray-200 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <div className="w-6 h-1.5 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="text-xs text-gray-600 text-center">
              priority levels
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
