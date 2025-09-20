"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { OnboardingData } from "@/types/onboarding";

import { addToast } from "@heroui/toast";

const OnboardingModal = dynamic(() => import("./OnboardingModal"));

export default function DashboardClient() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");

    setShowOnboarding(!completed);
  }, []);

  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    try {
      setShowOnboarding(false);
      addToast({
        title: "Onboarding completed",
        color: "success",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to save onboarding:", error);
      addToast({
        title: "Onboarding failed",
        description:
          (error as Error)?.message || "Please try again or login again.",
        color: "danger",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}
