import { ProtectedRoute } from "@/components/RouteGuards";

type EditorLayoutProps = {
  children: React.ReactNode;
};

export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <ProtectedRoute roles={["user"]}>
      <div className="min-h-screen bg-background">{children}</div>
    </ProtectedRoute>
  );
}
