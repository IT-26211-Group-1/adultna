import React, { Suspense, lazy } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

const FeedbackTable = lazy(() => import("./_components/FeedbackTable"));

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<TableSkeleton />}>
        <FeedbackTable />
      </Suspense>
    </div>
  );
}
