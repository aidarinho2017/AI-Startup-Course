"use client";

import Link from "next/link";
import { GraduationCap, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LanguageSwitcher, useLocale } from "@/components/language-switcher";

const COPY = {
  en: { profile: "Profile", instructor: "Instructor", signOut: "Sign out", language: "Interface language" },
  ru: { profile: "Профиль", instructor: "Преподаватель", signOut: "Выйти", language: "Язык интерфейса" },
  kk: { profile: "Профиль", instructor: "Оқытушы", signOut: "Шығу", language: "Интерфейс тілі" },
} as const;

export function Topbar() {
  const { user, logout } = useAuth();
  const { locale } = useLocale();
  const copy = COPY[locale];
  const displayName = user?.first_name || user?.name;
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-3 sm:px-6">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          <span className="sm:hidden">AI</span>
          <span className="hidden sm:inline">AI Startup Course</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <Link href="/profile" aria-label={copy.profile} className="flex text-sm text-muted-foreground hover:text-foreground">
              <UserRound className="size-4 sm:hidden" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.profile}</span>
            </Link>
          )}
          {user?.is_instructor && (
            <Link href="/instructor" aria-label={copy.instructor} className="flex text-sm text-muted-foreground hover:text-foreground">
              <GraduationCap className="size-4 md:hidden" aria-hidden="true" />
              <span className="hidden md:inline">{copy.instructor}</span>
            </Link>
          )}
          {user && (
            <span className="hidden text-sm text-muted-foreground md:inline">
              {displayName}
            </span>
          )}
          <LanguageSwitcher label={copy.language} />
          <Button variant="outline" size="sm" onClick={logout}>
            {copy.signOut}
          </Button>
        </div>
      </div>
    </header>
  );
}
