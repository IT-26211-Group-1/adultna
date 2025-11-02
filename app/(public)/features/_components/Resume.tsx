"use client";

import Link from "next/link";
import { FeatureImage } from "./FeatureImage";

export function Resume() {

  return (
    <section className="w-full py-16 relative px-4 md:px-22 max-w-7xl mx-auto bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
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
            Get your job applications running smoothly with our AI-powered resume and cover letter builder.
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Professional resume templates</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">AI-powered content optimization</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter text-sm">Customized cover letters</span>
            </div>
          </div>
          <Link href="/resume-builder" className="mt-6 bg-adult-green text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-adult-green/90 transition-colors inline-flex items-center gap-2">
            Explore resume builder <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}