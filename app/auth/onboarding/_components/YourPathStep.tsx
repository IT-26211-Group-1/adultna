"use client";

import { OnboardingData, YourPathStepProps } from "@/types/onboarding";
import React from "react";
import { LoadingButton } from "@/components/ui/Button";

export default function YourPathStep({
  displayName,
  lifeStage,
  priorities,
  onComplete,
  isSubmitting = false,
}: YourPathStepProps) {
  const handleSubmit = async () => {
    const payload: OnboardingData = {
      displayName: displayName || undefined,
      ...(lifeStage
        ? { questionId: lifeStage.questionId, optionId: lifeStage.optionId }
        : {}),
      priorities,
    };

    await onComplete(payload);
  };

  return (
    <section className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set!
      </h2>
      <p className="text-gray-600 mb-8">
        Welcome to AdultNa. Let&apos;s start your journey to organized
        adulthood.
      </p>

      <div className="space-y-6">
        <div className="bg-teal-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-800 mb-2">
            What&apos;s Next?
          </h3>
          <ul className="text-teal-700 space-y-2 text-left list-disc list-inside">
            <li>Explore your personalized dashboard</li>
            <li>Set up your first adult milestone</li>
            <li>Connect with the community</li>
            <li>Access resources tailored to your needs</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <LoadingButton
            className="px-8 py-3"
            loading={isSubmitting}
            type="button"
            onClick={handleSubmit}
          >
            Get Started
          </LoadingButton>
        </div>
      </div>
    </section>
  );
}
