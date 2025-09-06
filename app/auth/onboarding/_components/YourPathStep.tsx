import React from "react";

interface YourPathStepProps {
  onComplete: () => void;
}

export default function YourPathStep({ onComplete }: YourPathStepProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You&apos;re all set!
      </h2>
      <p className="text-gray-600 mb-8">
        Welcome to AdultNa. Let&apos;s start your journey to organized
        adulthood.
      </p>

      <div className="space-y-6">
        <div className="bg-teal-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-800 mb-2">
            What&apos;s Next?
          </h3>
          <ul className="text-teal-700 space-y-2 text-left">
            <li>• Explore your personalized dashboard</li>
            <li>• Set up your first adult milestone</li>
            <li>• Connect with the community</li>
            <li>• Access resources tailored to your needs</li>
          </ul>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            onClick={onComplete}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
