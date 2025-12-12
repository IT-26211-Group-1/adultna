import React, { Suspense, lazy } from "react";
import { TableSkeleton } from "@/components/ui/Skeletons";

const UsersTable = lazy(() => import("./_components/UsersTable"));

export default function AccountsPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <UsersTable />
    </Suspense>
  );
}
