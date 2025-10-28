"use client";

import { ResumeScoreGauge } from "./ResumeScoreGauge";
import { ResumeVerdict } from "./ResumeVerdict";
import { GraderAIRecommendations } from "./GraderAIRecommendations";
import { PersonalDetailsScore } from "./PersonalDetailsScore";

export default function ResumeGrader() {
  // Mock data - replace with real data from backend
  const resumeScore = 85;
  const scoreVerdict = "Good!";
  
  const verdict = "Your resume shows strong potential with room for improvement. Follow our recommendations below to boost your ATS compatibility and overall effectiveness.";
  
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
      type: "danger" as const,
    },
    {
      title: "Optimize Keywords",
      description:
        'Add industry-specific keywords: "Agile", "CI/CD", "Cloud Computing" to improve ATS matching',
      type: "warning" as const,
    },
    {
      title: "Strengthen Professional Summary",
      description:
        "Your summary could better highlight your unique value proposition and career goals",
      type: "warning" as const,
    },
    {
      title: "Add Certifications Section",
      description:
        "Consider adding relevant certifications or training to strengthen your profile",
      type: "info" as const,
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
            <div className="flex flex-col items-center mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Resume Score</h2>
              <div className="relative w-56 h-56">
                <svg className="w-full h-full" viewBox="0 0 200 120">
                  {/* Background arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  {/* Progress arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke={resumeScore >= 80 ? "#10b981" : resumeScore >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={`${(resumeScore / 100) * 251.2} 251.2`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                  <span className="text-5xl font-bold">{resumeScore}%</span>
                  <span className="text-lg text-gray-600 mt-2">{scoreVerdict}</span>
                </div>
              </div>
            </div>

            {/* Verdict Section */}
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Verdict:</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{verdict}</p>
              </div>

              {/* What's Working Well Section */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">What's Working Well</h3>
                <ul className="space-y-2">
                  {workingWell.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Build Resume Button */}
            <button className="w-full bg-[#11553F] hover:bg-[#0e4634] text-white font-semibold py-3 rounded-lg mt-6 transition-colors">
              Build Your Resume
            </button>
          </div>
        </div>

        {/* Right Column - Recommendations and Details */}
        <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto">
          <GraderAIRecommendations recommendations={recommendations} />
          <PersonalDetailsScore 
            score={7}
            totalFields={7}
            needsImprovement={0}
            fields={personalDetailsFields}
          />
        </div>
      </div>
    </div>
  );
}
