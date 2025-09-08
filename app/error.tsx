"use client";
import { ErrorProps } from "@/types/error";
import { useEffect } from "react";

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-8">
          <svg
            aria-hidden="true"
            className="h-10 w-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
            />
          </svg>
        </div>

        {/* Error Content */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            We&apos;re sorry, but something unexpected happened. Please try
            again.
          </p>

          {/* Error Details for Development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-red-800 mb-2">
                Development Error Details:
              </h3>
              <code className="text-sm text-red-700 break-words">
                {error.message}
              </code>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors shadow-sm"
          onClick={reset}
        >
          <svg
            className="-ml-1 mr-3 h-5 w-5"
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
      </div>
    </div>
  );
}
