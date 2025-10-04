'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'

interface Notification {
  id: number
  title: string
  message: string
  time: string
}

export default function DashboardNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New milestone unlocked!",
      message: "You completed the Financial Planning module",
      time: "2 min ago"
    },
    {
      id: 2,
      title: "Reminder",
      message: "Tax filing deadline approaching",
      time: "1 hour ago"
    },
    {
      id: 3,
      title: "Great job!",
      message: "You maintained your streak for 12 days",
      time: "3 hours ago"
    }
  ])

  const clearNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Bell size={16} className="text-gray-600" />
          <h4 className="font-semibold text-gray-900">My Notifications</h4>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={clearNotifications}
            className="text-xs text-adult-green hover:text-teal-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
      }}>
        <style jsx>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
          }
        `}</style>
        {notifications.length > 0 ? (
          <div className="space-y-3 pr-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/100 transition-all shadow-sm"
              >
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="text-xs text-gray-700 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">No notifications</p>
          </div>
        )}
      </div>
    </div>
  )
}