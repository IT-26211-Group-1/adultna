"use client";

import { YourPathStepProps } from "@/types/onboarding";
import React from "react";

export default function YourPathStep({
  displayName,
  priorities,
}: YourPathStepProps) {
  return (
    <section className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set!
      </h2>
      <p className="text-sm italic text-gray-600 mb-6">
        Welcome to AdultNa. Let&apos;s start your journey.
      </p>

      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 p-4 rounded-xl">
        <div className="flex items-center justify-center gap-4 text-sm">
          {displayName && (
            <span className="text-teal-700">
              <span className="font-medium">Welcome,</span> {displayName}
            </span>
          )}
          {priorities && priorities.length > 0 && (
            <span className="text-teal-600 font-medium">
              {priorities.length} priorities selected
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
