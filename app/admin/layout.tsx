export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <main className="flex-1 overflow-auto h-screen">
        <div>{children}</div>
      </main>
    </div>
  );
}
