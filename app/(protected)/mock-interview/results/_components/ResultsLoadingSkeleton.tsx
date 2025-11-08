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
