"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "@/components/ui/Table";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { User, UsersTableProps } from "@/types/admin";
import { getRoleDisplayLabel, Role } from "@/validators/adminSchema";
import { EditUserModal } from "./EditUserModal";
import { addToast } from "@heroui/toast";
import { useAdminUsers } from "@/hooks/queries/admin/useAdminQueries";

// Memoized user avatar component
const UserAvatar = React.memo<{ user: User }>(({ user }) => (
  <div className="flex items-center space-x-3">
    <Avatar
      alt={`${user.firstName} ${user.lastName}`}
      size="md"
    />
    <div>
      <div className="font-medium text-gray-900">
        {user.displayName || `${user.firstName} ${user.lastName}`.trim() || 'Unknown User'}
      </div>
      <div className="text-sm text-gray-500">{user.email}</div>
    </div>
  </div>
));
UserAvatar.displayName = 'UserAvatar';

// Memoized status badges component
const StatusBadges = React.memo<{ user: User }>(({ user }) => (
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
));
StatusBadges.displayName = 'StatusBadges';

// Memoized actions dropdown component
const UserActions = React.memo<{
  user: User;
  onEdit: (userId: string) => void;
  onResetPassword: (userId: string, email: string) => void;
  onToggleStatus: (userId: string, status: string) => void;
  isUpdating: boolean;
}>(({ user, onEdit, onResetPassword, onToggleStatus, isUpdating }) => (
  <DropdownMenu
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
    items={[
      {
        label: "Edit Account",
        onClick: () => onEdit(user.id),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
      },
      {
        label: "Reset Password",
        onClick: () => onResetPassword(user.id, user.email),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
          </svg>
        ),
      },
      {
        label: user.status === "active" ? "Deactivate Account" : "Activate Account",
        onClick: () => onToggleStatus(user.id, user.status),
        destructive: user.status === "active",
        disabled: isUpdating,
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {user.status === "active" ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            )}
          </svg>
        ),
      },
    ]}
  />
));
UserActions.displayName = 'UserActions';

const UsersTable: React.FC<UsersTableProps> = ({ onEditUser }) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const {
    users,
    isLoadingUsers: loading,
    usersError,
    updateUserStatus,
    isUpdatingStatus,
    refetchUsers
  } = useAdminUsers();

  // Memoized date formatter
  const formatDate = useCallback((dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Memoized event handlers
  const handleEditAccount = useCallback((userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      const mappedUser: User = {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        status: user.status as "active" | "inactive",
        createdAt: typeof user.createdAt === 'string' ? user.createdAt : user.createdAt.toISOString(),
        lastLogin: user.lastLogin ? (typeof user.lastLogin === 'string' ? user.lastLogin : user.lastLogin.toISOString()) : null,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        displayName: user.displayName,
        roleName: user.roleName || "",
      };
      setSelectedUser(mappedUser);
      setEditModalOpen(true);
    }
    onEditUser?.(userId);
  }, [users, onEditUser]);

  const handleUserUpdated = useCallback((_updatedUser?: User) => {
    refetchUsers();
    setEditModalOpen(false);
    setSelectedUser(null);
  }, [refetchUsers]);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleResetPassword = useCallback((userId: string, email: string) => {
    if (confirm(`Reset password for ${email}?`)) {
      console.log("Reset password for user:", userId);
      addToast({
        title: "Password reset functionality coming soon",
        color: "warning",
        timeout: 3000,
      });
    }
  }, []);

  const handleToggleAccountStatus = useCallback((userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "activate" : "deactivate";

    if (confirm(`Are you sure you want to ${action} this account?`)) {
      updateUserStatus(
        { userId, status: newStatus as "active" | "inactive" },
        {
          onSuccess: (response) => {
            if (response.success) {
              const actionPast = newStatus === "active" ? "activated" : "deactivated";
              addToast({
                title: response.message || `Account ${actionPast} successfully`,
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
          }
        }
      );
    }
  }, [updateUserStatus]);

  // Memoized user list mapping
  const mappedUsers: User[] = useMemo(() =>
    users.map(user => ({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      status: user.status as "active" | "inactive",
      createdAt: typeof user.createdAt === 'string' ? user.createdAt : user.createdAt.toISOString(),
      lastLogin: user.lastLogin ? (typeof user.lastLogin === 'string' ? user.lastLogin : user.lastLogin.toISOString()) : null,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      displayName: user.displayName,
      roleName: user.roleName || "",
    })), [users]
  );

  // Memoized table columns
  const columns: Column<User>[] = useMemo(() => [
    {
      header: "User",
      accessor: (user) => <UserAvatar user={user} />,
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
      accessor: (user) => <StatusBadges user={user} />,
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
        <UserActions
          user={user}
          onEdit={handleEditAccount}
          onResetPassword={handleResetPassword}
          onToggleStatus={handleToggleAccountStatus}
          isUpdating={isUpdatingStatus}
        />
      ),
      width: "80px",
      align: "center" as const,
    },
  ], [formatDate, handleEditAccount, handleResetPassword, handleToggleAccountStatus, isUpdatingStatus]);

  // Error state
  if (usersError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load users. Please try again.</p>
        <button
          onClick={() => refetchUsers()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
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

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="max-h-96 overflow-auto">
          <Table
            data={mappedUsers}
            columns={columns}
            loading={loading}
            emptyMessage="No users found"
          />
        </div>
      </div>

      {selectedUser && (
        <EditUserModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default React.memo(UsersTable);