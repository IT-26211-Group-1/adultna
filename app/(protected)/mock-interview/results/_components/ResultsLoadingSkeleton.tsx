import { Card, CardBody } from "@heroui/react";

export function ResultsLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="text-2xl font-bold text-[#11553F]">AdultNa.</div>
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Loading Message */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Processing Your Results
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Analyzing Your Interview Performance
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI is carefully reviewing your responses and generating personalized feedback.
            This may take up to 2 minutes for comprehensive analysis.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardBody className="p-12">
              <div className="space-y-6">
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded animate-pulse" />
                <div className="h-24 bg-gray-200 rounded animate-pulse" />
                <div className="flex gap-4">
                  <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white">
              <CardBody className="p-8">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mx-auto w-32" />
                  <div className="flex flex-col items-center">
                    <div className="w-64 h-32 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardBody>
            </Card>

            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
