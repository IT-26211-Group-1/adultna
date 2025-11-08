import { GovGuide } from "./GovGuide";
import { Interview } from "./Interview";
import { Filebox } from "./Filebox";
import { Job } from "./Job";
import { AIGabay } from "./AIGabay";
import { Resume } from "./Resume";

export function FeaturesGrid() {
  return (
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
  );
}
