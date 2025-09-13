"use client";

import React, { useState, useEffect } from "react";
import Table, { Column } from "@/components/ui/Table";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { User, UsersTableProps, UsersApiResponse } from "@/types/admin";
import { getRoleDisplayLabel, Role } from "@/validators/adminSchema";

const UsersTable: React.FC<UsersTableProps> = ({
  onEditUser,
  onDeleteUser,
  onViewUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/list-users");
        if (response.ok) {
          const data: UsersApiResponse = await response.json();
          if (data.success && data.users) {
            setUsers(data.users);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditAccount = (userId: string) => {
    console.log("Edit account:", userId);
    // TODO: Implement edit account functionality
    onEditUser?.(userId);
  };

  const handleResetPassword = (userId: string, email: string) => {
    if (confirm(`Reset password for ${email}?`)) {
      console.log("Reset password for user:", userId);
      // TODO: Implement password reset functionality
    }
  };

  const handleToggleAccountStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "activate" : "deactivate";

    if (confirm(`Are you sure you want to ${action} this account?`)) {
      console.log(`${action} account:`, userId);
      // TODO: Implement account status toggle functionality

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: newStatus as "active" | "inactive" }
            : user
        )
      );
    }
  };

  const columns: Column<User>[] = [
    {
      header: "User",
      accessor: (user) => (
        <div className="flex items-center space-x-3">
          <Avatar alt={`${user.firstName} ${user.lastName}`} size="md" />
          <div>
            <div className="font-medium text-gray-900">
              {user.displayName || `${user.firstName} ${user.lastName}`}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
      width: "300px",
    },
    {
      header: "Role",
      accessor: (user) => (
        <span className="text-gray-900">
          {getRoleDisplayLabel(user.roleName as Role)}
        </span>
      ),
      width: "120px",
    },
    {
      header: "Status",
      accessor: (user) => (
        <div className="flex items-center space-x-2">
          <Badge
            variant={user.status === "active" ? "success" : "error"}
            size="sm"
          >
            {user.status === "active" ? "Active" : "Inactive"}
          </Badge>
          {user.emailVerified && (
            <Badge variant="info" size="sm">
              Verified
            </Badge>
          )}
        </div>
      ),
      width: "140px",
    },
    {
      header: "Join Date",
      accessor: (user) => (
        <div className="text-gray-900">{formatDate(user.createdAt)}</div>
      ),
      width: "140px",
    },
    {
      header: "Last Login",
      accessor: (user) => (
        <div className="text-gray-900">
          {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
        </div>
      ),
      width: "140px",
    },
    {
      header: "Actions",
      accessor: (user) => (
        <DropdownMenu
          trigger={
            <button className="p-1 hover:bg-gray-100 rounded-full">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          }
          items={[
            {
              label: "Edit Account",
              onClick: () => handleEditAccount(user.id),
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              ),
            },
            {
              label: "Reset Password",
              onClick: () => handleResetPassword(user.id, user.email),
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              ),
            },
            {
              label:
                user.status === "active"
                  ? "Deactivate Account"
                  : "Activate Account",
              onClick: () => handleToggleAccountStatus(user.id, user.status),
              destructive: user.status === "active",
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {user.status === "active" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  )}
                </svg>
              ),
            },
          ]}
        />
      ),
      width: "80px",
      align: "center" as const,
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Accounts</h2>
          <p className="text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        <Table
          data={users}
          columns={columns}
          loading={loading}
          emptyMessage="No users found"
        />
      </div>
    </div>
  );
};

export default UsersTable;
