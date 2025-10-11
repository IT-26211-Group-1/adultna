'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, User, LogOut, Edit2, AlertTriangle } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import DashboardCalendar from './DashboardCalendar'
import DashboardNotifications from './DashboardNotifications'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { Button } from '@heroui/button'
import Image from 'next/image'

interface ProfileSidebarProps {
  sidebarCollapsed: boolean
  onModalStateChange?: (isOpen: boolean) => void
}

export default function ProfileSidebar({ sidebarCollapsed, onModalStateChange }: ProfileSidebarProps) {
  const { logout, isLoggingOut } = useAuth()
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const settingsRef = useRef<HTMLDivElement>(null)

  // Handle click outside settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false)
      }
    }

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSettingsDropdown])

  const handleProfileClick = () => {
    window.location.href = '/profile'
  }

  const handleSettingsClick = () => {
    window.location.href = '/settings'
  }

  const handleLogoutClick = () => {
    setShowSettingsDropdown(false)
    onOpen()
    onModalStateChange?.(true)
  }

  const confirmLogout = async () => {
    try {
      onClose()
      onModalStateChange?.(false)
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
      // In production, you might want to show an error toast here
    }
  }

  const handleModalClose = () => {
    onClose()
    onModalStateChange?.(false)
  }

  return (
    <div className={`transition-all duration-300 flex-shrink-0 ${sidebarCollapsed ? 'w-96' : 'w-80'}`}>
      <div className={`h-[calc(100vh-3rem)] backdrop-blur-md border border-white/30 rounded-3xl relative overflow-hidden transition-all duration-300 ${isOpen ? 'blur-sm' : ''}`} style={{ backgroundColor: 'rgba(17,85,63, 0.10)' }}>

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
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className="p-6 flex flex-col h-full">
          {/* Calendar */}
          <div className="flex-shrink-0 mb-4">
            <DashboardCalendar />
          </div>

          {/* My Notifications */}
          <div className="flex-1 overflow-hidden" style={{ height: 'calc(100% - 200px)' }}>
            <DashboardNotifications />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        size="sm"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">Sign Out Confirmation</h3>
            <p className="text-sm text-gray-500">You will be logged out of your account and redirected to the login page.</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-orange-800 font-medium">Are you sure you want to sign out?</p>
                <p className="text-orange-700 mt-1">
                  Any unsaved changes will be lost. Make sure to save your work before proceeding.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="flat"
              onPress={handleModalClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={confirmLogout}
              isLoading={isLoggingOut}
            >
              Sign Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}