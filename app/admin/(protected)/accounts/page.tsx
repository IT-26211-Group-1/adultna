import React from "react";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import AddUserModal from "./_components/AddUserModal";
import UsersTable from "./_components/UsersTable";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center mt-5">
        <AdminAddButton
          label="Add User"
          modalComponent={<AddUserModal />}
          variant="green"
        />
      </div>
      <UsersTable />
    </div>
  );
}
