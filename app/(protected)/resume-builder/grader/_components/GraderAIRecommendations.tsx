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
    <Card className="bg-transparent flex-shrink-0 shadow-none border-none">
      <CardBody className="p-0">
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
      </CardBody>
    </Card>
  );
}
