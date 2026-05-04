import { Navigate } from "@tanstack/react-router";
import { useRole, type Role } from "@/context/RoleContext";
import type { ReactNode } from "react";

export function RoleGuard({ allow, redirectTo, children }: { allow: Role; redirectTo: string; children: ReactNode }) {
  const { role } = useRole();
  if (role !== allow) return <Navigate to={redirectTo} />;
  return <>{children}</>;
}
