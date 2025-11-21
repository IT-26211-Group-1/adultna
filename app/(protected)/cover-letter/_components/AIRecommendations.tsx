"use client";

import { Card, CardBody } from "@heroui/react";
import { Lightbulb } from "lucide-react";

type AIRecommendation = {
  title: string;
  description: string;
};

type AIRecommendationsProps = {
  coverLetterId: string | null;
};

export function AIRecommendations({ coverLetterId }: AIRecommendationsProps) {
  const recommendations: AIRecommendation[] = [
    {
      title: "Highlight Quantifiable Achievements",
      description:
        "Include specific metrics from your resume to demonstrate impact",
    },
    {
      title: "Match Job Requirements",
      description:
        "Align your cover letter with the specific job posting requirements",
    },
    {
      title: "Showcase Relevant Skills",
      description: "Emphasize skills that match the job description",
    },
    {
      title: "Demonstrate Cultural Fit",
      description: "Research company values that align with your experience",
    },
  ];

  if (!coverLetterId) {
    return null;
  }

  return (
    <Card className="bg-white border border-gray-200 flex-shrink-0">
      <CardBody className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 p-1.5 bg-yellow-50 rounded-full">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                AI Recommendations
              </h3>
              <p className="text-xs text-gray-700 mt-0.5">
                Based on your resume analysis
              </p>
            </div>

            <div className="space-y-1.5">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-2 bg-white rounded-lg border border-gray-300"
                >
                  <h4 className="font-medium text-black-900 text-xs mb-0.5">
                    {rec.title}
                  </h4>
                  <p className="text-[10px] text-black-700 leading-tight">
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
