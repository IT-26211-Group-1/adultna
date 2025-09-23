"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { OnboardingData } from "@/types/onboarding";
import { useOnboardingSubmit } from "@/hooks/queries/useOnboardingQueries";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { useAuth } from "@/hooks/useAuth";

import { addToast } from "@heroui/toast";

const OnboardingModal = dynamic(() => import("./OnboardingModal"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gray-100 animate-pulse" />
});

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";
const CACHE_DURATION = 24 * 60; // 24 hours in minutes

export default function DashboardClient() {
  const { user } = useAuth();
  const { getSecureItem, setSecureItem } = useSecureStorage();
  const router = useRouter();
  const onboardingSubmit = useOnboardingSubmit();

  // Memoize the initial onboarding state check
  const initialShowOnboarding = useMemo(() => {
    // First check user's actual onboarding status from the server
    if (user?.onboardingStatus === "completed") {
      return false;
    }

    // Fallback to secure storage cache
    const completed = getSecureItem(ONBOARDING_COMPLETED_KEY);
    return !completed;
  }, [user?.onboardingStatus, getSecureItem]);

  const [showOnboarding, setShowOnboarding] = useState(initialShowOnboarding);

  // Update onboarding visibility when user data changes
  useEffect(() => {
    if (user?.onboardingStatus === "completed") {
      setShowOnboarding(false);
      // Cache the completion status securely
      setSecureItem(ONBOARDING_COMPLETED_KEY, "true", CACHE_DURATION);
    }
  }, [user?.onboardingStatus, setSecureItem]);

  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    try {
      // Submit onboarding data to the API
      const result = await onboardingSubmit.mutateAsync(data);

      setShowOnboarding(false);

      // Show appropriate success message based on completion status
      const isCompleted = result.message?.includes("Personalized Roadmap");

      if (isCompleted) {
        // Cache completion status securely only if truly completed
        setSecureItem(ONBOARDING_COMPLETED_KEY, "true", CACHE_DURATION);
        addToast({
          title: "Onboarding completed successfully!",
          description: "Your personalized roadmap is being prepared.",
          color: "success",
        });
      } else {
        addToast({
          title: "Progress saved!",
          description: "You can continue your onboarding anytime.",
          color: "success",
        });
      }

      // The useOnboardingSubmit hook will handle redirects based on completion status
    } catch (error) {
      console.error("Failed to save onboarding:", error);

      // More specific error handling
      const errorMessage = error instanceof Error
        ? error.message
        : "An unexpected error occurred";

      addToast({
        title: "Onboarding submission failed",
        description: errorMessage.includes("unauthorized")
          ? "Session expired. Please login again."
          : errorMessage,
        color: "danger",
      });

      // If unauthorized, redirect to login
      if (errorMessage.includes("unauthorized")) {
        router.replace("/auth/login");
      }
    }
  }, [onboardingSubmit, setSecureItem, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
          isSubmitting={onboardingSubmit.isPending}
        />
      )}
    </div>
  );
}
