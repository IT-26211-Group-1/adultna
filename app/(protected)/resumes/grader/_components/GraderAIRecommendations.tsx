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
  className = "",
}: GraderAIRecommendationsProps) {
  const getBackgroundColor = (type?: string) => {
    switch (type) {
      case "danger":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-purple-50 border-purple-200";
    }
  };

  const getTextColor = (type?: string) => {
    switch (type) {
      case "danger":
        return "text-red-900";
      case "warning":
        return "text-amber-900";
      case "info":
        return "text-blue-900";
      case "success":
        return "text-green-900";
      default:
        return "text-purple-900";
    }
  };

  const getDescColor = (type?: string) => {
    switch (type) {
      case "danger":
        return "text-red-700";
      case "warning":
        return "text-amber-700";
      case "info":
        return "text-blue-700";
      case "success":
        return "text-green-700";
      default:
        return "text-purple-700";
    }
  };

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
                  className={`p-3 rounded-lg border ${getBackgroundColor(
                    rec.type
                  )}`}
                >
                  <h4
                    className={`font-medium text-sm mb-1 ${getTextColor(
                      rec.type
                    )}`}
                  >
                    {rec.title}
                  </h4>
                  <p className={`text-xs leading-relaxed ${getDescColor(rec.type)}`}>
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
