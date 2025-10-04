export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Days Active Streak */}
      <div className="backdrop-blur-md border border-white/40 rounded-3xl p-4 relative overflow-hidden" style={{ backgroundColor: 'rgba(252, 226, 169, 0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/30 rounded-xl p-3">
            <span className="text-2xl">🔥</span>
          </div>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Daily Active Streak</h3>
        <p className="text-gray-700 mb-2 text-sm">Keep building your habits</p>
        <p className="text-sm text-gray-600">12 days active</p>
      </div>

      {/* Adulting Roadmap Progress */}
      <div className="backdrop-blur-md border border-white/40 rounded-3xl p-4 relative overflow-hidden" style={{ backgroundColor: 'rgba(203, 203, 231, 0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/30 rounded-xl p-3">
            <span className="text-2xl">📍</span>
          </div>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Roadmap Progress</h3>
        <p className="text-sm text-gray-600 mb-2">8 out of 12 milestones completed</p>
        <div className="mt-2 w-full bg-white/40 rounded-full h-2">
          <div className="bg-adult-green h-2 rounded-full" style={{ width: '68%' }}></div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="backdrop-blur-md border border-white/40 rounded-3xl p-4 relative overflow-hidden" style={{ backgroundColor: 'rgba(241, 111, 51, 0.2)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/30 rounded-xl p-3">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Recent Activities</h3>
        <p className="text-gray-700 mb-2 text-sm">Stay updated with your progress</p>
        <p className="text-sm text-gray-600">3 new activities today</p>
      </div>

      {/* Upcoming Deadlines */}
      <div className="backdrop-blur-md border border-white/40 rounded-3xl p-4 relative overflow-hidden" style={{ backgroundColor: 'rgba(172, 189, 111, 0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="bg-white/30 rounded-xl p-3">
            <span className="text-2xl">⏰</span>
          </div>
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Upcoming Deadlines</h3>
        <p className="text-gray-700 mb-2 text-sm">Never miss important dates</p>
        <p className="text-sm text-gray-600">2 urgent deadlines this week</p>
      </div>
    </div>
  )
}