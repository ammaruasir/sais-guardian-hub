import { useEffect, useState } from "react";
import { useAppStore } from "@/store/appStore";

export type ThemeMode = "light" | "dark" | "auto";
export type ResolvedTheme = "light" | "dark";

function applyClass(t: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function useTheme() {
  const themeMode = useAppStore((s) => s.settings.themeMode) as ThemeMode;
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [systemDark, setSystemDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Listen to system changes when in auto mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: ResolvedTheme =
    themeMode === "auto" ? (systemDark ? "dark" : "light") : themeMode;

  // Apply class on every change
  useEffect(() => {
    applyClass(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = (m: ThemeMode) => updateSettings({ themeMode: m });

  return { themeMode, resolvedTheme, setTheme };
}
