import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "sais" | "company";

type RoleContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  toggle: () => void;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("sais");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("sais-role") : null;
    if (stored === "sais" || stored === "company") setRoleState(stored);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    if (typeof window !== "undefined") window.localStorage.setItem("sais-role", r);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, toggle: () => setRole(role === "sais" ? "company" : "sais") }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
