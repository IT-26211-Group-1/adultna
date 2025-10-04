'use client'

import React, { useState, useRef, useEffect } from "react"
import ProtectedPageWrapper from "../../../components/ui/ProtectedPageWrapper"
import { Settings, ChevronLeft, ChevronRight, Bell, User, LogOut, Edit2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function Page() {
  const { logout, isLoggingOut } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [currentDate, setCurrentDate] = useState(new Date()) // Current date
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState([
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

  // Handle click outside settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleProfileClick = () => {
    window.location.href = '/profile'
  }

  const handleSettingsClick = () => {
    window.location.href = '/settings'
  }

  const handleLogoutClick = async () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      try {
        setShowSettingsDropdown(false) // Close dropdown first
        await logout()
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
  }

  // Calendar data
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

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'roadmap', label: 'Adulting Roadmap Progress' },
    { id: 'activities', label: 'Recent Activities' },
    { id: 'deadlines', label: 'Upcoming Deadlines' }
  ]

  return (
    <ProtectedPageWrapper>
      {({ sidebarCollapsed }) => (
        <>
          {/* Main Layout - Flex Container */}
          <div className={`flex p-6 gap-8 transition-all duration-300 ${sidebarCollapsed ? 'ml-8' : 'ml-1'}`}>
        
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col lg:h-[calc(100vh-3rem)]">
          {/* Header */}
        <div className="mb-8">
         <h1 className="text-4xl font-bold text-gray-600 mb-12 mt-15 leading-[3rem]">
          Everything You Need for Career, Civic,  <br /> and Life Readiness is{" "}
          <span className="italic text-adult-green">Here.</span>
        </h1>

            
            {/* Category Tabs */}
            <div className="flex justify-end space-x-2 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-adult-green text-white'
                      : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
     
          </div>

          {/* 2x2 Grid of Cards */}
          <div className="grid grid-cols-2 gap-4 ">
            
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
        </div>

        {/* Profile Container */}
        <div className={`transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'w-96' : 'w-80'}`}>
          <div className="h-[calc(100vh-3rem)] backdrop-blur-md border border-white/30 rounded-3xl relative overflow-hidden" style={{ backgroundColor: 'rgba(17,85,63, 0.10)' }}>
            
            {/* Settings Icon - Top Right */}
            <div className="absolute top-6 right-6 z-10" ref={settingsRef}>
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className="p-2 hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
              >
                <Settings size={20} className="text-gray-600" />
              </button>

              {/* Settings Dropdown */}
              {showSettingsDropdown && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden">
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-white/50 transition-colors"
                    >
                      <User size={16} />
                      <span className="text-sm">Profile</span>
                    </button>
                    <button
                      onClick={handleSettingsClick}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-white/50 transition-colors"
                    >
                      <Settings size={16} />
                      <span className="text-sm">Settings</span>
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut size={16} />
                      <span className="text-sm">{isLoggingOut ? "Signing out..." : "Logout"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile Header with Glassmorphism */}
            <div className="bg-transparent text-gray-900 p-6 relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center mb-3">
                  <div className="w-14 h-14 bg-teal-200/60 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 font-bold text-xl">A</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">Tricia Arellano</h3>
                  <button
                    onClick={handleProfileClick}
                    className="p-1 hover:bg-white/40 rounded-lg transition-colors"
                    title="Edit Profile"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>


            <div className="p-6 flex flex-col h-full">
              {/* Calendar */}
              <div className="mb-7">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h4>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      className="p-0.5 hover:bg-white/50 rounded"
                    >
                      <ChevronLeft size={12} />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      className="p-0.5 hover:bg-white/50 rounded"
                    >
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
                  {weekDays.map((day, index) => (
                    <div key={`${day.full}-${index}`} className="text-gray-600 py-0.5 font-medium text-xs">
                      {day.short}
                    </div>
                  ))}
                  {calendarDays.map((date, index) => (
                    <div
                      key={index}
                      className={`py-0.5 text-xs cursor-pointer ${
                        date.isToday
                          ? 'bg-adult-green text-white rounded-full'
                          : date.isCurrentMonth
                            ? 'text-gray-700 hover:bg-white/40 rounded-full'
                            : 'text-gray-400'
                      }`}
                    >
                      {date.day}
                    </div>
                  ))}
                </div>
              </div>

              {/* My Notifications */}
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

                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {notifications.length > 0 ? (
                    <div className="space-y-3 pr-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/30 hover:bg-white/50 transition-all"
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
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </ProtectedPageWrapper>
  )
}
