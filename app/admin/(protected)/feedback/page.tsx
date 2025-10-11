import React, { Suspense, lazy } from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import { TableSkeleton } from "@/components/ui/Skeletons";
import AddFeedbackModal from "./_components/AddFeedbackModal";

const FeedbackTable = lazy(() => import("./_components/FeedbackTable"));

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add Feedback"
          modalComponent={<AddFeedbackModal />}
          variant="green"
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <FeedbackTable />
      </Suspense>
    </div>
  );
}
