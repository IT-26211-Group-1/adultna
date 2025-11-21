"use client";

import { Card, CardBody } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export default function GuideDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32 rounded-lg" />

      <Skeleton className="h-10 w-3/4 rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="border border-gray-200">
            <CardBody className="p-6">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32 rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}
