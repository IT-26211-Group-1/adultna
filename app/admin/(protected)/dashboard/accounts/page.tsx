import React from "react";
import AddUserButton from "./_components/AddUserButton";
import UsersTable from "./_components/UsersTable";

export default function Page() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Account Management
          </h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <AddUserButton />
      </div>

      <UsersTable />
    </div>
  );
}
