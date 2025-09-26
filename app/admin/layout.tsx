import { AdminMenu } from "@/components/admin/AdminMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  }
) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <AdminMenu />

      <main className="flex-1 p-6">
        <AdminHeader />
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}