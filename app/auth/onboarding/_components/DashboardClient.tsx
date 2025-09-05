"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { OnboardingData } from "@/types/onboarding";

const OnboardingModal = dynamic(() => import("./OnboardingModal"));

export default function DashboardClient() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("onboarding_completed")
  );

  const handleOnboardingComplete = useCallback(async (data: OnboardingData) => {
    try {
      localStorage.setItem("onboarding_completed", "true");
      setShowOnboarding(false);
      // await saveOnboardingData(data); // sync with backend if needed
    } catch (error) {
      console.error("Failed to save onboarding:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold"></h1>
      </div>

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
