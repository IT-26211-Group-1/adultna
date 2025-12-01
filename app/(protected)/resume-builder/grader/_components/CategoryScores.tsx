"use client";

import { Card, CardBody, Progress, Chip } from "@heroui/react";
import { CheckCircle2, XCircle, TrendingUp, AlertCircle } from "lucide-react";

interface CategoryScore {
  score: number;
  maxScore: number;
  issues: string[];
  strengths: string[];
  quantifiableMetricsCount?: number;
  metricsExamples?: string[];
  missingKeywords?: string[];
  synonymsFound?: string[];
  keywordOverlapPercent?: number;
}

interface CategoryScoresProps {
  categoryScores: {
    keywordOptimization: CategoryScore;
    formatCompatibility: CategoryScore;
    sectionCompleteness: CategoryScore;
    contentQuality: CategoryScore;
    jobMatchScore?: CategoryScore;
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
    ...(categoryScores.jobMatchScore
      ? [
          {
            key: "jobMatchScore",
            label: "Job Match Score",
            data: categoryScores.jobMatchScore,
          },
        ]
      : []),
  ];

  const getColorClass = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";

    return "danger";
  };

  return (
    <Card
      className={`${className} bg-transparent border-none shadow-none flex-shrink-0`}
    >
      <CardBody className="p-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Category Breakdown</h3>
          <p className="text-xs text-gray-500">
            Detailed scores across all ATS criteria
          </p>
        </div>

        <div className="space-y-4">
          {categories.map((category, index) => {
            const percentage =
              (category.data.score / category.data.maxScore) * 100;
            const isPassing = category.data.score >= 20;

            return (
              <div key={category.key}>
                {index > 0 && <div className="border-t border-gray-200 my-4" />}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      {isPassing ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {category.label}
                      </span>
                      {category.key === "contentQuality" &&
                        category.data.quantifiableMetricsCount !==
                          undefined && (
                          <Chip
                            color={
                              category.data.quantifiableMetricsCount >= 8
                                ? "success"
                                : category.data.quantifiableMetricsCount >= 5
                                  ? "warning"
                                  : "danger"
                            }
                            size="sm"
                            startContent={<TrendingUp className="w-3 h-3" />}
                            variant="flat"
                          >
                            {category.data.quantifiableMetricsCount} metrics
                          </Chip>
                        )}
                      {(category.key === "jobMatchScore" ||
                        category.key === "keywordOptimization") &&
                        category.data.keywordOverlapPercent !== undefined && (
                          <Chip
                            color={
                              category.data.keywordOverlapPercent >= 80
                                ? "success"
                                : category.data.keywordOverlapPercent >= 60
                                  ? "warning"
                                  : "danger"
                            }
                            size="sm"
                            variant="flat"
                          >
                            {category.data.keywordOverlapPercent.toFixed(0)}%
                            match
                          </Chip>
                        )}
                    </div>
                    <span className="text-sm font-semibold">
                      {category.data.score}/{category.data.maxScore}
                    </span>
                  </div>

                  <Progress
                    className="w-full"
                    color={getColorClass(
                      category.data.score,
                      category.data.maxScore,
                    )}
                    size="sm"
                    value={percentage}
                  />

                  {/* Strengths */}
                  {category.data.strengths.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {category.data.strengths
                        .slice(0, 2)
                        .map((strength, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-1.5 text-xs text-green-700"
                          >
                            <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Issues */}
                  {category.data.issues.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {category.data.issues.slice(0, 2).map((issue, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-1.5 text-xs text-amber-700"
                        >
                          <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Metrics Examples (only for Content Quality) */}
                  {category.key === "contentQuality" &&
                    category.data.metricsExamples &&
                    category.data.metricsExamples.length > 0 && (
                      <div className="text-xs text-gray-600 pl-6 pt-1">
                        <span className="font-medium">Examples found: </span>
                        {category.data.metricsExamples
                          .slice(0, 3)
                          .map((example, idx) => (
                            <span key={idx}>
                              &ldquo;{example}&rdquo;
                              {idx <
                              Math.min(
                                2,
                                category.data.metricsExamples!.length - 1,
                              )
                                ? ", "
                                : ""}
                            </span>
                          ))}
                      </div>
                    )}

                  {/* Missing Keywords (for Job Match Score and Keyword Optimization) */}
                  {(category.key === "jobMatchScore" ||
                    category.key === "keywordOptimization") &&
                    category.data.missingKeywords &&
                    category.data.missingKeywords.length > 0 && (
                      <div className="text-xs text-amber-700 pl-6 pt-1 space-y-1">
                        <span className="font-medium">Missing keywords: </span>
                        <div className="flex flex-wrap gap-1">
                          {category.data.missingKeywords
                            .slice(0, 5)
                            .map((keyword, idx) => (
                              <Chip
                                key={idx}
                                color="warning"
                                size="sm"
                                variant="flat"
                              >
                                {keyword}
                              </Chip>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Synonyms Found (for Keyword Optimization) */}
                  {category.key === "keywordOptimization" &&
                    category.data.synonymsFound &&
                    category.data.synonymsFound.length > 0 && (
                      <div className="text-xs text-green-700 pl-6 pt-1">
                        <span className="font-medium">Synonyms found: </span>
                        {category.data.synonymsFound
                          .slice(0, 3)
                          .map((synonym, idx) => (
                            <span key={idx}>
                              {synonym}
                              {idx <
                              Math.min(
                                2,
                                category.data.synonymsFound!.length - 1,
                              )
                                ? ", "
                                : ""}
                            </span>
                          ))}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
