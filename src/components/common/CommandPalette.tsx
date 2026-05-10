import { useEffect } from "react";
import { create } from "zustand";
import { useNavigate } from "@tanstack/react-router";
import { FileText, FolderKanban, Building2, Users } from "lucide-react";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem,
} from "@/components/ui/command";
import { useAppStore } from "@/store/appStore";
import { useT } from "@/hooks/useT";
import { useRole } from "@/context/RoleContext";

type State = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useCommandPalette = create<State>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));

export function CommandPalette() {
  const isOpen = useCommandPalette((s) => s.isOpen);
  const close = useCommandPalette((s) => s.close);
  const toggle = useCommandPalette((s) => s.toggle);
  const { t, isAr } = useT();
  const { role } = useRole();
  const navigate = useNavigate();

  const requests = useAppStore((s) => s.requests);
  const projects = useAppStore((s) => s.projects);
  const companies = useAppStore((s) => s.companies);
  const users = useAppStore((s) => s.users);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  const visibleRequests = role === "company"
    ? requests.filter((r) => r.companyId === "aramco")
    : requests;
  const visibleProjects = role === "company"
    ? projects.filter((p) => p.companyId === "aramco")
    : projects;

  const go = (fn: () => void) => () => { close(); fn(); };

  return (
    <CommandDialog open={isOpen} onOpenChange={(v) => !v && close()}>
      <CommandInput placeholder={t("search_platform")} />
      <CommandList>
        <CommandEmpty>{t("no_results")}</CommandEmpty>

        {visibleRequests.length > 0 && (
          <CommandGroup heading={t("group_requests")}>
            {visibleRequests.slice(0, 30).map((r) => (
              <CommandItem
                key={r.id}
                value={`${r.ref} ${r.titleAr}`}
                onSelect={go(() => navigate({ to: role === "company" ? "/portal/requests/$id" : "/requests/$id", params: { id: r.id } }))}
              >
                <FileText className="h-4 w-4 me-2 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.titleAr}</div>
                  <div className="text-xs text-muted-foreground font-mono">{r.ref}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {visibleProjects.length > 0 && (
          <CommandGroup heading={t("group_projects")}>
            {visibleProjects.slice(0, 20).map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.nameAr} ${p.nameEn ?? ""}`}
                onSelect={go(() => navigate({ to: role === "company" ? "/portal/projects/$id" : "/projects/$id", params: { id: p.id } }))}
              >
                <FolderKanban className="h-4 w-4 me-2 text-secondary" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{isAr ? p.nameAr : (p.nameEn ?? p.nameAr)}</div>
                  <div className="text-xs text-muted-foreground">{t("group_projects")}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {role === "sais" && companies.length > 0 && (
          <CommandGroup heading={t("group_companies")}>
            {companies.slice(0, 20).map((c) => (
              <CommandItem
                key={c.id}
                value={`${c.nameAr} ${c.nameEn ?? ""}`}
                onSelect={go(() => navigate({ to: "/companies/$id", params: { id: c.id } }))}
              >
                <Building2 className="h-4 w-4 me-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{isAr ? c.nameAr : (c.nameEn ?? c.nameAr)}</div>
                  <div className="text-xs text-muted-foreground">{t("group_companies")}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {role === "sais" && users.length > 0 && (
          <CommandGroup heading={t("group_users")}>
            {users.slice(0, 20).map((u) => (
              <CommandItem
                key={u.id}
                value={`${u.nameAr} ${u.email}`}
                onSelect={go(() => navigate({ to: "/admin/users" }))}
              >
                <Users className="h-4 w-4 me-2" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{u.nameAr}</div>
                  <div className="text-xs text-muted-foreground">{u.department}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
