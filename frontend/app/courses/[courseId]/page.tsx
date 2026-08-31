"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Hammer,
  Lock,
  Megaphone,
  Rocket,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/api";
import { CourseId, CourseSectionId, getCourse, getSectionMissions } from "@/lib/course";
import { DashboardOut, ModuleListItem } from "@/lib/types";
import { Protected } from "@/components/protected";
import { Topbar } from "@/components/topbar";
import { Badge } from "@/components/ui/badge";

const sectionIcons: Record<CourseSectionId, typeof Hammer> = {
  build: Hammer,
  discover: Search,
  launch: Megaphone,
  scale: TrendingUp,
};

const COPY = {
  en: {
    allCourses: "All courses", heading: "Build. Discover. Launch. Scale.",
    intro: "Move through the course one mission at a time, then submit real artifacts for review.",
    progress: "Course progress", complete: "missions complete", loading: "Loading progress...",
    failed: "Failed to load progress.", section: "Section", active: "Active", soon: "Coming soon",
    hide: "Hide", open: "Open", missions: "missions", mission: "Mission", due: "Due",
    noDeadline: "Deadline not set yet", review: "Review", toolkit: "Startup Toolkit",
    locked: "This section will open after the earlier missions are ready.", missing: "Course not found.",
  },
  ru: {
    allCourses: "Все курсы", heading: "Создайте. Исследуйте. Запустите. Масштабируйте.",
    intro: "Проходите курс по одной миссии и отправляйте реальные результаты на проверку.",
    progress: "Прогресс курса", complete: "миссий выполнено", loading: "Загрузка прогресса...",
    failed: "Не удалось загрузить прогресс.", section: "Раздел", active: "Доступен", soon: "Скоро",
    hide: "Скрыть", open: "Открыть", missions: "миссии", mission: "Миссия", due: "Срок",
    noDeadline: "Срок пока не установлен", review: "Посмотреть", toolkit: "Набор инструментов",
    locked: "Этот раздел откроется после подготовки предыдущих миссий.", missing: "Курс не найден.",
  },
  kk: {
    allCourses: "Барлық курстар", heading: "Жасаңыз. Зерттеңіз. Іске қосыңыз. Өсіңіз.",
    intro: "Курсты миссия бойынша өтіп, нақты нәтижелерді тексеруге жіберіңіз.",
    progress: "Курс барысы", complete: "миссия орындалды", loading: "Прогресс жүктелуде...",
    failed: "Прогресті жүктеу мүмкін болмады.", section: "Бөлім", active: "Қолжетімді", soon: "Жақында",
    hide: "Жасыру", open: "Ашу", missions: "миссиялары", mission: "Миссия", due: "Мерзімі",
    noDeadline: "Мерзім әлі белгіленбеген", review: "Қарау", toolkit: "Стартап құралдары",
    locked: "Бұл бөлім алдыңғы миссиялар дайын болғаннан кейін ашылады.", missing: "Курс табылмады.",
  },
} as const;

function CourseInner({ courseId }: { courseId: string }) {
  const course = getCourse(courseId);
  const language: CourseId = course?.id ?? "en";
  const copy = COPY[language];
  const [openSections, setOpenSections] = useState<Record<CourseSectionId, boolean>>({
    build: false, discover: false, launch: false, scale: false,
  });
  const { data, isLoading, error } = useQuery<DashboardOut>({
    queryKey: ["dashboard"],
    queryFn: () => api<DashboardOut>("/dashboard"),
    enabled: Boolean(course),
  });

  if (!course) {
    return <div className="dark min-h-screen bg-[#050505] text-white"><Topbar /><p className="p-10 text-center">{copy.missing}</p></div>;
  }

  const runtimeBySlug = new Map<string, ModuleListItem>(
    (data?.modules ?? []).map((module) => [module.slug, module])
  );
  const completed = course.missions.filter((mission) => runtimeBySlug.get(mission.slug)?.is_completed).length;
  const progress = Math.round((completed / course.missions.length) * 100);

  return (
    <div className="dark min-h-screen bg-[#050505] text-white">
      <Topbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-10 md:px-8">
        <section className="w-full max-w-3xl text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden="true" />{copy.allCourses}
          </Link>
          <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-[8px] border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
            <Rocket className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-medium text-emerald-300">{course.name}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">{copy.heading}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">{copy.intro}</p>

          <div className="mt-8 rounded-[8px] border border-white/10 bg-white/[0.04] p-5 text-left">
            <div className="flex items-end justify-between gap-3">
              <div><p className="text-sm text-zinc-400">{copy.progress}</p><p className="mt-1 text-2xl font-semibold">{completed} / {course.missions.length} {copy.complete}</p></div>
              <p className="text-3xl font-semibold tabular-nums">{progress}%</p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-[linear-gradient(90deg,#34d399,#22d3ee,#fbbf24)]" style={{ width: `${progress}%` }} /></div>
            {isLoading && <p className="mt-3 text-sm text-zinc-500">{copy.loading}</p>}
            {error && <p className="mt-3 text-sm text-red-300">{copy.failed}</p>}
          </div>
        </section>

        <section className="mt-8 flex w-full max-w-3xl flex-col gap-4">
          {course.sections.map((section, sectionIndex) => {
            const Icon = sectionIcons[section.id];
            const active = section.status === "active";
            const missions = getSectionMissions(section);
            const sectionOpen = openSections[section.id];
            return (
              <div key={section.id} className="rounded-[8px] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Icon className="size-5" aria-hidden="true" /></div>
                    <div><p className="text-xs uppercase tracking-widest text-zinc-500">{copy.section} {sectionIndex + 1}</p><h2 className="mt-1 text-2xl font-semibold">{section.title}</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{section.description}</p></div>
                  </div>
                  <Badge variant={active ? "success" : "outline"}>{active ? copy.active : copy.soon}</Badge>
                </div>

                {active && missions.length > 0 && <>
                  <button type="button" onClick={() => setOpenSections((current) => ({ ...current, [section.id]: !current[section.id] }))} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10" aria-expanded={sectionOpen}>
                    {sectionOpen ? <ChevronUp className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
                    {sectionOpen ? copy.hide : copy.open} {section.title} {copy.missions}
                  </button>
                  {sectionOpen && <div className="mt-6 space-y-3">{missions.map((mission) => {
                    const runtime = runtimeBySlug.get(mission.slug);
                    const done = Boolean(runtime?.is_completed);
                    const number = course.missions.findIndex((item) => item.slug === mission.slug) + 1;
                    return <Link key={mission.slug} href={`/modules/${mission.slug}`} className="group flex min-h-[96px] flex-col justify-between gap-4 rounded-[8px] border border-white/10 bg-black/30 p-4 transition hover:border-emerald-300/40 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 gap-4"><div className={`flex size-9 shrink-0 items-center justify-center rounded-[8px] border text-sm font-semibold ${done ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-200" : "border-white/15 text-zinc-300"}`}>{done ? <CheckCircle2 className="size-4" aria-hidden="true" /> : number}</div>
                        <div><p className="text-xs uppercase tracking-widest text-zinc-500">{copy.mission} {number}</p><h3 className="mt-1 text-lg font-semibold">{mission.shortTitle}</h3><p className="mt-1 text-sm text-zinc-400">{mission.artifact}</p>
                          {runtime?.due_at ? <p className="mt-1 text-xs text-zinc-500">{copy.due} {new Date(runtime.due_at).toLocaleString(language === "ru" ? "ru-RU" : language === "kk" ? "kk-KZ" : "en-US")}</p> : runtime?.deadline_state === "not_set" ? <p className="mt-1 text-xs text-zinc-500">{copy.noDeadline}</p> : null}
                        </div></div><div className="flex items-center gap-2 text-sm font-medium text-emerald-200">{done ? copy.review : copy.open}<ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></div>
                    </Link>;
                  })}</div>}
                </>}
                {!active && <div className="mt-6 flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/25 p-4 text-sm text-zinc-400"><Lock className="size-4" aria-hidden="true" />{copy.locked}</div>}
              </div>
            );
          })}
        </section>

        <Link href="/toolkit" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"><Sparkles className="size-4" aria-hidden="true" />{copy.toolkit}</Link>
      </main>
    </div>
  );
}

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  return <Protected><CourseInner courseId={courseId} /></Protected>;
}
