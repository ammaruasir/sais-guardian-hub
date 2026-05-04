import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedUsers,
  seedRoles,
  seedPermMatrix,
  seedAuditEvents,
  seedSettings,
  type AdminUser,
  type Role,
  type PermMatrix,
  type AuditEvent,
  type AppSettings,
} from "@/data/admin";

type ProjectsSlice = {
  // Phase 7A focuses on admin slices; existing data files remain.
};

type State = {
  users: AdminUser[];
  roles: Role[];
  permissions: PermMatrix;
  audit: AuditEvent[];
  settings: AppSettings;
  // Mutators
  addUser: (u: Omit<AdminUser, "id" | "events">) => void;
  updateUser: (id: string, patch: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  addRole: (r: Omit<Role, "system">) => void;
  updateRole: (key: string, patch: Partial<Role>) => void;
  deleteRole: (key: string) => void;
  setPermission: (perm: string, roleKey: string, value: boolean) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  addAudit: (e: Omit<AuditEvent, "id" | "ts">) => void;
  deleteAudit: (id: string) => void;
  resetDemo: () => void;
} & ProjectsSlice;

export const useAppStore = create<State>()(
  persist(
    (set) => ({
      users: seedUsers,
      roles: seedRoles,
      permissions: seedPermMatrix,
      audit: seedAuditEvents,
      settings: seedSettings,

      addUser: (u) =>
        set((s) => ({
          users: [{ ...u, id: `u${Date.now()}`, events: 0 }, ...s.users],
        })),
      updateUser: (id, patch) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
      deleteUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      addRole: (r) =>
        set((s) => {
          const newRole: Role = { ...r, system: false };
          // ensure permissions matrix has new role column with all-false
          const perms: PermMatrix = { ...s.permissions };
          for (const k of Object.keys(perms)) {
            perms[k] = { ...perms[k], [r.key]: false };
          }
          return { roles: [...s.roles, newRole], permissions: perms };
        }),
      updateRole: (key, patch) =>
        set((s) => ({ roles: s.roles.map((r) => (r.key === key ? { ...r, ...patch } : r)) })),
      deleteRole: (key) =>
        set((s) => {
          const perms: PermMatrix = {};
          for (const p of Object.keys(s.permissions)) {
            const { [key]: _drop, ...rest } = s.permissions[p];
            perms[p] = rest;
          }
          return { roles: s.roles.filter((r) => r.key !== key), permissions: perms };
        }),
      setPermission: (perm, roleKey, value) =>
        set((s) => ({
          permissions: {
            ...s.permissions,
            [perm]: { ...s.permissions[perm], [roleKey]: value },
          },
        })),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      addAudit: (e) =>
        set((s) => ({
          audit: [{ ...e, id: `ev${Date.now()}`, ts: new Date().toISOString() }, ...s.audit],
        })),
      deleteAudit: (id) => set((s) => ({ audit: s.audit.filter((e) => e.id !== id) })),

      resetDemo: () =>
        set({
          users: seedUsers,
          roles: seedRoles,
          permissions: seedPermMatrix,
          audit: seedAuditEvents,
          settings: seedSettings,
        }),
    }),
    { name: "sais-app-store-v1" },
  ),
);
