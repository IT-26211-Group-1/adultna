import React from "react";

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this area. Please contact
          your administrator if you believe this is an error.
        </p>
        <button
          className="w-full px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90 transition-colors"
          onClick={() => (window.location.href = "/admin/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
