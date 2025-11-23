"use client";

import { useEffect } from "react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Oops! Something went wrong
                </h2>
                <p className="text-gray-600 text-sm">
                  We encountered an unexpected error. Don&apos;t worry,
                  we&apos;re on it!
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white bg-adult-green hover:bg-adult-green/90 transition-all duration-200 font-medium shadow-sm"
                onClick={() => reset()}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                Try again
              </button>

              <button
                className="w-full px-6 py-3 rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium"
                onClick={() => (window.location.href = "/")}
              >
                Go to Homepage
              </button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Error ID: {(error as any).digest || "85345234"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
