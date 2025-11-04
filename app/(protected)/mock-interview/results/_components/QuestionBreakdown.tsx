"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { InterviewAnswer } from "@/types/interview-answer";
import ReactMarkdown from "react-markdown";

type QuestionBreakdownProps = {
  answers: InterviewAnswer[];
};

export function QuestionBreakdown({ answers }: QuestionBreakdownProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Question-by-Question Breakdown
      </h3>
      <div className="space-y-3">
        {answers.map((answer, index) => {
          const isExpanded = expandedIndex === index;
          const percentageScore = answer.percentageScore ?? 0;

          return (
            <Card
              key={answer.id}
              className={`transition-all ${
                isExpanded ? "shadow-md" : "shadow-sm hover:shadow-md"
              }`}
            >
              <CardBody className="p-0">
                <button
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm font-semibold text-gray-700">
                      Q{index + 1}
                    </span>
                    <span className="text-sm text-gray-600 line-clamp-1">
                      {answer.questionText || "Question"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-sm font-semibold ${
                        percentageScore >= 80
                          ? "text-green-600"
                          : percentageScore >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {percentageScore}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Question
                      </h4>
                      <p className="text-sm text-gray-700">{answer.questionText}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Your Answer
                      </h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {answer.userAnswer || "No answer provided"}
                      </p>
                    </div>

                    {answer.scores && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Performance Scores
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="text-xs text-gray-600">
                              STAR Completeness
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              {answer.scores.starCompleteness}/5
                            </div>
                          </div>
                          <div className="bg-purple-50 p-2 rounded">
                            <div className="text-xs text-gray-600">
                              Action Specificity
                            </div>
                            <div className="text-lg font-bold text-purple-600">
                              {answer.scores.actionSpecificity}/5
                            </div>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <div className="text-xs text-gray-600">
                              Result Quantification
                            </div>
                            <div className="text-lg font-bold text-green-600">
                              {answer.scores.resultQuantification}/5
                            </div>
                          </div>
                          <div className="bg-orange-50 p-2 rounded">
                            <div className="text-xs text-gray-600">
                              Role Relevance
                            </div>
                            <div className="text-lg font-bold text-orange-600">
                              {answer.scores.relevanceToRole}/5
                            </div>
                          </div>
                          <div className="bg-pink-50 p-2 rounded">
                            <div className="text-xs text-gray-600">
                              Delivery Fluency
                            </div>
                            <div className="text-lg font-bold text-pink-600">
                              {answer.scores.deliveryFluency}/5
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {answer.evaluation && (
                      <>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-1">
                            Feedback
                          </h4>
                          <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                            <ReactMarkdown>
                              {answer.evaluation.starFeedback?.overall ||
                                "No feedback available"}
                            </ReactMarkdown>
                          </div>
                        </div>

                        {answer.evaluation.strengths &&
                          answer.evaluation.strengths.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                Strengths
                              </h4>
                              <ul className="space-y-1">
                                {answer.evaluation.strengths.map(
                                  (strength, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-gray-700 flex items-start gap-2"
                                    >
                                      <span className="text-green-500 mt-0.5">
                                        ✓
                                      </span>
                                      <span>{strength}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {answer.evaluation.areasForImprovement &&
                          answer.evaluation.areasForImprovement.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-1">
                                {answer.evaluation.areasForImprovement.map(
                                  (improvement, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-gray-700 flex items-start gap-2"
                                    >
                                      <span className="text-yellow-500 mt-0.5">
                                        →
                                      </span>
                                      <span>{improvement}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
