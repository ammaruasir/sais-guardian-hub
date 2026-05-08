import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useAppStore } from "@/store/appStore";
import { Loader2 } from "lucide-react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const mockAuthed = useAppStore((s) => s.mockAuth.isAuthenticated);
  const navigate = useNavigate();

  const authed = !!user || mockAuthed;

  useEffect(() => {
    if (!loading && !authed) {
      navigate({ to: "/landing" });
    }
  }, [authed, loading, navigate]);

  if (loading || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
