import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useMembership } from "@/hooks/useMembership";

export default function AdminGate() {
  const { isLoadingAuth, authChecked } = useAuth();
  const { isAuthenticated, isAdmin } = useMembership();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!isAdmin) {
    return (
      <div className="shell py-16">
        <div className="mx-auto max-w-lg border border-border bg-card p-8 text-center">
          <p className="eyebrow text-accent">Restricted</p>
          <h1 className="display mt-3 text-2xl">Organization administrators only</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This control room manages every team, brand, sponsor and member for the organization. Ask
            an existing administrator to raise your account if you need it.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}