'use client'

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date()) // Today's date

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const today = new Date()

  const completedDays = [1, 2, 3, 4, 5, 6, 7] // Example completed days
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const generateCalendarDays = () => {
    const days = []
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0).getDate()

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonth - i,
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
    <div className="backdrop-blur-md bg-white/30 rounded-2xl p-5 border border-white/20 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-1 hover:bg-white/50 rounded"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-1 hover:bg-white/50 rounded"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        {calendarDays.map((date, index) => (
          <div
            key={index}
            className={`
              text-center text-xs py-1.5 cursor-pointer rounded
              ${date.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
              ${date.isToday ? 'bg-teal-600 text-white font-semibold' : 'hover:bg-white/40'}
              ${completedDays.includes(date.day) && date.isCurrentMonth ? 'bg-teal-100/60 text-teal-800' : ''}
            `}
          >
            {date.day}
          </div>
        ))}
      </div>
    </div>
  )
}