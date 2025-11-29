"use client";

import React from "react";

export default function YourPathStep() {
  return (
    <section className="text-center px-2 sm:px-4 md:px-6">
      {/* Main Heading - Responsive Typography */}
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
        You&apos;re all set!
      </h2>

      {/* Subtitle - Responsive Typography */}
      <p className="text-xs sm:text-sm md:text-base italic text-gray-600 mb-4 sm:mb-6 md:mb-8 max-w-md mx-auto leading-relaxed">
        Welcome to AdultNa. Let&apos;s start your journey.
      </p>

      {/* What's Next Section - Responsive Container */}
      <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200 p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg sm:rounded-xl md:rounded-2xl max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
        {/* Section Title - Responsive Typography */}
        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-teal-800 mb-3 sm:mb-4 md:mb-6">
          What happens next?
        </h3>

        {/* Steps Container - Responsive Spacing */}
        <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          {/* Step 1 - Responsive Layout */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold flex-shrink-0 shadow-sm">
              1
            </div>
            <p className="text-left text-xs sm:text-sm md:text-base lg:text-lg text-teal-700 leading-relaxed font-medium">
              Your personalized roadmap will be created.
            </p>
          </div>

          {/* Step 2 - Responsive Layout */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold flex-shrink-0 shadow-sm">
              2
            </div>
            <p className="text-left text-xs sm:text-sm md:text-base lg:text-lg text-teal-700 leading-relaxed font-medium">
              Access your dashboard and update your profile.
            </p>
          </div>

          {/* Step 3 - Responsive Layout */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold flex-shrink-0 shadow-sm">
              3
            </div>
            <p className="text-left text-xs sm:text-sm md:text-base lg:text-lg text-teal-700 leading-relaxed font-medium">
              Explore features and build your adult life skills!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
