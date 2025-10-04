'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function DashboardCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const today = new Date()
  const weekDays = [
    { short: 'S', full: 'Sunday' },
    { short: 'M', full: 'Monday' },
    { short: 'T', full: 'Tuesday' },
    { short: 'W', full: 'Wednesday' },
    { short: 'T', full: 'Thursday' },
    { short: 'F', full: 'Friday' },
    { short: 'S', full: 'Saturday' }
  ]
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const generateCalendarDays = () => {
    const days = []
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0).getDate()

    // Previous month days
    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({
        day: prevMonth - i + 1,
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = currentDate.getMonth() === today.getMonth() &&
                     currentDate.getFullYear() === today.getFullYear() &&
                     day === today.getDate()
      days.push({
        day,
        isCurrentMonth: true,
        isToday
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isToday: false
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="mb-4 bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/30 flex-shrink-0">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            <ChevronLeft size={12} className="text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            <ChevronRight size={12} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {weekDays.map((day, index) => (
          <div key={`${day.full}-${index}`} className="text-gray-500 py-1 font-medium text-xs">
            {day.short}
          </div>
        ))}
        {calendarDays.map((date, index) => (
          <div
            key={index}
            className={`py-1 text-xs cursor-pointer transition-all duration-200 ${
              date.isToday
                ? 'bg-adult-green text-white rounded font-bold'
                : date.isCurrentMonth
                  ? 'text-gray-700 hover:bg-white/60 rounded font-medium'
                  : 'text-gray-400 hover:bg-white/30 rounded'
            }`}
          >
            {date.day}
          </div>
        ))}
      </div>
    </div>
  )
}