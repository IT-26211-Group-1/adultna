export default function RecentActivitiesCard() {
  return (
    <div className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48" style={{ backgroundColor: 'rgba(241, 111, 51, 0.2)' }}>
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">⚡</div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Recent Activities</h3>
          <p className="text-gray-700 mb-3 text-sm">Stay updated with progress</p>
          <p className="text-xs text-gray-600"><span className="text-orange-600 font-semibold">+150%</span> vs last week</p>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="space-y-1">
            <div className="flex gap-1">
              <div className="w-3 h-8 bg-orange-300 rounded-sm"></div>
              <div className="w-3 h-12 bg-orange-400 rounded-sm"></div>
              <div className="w-3 h-6 bg-orange-300 rounded-sm"></div>
              <div className="w-3 h-16 bg-orange-500 rounded-sm"></div>
            </div>
            <div className="text-xs text-gray-600 text-center">activity trend</div>
          </div>
        </div>
      </div>
    </div>
  )
}