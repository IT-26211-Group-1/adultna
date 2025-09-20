'use client'

import React, { useState } from "react"
import { User, Settings, LogOut } from "lucide-react"

export default function ProfileDropdown() {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
      >
        <User size={16} className="text-gray-600" />
      </button>

      {showProfileMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-white/80 rounded-lg shadow-lg border border-white/20 z-50">
            <div className="py-1">
              <a
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/50"
              >
                <Settings size={16} className="mr-3" />
                Settings
              </a>
              <button
                onClick={() => {
                  console.log('Logout clicked')
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/50"
              >
                <LogOut size={16} className="mr-3" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}