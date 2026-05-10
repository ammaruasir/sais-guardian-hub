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
  const language = useAppStore((s) => s.settings.language ?? "ar");
  const watermark = useAppStore((s) => s.settings.watermark);
  const copyProtection = useAppStore((s) => s.settings.copyProtection);
  const disableRightClick = useAppStore((s) => s.settings.disableRightClick);

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

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.dir = "rtl";
    root.lang = language;
    root.classList.toggle("font-en", language === "en");
    root.classList.toggle("font-ar", language === "ar");
    document.body.classList.toggle("lang-en", language === "en");
    document.body.classList.toggle("lang-ar", language === "ar");
  }, [language]);

  // Watermark overlay
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "app-watermark-overlay";
    let el = document.getElementById(id);
    if (!watermark) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
    }
    const userName = "SAIS User";
    const date = new Date().toLocaleDateString("ar-SA");
    const text = `${userName} • ${date}`;
    el.style.cssText = [
      "position:fixed", "inset:0", "pointer-events:none", "z-index:9999",
      "overflow:hidden", "user-select:none",
    ].join(";");
    el.innerHTML = `<div style="position:absolute;inset:-50%;transform:rotate(-30deg);display:grid;grid-template-columns:repeat(6,1fr);gap:120px 80px;font-size:14px;color:rgba(0,0,0,0.08);font-weight:600;white-space:nowrap;">${Array.from({ length: 60 }).map(() => `<span>${text}</span>`).join("")}</div>`;
    return () => { el?.remove(); };
  }, [watermark]);

  // Copy protection
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!copyProtection) return;
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("copy", prevent);
    document.addEventListener("cut", prevent);
    document.addEventListener("selectstart", prevent);
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("copy", prevent);
      document.removeEventListener("cut", prevent);
      document.removeEventListener("selectstart", prevent);
      document.body.style.userSelect = "";
    };
  }, [copyProtection]);

  // Disable right click
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!disableRightClick) return;
    const prevent = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    return () => document.removeEventListener("contextmenu", prevent);
  }, [disableRightClick]);
}
