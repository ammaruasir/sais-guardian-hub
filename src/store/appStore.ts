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
import {
  projects as seedProjects,
  companies as seedCompanies,
  activity as seedActivity,
  type Project,
  type Company,
  type ActivityItem,
  type ProjectStatus,
  type Stage,
} from "@/data";
import { tasks as seedTasks, type Task, type TaskStatus } from "@/data/tasks";
import { submissions as seedSubmissions, type Submission } from "@/data/submissions";
import { notifications as seedNotifications, type AppNotification } from "@/data/notifications";
import { consultants as seedConsultants, type Consultant } from "@/data/consultants";
import { facilities as seedFacilities, type Facility } from "@/data/facilities";

export type MockAuth = {
  isAuthenticated: boolean;
  mockRole: "sais" | "company" | null;
  identifier: string | null;
  method: "nafath_business" | "nafath_gov" | "nafath_individual" | "username" | null;
};

type State = {
  mockAuth: MockAuth;
  loginMock: (a: Omit<MockAuth, "isAuthenticated"> & { isAuthenticated?: boolean }) => void;
  logoutMock: () => void;

  // Admin
  users: AdminUser[];
  roles: Role[];
  permissions: PermMatrix;
  audit: AuditEvent[];
  settings: AppSettings;
  // Domain
  projects: Project[];
  companies: Company[];
  tasks: Task[];
  submissions: Submission[];
  notifications: AppNotification[];
  activity: ActivityItem[];
  consultants: Consultant[];
  facilities: Facility[];

  // Admin mutators
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

  // Projects
  addProject: (p: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateProjectStatus: (id: string, status: ProjectStatus, stage?: Stage) => void;

  // Companies
  addCompany: (c: Company) => void;
  updateCompany: (id: string, patch: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Tasks
  addTask: (t: Task) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;

  // Submissions
  addSubmission: (s: Submission) => void;
  updateSubmission: (id: string, patch: Partial<Submission>) => void;
  updateSubmissionDecision: (
    id: string,
    decision: "approved" | "additional_docs" | "rejected",
    comments?: string,
  ) => void;

  // Notifications
  addNotification: (n: Omit<AppNotification, "id" | "read"> & { read?: boolean }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (role: "sais" | "company") => void;
  deleteNotification: (id: string) => void;
  getUnreadCount: (role: "sais" | "company") => number;

  // Activity
  addActivity: (a: Omit<ActivityItem, "id">) => void;

  // Consultants
  addConsultant: (c: Consultant) => void;
  updateConsultant: (id: string, patch: Partial<Consultant>) => void;
  deleteConsultant: (id: string) => void;

  resetDemo: () => void;
};

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      roles: seedRoles,
      permissions: seedPermMatrix,
      audit: seedAuditEvents,
      settings: seedSettings,
      projects: seedProjects,
      companies: seedCompanies,
      tasks: seedTasks,
      submissions: seedSubmissions,
      notifications: seedNotifications,
      activity: seedActivity,
      consultants: seedConsultants,
      facilities: seedFacilities,
      mockAuth: { isAuthenticated: false, mockRole: null, identifier: null, method: null },
      loginMock: (a) =>
        set({
          mockAuth: {
            isAuthenticated: a.isAuthenticated ?? true,
            mockRole: a.mockRole,
            identifier: a.identifier,
            method: a.method,
          },
        }),
      logoutMock: () =>
        set({
          mockAuth: { isAuthenticated: false, mockRole: null, identifier: null, method: null },
        }),


      // Admin
      addUser: (u) =>
        set((s) => ({ users: [{ ...u, id: `u${Date.now()}`, events: 0 }, ...s.users] })),
      updateUser: (id, patch) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      addRole: (r) =>
        set((s) => {
          const newRole: Role = { ...r, system: false };
          const perms: PermMatrix = { ...s.permissions };
          for (const k of Object.keys(perms)) perms[k] = { ...perms[k], [r.key]: false };
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
          permissions: { ...s.permissions, [perm]: { ...s.permissions[perm], [roleKey]: value } },
        })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addAudit: (e) =>
        set((s) => ({
          audit: [{ ...e, id: `ev${Date.now()}`, ts: new Date().toISOString() }, ...s.audit],
        })),
      deleteAudit: (id) => set((s) => ({ audit: s.audit.filter((e) => e.id !== id) })),

      // Projects
      addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
      updateProject: (id, patch) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
      updateProjectStatus: (id, status, stage) =>
        set((s) => ({
          projects: s.projects.map((p) => {
            if (p.id !== id) return p;
            // Auto-advance on intermediate approval
            if (status === "approved" && p.stage < 4) {
              return {
                ...p,
                stage: (p.stage + 1) as Stage,
                status: "awaiting_submission",
                daysInStage: 0,
                overdue: false,
              };
            }
            return { ...p, status, ...(stage ? { stage } : {}) };
          }),
        })),

      // Companies
      addCompany: (c) => set((s) => ({ companies: [c, ...s.companies] })),
      updateCompany: (id, patch) =>
        set((s) => ({ companies: s.companies.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
      deleteCompany: (id) => set((s) => ({ companies: s.companies.filter((c) => c.id !== id) })),

      // Tasks
      addTask: (t) => set((s) => ({ tasks: [t, ...s.tasks] })),
      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      updateTaskStatus: (id, status) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),

      // Submissions
      addSubmission: (sub) => set((s) => ({ submissions: [sub, ...s.submissions] })),
      updateSubmission: (id, patch) =>
        set((s) => ({
          submissions: s.submissions.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      updateSubmissionDecision: (id, decision, comments) => {
        const sub = get().submissions.find((x) => x.id === id);
        set((s) => ({
          submissions: s.submissions.map((x) =>
            x.id === id
              ? {
                  ...x,
                  decision,
                  comments: comments ?? x.comments,
                  reviewedAt: new Date().toISOString().slice(0, 10),
                }
              : x,
          ),
        }));
        if (sub) {
          const map: Record<typeof decision, ProjectStatus> = {
            approved: "approved",
            additional_docs: "additional_docs",
            rejected: "rejected",
          };
          get().updateProjectStatus(sub.projectId, map[decision]);
        }
      },

      // Notifications
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { id: `n${Date.now()}`, read: false, ...n } as AppNotification,
            ...s.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllAsRead: (role) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.forRole === role || n.forRole === "both" ? { ...n, read: true } : n,
          ),
        })),
      deleteNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      getUnreadCount: (role) =>
        get().notifications.filter((n) => !n.read && (n.forRole === role || n.forRole === "both"))
          .length,

      // Activity
      addActivity: (a) =>
        set((s) => ({ activity: [{ ...a, id: `a${Date.now()}` }, ...s.activity] })),

      // Consultants
      addConsultant: (c) => set((s) => ({ consultants: [c, ...s.consultants] })),
      updateConsultant: (id, patch) =>
        set((s) => ({
          consultants: s.consultants.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteConsultant: (id) =>
        set((s) => ({ consultants: s.consultants.filter((c) => c.id !== id) })),

      resetDemo: () =>
        set({
          users: seedUsers,
          roles: seedRoles,
          permissions: seedPermMatrix,
          audit: seedAuditEvents,
          settings: seedSettings,
          projects: seedProjects,
          companies: seedCompanies,
          tasks: seedTasks,
          submissions: seedSubmissions,
          notifications: seedNotifications,
          activity: seedActivity,
          consultants: seedConsultants,
          facilities: seedFacilities,
        }),
    }),
    { name: "sais-app-store-v2" },
  ),
);
