import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background" dir="rtl">
        <AppSidebar />
        <SidebarInset className="flex flex-1 flex-col">
          <TopBar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
