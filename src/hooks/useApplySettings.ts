import { useEffect } from "react";
import { useAppStore } from "@/store/appStore";

const FONT_SIZE_PX: Record<string, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
};

export function useApplySettings() {
  const themeMode = useAppStore((s) => s.settings.themeMode);
  const fontSize = useAppStore((s) => s.settings.fontSize);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const apply = (mode: "light" | "dark") => {
      root.classList.toggle("dark", mode === "dark");
    };
    if (themeMode === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "dark" : "light");
      const handler = (e: MediaQueryListEvent) => apply(e.matches ? "dark" : "light");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    apply(themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.fontSize = FONT_SIZE_PX[fontSize] ?? "16px";
  }, [fontSize]);
}
