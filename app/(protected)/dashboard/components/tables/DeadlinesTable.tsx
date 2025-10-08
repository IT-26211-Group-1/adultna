export default function DeadlinesTable() {
  return (
    <div className="backdrop-blur-md border border-white/40 rounded-3xl p-6 relative overflow-hidden" style={{ backgroundColor: 'rgba(172, 189, 111, 0.10)' }}>
      <div className="absolute -bottom-4 -right-4 text-6xl opacity-5 pointer-events-none">⏰</div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Upcoming Deadlines</h2>
      <div className="divide-y divide-white/20">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Tax Filing Deadline</h3>
              <p className="text-xs text-gray-600">Submit annual tax returns</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-red-600">Due in 3 days</span>
            <p className="text-xs text-gray-600">High Priority</p>
          </div>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Insurance Renewal</h3>
              <p className="text-xs text-gray-600">Renew health insurance policy</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-yellow-600">Due in 1 week</span>
            <p className="text-xs text-gray-600">Medium Priority</p>
          </div>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Investment Review</h3>
              <p className="text-xs text-gray-600">Quarterly portfolio assessment</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-blue-600">Due in 2 weeks</span>
            <p className="text-xs text-gray-600">Low Priority</p>
          </div>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Course Completion</h3>
              <p className="text-xs text-gray-600">Finish online certification course</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-green-600">Due in 3 weeks</span>
            <p className="text-xs text-gray-600">Low Priority</p>
          </div>
        </div>
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Budgeting Review</h3>
              <p className="text-xs text-gray-600">Monthly financial check-in</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-purple-600">Due in 1 month</span>
            <p className="text-xs text-gray-600">Low Priority</p>
          </div>
        </div>
      </div>
    </div>
  )
}