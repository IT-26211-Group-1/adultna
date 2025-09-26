export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string | null;
  firstName: string;
  lastName: string;
  displayName: string | null;
  roleName: string;
};

export type UsersTableProps = {
  onEditUser?: (userId: string) => void;
};
