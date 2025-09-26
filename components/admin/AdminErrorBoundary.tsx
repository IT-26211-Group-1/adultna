"use client";

import React from "react";

interface AdminErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

const DefaultErrorFallback: React.FC<{
  error?: Error;
  resetError: () => void;
}> = ({ error, resetError }) => (
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
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6">
        An unexpected error occurred in the admin panel. Please try refreshing
        the page.
      </p>
      {process.env.NODE_ENV === "development" && error && (
        <details className="mb-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Error details
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      <div className="space-y-3">
        <button
          className="w-full px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90 transition-colors"
          onClick={resetError}
        >
          Try Again
        </button>
        <button
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => (window.location.href = "/admin/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>
);

export class AdminErrorBoundary extends React.Component<
  AdminErrorBoundaryProps,
  AdminErrorBoundaryState
> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AdminErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Admin Error Boundary caught an error:", error, errorInfo);

    if (process.env.NODE_ENV === "production") {
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const ErrorComponent = this.props.fallback || DefaultErrorFallback;

      return (
        <ErrorComponent error={this.state.error} resetError={this.resetError} />
      );
    }

    return this.props.children;
  }
}
