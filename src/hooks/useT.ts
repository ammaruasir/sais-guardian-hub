import { useAppStore } from "@/store/appStore";
import { translations, type TKey, type Lang } from "@/i18n/translations";

export function useT() {
  const lang = (useAppStore((s) => s.settings.language) ?? "ar") as Lang;

  return {
    t: (key: TKey) => translations[key][lang],
    lang,
    dir: (lang === "ar" ? "rtl" : "ltr") as "rtl" | "ltr",
    isAr: lang === "ar",
    name: (entity: { nameAr?: string | null; nameEn?: string | null } | null | undefined) => {
      if (!entity) return "";
      return (lang === "ar" ? entity.nameAr : entity.nameEn) ?? entity.nameAr ?? entity.nameEn ?? "";
    },
    setLanguage: useAppStore.getState().setLanguage,
  };
}
