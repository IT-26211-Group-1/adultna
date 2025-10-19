import React, { Suspense, lazy } from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import { TableSkeleton } from "@/components/ui/Skeletons";
import AddUserModal from "./_components/AddUserModal";

const UsersTable = lazy(() => import("./_components/UsersTable"));

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add User"
          modalComponent={<AddUserModal />}
          variant="green"
        />
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}
