"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Resume() {
  return (
    <section
      className="w-full py-8 sm:py-12 md:py-16 relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-22 max-w-7xl mx-auto bg-transparent"
      id="resume-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-16 xl:gap-20 items-center">
        {/* Image Content - Always on top for mobile/tablet */}
        <div className="relative h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[450px] order-1 lg:order-1">
          <FeatureImage
            alt="Resume builder and optimization features"
            src="/SmartResume-Feature.png"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 order-2 lg:order-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Build standout resumes,{" "}
            <span className="text-adult-green">effortlessly</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-inter">
            Generate professional resumes and tailored cover letters, get
            instant ATS-based feedback, and fine-tune every detail before
            sending it out—because your application deserves to stand out.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                ATS-friendly suggestions
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Easy customization for resumes and cover letters
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-adult-green text-base sm:text-lg">✓</span>
              <span className="text-gray-700 font-inter text-xs sm:text-sm">
                Smart AI writing assistance
              </span>
            </div>
          </div>
          <Link
            className="mt-4 sm:mt-6 bg-adult-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            href="/resume-builder"
          >
            Explore Resume Builder <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
