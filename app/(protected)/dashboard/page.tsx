'use client';

import { useState, useEffect } from 'react';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { saveOnboardingData } from '@/utils/onboarding';
import { OnboardingData } from '@/types/onboarding';

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding (from your auth context or API)
    const checkOnboardingStatus = async () => {
      // Your logic to determine if onboarding is needed
      // This could be from user context, localStorage, or API call
      const needsOnboarding = !localStorage.getItem('onboarding_completed');
      setShowOnboarding(needsOnboarding);
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      // Save to your AWS backend
      await saveOnboardingData(data);
      localStorage.setItem('onboarding_completed', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Your existing dashboard content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {/* Rest of your dashboard */}
      </div>

      {/* Onboarding Modal Overlay */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}