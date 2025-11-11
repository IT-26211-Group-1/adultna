import React, { Suspense, lazy } from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import { TableSkeleton } from "@/components/ui/Skeletons";
import AddGuideModal from "./_components/AddGuideModal";

const GuidesTable = lazy(() => import("./_components/GuidesTable"));

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add Guide"
          modalComponent={<AddGuideModal />}
          variant="green"
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <GuidesTable />
      </Suspense>
    </div>
  );
}
