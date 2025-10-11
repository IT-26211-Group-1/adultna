import React, { Suspense, lazy } from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import { TableSkeleton, ModalSkeleton } from "@/components/ui/Skeletons";

const AddFeedbackModal = lazy(() => import("./_components/AddFeedbackModal"));
const FeedbackTable = lazy(() => import("./_components/FeedbackTable"));

export default function FeedbackPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add Feedback"
          modalComponent={
            <Suspense fallback={<ModalSkeleton />}>
              <AddFeedbackModal />
            </Suspense>
          }
          variant="green"
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <FeedbackTable />
      </Suspense>
    </div>
  );
}
