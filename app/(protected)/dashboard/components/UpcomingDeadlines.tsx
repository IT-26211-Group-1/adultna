'use client'

import React from "react"
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react"

const upcomingDeadlines = [
  { task: "Submit passport application", date: "Mar 15", priority: "high" },
  { task: "Complete tax filing", date: "Mar 20", priority: "medium" },
  { task: "Update resume", date: "Mar 25", priority: "low" }
]

export default function UpcomingDeadlines() {
  return (
    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Upcoming Deadlines</h3>
        <CalendarIcon size={16} className="text-gray-400" />
      </div>
      <div className="space-y-3 flex-1">
        {upcomingDeadlines.map((deadline, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                deadline.priority === 'high' ? 'bg-red-400' :
                deadline.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              }`}></div>
              <div>
                <p className="text-sm text-gray-900">{deadline.task}</p>
                <p className="text-xs text-gray-500">{deadline.date}</p>
              </div>
            </div>
            <AlertCircle size={14} className={
              deadline.priority === 'high' ? 'text-red-400' :
              deadline.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'
            } />
          </div>
        ))}
      </div>
    </div>
  )
}