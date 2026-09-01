"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { LOCALE_COOKIE, LOCALES, Locale, parseLocale } from "@/lib/locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState(initialLocale);
  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export function useLocaleFromUrl() {
  const { setLocale } = useLocale();

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("lang");
    if (value) setLocale(parseLocale(value));
  }, [setLocale]);
}

const labels: Record<Locale, string> = { en: "EN", ru: "RU", kk: "KZ" };

export function LanguageSwitcher({ label }: { label: string }) {
  const { locale, setLocale } = useLocale();

  const choose = (nextLocale: Locale) => {
    setLocale(nextLocale);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", nextLocale);
    window.history.replaceState(null, "", url);
  };

  return (
    <div role="group" aria-label={label} className="flex shrink-0 rounded-[8px] border border-border bg-muted/50 p-1 text-xs font-semibold">
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={option === locale}
          onClick={() => choose(option)}
          className={`rounded-[6px] px-2 py-1.5 transition ${option === locale ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}

export function LanguageLinks({ locale, label }: { locale: Locale; label: string }) {
  const { setLocale } = useLocale();

  useEffect(() => setLocale(locale), [locale, setLocale]);

  return (
    <div role="group" aria-label={label} className="flex items-center rounded-[8px] border border-white/10 bg-white/[0.04] p-1 text-xs font-semibold">
      {LOCALES.map((option) => (
        <Link
          key={option}
          href={`/?lang=${option}`}
          onClick={() => setLocale(option)}
          aria-current={option === locale ? "page" : undefined}
          className={`rounded-[6px] px-2 py-1.5 transition ${option === locale ? "bg-white text-black" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}
        >
          {labels[option]}
        </Link>
      ))}
    </div>
  );
}
