"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Job() {

  return (
    <section id="job-section" className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="relative h-96 md:h-[500px] lg:h-[600px] lg:order-1">
          <FeatureImage
            src="/JobBoard-Feature.png"
            alt="Job board and career search features"
          />
        </div>

        {/* Right Content */}
        <div className="space-y-6 lg:order-2">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Your Career Journey Starts <span className="text-adult-green">Here</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            Looking for your first job or internship? Our job board brings together beginner-friendly opportunities so you can easily explore through official company sites.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Entry-level and internship listings</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Direct links to official application sites</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Organized, easy-to-browse interface</span>
            </div>
          </div>
          <Link href="/job-board" className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2">
            Explore Job Board <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
