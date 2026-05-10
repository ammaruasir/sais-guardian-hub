import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { RoleProvider } from "@/context/RoleContext";
import { AuthProvider } from "@/context/AuthContext";
import { useTheme } from "@/hooks/useTheme";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" dir="rtl">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">الصفحة التي تبحث عنها غير متاحة.</p>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "منصة SAIS — الهيئة العليا للأمن الصناعي" },
      {
        name: "description",
        content: "منصة الهيئة العليا للأمن الصناعي لإدارة المشاريع والامتثال.",
      },
      { property: "og:title", content: "منصة SAIS — الهيئة العليا للأمن الصناعي" },
      { name: "twitter:title", content: "منصة SAIS — الهيئة العليا للأمن الصناعي" },
      {
        property: "og:description",
        content: "منصة الهيئة العليا للأمن الصناعي لإدارة المشاريع والامتثال.",
      },
      {
        name: "twitter:description",
        content: "منصة الهيئة العليا للأمن الصناعي لإدارة المشاريع والامتثال.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5bb895dd-a962-4319-b689-74ea2f1a07b6/id-preview-8e7eff3d--d34eef2c-9d24-4646-bb2f-3fd4839aecc4.lovable.app-1777930412438.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5bb895dd-a962-4319-b689-74ea2f1a07b6/id-preview-8e7eff3d--d34eef2c-9d24-4646-bb2f-3fd4839aecc4.lovable.app-1777930412438.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <RoleProvider>
        <ThemeBootstrapper />
        <Outlet />
      </RoleProvider>
    </AuthProvider>
  );
}

function ThemeBootstrapper() {
  // Reads settings.themeMode from store and applies the .dark class
  // to <html> for all routes.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _t = useTheme();
  return null;
}
