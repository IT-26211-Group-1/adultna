"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function GovGuide() {
  return (
    <section className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Navigate government services, <span className="text-adult-green">simplified</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            Get your government processes and applications running smoothly with our comprehensive guidance system.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Step-by-step application guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Document preparation assistance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Access to government service directories</span>
            </div>
          </div>
          <Link href="/gov-guides" className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2">
            Explore GovGuides <span>→</span>
          </Link>
        </div>

        {/* Right Image */}
        <div className="relative h-80 md:h-96">
          <FeatureImage
            src="/GovGuides-Feature.png"
            alt="Government services guidance features"
          />
        </div>
      </div>
    </section>
  );
}
