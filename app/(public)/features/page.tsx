import React from "react";

import { FeatureText } from "./_components/FeatureText";
import { FeatureNav } from "./_components/FeatureNav";
import { Roadmap } from "./_components/Roadmap";
import { GovGuide } from "./_components/GovGuide";
import { Interview } from "./_components/Interview";
import { Job } from "./_components/Job";
import { Filebox } from "./_components/Filebox";
import { ScrollUp } from "./_components/ScrollUp";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <FeatureText />
      <FeatureNav />

      <div className="w-full flex" id="roadmap-section">
        <Roadmap />
      </div>
      <div className="w-full flex" id="govguide-section">
        <GovGuide />
      </div>
      <div className="w-full flex" id="interview-section">
        <Interview />
      </div>
      <div className="w-full flex" id="filebox-section">
        <Filebox />
      </div>
      <div className="w-full flex" id="job-section">
        <Job />
      </div>

      <ScrollUp />
    </section>
  );
}
