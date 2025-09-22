"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-crayolaOrange/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-crayolaOrange"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-adultGreen font-playfair">
              Oops! Something went wrong
            </h2>
            <p className="text-ultraViolet font-inter text-sm">
              We encountered an unexpected error. Don't worry, we're on it!
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white bg-adultGreen hover:bg-adultGreen/90 transition-colors duration-200 font-inter font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try again
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-3 rounded-lg text-adultGreen bg-peachYellow hover:bg-peachYellow/80 transition-colors duration-200 font-inter font-medium"
          >
            Go to Homepage
          </button>
        </div>

        <div className="pt-4 border-t border-periwinkle/30">
          <p className="text-xs text-ultraViolet/60 font-inter">
            Error ID: {(error as any).digest || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
