"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import type { InterviewAnswer } from "@/types/interview-answer";
import ReactMarkdown from "react-markdown";

type QuestionBreakdownProps = {
  answers: InterviewAnswer[];
};

export function QuestionBreakdown({ answers }: QuestionBreakdownProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Question-by-Question Breakdown
      </h3>

      <Accordion variant="splitted" className="px-0">
        {answers.map((answer, index) => {
          const percentageScore = answer.percentageScore ?? 0;

          return (
            <AccordionItem
              key={answer.id}
              aria-label={`Question ${index + 1}`}
              title={
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Q{index + 1}
                    </span>
                    <span className="text-sm text-gray-600 truncate">
                      {answer.questionText || "Question"}
                    </span>
                  </div>
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
                </div>
              }
              className="shadow-sm"
            >
              <div className="space-y-4 p-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Question
                  </h4>
                  <p className="text-sm text-gray-700">
                    {answer.questionText}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Your Answer
                  </h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {answer.userAnswer || "No answer provided"}
                  </p>
                </div>

                {answer.scores && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Performance Scores
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">
                          STAR Completeness
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {answer.scores.starCompleteness}/5
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">
                          Action Specificity
                        </div>
                        <div className="text-lg font-bold text-purple-600">
                          {answer.scores.actionSpecificity}/5
                        </div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">
                          Result Quantification
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {answer.scores.resultQuantification}/5
                        </div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">
                          Role Relevance
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {answer.scores.relevanceToRole}/5
                        </div>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">
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
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
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
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Strengths
                          </h4>
                          <ul className="space-y-2">
                            {answer.evaluation.strengths.map(
                              (strength, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-green-500 mt-0.5 text-base">
                                    ✓
                                  </span>
                                  <span>{strength}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {answer.evaluation.areasForImprovement &&
                      answer.evaluation.areasForImprovement.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-2">
                            {answer.evaluation.areasForImprovement.map(
                              (improvement, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-700 flex items-start gap-2"
                                >
                                  <span className="text-yellow-500 mt-0.5 text-base">
                                    →
                                  </span>
                                  <span>{improvement}</span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}
                  </>
                )}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
