"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

type QuestionOption = {
  id: number;
  optionText: string;
  outcomeId?: number;
};

type Question = {
  id: number;
  question: string;
  category: string;
  options: QuestionOption[];
};

type LifeStageStepProps = {
  selectedLifeStage: string;
  setSelectedLifeStage: (stage: string) => void;
  onNext: () => void;
  onSkip: () => void;
};

export default function LifeStageStep({
  selectedLifeStage,
  setSelectedLifeStage,
  onNext,
  onSkip,
}: LifeStageStepProps) {
  const [lifeStageQuestion, setLifeStageQuestion] = useState<Question | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLifeStageQuestion() {
      try {
        const res = await fetch("/api/auth/onboarding/view");
        const data = await res.json();

        if (data.success && data.data?.success) {
          const questionsArray = Array.isArray(data.data.data)
            ? data.data.data
            : [];
          const question = questionsArray.find(
            (q: Question) => q.category === "Life Stage"
          );

          if (question) setLifeStageQuestion(question);
        } else {
          console.error("Failed to fetch questions:", data.message);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLifeStageQuestion();
  }, []);

  {
    /* TODO: Change the Loading animation into a skeletion animation */
  }

  if (loading) {
    return <p className="text-center text-gray-600">Loading questions...</p>;
  }

  if (!lifeStageQuestion) {
    return (
      <p className="text-center text-gray-600">No life stage question found.</p>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {lifeStageQuestion.question}
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us personalize your experience
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {lifeStageQuestion.options.map((option) => (
            <label
              key={option.id}
              className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                checked={selectedLifeStage === option.optionText}
                className="mr-3 text-teal-600"
                name="lifeStage"
                type="radio"
                value={option.optionText}
                onChange={(e) => setSelectedLifeStage(e.target.value)}
              />
              <span className="text-gray-900">{option.optionText}</span>
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
