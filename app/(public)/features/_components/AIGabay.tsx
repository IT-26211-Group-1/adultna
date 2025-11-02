"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function AIGabay() {
  return (
    <section
      className="w-full py-8 sm:py-12 md:py-16 relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-22 max-w-7xl mx-auto bg-transparent"
      id="aigabay-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center">
        {/* Image Content - Always on top for mobile/tablet, right side for desktop */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] order-1 lg:order-2">
          <FeatureImage
            alt="AI-powered life guidance features"
            src="/AIGabay-Feature.png"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 order-2 lg:order-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Get life guidance, <span className="text-adult-green">anytime</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-inter">
            Meet AI Gabay, your friendly digital companion for all things
            adulting. Whether you need help exploring the platform, learning
            about government processes, or getting practical life tips, AI Gabay
            is here for you.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Always-available AI support
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Guidance on government and life topics
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Support for using AdultNa's features
              </span>
            </div>
          </div>
          <Link
            className="mt-4 sm:mt-6 bg-adult-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            href="/ai-gabay"
          >
            Explore AI Gabay <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
