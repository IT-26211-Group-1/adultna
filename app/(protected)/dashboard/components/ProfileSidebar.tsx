"use client";

import { useState, useRef, useCallback, memo } from "react";
import { Settings, User, LogOut, Edit2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardCalendar from "./DashboardCalendar";
import DashboardNotifications from "./DashboardNotifications";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import Image from "next/image";

interface ProfileSidebarProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

function ProfileSidebar({ onModalStateChange }: ProfileSidebarProps) {
  const router = useRouter();
  const { logout, isLoggingOut } = useAuth();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const settingsRef = useRef<HTMLDivElement>(null);

  // Handle click outside settings dropdown using onBlur instead of useEffect
  const handleDropdownBlur = useCallback((e: React.FocusEvent) => {
    // Check if the new focus target is outside the settings dropdown
    if (!settingsRef.current?.contains(e.relatedTarget as Node)) {
      setShowSettingsDropdown(false);
    }
  }, []);

  const handleProfileClick = useCallback(() => {
    router.push("/profile");
  }, [router]);

  const handleSettingsClick = useCallback(() => {
    router.push("/settings");
  }, [router]);

  const handleLogoutClick = useCallback(() => {
    setShowSettingsDropdown(false);
    onOpen();
    onModalStateChange?.(true);
  }, [onOpen, onModalStateChange]);

  const confirmLogout = useCallback(async () => {
    try {
      onClose();
      onModalStateChange?.(false);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [onClose, onModalStateChange, logout]);

  const handleModalClose = useCallback(() => {
    onClose();
    onModalStateChange?.(false);
  }, [onClose, onModalStateChange]);

  const toggleSettingsDropdown = useCallback(() => {
    setShowSettingsDropdown((prev) => !prev);
  }, []);

  return (
    <div className="transition-all duration-300 flex-shrink-0 w-80">
      <div
        className={`h-[calc(100vh-3rem)] backdrop-blur-md border border-white/30 rounded-3xl relative overflow-hidden transition-all duration-300 ${isOpen ? "blur-sm" : ""}`}
        style={{ backgroundColor: "rgba(17,85,63, 0.10)" }}
      >
        {/* Settings Icon */}
        <div
          ref={settingsRef}
          className="absolute top-6 right-6 z-10"
          onBlur={handleDropdownBlur}
        >
          <button
            aria-expanded={showSettingsDropdown}
            aria-label="User settings menu"
            className="p-2 hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
            onClick={toggleSettingsDropdown}
          >
            <Settings className="text-gray-600" size={20} />
          </button>

          {/* Settings Dropdown */}
          {showSettingsDropdown && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white/100 backdrop-blur-md border border-white/30 rounded-xl shadow-lg overflow-hidden">
              <div className="py-2">
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={handleProfileClick}
                >
                  <User size={16} />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={handleSettingsClick}
                >
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoggingOut}
                  onClick={handleLogoutClick}
                >
                  <LogOut size={16} />
                  <span className="text-sm">
                    {isLoggingOut ? "Signing out..." : "Logout"}
                  </span>
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
                  alt="Profile Image"
                  className="w-full h-full object-cover"
                  height={80}
                  src="/member.jpg"
                  width={80}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">Tricia Arellano</h3>
              <button
                className="p-1 hover:bg-white/40 rounded-lg transition-colors"
                title="Edit Profile"
                onClick={handleProfileClick}
              >
                <Edit2 className="text-gray-600" size={16} />
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
          <div
            className="flex-1 overflow-hidden"
            style={{ height: "calc(100% - 200px)" }}
          >
            <DashboardNotifications />
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        size="sm"
        onClose={handleModalClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Sign Out Confirmation
            </h3>
            <p className="text-sm text-gray-500">
              You will be logged out of your account and redirected to the login
              page.
            </p>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-start space-x-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-orange-800 font-medium">
                  Are you sure you want to sign out?
                </p>
                <p className="text-orange-700 mt-1">
                  Any unsaved changes will be lost. Make sure to save your work
                  before proceeding.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-2"
              color="default"
              variant="flat"
              onPress={handleModalClose}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={isLoggingOut}
              onPress={confirmLogout}
            >
              Sign Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default memo(ProfileSidebar);
