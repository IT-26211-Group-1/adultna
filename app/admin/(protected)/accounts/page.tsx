import React from "react";
import AddUserButton from "./_components/AddUserButton";
import UsersTable from "./_components/UsersTable";

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div />
        <AddUserButton />
      </div>
      <UsersTable />
    </div>
  );
}
