"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { BrainCircuit, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { GuestOnly } from "@/components/auth-redirect";

function LoginInner() {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <main className="dark relative flex min-h-screen items-center justify-center overflow-x-hidden bg-[#050505] px-4 py-8 text-white">
      <Image
        src="/images/ai-startup-school-hero.png"
        alt=""
        fill
        priority
        className="object-cover opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.88)_48%,#050505_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.2),#050505_94%)]" />

      <Card className="relative z-10 w-full max-w-[25rem] rounded-[8px] border-white/10 bg-black/60 text-white shadow-2xl shadow-emerald-950/25 backdrop-blur-xl">
        <CardHeader className="p-5 pb-4">
          <Link href="/" className="mb-6 flex w-fit items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-black">
              <BrainCircuit className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-white">
              AI Product Builder
            </span>
          </Link>

          <div className="flex size-10 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <div className="pt-3">
            <CardTitle className="text-2xl text-white">Sign in</CardTitle>
            <CardDescription className="mt-2 text-zinc-400">
              Continue your AI startup course.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5 pt-0">
          <div className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.06] p-2 [color-scheme:dark]">
            <GoogleLogin
              onSuccess={async ({ credential }) => {
                if (!credential) return;
                setError(null);
                try {
                  await googleLogin(credential);
                } catch (err) {
                  setError(err instanceof ApiError ? err.message : "Google login failed");
                }
              }}
              onError={() => setError("Google login failed")}
              theme="filled_black"
              size="large"
              text="signin_with"
              shape="rectangular"
              logo_alignment="left"
              width="100%"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-black/35 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-300/25"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/10 bg-black/35 text-white placeholder:text-zinc-600 focus-visible:ring-emerald-300/25"
              />
            </div>
            {error && (
              <p className="rounded-[8px] border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="min-h-11 w-full rounded-[8px] bg-white text-sm font-semibold text-black hover:bg-emerald-200"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400">
            No account?{" "}
            <Link href="/signup" className="font-medium text-emerald-200 underline-offset-4 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginInner />
    </GuestOnly>
  );
}
