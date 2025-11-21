"use client";

import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function GuidesLoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="border border-gray-200">
          <CardBody className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
