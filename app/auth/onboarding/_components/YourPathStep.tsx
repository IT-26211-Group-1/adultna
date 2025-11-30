"use client";

import React from "react";

export default function YourPathStep() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set!
      </h2>
      <p className="text-sm italic text-gray-600 mb-8">
        Welcome to AdultNa. Let&apos;s start your journey.
      </p>

      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 p-6 rounded-xl max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-teal-800 mb-4">
          What happens next?
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              1
            </div>
            <p className="text-left text-sm text-teal-700 font-medium">
              Your personalized roadmap will be created.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              2
            </div>
            <p className="text-left text-sm text-teal-700 font-medium">
              Access your dashboard and update your profile.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              3
            </div>
            <p className="text-left text-sm text-teal-700 font-medium">
              Explore features and build your adult life skills!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
