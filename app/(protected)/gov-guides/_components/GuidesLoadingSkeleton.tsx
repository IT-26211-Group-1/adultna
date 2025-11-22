"use client";

import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function GuidesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(9)].map((_, index) => (
        <Card key={index} className="border border-gray-200 shadow-none">
          <CardBody className="p-4 min-h-[200px]">
            <div className="flex flex-col h-full">
              {/* Title */}
              <Skeleton className="h-4 w-3/4 rounded-lg mb-3" />

              {/* Divider */}
              <div className="border-t border-gray-100 mb-3" />

              {/* Summary */}
              <div className="flex-1 space-y-2 mb-4">
                <Skeleton className="h-3 w-full rounded-lg" />
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </div>

              {/* Requirements */}
              <Skeleton className="h-3 w-1/3 rounded-lg mb-3" />

              {/* Bottom Row */}
              <div className="flex items-end justify-between">
                {/* Category Tag */}
                <Skeleton className="h-6 w-24 rounded-full" />

                {/* View Details */}
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
