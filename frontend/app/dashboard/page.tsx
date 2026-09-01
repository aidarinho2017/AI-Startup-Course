"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Languages } from "lucide-react";
import { api } from "@/lib/api";
import { COURSES } from "@/lib/course";
import { DashboardOut } from "@/lib/types";
import { Protected } from "@/components/protected";
import { Topbar } from "@/components/topbar";
import { useLocale } from "@/components/language-switcher";

const COPY = {
  en: {
    heading: "Choose your course",
    description: "English, Russian, and Kazakh follow the same curriculum with separate progress.",
    loading: "Loading progress...",
    failed: "Failed to load progress.",
  },
  ru: {
    heading: "Выберите курс",
    description: "Курсы на английском, русском и казахском проходят по одной программе с отдельным прогрессом.",
    loading: "Загрузка прогресса...",
    failed: "Не удалось загрузить прогресс.",
  },
  kk: {
    heading: "Курсты таңдаңыз",
    description: "Ағылшын, орыс және қазақ тілдеріндегі курстардың бағдарламасы бірдей, ал прогресі бөлек сақталады.",
    loading: "Прогресс жүктелуде...",
    failed: "Прогресті жүктеу мүмкін болмады.",
  },
} as const;

function DashboardInner() {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const { data, isLoading, error } = useQuery<DashboardOut>({
    queryKey: ["dashboard"],
    queryFn: () => api<DashboardOut>("/dashboard"),
  });
  const completedSlugs = new Set(
    (data?.modules ?? []).filter((module) => module.is_completed).map((module) => module.slug)
  );

  return (
    <div className="dark min-h-screen bg-[#050505] text-white">
      <Topbar />
      <main className="mx-auto w-full max-w-5xl px-5 py-12 md:px-8">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-[8px] border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
            <Languages className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-medium text-emerald-300">AI Product Builder</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">{copy.heading}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            {copy.description}
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
          {COURSES.map((course) => {
            const completed = course.missions.filter((mission) => completedSlugs.has(mission.slug)).length;
            const progress = Math.round((completed / course.missions.length) * 100);
            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group rounded-[8px] border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <BookOpen className="size-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-emerald-200">{course.id.toUpperCase()}</span>
                </div>
                <h2 className="mt-6 text-2xl font-semibold">{course.name}</h2>
                <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">{course.description}</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex justify-between text-xs text-zinc-400">
                      <span>{completed} / {course.missions.length}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-emerald-300" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="size-5 text-emerald-200 transition group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </section>

        {isLoading && <p className="mt-6 text-center text-sm text-zinc-500">{copy.loading}</p>}
        {error && <p className="mt-6 text-center text-sm text-red-300">{copy.failed}</p>}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <Protected><DashboardInner /></Protected>;
}
