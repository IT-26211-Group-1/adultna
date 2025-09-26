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
  loading: () => <div className="min-h-screen bg-gray-100 animate-pulse" />,
});

const ONBOARDING_COMPLETED_KEY = "onboarding_completed";
const CACHE_DURATION = 24 * 60; // 24 hours in minutes

export default function DashboardClient() {
  const { user } = useAuth();
  const { getSecureItem, setSecureItem } = useSecureStorage();
  const router = useRouter();
  const onboardingSubmit = useOnboardingSubmit();

  const initialShowOnboarding = useMemo(() => {
    if (user?.onboardingStatus === "completed") {
      return false;
    }

    if (
      user?.onboardingStatus &&
      !["not_started", "in_progress"].includes(user.onboardingStatus)
    ) {
      return false;
    }

    if (!user?.onboardingStatus) {
      const completed = getSecureItem(ONBOARDING_COMPLETED_KEY);

      return !completed;
    }

    // Show onboarding for not_started and in_progress
    return ["not_started", "in_progress"].includes(user.onboardingStatus);
  }, [user?.onboardingStatus, getSecureItem]);

  const showOnboarding = useMemo(() => {
    if (user?.onboardingStatus === "completed") {
      setSecureItem(ONBOARDING_COMPLETED_KEY, "true", CACHE_DURATION);
      return false;
    }

    if (
      user?.onboardingStatus &&
      !["not_started", "in_progress"].includes(user.onboardingStatus)
    ) {
      return false;
    }

    return initialShowOnboarding;
  }, [user?.onboardingStatus, setSecureItem, initialShowOnboarding]);

  const handleOnboardingComplete = useCallback(
    async (data: OnboardingData) => {
      try {
        const result = await onboardingSubmit.mutateAsync(data);

        const isCompleted = result.message?.includes("Personalized Roadmap");

        if (isCompleted) {
          setSecureItem(ONBOARDING_COMPLETED_KEY, "true", CACHE_DURATION);
          addToast({
            title: "Personalizing your Roadmap",
            color: "success",
          });
        } else {
          addToast({
            title: "Progress saved",
            description: "You can continue your onboarding anytime.",
            color: "success",
          });
        }
      } catch (error) {
        console.error("Failed to save onboarding:", error);

        // More specific error handling based on error type
        let errorMessage = "An unexpected error occurred";
        let shouldRedirect = false;

        if (error instanceof Error) {
          if (error.message.includes("already completed")) {
            errorMessage = "Onboarding has already been completed";
            shouldRedirect = true;
          } else if (error.message.includes("Authentication required")) {
            errorMessage = "Please log in to continue";
            shouldRedirect = true;
          } else if (error.message.includes("Invalid onboarding status")) {
            errorMessage = "Your onboarding status is invalid";
            shouldRedirect = true;
          } else {
            errorMessage = error.message;
          }
        }

        addToast({
          title: "Onboarding submission failed",
          description: errorMessage,
          color: "danger",
        });

        // Redirect if needed
        if (shouldRedirect) {
          setTimeout(() => {
            router.replace("/dashboard");
          }, 2000);
        }
      }
    },
    [onboardingSubmit, setSecureItem, router]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          isSubmitting={onboardingSubmit.isPending}
          onClose={() => {}}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}
