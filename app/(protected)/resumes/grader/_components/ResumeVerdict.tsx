"use client";

import { Card, CardBody, Button } from "@heroui/react";

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
    <Card className={`${className} flex-shrink-0`}>
      <CardBody className="p-4 space-y-4">
        {/* Verdict Section */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold">Verdict:</h3>
          <p className="text-xs text-gray-700 leading-relaxed">{verdict}</p>
        </div>

        {/* What's Working Well Section */}
        <div className="space-y-2">
          <h3 className="text-base font-semibold">What's Working Well</h3>
          <ul className="space-y-1.5">
            {workingWell.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-gray-700">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Build Resume Button */}
        <Button
          className="w-full bg-[#11553F] hover:bg-[#0e4634] text-white font-semibold"
          size="sm"
        >
          Build Your Resume
        </Button>
      </CardBody>
    </Card>
  );
}
