export function ResultsLoadingSkeleton() {
  return (
    <div className="bg-white w-full min-h-screen">
      {/* Breadcrumb Skeleton */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section Skeleton */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full mb-6">
            <div className="w-4 h-4 bg-green-200 rounded-full animate-pulse" />
            <div className="h-4 w-32 bg-green-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-96 mx-auto bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-6 w-full max-w-2xl mx-auto bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Score Section Skeleton */}
        <div className="mb-16">
          <div className="p-8 md:p-12 border-b border-gray-200">
            <div className="text-center">
              <div className="h-8 w-64 mx-auto bg-gray-200 rounded animate-pulse mb-8" />

              {/* Gauge Skeleton */}
              <div className="w-96 h-64 mx-auto mb-8 flex items-center justify-center">
                <div className="w-64 h-64 bg-gray-200 rounded-full animate-pulse relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-gray-400">
                      ---%
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-8 w-32 mx-auto bg-gray-200 rounded animate-pulse mb-8" />

              {/* Buttons Skeleton */}
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-48 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-12 w-56 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown Skeleton */}
        <div className="mb-16">
          <div className="h-8 w-72 mx-auto bg-gray-200 rounded animate-pulse mb-8" />
          <div className="bg-white rounded-lg p-6">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-40 bg-gray-200 rounded animate-pulse mb-3" />
                  <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Feedback Skeleton */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Strengths Skeleton */}
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-200 rounded-full animate-pulse" />
              <div className="h-6 w-48 bg-green-200 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-green-100 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Feedback Skeleton */}
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-200 rounded-full animate-pulse" />
              <div className="h-6 w-48 bg-blue-200 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-blue-100 rounded animate-pulse" style={{ width: `${100 - i * 5}%` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Question Breakdown Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-80 mx-auto bg-gray-200 rounded animate-pulse mb-8" />
          <div className="bg-white rounded-lg p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processing Message */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Processing Your Results
          </div>
          <p className="text-gray-600">
            Our AI is carefully reviewing your responses and generating personalized feedback.
            This may take up to 2 minutes for comprehensive analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
