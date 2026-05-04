import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { seedUsers } from "@/data/admin";
import { useAppStore } from "@/store/appStore";

export type Role = "sais" | "company";

export type CurrentUser = {
  id: string;
  name: string;
  role: Role;
  roleKey: string;
  companyId?: string;
};

const STORAGE_KEY = "sais-current-user";

const defaultSaisSeed =
  seedUsers.find((u) => u.roleKey === "super_admin") ??
  seedUsers.find((u) => u.roleKey === "admin")!;

const defaultSaisUser: CurrentUser = {
  id: defaultSaisSeed.id,
  name: defaultSaisSeed.nameAr,
  role: "sais",
  roleKey: defaultSaisSeed.roleKey,
};

const defaultCompanyUser: CurrentUser = {
  id: "company-aramco",
  name: "ممثل أرامكو",
  role: "company",
  roleKey: "viewer",
  companyId: "aramco",
};

type RoleContextValue = {
  role: Role;
  setRole: (r: Role) => void;
  toggle: () => void;
  currentUser: CurrentUser;
  setCurrentUser: (u: CurrentUser) => void;
  hasPermission: (permKey: string) => boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<CurrentUser>(defaultSaisUser);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CurrentUser;
        if (parsed && (parsed.role === "sais" || parsed.role === "company")) {
          setCurrentUserState(parsed);
          return;
        }
      } catch {
        // ignore
      }
    }
    // Back-compat: read legacy `sais-role` if present
    const legacy = window.localStorage.getItem("sais-role");
    if (legacy === "company") setCurrentUserState(defaultCompanyUser);
  }, []);

  const setCurrentUser = (u: CurrentUser) => {
    setCurrentUserState(u);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      window.localStorage.setItem("sais-role", u.role);
    }
  };

  const setRole = (r: Role) => {
    if (r === currentUser.role) return;
    setCurrentUser(r === "sais" ? defaultSaisUser : defaultCompanyUser);
  };

  const hasPermission = (permKey: string): boolean => {
    const perms = useAppStore.getState().permissions;
    return !!perms[permKey]?.[currentUser.roleKey];
  };

  return (
    <RoleContext.Provider
      value={{
        role: currentUser.role,
        setRole,
        toggle: () => setRole(currentUser.role === "sais" ? "company" : "sais"),
        currentUser,
        setCurrentUser,
        hasPermission,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}
