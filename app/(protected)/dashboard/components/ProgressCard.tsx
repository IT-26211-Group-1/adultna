'use client'

import React from "react"

export default function ProgressCard() {
  return (
    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
          <span className="text-2xl font-bold text-teal-600">24%</span>
        </div>
        <p className="text-gray-700 text-sm mb-6">
          You're making great progress on your adulting journey! Here's what
          you've accomplished so far and what's coming up next.
        </p>
        <div className="w-full bg-white/40 rounded-full h-3 mb-3">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full" style={{ width: '24%' }}></div>
        </div>
        <p className="text-gray-600 italic text-sm">
          You've completed 2 out of 25 essential adulting tasks. Keep going!
        </p>
      </div>

      {/* Your Next Steps */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Next Steps</h3>
        <div className="space-y-3">
          {/* Apply for SSS ID */}
          <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-red-50/60 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">Apply for SSS ID</h4>
              <p className="text-xs text-red-600">Due this week • High Priority</p>
            </div>
            <button className="px-3 py-1.5 bg-red-100/80 text-red-700 rounded-lg hover:bg-red-200/80 transition-colors font-medium text-sm">
              Start Now
            </button>
          </div>

          {/* Open Bank Account */}
          <div className="flex items-center justify-between p-4 backdrop-blur-sm bg-yellow-50/60 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 text-sm">Open Bank Account</h4>
              <p className="text-xs text-yellow-600">Due next week • Medium Priority</p>
            </div>
            <button className="px-3 py-1.5 bg-yellow-100/80 text-yellow-700 rounded-lg hover:bg-yellow-200/80 transition-colors font-medium text-sm">
              Learn How
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}