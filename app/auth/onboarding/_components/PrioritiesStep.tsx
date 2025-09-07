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

type PrioritiesStepProps = {
  selectedPriorities: string[];
  setSelectedPriorities: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onSkip: () => void;
};

export default function PrioritiesStep({
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
      try {
        const res = await fetch("/api/auth/onboarding/view");
        const data = await res.json();

        if (data.success) {
          const question = data.data.find(
            (q: Question) => q.category === "Priorities"
          );
          if (question) setPrioritiesQuestion(question);
        } else {
          console.error("Failed to fetch priorities:", data.message);
        }
      } catch (err) {
        console.error("Error fetching priorities:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrioritiesQuestion();
  }, []);

  const togglePriority = (optionText: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(optionText)
        ? prev.filter((p) => p !== optionText)
        : [...prev, optionText]
    );
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading questions...</p>;
  }

  if (!prioritiesQuestion) {
    return (
      <p className="text-center text-gray-600">No priorities question found.</p>
    );
  }

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
          {prioritiesQuestion.options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPriorities.includes(option.optionText)
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                checked={selectedPriorities.includes(option.optionText)}
                className="mr-3 text-teal-600"
                type="checkbox"
                onChange={() => togglePriority(option.optionText)}
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
