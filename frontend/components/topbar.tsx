"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function Topbar() {
  const { user, logout } = useAuth();
  const displayName = user?.first_name || user?.name;
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link href="/dashboard" className="text-sm font-semibold tracking-tight">
          AI Startup Course
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">
              Profile
            </Link>
          )}
          {user?.is_instructor && (
            <Link href="/instructor" className="text-sm text-muted-foreground hover:text-foreground">
              Instructor
            </Link>
          )}
          {user && (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {displayName}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
