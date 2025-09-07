import React from "react";
import { ChevronRight } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { IntroductionStepProps } from "@/types/onboarding";

export default function IntroductionStep({ onNext }: IntroductionStepProps) {
  const [displayName, setDisplayName] = useLocalStorage<string>(
    "displayName",
    "",
  );

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
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="displayName"
          >
            Display Name
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors"
            placeholder="Enter your display name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            onClick={handleSubmit}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
