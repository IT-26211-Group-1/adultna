"use client";

import { Card, CardBody } from "@heroui/react";
import { Lightbulb, CheckCircle2 } from "lucide-react";
import { useGetRecommendations } from "@/hooks/queries/useCoverLetterQueries";

type AIRecommendationsProps = {
  coverLetterId: string;
};

export default function AIRecommendations({
  coverLetterId,
}: AIRecommendationsProps) {
  const { data: recommendations, isLoading } =
    useGetRecommendations(coverLetterId);

  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="text-yellow-500" size={20} />
          <h2 className="text-lg font-semibold">AI Recommendations</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Based on your resume analysis
        </p>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations?.map((rec, index) => (
              <div key={index} className="border-l-2 border-green-500 pl-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    className="text-green-500 mt-0.5 flex-shrink-0"
                    size={16}
                  />
                  <div>
                    <p className="font-medium text-sm">{rec.title}</p>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
