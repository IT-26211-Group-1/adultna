import React, { Suspense, lazy } from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import { TableSkeleton } from "@/components/ui/Skeletons";
import AddOnboardingQuestionModal from "./_components/AddOnboardingQuestionModal";

const OnboardingQuestionsTable = lazy(
  () => import("./_components/OnboardingQuestionsTable")
);

export default function OnboardingQuestionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add Question"
          modalComponent={<AddOnboardingQuestionModal />}
          variant="green"
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <OnboardingQuestionsTable />
      </Suspense>
    </div>
  );
}
