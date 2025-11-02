"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Job() {

  return (
    <section className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <div className="relative h-96 md:h-[500px] lg:h-[600px] lg:order-1">
          <FeatureImage
            src="/JobBoard-Feature.png"
            alt="Job board and career search features"
          />
        </div>

        {/* Right Content */}
        <div className="space-y-6 lg:order-2">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Find your dream job, <span className="text-adult-green">efficiently</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            Get your job search running smoothly with our intelligent job board platform.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Personalized job recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Application progress tracking</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Company insights and research tools</span>
            </div>
          </div>
          <Link href="/job-board" className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2">
            Explore job board <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
