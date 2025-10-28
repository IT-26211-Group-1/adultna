"use client";

import { Card, CardBody, Progress } from "@heroui/react";

interface ResumeScoreGaugeProps {
  score: number;
  verdict: string;
  className?: string;
}

export function ResumeScoreGauge({
  score,
  verdict,
  className = "",
}: ResumeScoreGaugeProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const color = getScoreColor(score);

  return (
    <Card className={className}>
      <CardBody className="p-4">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">Your Resume Score</h2>
          
          {/* Circular Progress Gauge */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Semi-circle background */}
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
                  stroke={
                    color === "success"
                      ? "#10b981"
                      : color === "warning"
                      ? "#f59e0b"
                      : "#ef4444"
                  }
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 251.2} 251.2`}
                  className="transition-all duration-1000"
                />
              </svg>
              
              {/* Score text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                <span className="text-4xl font-bold">{score}%</span>
                <span className="text-base text-gray-600 mt-1">{verdict}</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
