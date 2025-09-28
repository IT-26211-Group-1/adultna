import React from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import AddUserModal from "./_components/AddUserModal";
import UsersTable from "./_components/UsersTable";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AdminAddButton
          label="Add User"
          variant="green"
          modalComponent={<AddUserModal />}
        />
      </div>
      <UsersTable />
    </div>
  );
}
