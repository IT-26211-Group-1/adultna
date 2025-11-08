"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function GovGuide() {
  return (
    <section
      className="w-full py-8 sm:py-12 md:py-16 relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-22 max-w-7xl mx-auto bg-transparent"
      id="govguide-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 items-center">
        {/* Left Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Your <span className="text-adult-green">Simple Way</span> to
            Government Services
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-inter">
            AdultNa helps you get things done—without the stress. Our platform
            simplifies government-related processes by guiding you through each
            step.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Step-by-step application guidance
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Document preparation assistance
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Notifications and guidance every step of the way
              </span>
            </div>
          </div>
          <Link
            className="mt-4 sm:mt-6 bg-adult-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            href="/gov-guides"
          >
            Explore GovGuides <span>→</span>
          </Link>
        </div>

        {/* Right Content */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] order-1 lg:order-2">
          <FeatureImage
            alt="Government services guidance features"
            src="/GovGuides-Feature.png"
          />
        </div>
      </div>
    </section>
  );
}
