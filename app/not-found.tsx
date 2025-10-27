"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto h-16 w-16 text-adult-green"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>

        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90 transition-colors font-medium"
          >
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
