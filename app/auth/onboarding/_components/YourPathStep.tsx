"use client";

import { YourPathStepProps } from "@/types/onboarding";
import React, { useState } from "react";

export default function YourPathStep({
  userId,
  lifeStage,
  priorities,
  onComplete,
}: YourPathStepProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          "onboarding-lifeStage": lifeStage,
          "onboarding-priorities": JSON.stringify(priorities),
        }),
      });

      const data = await res.json();

      if (data.success) {
        onComplete();
      } else {
        console.error("Onboarding submission failed:", data.message);
      }
    } catch (err) {
      console.error("Error submitting onboarding:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          <button
            type="button"
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Get Started"}
          </button>
        </div>
      </div>
    </section>
  );
}
