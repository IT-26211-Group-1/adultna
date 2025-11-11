"use client";

import { Card, CardBody } from "@heroui/react";
import { Lightbulb } from "lucide-react";

interface GraderAIRecommendationsProps {
  recommendations: string[];
  className?: string;
}

export function GraderAIRecommendations({
  recommendations,
}: GraderAIRecommendationsProps) {
  return (
    <Card className="bg-purple-50 border-purple-200 flex-shrink-0">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-purple-100 rounded-full">
            <Lightbulb className="w-5 h-5 text-purple-600" />
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-base text-purple-900">
                AI Recommendations
              </h3>
              <p className="text-xs text-purple-700 mt-1">
                Smart suggestions to improve your resume effectiveness
              </p>
            </div>

            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border bg-white border-purple-200 flex items-start gap-2"
                >
                  <span className="text-purple-600 font-bold mt-0.5">•</span>
                  <p className="text-sm leading-relaxed text-gray-700 flex-1">
                    {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
