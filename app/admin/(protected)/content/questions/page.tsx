import React, { Suspense, lazy } from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import { TableSkeleton } from "@/components/ui/Skeletons";
import AddQuestionModal from "./_components/AddQuestionModal";

const QuestionsTable = lazy(() => import("./_components/QuestionsTable"));

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add Question"
          modalComponent={<AddQuestionModal />}
          variant="green"
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <QuestionsTable />
      </Suspense>
    </div>
  );
}
