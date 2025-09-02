import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

// Step 4: Your Path Component (Final step)
interface YourPathStepProps {
  onComplete: () => void;
}

const YourPathStep = ({ onComplete }: YourPathStepProps) => {
  const handleSubmit = () => {
    onComplete();
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        You're all set!
      </h2>
      <p className="text-gray-600 mb-8">
        Welcome to AdultNa. Let's start your journey to organized adulthood.
      </p>
      
      <div className="space-y-6">
        <div className="bg-teal-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-teal-800 mb-2">
            What's Next?
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
            onClick={handleSubmit}
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default YourPathStep;