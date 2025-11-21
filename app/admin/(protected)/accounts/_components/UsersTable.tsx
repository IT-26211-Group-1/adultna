"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table from "@/components/ui/Table";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { User, UsersTableProps } from "@/types/admin";
import { addToast } from "@heroui/toast";
import { useAdminUsers } from "@/hooks/queries/admin/useAdminQueries";
import EditUserModal from "./EditUserModal";
import { getUsersTableColumns } from "@/constants/admin-tables";
import { formatDate } from "@/constants/format-date";
import { RetryButton } from "@/components/ui/RetryButton";

// Memoized actions dropdown
const UserActions = React.memo<{
  user: User;
  onEdit: (userId: string) => void;
  onResetPassword: (userId: string, email: string) => void;
  onToggleStatus: (userId: string, status: string) => void;
  isUpdating: boolean;
}>(
  ({
    user,
    onEdit,
    onResetPassword: _onResetPassword,
    onToggleStatus,
    isUpdating,
  }) => (
    <DropdownMenu
      items={[
        {
          label: "Edit Account",
          onClick: () => onEdit(user.id),
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          ),
        },

        {
          label:
            user.status === "active"
              ? "Deactivate Account"
              : "Activate Account",
          onClick: () => onToggleStatus(user.id, user.status),
          destructive: user.status === "active",
          disabled: isUpdating,
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {user.status === "active" ? (
                <path
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          ),
        },
      ]}
      trigger={
        <button
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isUpdating}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      }
    />
  ),
);

UserActions.displayName = "UserActions";

const UsersTable: React.FC<UsersTableProps> = ({ onEditUser }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    isLoadingUsers: loading,
    usersError,
    updateUserStatus,
    isUpdatingStatus,
    refetchUsers,
  } = useAdminUsers();

  const handleEditAccount = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);

      if (user) {
        const mappedUser: User = {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          status: user.status as "active" | "deactivated" | "unverified",
          createdAt:
            typeof user.createdAt === "string"
              ? user.createdAt
              : user.createdAt.toISOString(),
          lastLogin: user.lastLogin
            ? typeof user.lastLogin === "string"
              ? user.lastLogin
              : user.lastLogin.toISOString()
            : null,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          displayName: user.displayName,
          roleName: user.roleName || "",
        };

        setSelectedUser(mappedUser);
        setEditModalOpen(true);
      }
      onEditUser?.(userId);
    },
    [users, onEditUser],
  );

  const handleUserUpdated = useCallback(
    (_updatedUser?: User) => {
      refetchUsers();
      setEditModalOpen(false);
      setSelectedUser(null);
    },
    [refetchUsers],
  );

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleResetPassword = useCallback((userId: string, email: string) => {
    if (confirm(`Reset password for ${email}?`)) {
      addToast({
        title: "Password reset functionality coming soon",
        color: "warning",
        timeout: 3000,
      });
    }
  }, []);

  const handleToggleAccountStatus = useCallback(
    (userId: string, currentStatus: string) => {
      // If unverified or deactivated, allow activating. If active, allow deactivating
      const newStatus = currentStatus === "active" ? "deactivated" : "active";
      const action = newStatus === "active" ? "activate" : "deactivate";

      if (confirm(`Are you sure you want to ${action} this account?`)) {
        updateUserStatus(
          {
            userId,
            status: newStatus as "active" | "deactivated" | "unverified",
          },
          {
            onSuccess: (response) => {
              if (response.success) {
                const actionPast =
                  newStatus === "active" ? "activated" : "deactivated";

                addToast({
                  title:
                    response.message || `Account ${actionPast} successfully`,
                  color: "success",
                  timeout: 4000,
                });
              }
            },
            onError: (error: any) => {
              addToast({
                title: error?.message || "Failed to update account status",
                color: "danger",
                timeout: 4000,
              });
            },
          },
        );
      }
    },
    [updateUserStatus],
  );

  // Memoized user list
  const mappedUsers: User[] = useMemo(
    () =>
      users.map((user) => ({
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        status: user.status as "active" | "deactivated" | "unverified",
        createdAt:
          typeof user.createdAt === "string"
            ? user.createdAt
            : user.createdAt.toISOString(),
        lastLogin: user.lastLogin
          ? typeof user.lastLogin === "string"
            ? user.lastLogin
            : user.lastLogin.toISOString()
          : null,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        displayName: user.displayName,
        roleName: user.roleName || "",
      })),
    [users],
  );

  // Memoized table columns
  const columns = useMemo(
    () =>
      getUsersTableColumns(
        formatDate,
        handleEditAccount,
        handleResetPassword,
        handleToggleAccountStatus,
        isUpdatingStatus,
        UserActions,
      ),
    [
      formatDate,
      handleEditAccount,
      handleResetPassword,
      handleToggleAccountStatus,
      isUpdatingStatus,
    ],
  );

  // Error state
  if (usersError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Failed to load users. Please try again.
        </p>
        <RetryButton onRetry={refetchUsers} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">User Accounts</h2>
          <p className="text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {loading ? "Loading..." : `${users.length} users`}
        </div>
      </div>

      <Table
        columns={columns}
        data={mappedUsers}
        emptyMessage="No users found"
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [5, 10, 25, 50, 100],
        }}
      />

      {selectedUser && (
        <EditUserModal
          open={editModalOpen}
          user={selectedUser}
          onClose={handleCloseEditModal}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default React.memo(UsersTable);
