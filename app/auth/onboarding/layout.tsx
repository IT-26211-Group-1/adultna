"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/apiClient";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleRedirect = useCallback(async () => {
    if (!isLoading) {
      // Only refetch once when component mounts, not on every render
      const hasRefetched =
        queryClient.getQueryState(queryKeys.auth.me())?.fetchStatus ===
        "fetching";

      if (isAuthenticated && user && !hasRefetched) {
        // Clear all auth-related cache first
        queryClient.removeQueries({
          queryKey: queryKeys.auth.all,
        });

        // Force a fresh fetch
        await queryClient.refetchQueries({
          queryKey: queryKeys.auth.me(),
          type: "active",
        });
      }

      // Redirect if not authenticated
      if (!isAuthenticated || !user) {
        router.replace("/auth/login");

        return;
      }

      // Redirect if onboarding is completed
      if (user?.onboardingStatus === "completed") {
        router.replace("/dashboard");

        return;
      }

      // Redirect users with invalid onboarding status
      if (
        user?.onboardingStatus &&
        !["not_started", "in_progress"].includes(user.onboardingStatus)
      ) {
        router.replace("/dashboard");

        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, queryClient]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Return null while redirecting
  if (
    !isAuthenticated ||
    !user ||
    user?.onboardingStatus === "completed" ||
    (user?.onboardingStatus &&
      !["not_started", "in_progress"].includes(user.onboardingStatus))
  ) {
    return null;
  }

  return <>{children}</>;
}
