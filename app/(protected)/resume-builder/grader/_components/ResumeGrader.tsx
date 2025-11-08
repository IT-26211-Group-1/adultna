"use client";

import { ResumeScoreGauge } from "./ResumeScoreGauge";
import { ResumeVerdict } from "./ResumeVerdict";
import { GraderAIRecommendations } from "./GraderAIRecommendations";
import { PersonalDetailsScore } from "./PersonalDetailsScore";
// import ng Upload from "./Upload" tapos ternary operator nalang sa magdidisplay ng Upload o ResumeGrader base sa state;

export default function ResumeGrader() {
  // Mock data - replace with real data from backend
  const resumeScore = 85;
  const scoreVerdict = "Good!";

  const verdict =
    "Your resume shows strong potential with room for improvement. Follow our recommendations below to boost your ATS compatibility and overall effectiveness.";

  const workingWell = [
    "Strong Technical Skills Section",
    "ATS-Friendly Format",
    "Clear Contact Information",
    "Relevant Work Experience",
  ];

  const recommendations = [
    {
      title: "Add Quantifiable Achievements",
      description:
        'Include specific metrics and numbers to demonstrate your impact (e.g., "Increased efficiency by 30%")',
    },
    {
      title: "Optimize Keywords",
      description:
        'Add industry-specific keywords: "Agile", "CI/CD", "Cloud Computing" to improve ATS matching',
    },
    {
      title: "Strengthen Professional Summary",
      description:
        "Your summary could better highlight your unique value proposition and career goals",
    },
    {
      title: "Add Certifications Section",
      description:
        "Consider adding relevant certifications or training to strengthen your profile",
    },
  ];

  const personalDetailsFields = [
    { label: "Name", status: "complete" as const },
    { label: "Location", status: "complete" as const },
    { label: "Phone Number", status: "complete" as const },
    { label: "Professional Email Check", status: "complete" as const },
  ];

  return (
    <div className="h-[100dvh] bg-gray-50 p-6 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto h-full">
        {/* Left Column - Score and Verdict in Single Card */}
        <div className="flex flex-col h-full min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
            {/* Score Section */}
            <div className="mb-6">
              <ResumeScoreGauge score={resumeScore} verdict={scoreVerdict} />
            </div>

            {/* Verdict Section */}
            <div className="flex-1">
              <ResumeVerdict verdict={verdict} workingWell={workingWell} />
            </div>
          </div>
        </div>

        {/* Right Column - Recommendations and Details */}
        <div className="flex flex-col gap-6 h-full p-3 min-h-0 overflow-y-auto">
          <GraderAIRecommendations recommendations={recommendations} />
          <PersonalDetailsScore
            fields={personalDetailsFields}
            needsImprovement={0}
            score={7}
            totalFields={7}
          />
        </div>
      </div>
    </div>
  );
}
