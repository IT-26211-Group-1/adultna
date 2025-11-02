"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Interview() {

  return (
    <section className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <div className="relative h-96 md:h-[500px] lg:h-[600px] lg:order-1">
          <FeatureImage
            src="/MockInterview-Feature.png"
            alt="Mock interview and practice features"
          />
        </div>

        {/* Right Content */}
        <div className="space-y-6 lg:order-2">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Ace your interviews, <span className="text-adult-green">every time</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            Get your interview skills running smoothly with our AI-powered coaching platform.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Practice with realistic interview scenarios</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Get instant feedback and improvement tips</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Build confidence through repeated practice</span>
            </div>
          </div>
          <Link href="/mock-interview" className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2">
            Explore interview coach <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
