import React from "react";
import { Column } from "@/components/ui/Table";
import { User } from "@/types/admin";
import {
  Feedback,
  FeedbackStatus,
} from "@/hooks/queries/admin/useFeedbackQueries";
import Badge from "@/components/ui/Badge";
import { getRoleDisplayLabel, Role } from "@/validators/adminSchema";

// User Avatar Component
export const UserAvatar = React.memo<{ user: User }>(({ user }) => (
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-sm font-medium text-gray-700">
        {user.firstName?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
      </span>
    </div>
    <div>
      <div className="font-medium text-gray-900">
        {user.displayName ||
          `${user.firstName} ${user.lastName}`.trim() ||
          "Unknown User"}
      </div>
      <div className="text-sm text-gray-500">{user.email}</div>
    </div>
  </div>
));

UserAvatar.displayName = "UserAvatar";

// Status Badges Component
export const StatusBadges = React.memo<{ user: User }>(({ user }) => (
  <div className="flex items-center space-x-2">
    <Badge size="sm" variant={user.status === "active" ? "success" : "error"}>
      {user.status === "active" ? "Active" : "Inactive"}
    </Badge>
    {user.emailVerified && (
      <Badge size="sm" variant="info">
        Verified
      </Badge>
    )}
  </div>
));

StatusBadges.displayName = "StatusBadges";

// Feedback Status Badge Component
export const FeedbackStatusBadge = React.memo<{ status: FeedbackStatus }>(
  ({ status }) => (
    <Badge size="sm" variant={status === "resolved" ? "success" : "warning"}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </Badge>
  ),
);

FeedbackStatusBadge.displayName = "FeedbackStatusBadge";

// Users Table Column Configuration
export const getUsersTableColumns = (
  formatDate: (dateString: string | Date) => string,
  handleEditAccount: (userId: string) => void,
  handleResetPassword: (userId: string, email: string) => void,
  handleToggleAccountStatus: (userId: string, status: string) => void,
  isUpdatingStatus: boolean,
  UserActionsComponent: React.ComponentType<any>,
): Column<User>[] => [
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
      <UserActionsComponent
        isUpdating={isUpdatingStatus}
        user={user}
        onEdit={handleEditAccount}
        onResetPassword={handleResetPassword}
        onToggleStatus={handleToggleAccountStatus}
      />
    ),
    width: "80px",
    align: "center" as const,
  },
];

// Feedback Table Column Configuration
export const getFeedbackTableColumns = (
  formatDate: (dateString: string) => string,
  handleEditFeedback: (feedbackId: string) => void,
  handleToggleStatus: (
    feedbackId: string,
    currentStatus: FeedbackStatus,
  ) => void,
  handleDeleteFeedback: (feedbackId: string) => void,
  isUpdatingStatus: boolean,
  isDeletingFeedback: boolean,
  FeedbackActionsComponent: React.ComponentType<any>,
): Column<Feedback>[] => [
  {
    header: "Feature",
    accessor: (feedback) => (
      <div className="text-gray-900 font-medium">{feedback.feature}</div>
    ),
    width: "120px",
  },
  {
    header: "Title",
    accessor: (feedback) => (
      <div className="text-gray-900 font-medium">{feedback.title}</div>
    ),
    width: "200px",
  },
  {
    header: "Description",
    accessor: (feedback) => (
      <div
        className="text-gray-600 text-sm truncate max-w-xs"
        title={feedback.description}
      >
        {feedback.description}
      </div>
    ),
    width: "300px",
  },
  {
    header: "Status",
    accessor: (feedback) => <FeedbackStatusBadge status={feedback.status} />,
    width: "100px",
  },
  {
    header: "Submitted By",
    accessor: (feedback) => (
      <div className="text-gray-900">
        {feedback.submittedByEmail && feedback.submittedByEmail !== "No Email"
          ? feedback.submittedByEmail
          : "No Email"}
      </div>
    ),
    width: "200px",
  },
  {
    header: "Date",
    accessor: (feedback) => (
      <div className="text-gray-900">{formatDate(feedback.createdAt)}</div>
    ),
    width: "140px",
  },
  {
    header: "Actions",
    accessor: (feedback) => (
      <FeedbackActionsComponent
        feedback={feedback}
        isDeleting={isDeletingFeedback}
        isUpdating={isUpdatingStatus}
        onDelete={handleDeleteFeedback}
        onEdit={handleEditFeedback}
        onToggleStatus={handleToggleStatus}
      />
    ),
    width: "80px",
    align: "center" as const,
  },
];
