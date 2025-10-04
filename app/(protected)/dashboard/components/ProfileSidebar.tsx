'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, User, LogOut, Edit2 } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import DashboardCalendar from './DashboardCalendar'
import DashboardNotifications from './DashboardNotifications'
import Image from 'next/image'

interface ProfileSidebarProps {
  sidebarCollapsed: boolean
}

export default function ProfileSidebar({ sidebarCollapsed }: ProfileSidebarProps) {
  const { logout, isLoggingOut } = useAuth()
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  // // Handle click outside settings dropdown
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
  //       setShowSettingsDropdown(false)
  //     }
  //   }

  //   document.addEventListener('mousedown', handleClickOutside)
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [])

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
        setShowSettingsDropdown(false)
        await logout()
      } catch (error) {
        console.error("Logout error:", error)
      }
    }
  }

  return (
    <div className={`transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'w-96' : 'w-80'}`}>
      <div className="h-[calc(100vh-3rem)] backdrop-blur-md border border-white/30 rounded-3xl relative overflow-hidden" style={{ backgroundColor: 'rgba(17,85,63, 0.10)' }}>

        {/* Settings Icon */}
        <div className="absolute top-6 right-6 z-10" ref={settingsRef}>
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className="p-2 hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
          >
            <Settings size={20} className="text-gray-600" />
          </button>

          {/* Settings Dropdown */}
          {showSettingsDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white/100 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden">
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

        {/* Profile Header */}
        <div className="bg-transparent text-gray-900 p-2 pt-15 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-30 h-30 bg-white/40 rounded-full flex items-center justify-center mb-3 p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image
                  src="/member.jpg"
                  alt="Profile Image"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
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

        <div className="p-6 flex flex-col flex-1 min-h-0">
          {/* Calendar */}
          <DashboardCalendar />

          {/* My Notifications */}
          <div className="flex-1 min-h-0">
            <DashboardNotifications />
          </div>
        </div>
      </div>
    </div>
  )
}