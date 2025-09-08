"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { PrioritiesStepProps, Question } from "@/types/onboarding";

function PrioritiesStep({
  selectedPriorities,
  setSelectedPriorities,
  onNext,
  onSkip,
}: PrioritiesStepProps) {
  const [prioritiesQuestion, setPrioritiesQuestion] = useState<Question | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrioritiesQuestion() {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);

      try {
        const res = await fetch("/api/auth/onboarding/view", {
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const data = await res.json();

        if (data.success && data.data?.success) {
          const questionsArray = Array.isArray(data.data.data)
            ? data.data.data
            : [];
          const question = questionsArray.find(
            (q: Question) => q.category === "Priorities"
          );

          if (question) {
            setPrioritiesQuestion(question);
          } else {
            console.error("No priorities question found.");
          }
        } else {
          console.error(data.message || "Failed to fetch priorities.");
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.error("Request timed out. Please try again.");
        } else {
          console.error("Error fetching priorities.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPrioritiesQuestion();
  }, []);

  const togglePriority = useCallback(
    (questionId: number, optionId: number) => {
      setSelectedPriorities((prev) => {
        const exists = prev.some(
          (p) => p.questionId === questionId && p.optionId === optionId
        );
        if (exists) {
          return prev.filter(
            (p) => !(p.questionId === questionId && p.optionId === optionId)
          );
        }
        return [...prev, { questionId, optionId }];
      });
    },
    [setSelectedPriorities]
  );

  if (loading) {
    return <p className="text-center text-gray-600">Loading questions...</p>;
  }

  if (!prioritiesQuestion) {
    return (
      <p className="text-center text-gray-600">No priorities question found.</p>
    );
  }

  const options = prioritiesQuestion?.options || [];

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {prioritiesQuestion.question}
      </h2>
      <p className="text-gray-600 mb-8">
        Select all that apply (you can change these later)
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPriorities.some(
                  (p) =>
                    p.questionId === prioritiesQuestion.id &&
                    p.optionId === option.id
                )
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                checked={selectedPriorities.some(
                  (p) =>
                    p.questionId === prioritiesQuestion.id &&
                    p.optionId === option.id
                )}
                className="mr-3 text-teal-600"
                type="checkbox"
                onChange={() =>
                  togglePriority(prioritiesQuestion.id, option.id)
                }
              />
              <span className="text-gray-900 text-sm">{option.optionText}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="text-gray-500 hover:text-gray-700 px-6 py-2 font-medium transition-colors"
            onClick={onSkip}
          >
            Skip
          </button>
          <button
            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            onClick={onNext}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PrioritiesStep);
