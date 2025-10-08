export default function DailyStreakCard() {
  return (
    <div className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden h-48" style={{ backgroundColor: 'rgba(252, 226, 169, 0.3)' }}>
      <div className="absolute -bottom-4 -right-4 text-8xl opacity-5 pointer-events-none">🔥</div>
      <div className="flex justify-between items-start h-full">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Daily Active Streak</h3>
          <p className="text-gray-700 mb-3 text-sm">Keep building your habits</p>
          <p className="text-xs text-gray-600"><span className="text-adult-green font-semibold">85%</span> completion rate</p>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-sm text-gray-600 mt-1">day</div>
          <div className="text-6xl font-bold text-adult-green">12</div>
        </div>
      </div>
    </div>
  )
}