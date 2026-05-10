import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { useRole } from "@/context/RoleContext";
import { useAppStore } from "@/store/appStore";
import { useApplySettings } from "@/hooks/useApplySettings";
import { RequireAuth } from "@/components/auth/RequireAuth";

export function AppShell({ children }: { children: ReactNode }) {
  const { role } = useRole();
  const sidebarMode = useAppStore((s) => s.settings.sidebarMode);
  useApplySettings();
  return (
    <RequireAuth>
      <SidebarProvider defaultOpen={sidebarMode !== "collapsed"}>
        <div className="flex min-h-screen w-full bg-background" dir="rtl">
          <AppSidebar />
          <SidebarInset className="flex flex-1 flex-col">
            <TopBar />
            <main key={role} className="content-area flex-1 p-4 md:p-6 animate-in fade-in duration-200">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </RequireAuth>
  );
}
