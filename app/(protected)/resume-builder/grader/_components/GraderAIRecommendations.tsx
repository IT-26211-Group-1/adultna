"use client";

import { Card, CardBody } from "@heroui/react";
import { Lightbulb } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  type?: "danger" | "warning" | "info" | "success";
}

interface GraderAIRecommendationsProps {
  recommendations: Recommendation[];
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
                  className="p-3 rounded-lg border bg-white border-purple-200"
                >
                  <h4 className="font-medium text-sm mb-1 text-black-900">
                    {rec.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-black-700">
                    {rec.description}
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
