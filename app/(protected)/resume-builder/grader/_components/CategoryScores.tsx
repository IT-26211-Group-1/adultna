"use client";

import { Card, CardBody, Progress } from "@heroui/react";
import { CheckCircle2, XCircle } from "lucide-react";

interface CategoryScore {
  score: number;
  maxScore: number;
  issues: string[];
  strengths: string[];
}

interface CategoryScoresProps {
  categoryScores: {
    keywordOptimization: CategoryScore;
    formatCompatibility: CategoryScore;
    sectionCompleteness: CategoryScore;
    contentQuality: CategoryScore;
  };
  className?: string;
}

export function CategoryScores({
  categoryScores,
  className = "",
}: CategoryScoresProps) {
  const categories = [
    {
      key: "keywordOptimization",
      label: "Keyword Optimization",
      data: categoryScores.keywordOptimization,
    },
    {
      key: "formatCompatibility",
      label: "Format Compatibility",
      data: categoryScores.formatCompatibility,
    },
    {
      key: "sectionCompleteness",
      label: "Section Completeness",
      data: categoryScores.sectionCompleteness,
    },
    {
      key: "contentQuality",
      label: "Content Quality",
      data: categoryScores.contentQuality,
    },
  ];

  const getColorClass = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    return "danger";
  };

  return (
    <Card className={`${className} flex-shrink-0`}>
      <CardBody className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Category Breakdown</h3>
          <p className="text-xs text-gray-500">
            Detailed scores across all ATS criteria
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category) => {
            const percentage =
              (category.data.score / category.data.maxScore) * 100;
            const isPassing = category.data.score >= 20;

            return (
              <div key={category.key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPassing ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {category.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">
                    {category.data.score}/{category.data.maxScore}
                  </span>
                </div>

                <Progress
                  className="w-full"
                  color={getColorClass(
                    category.data.score,
                    category.data.maxScore
                  )}
                  size="sm"
                  value={percentage}
                />
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
