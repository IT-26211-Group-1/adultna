"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Resume() {

  return (
    <section id="resume-section" className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="relative h-96 md:h-[500px] lg:h-[600px] lg:order-1">
          <FeatureImage
            src="/SmartResume-Feature.png"
            alt="Resume builder and optimization features"
          />
        </div>

        {/* Right Content */}
        <div className="space-y-6 lg:order-2">
          <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight font-playfair">
            Build standout resumes, <span className="text-adult-green">effortlessly</span>
          </h2>
          <p className="text-base text-gray-600 leading-relaxed font-inter">
            Generate professional resumes and tailored cover letters, get instant ATS-based feedback, and fine-tune every detail before sending it out—because your application deserves to stand out.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">ATS-friendly suggestions</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Easy customization for resumes and cover letters</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Smart AI writing assistance</span>
            </div>
          </div>
          <Link href="/resume-builder" className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2">
            Explore Resume Builder <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}