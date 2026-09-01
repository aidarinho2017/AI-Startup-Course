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
import { LanguageSwitcher, useLocale, useLocaleFromUrl } from "@/components/language-switcher";

const COPY = {
  en: {
    language: "Interface language", title: "Sign in", description: "Continue your AI startup course.",
    or: "or", email: "Email", password: "Password", submit: "Sign in", submitting: "Signing in...",
    noAccount: "No account?", signup: "Sign up", failed: "Login failed", googleFailed: "Google login failed",
    errors: { "Invalid email or password": "Invalid email or password", "Google login is not configured": "Google login is not configured", "Invalid Google token": "Invalid Google token" },
  },
  ru: {
    language: "Язык интерфейса", title: "Войти", description: "Продолжите обучение на курсе по AI-стартапам.",
    or: "или", email: "Электронная почта", password: "Пароль", submit: "Войти", submitting: "Вход...",
    noAccount: "Нет аккаунта?", signup: "Зарегистрироваться", failed: "Не удалось войти", googleFailed: "Не удалось войти через Google",
    errors: { "Invalid email or password": "Неверная почта или пароль", "Google login is not configured": "Вход через Google не настроен", "Invalid Google token": "Недействительный токен Google" },
  },
  kk: {
    language: "Интерфейс тілі", title: "Кіру", description: "AI стартап курсында оқуды жалғастырыңыз.",
    or: "немесе", email: "Электрондық пошта", password: "Құпиясөз", submit: "Кіру", submitting: "Кіру...",
    noAccount: "Аккаунтыңыз жоқ па?", signup: "Тіркелу", failed: "Кіру мүмкін болмады", googleFailed: "Google арқылы кіру мүмкін болмады",
    errors: { "Invalid email or password": "Пошта немесе құпиясөз қате", "Google login is not configured": "Google арқылы кіру бапталмаған", "Invalid Google token": "Google токені жарамсыз" },
  },
} as const;

function authError(error: unknown, fallback: string, messages: Readonly<Record<string, string>>) {
  return error instanceof ApiError ? messages[error.message] ?? fallback : fallback;
}

function LoginInner() {
  const { login, googleLogin } = useAuth();
  const { locale } = useLocale();
  useLocaleFromUrl();
  const copy = COPY[locale];
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
      setError(authError(err, copy.failed, copy.errors));
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
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link href={`/?lang=${locale}`} className="flex min-w-0 items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-black">
                <BrainCircuit className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate text-sm font-semibold text-white">AI Product Builder</span>
            </Link>
            <LanguageSwitcher label={copy.language} />
          </div>

          <div className="flex size-10 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <div className="pt-3">
            <CardTitle className="text-2xl text-white">{copy.title}</CardTitle>
            <CardDescription className="mt-2 text-zinc-400">
              {copy.description}
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
                  setError(authError(err, copy.googleFailed, copy.errors));
                }
              }}
              onError={() => setError(copy.googleFailed)}
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
            <span className="text-xs text-zinc-500">{copy.or}</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-200">
                {copy.email}
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
                {copy.password}
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
              {submitting ? copy.submitting : copy.submit}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-400">
            {copy.noAccount}{" "}
            <Link href={`/signup?lang=${locale}`} className="font-medium text-emerald-200 underline-offset-4 hover:underline">
              {copy.signup}
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
