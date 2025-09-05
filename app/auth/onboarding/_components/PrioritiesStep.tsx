import React from "react";
import { ChevronRight } from "lucide-react";

type PrioritiesStepProps = {
  selectedPriorities: string[];
  setSelectedPriorities: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onSkip: () => void;
};

const priorities = [
  "Career Growth",
  "Financial Planning",
  "Health & Wellness",
  "Relationships",
  "Learning & Education",
  "Travel & Experiences",
  "Family Planning",
  "Personal Projects",
];

export default function PrioritiesStep({
  selectedPriorities,
  setSelectedPriorities,
  onNext,
  onSkip,
}: PrioritiesStepProps) {
  const togglePriority = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What are your current priorities?
      </h2>
      <p className="text-gray-600 mb-8">
        Select all that apply (you can change these later)
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {priorities.map((priority) => (
            <label
              key={priority}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPriorities.includes(priority)
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedPriorities.includes(priority)}
                onChange={() => togglePriority(priority)}
                className="mr-3 text-teal-600"
              />
              <span className="text-gray-900 text-sm">{priority}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={onSkip}
            className="text-gray-500 hover:text-gray-700 px-6 py-2 font-medium transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onNext}
            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
