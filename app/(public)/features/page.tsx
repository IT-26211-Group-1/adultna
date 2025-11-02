"use client";

import React, { useEffect } from "react";

import { FeatureText } from "./_components/FeatureText";
import { FeatureNav } from "./_components/FeatureNav";
import { Roadmap } from "./_components/Roadmap";
import { GovGuide } from "./_components/GovGuide";
import { Interview } from "./_components/Interview";
import { Job } from "./_components/Job";
import { Filebox } from "./_components/Filebox";
import { AIGabay } from "./_components/AIGabay";
import { Resume } from "./_components/Resume";
import { ScrollUp } from "./_components/ScrollUp";

export default function Page() {
  useEffect(() => {
    // Handle hash navigation when component mounts
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        // Use setTimeout to ensure the page has fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full pt-8 sm:pt-12 md:pt-16 lg:pt-20">
        <FeatureText />
      </section>

      <section className="w-full" id="roadmap-section">
        <Roadmap />
      </section>

      {/* Other Features Section */}
      <section className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mt-6 sm:mt-8 md:mt-10 mb-4 sm:mb-5 md:mb-6 font-playfair px-2 sm:px-0">
            Everything You Need,{" "}
            <span className="italic text-adult-green">In One Place</span>
          </h2>

          <FeatureNav />

          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            <div id="govguide-section">
              <GovGuide />
            </div>

            <div id="interview-section">
              <Interview />
            </div>

            <div id="filebox-section">
              <Filebox />
            </div>

            <div id="job-section">
              <Job />
            </div>

            <div id="aigabay-section">
              <AIGabay />
            </div>

            <div id="resume-section">
              <Resume />
            </div>
          </div>
        </div>
      </section>

      <ScrollUp />
    </div>
  );
}
