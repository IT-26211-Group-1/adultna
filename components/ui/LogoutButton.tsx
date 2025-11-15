"use client";

import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";

interface LogoutButtonProps {
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  confirmLogout?: boolean;
}

export function LogoutButton({
  variant = "light",
  color = "danger",
  size = "md",
  className,
  showIcon = true,
  children,
  confirmLogout = false,
}: LogoutButtonProps) {
  const { logout, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    if (confirmLogout) {
      const confirmed = window.confirm("Are you sure you want to sign out?");

      if (!confirmed) return;
    }

    try {
      logout();
    } catch (error) {
      logger.error("Logout error:", error);
      addToast({
        title: "Sign out failed",
        description: "Please try again",
        color: "danger",
      });
    }
  };

  return (
    <Button
      className={className}
      color={color}
      disabled={isLoggingOut}
      isLoading={isLoggingOut}
      size={size}
      startContent={
        showIcon && !isLoggingOut ? (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        ) : undefined
      }
      variant={variant}
      onPress={handleLogout}
    >
      {isLoggingOut ? "Signing out..." : children || "Sign Out"}
    </Button>
  );
}
