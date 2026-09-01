export type Locale = "en" | "ru" | "kk";

export const LOCALE_COOKIE = "ai_startup_locale";
export const LOCALES: Locale[] = ["en", "ru", "kk"];

export function parseLocale(value?: string | null): Locale {
  return value === "ru" || value === "kk" ? value : "en";
}
