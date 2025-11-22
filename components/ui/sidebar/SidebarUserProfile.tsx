"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, LogOut, User, ChevronUp, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthData } from "@/hooks/queries/useAuthQueries";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/react";
import { LoadingSpinner } from "../LoadingSpinner";

interface SidebarUserProfileProps {
  isCollapsed: boolean;
}

export default function SidebarUserProfile({
  isCollapsed,
}: SidebarUserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { logout, isLoggingOut } = useAuth();
  const { user } = useAuthData();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = () => {
    router.push("/profile");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    onOpen();
  };

  const handleConfirmLogout = () => {
    try {
      logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

  if (isCollapsed) {
    return (
      <div ref={dropdownRef} className="relative p-2">
        <button
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          onClick={toggleDropdown}
        >
          <div className="w-8 h-8 rounded-full bg-adult-green flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </button>

        {/* Collapsed Dropdown */}
        {isDropdownOpen && (
          <div className="absolute left-16 bottom-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[180px]">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              onClick={handleProfileClick}
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Profile Settings
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600"
              onClick={handleLogoutClick}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* User Profile Section */}
      <div className="px-4 py-3 border-t border-white/10">
        <button
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
          onClick={toggleDropdown}
        >
          <div className="w-8 h-8 rounded-full bg-adult-green flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-gray-700">
              {user ? (
                user.firstName && user.lastName ? (
                  `${user.firstName} ${user.lastName}`
                ) : (
                  user.displayName || "User"
                )
              ) : (
                <LoadingSpinner fullScreen={false} size="sm" />
              )}
            </div>
            <p className="text-xs text-gray-500">{user?.email || ""}</p>
          </div>
          <ChevronUp
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Expanded Dropdown */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
              onClick={handleProfileClick}
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Profile Settings
            </button>
            <button
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-red-600"
              onClick={handleLogoutClick}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        size="sm"
        onClose={onClose}
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
              isDisabled={isLoggingOut}
              variant="flat"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={isLoggingOut}
              onPress={handleConfirmLogout}
            >
              Sign Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
