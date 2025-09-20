'use client'

import React from "react"
import { CheckCircle, Clock, FileText } from "lucide-react"

const recentActivities = [
  { action: "Completed Government ID guide", time: "2 hours ago", type: "success" },
  { action: "Started Bank Account application", time: "Yesterday", type: "progress" },
  { action: "Viewed Resume Builder", time: "3 days ago", type: "info" }
]

export default function RecentActivity() {
  return (
    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
        <a href="/activity" className="text-xs text-teal-600 hover:text-teal-700">View all</a>
      </div>
      <div className="space-y-3 flex-1">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`p-1 rounded-full mt-1 ${
              activity.type === 'success' ? 'bg-green-100' :
              activity.type === 'progress' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {activity.type === 'success' ? (
                <CheckCircle size={12} className="text-green-600" />
              ) : activity.type === 'progress' ? (
                <Clock size={12} className="text-blue-600" />
              ) : (
                <FileText size={12} className="text-gray-600" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.action}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}