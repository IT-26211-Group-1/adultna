import { Button } from "@nextui-org/react"

export default function RoadmapProgressTable() {
  return (
    <div className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden" style={{ backgroundColor: 'rgba(203, 203, 231, 0.30)' }}>
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 pointer-events-none">📍</div>

      {/* Overall Progress Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">Overall Progress</h2>
          <span className="text-3xl font-bold text-adult-green">24%</span>
        </div>

        <div className="w-full bg-white/30 rounded-full h-2 mb-3">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
        </div>

        <p className="text-gray-700 text-sm">
          You've completed <strong>2 out of 25</strong> essential adulting tasks. Keep going!
        </p>
      </div>

      {/* Your Next Steps Section */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Your Next Steps</h3>

        <div className="space-y-3">
          {/* High Priority Task */}
          <div className="backdrop-blur-md bg-white/60 h-16 border-white/40 border-t border-r border-b rounded-xl p-4 border-l-4 border-l-red-500 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Apply for SSS ID</h4>
              <p className="text-red-600 font-medium text-xs">Due this week • High Priority</p>
            </div>
            <Button
              color="danger"
              variant="bordered"
              size="sm"
              className="font-medium text-xs h-6 min-h-6"
            >
              Start Now
            </Button>
          </div>

          {/* Medium Priority Task */}
          <div className="backdrop-blur-md bg-white/60 h-16 border-white/40 border-t border-r border-b rounded-xl p-4 border-l-4 border-l-yellow-500 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Open Bank Account</h4>
              <p className="text-yellow-600 font-medium text-xs">Due next week • Medium Priority</p>
            </div>
            <Button
              color="warning"
              variant="bordered"
              size="sm"
              className="font-medium text-xs h-6 min-h-6"
            >
              Learn How
            </Button>
          </div>

          {/* Additional Tasks */}
          <div className="backdrop-blur-md bg-white/60 h-16 border-white/40 border-t border-r border-b rounded-xl p-4 border-l-4 border-l-blue-500 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Register to Vote</h4>
              <p className="text-blue-600 font-medium text-xs">Due next month • Low Priority</p>
            </div>
            <Button
              color="primary"
              variant="bordered"
              size="sm"
              className="font-medium text-xs h-6 min-h-6"
            >
              Plan Ahead
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}