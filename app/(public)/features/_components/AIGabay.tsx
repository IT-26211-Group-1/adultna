"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function AIGabay() {
  return (
    <section
      className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent"
      id="aigabay-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Get life guidance, <span className="text-adult-green">anytime</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            Meet AI Gabay, your friendly digital companion for all things
            adulting. Whether you need help exploring the platform, learning
            about government processes, or getting practical life tips, AI Gabay
            is here for you.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">
                Always-available AI support
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">
                Guidance on government and life topics
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">
                Support for using AdultNa’s features
              </span>
            </div>
          </div>
          <Link
            className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2"
            href="/ai-gabay"
          >
            Explore AI Gabay <span>→</span>
          </Link>
        </div>

        {/* Right Content */}
        <div className="relative h-80 md:h-96">
          <FeatureImage
            alt="AI-powered life guidance features"
            src="/AIGabay-Feature.png"
          />
        </div>
      </div>
    </section>
  );
}
