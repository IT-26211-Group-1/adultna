"use client";

import { Card, CardBody, Skeleton } from "@heroui/react";

export default function ResumeListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="w-full">
          <CardBody className="space-y-3 p-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <Skeleton className="h-32 w-full rounded-lg" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-2/3 rounded-lg" />
            </div>

            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
              <Skeleton className="h-9 w-20 rounded-lg" />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
