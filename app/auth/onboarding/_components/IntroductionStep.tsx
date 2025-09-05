import React from "react";
import { ChevronRight } from "lucide-react";

interface IntroductionStepProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  onNext: () => void;
}

export default function IntroductionStep({
  displayName,
  setDisplayName,
  onNext,
}: IntroductionStepProps) {
  const handleSubmit = () => {
    if (displayName.trim()) onNext();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome! First things first..
      </h2>
      <p className="text-gray-600 mb-8">What should we call you?</p>

      <div className="space-y-6">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
            placeholder="Enter your display name"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
