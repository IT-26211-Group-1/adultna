"use client";

import { Button } from "@heroui/react";

interface ResumeVerdictProps {
  verdict: string;
  workingWell: string[];
  className?: string;
}

export function ResumeVerdict({
  verdict,
  workingWell,
  className = "",
}: ResumeVerdictProps) {
  return (
    <div className={`space-y-4 flex flex-col h-full ${className}`}>
      {/* Verdict Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Verdict:</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{verdict}</p>
      </div>

      {/* What's Working Well Section */}
      <div className="space-y-3 flex-1">
        <h3 className="text-lg font-semibold">What&apos;s Working Well</h3>
        <ul className="space-y-2">
          {workingWell.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-700"
            >
              <span className="text-green-600 mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Build Resume Button */}
      <Button
        className="w-full bg-[#11553F] hover:bg-[#0e4634] text-white font-semibold mt-6"
        size="lg"
      >
        Build Your Resume
      </Button>
    </div>
  );
}
