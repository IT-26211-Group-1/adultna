"use client";

import React from "react";

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
  return (
    <div className="flex flex-col">
      <section className="w-full pyt-16 md:pt-20">
        <FeatureText />
      </section>

      <section className="w-full" id="roadmap-section">
        <Roadmap />
      </section>

      {/* Other Features Section */}
      <section className="flex flex-col items-center justify-center pt-5">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-center text-gray-900 mt-10 mb-5 font-playfair">
            Everything You Need,{" "}
            <span className="italic text-adult-green">In One Place</span>
          </h2>

          <FeatureNav />

          <div className="flex flex-col gap-5">
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
