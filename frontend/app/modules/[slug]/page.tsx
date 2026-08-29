"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Github,
  LinkIcon,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { CourseId, getCourseMission, getMissionCourse, getMissionSection } from "@/lib/course";
import { ModuleDetail } from "@/lib/types";
import { Protected } from "@/components/protected";
import { Topbar } from "@/components/topbar";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { ChatPanel } from "@/components/chat-panel";
import { SubmissionForm } from "@/components/submission-form";
import { Badge } from "@/components/ui/badge";

const MENTOR_QUESTIONS: Record<string, string> = {
  "build-simple":
    "What are you trying to make in Lovable, and what is the smallest version you can publish today?",
  "build-vibe-coding":
    "What website are you creating or improving, and what should a visitor be able to do on it?",
  "build-real-vibe-coding":
    "Which tool are you choosing for this mission, and what code artifact will you push to GitHub?",
  "discover-find-problem":
    "What problems do you personally notice often, and which one feels painful enough that someone might pay to solve it?",
  "discover-talk-to-people":
    "Who did you talk to first, and what surprised you about how they described their problem?",
  "discover-evaluate-ideas":
    "Which of your startup ideas is the most ambitious, and what real problem does it solve?",
  "launch-build-mvp":
    "What hypothesis should your MVP test, and what is the smallest useful version you can launch?",
  "launch-product-online":
    "Where will you post about your product first, and what account links will show those posts?",
  "launch-first-customers":
    "Who is your first customer segment, and what is your first practical sales step?",
};

const RUSSIAN_MENTOR_QUESTIONS: Record<string, string> = {
  "build-simple": "Что вы хотите создать в Lovable и какую самую маленькую версию можно опубликовать сегодня?",
  "build-vibe-coding": "Какой сайт вы создаёте или улучшаете и что посетитель должен уметь на нём делать?",
  "build-real-vibe-coding": "Какой инструмент вы выбрали и какой результат отправите в GitHub?",
  "discover-find-problem": "Какие проблемы вы часто замечаете и за решение какой из них люди могли бы заплатить?",
  "discover-talk-to-people": "С кем вы поговорили первым и что удивило вас в описании проблемы?",
  "discover-evaluate-ideas": "Какая идея самая амбициозная и какую реальную проблему она решает?",
  "launch-build-mvp": "Какую гипотезу проверит ваш MVP и какую минимальную полезную версию можно запустить?",
  "launch-product-online": "Где вы впервые расскажете о продукте и какие ссылки покажут публикации?",
  "launch-first-customers": "Кто ваши первые клиенты и какой первый практический шаг продаж вы сделаете?",
};

const COPY = {
  en: { back: "Back to course", missing: "Mission not found", notActive: "This mission is not part of the active course.", mission: "Mission", completed: "Completed", due: "Due", noDeadline: "Deadline not set yet", loading: "Loading mission state...", failed: "Failed to load this mission.", resources: "Resources", video: "Video", chooseVideo: "Choose one video", github: "GitHub", githubText: "GitHub is a place to store, version, and share code. For this mission, create a repository, push your project code there, and submit the repository link.", artifact: "Artifact" },
  ru: { back: "Назад к курсу", missing: "Миссия не найдена", notActive: "Эта миссия не входит в активный курс.", mission: "Миссия", completed: "Выполнено", due: "Срок", noDeadline: "Срок пока не установлен", loading: "Загрузка миссии...", failed: "Не удалось загрузить миссию.", resources: "Материалы", video: "Видео", chooseVideo: "Выберите одно видео", github: "GitHub", githubText: "GitHub — это сервис для хранения, управления версиями и публикации кода. Создайте репозиторий, загрузите туда код проекта и отправьте ссылку.", artifact: "Результат" },
} as const;

function MissingMission({ language }: { language: CourseId }) {
  const copy = COPY[language];
  return (
    <div className="dark min-h-screen bg-[#050505] text-white">
      <Topbar />
      <main className="mx-auto max-w-3xl px-5 py-10 md:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {copy.back}
        </Link>
        <div className="mt-8 rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
          <h1 className="text-2xl font-semibold text-white">{copy.missing}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {copy.notActive}
          </p>
        </div>
      </main>
    </div>
  );
}

function ModuleInner({ slug }: { slug: string }) {
  const mission = getCourseMission(slug);
  const { data, isLoading, error } = useQuery<ModuleDetail>({
    queryKey: ["module", slug],
    queryFn: () => api<ModuleDetail>(`/modules/${slug}`),
    enabled: Boolean(mission),
  });

  if (!mission) {
    return <MissingMission language={slug.startsWith("ru-") ? "ru" : "en"} />;
  }

  const course = getMissionCourse(mission);
  const language = course.id;
  const copy = COPY[language];
  const missionIndex = course.missions.findIndex((item) => item.slug === slug) + 1;
  const section = getMissionSection(mission);
  const isCodingAgentMission = mission.slug.endsWith("build-real-vibe-coding");

  return (
    <div className="dark min-h-screen bg-[#050505] text-white">
      <Topbar />
      <main className="mx-auto w-full max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {copy.back}
        </Link>

        <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="min-w-0">
            <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-[8px] bg-emerald-300 text-black">
                  {section.title}
                </Badge>
                <p className="text-xs uppercase tracking-widest text-zinc-500">
                  {copy.mission} {missionIndex}
                </p>
                {data?.is_completed && (
                  <Badge variant="success" className="rounded-[8px]">
                    {copy.completed}
                  </Badge>
                )}
                {data?.due_at ? (
                  <Badge
                    variant="outline"
                    className="rounded-[8px] border-white/15 text-zinc-300"
                  >
                    {copy.due} {new Date(data.due_at).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}
                  </Badge>
                ) : data?.deadline_state === "not_set" ? (
                  <Badge
                    variant="outline"
                    className="rounded-[8px] border-white/15 text-zinc-300"
                  >
                    {copy.noDeadline}
                  </Badge>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
                {mission.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
                {mission.description}
              </p>

              <div className="mt-6 rounded-[8px] border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 size-5 shrink-0 text-cyan-200" aria-hidden="true" />
                  <p className="text-sm leading-6 text-zinc-300">{mission.brief}</p>
                </div>
              </div>

              {isLoading && (
                <p className="mt-4 text-sm text-zinc-500">{copy.loading}</p>
              )}
              {error && (
                <p className="mt-4 text-sm text-red-300">
                  {copy.failed}
                </p>
              )}
            </div>

            {mission.resources.length > 0 && (
              <section className="mt-6 rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <LinkIcon className="size-5 text-emerald-300" aria-hidden="true" />
                  <h2 className="text-lg font-semibold text-white">{copy.resources}</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {mission.resources.map((resource) => (
                    <a
                      key={resource.href}
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/10"
                    >
                      {resource.label}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className="mt-6 rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-5 flex items-center gap-3">
                <PlayCircle className="size-5 text-emerald-300" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-white">
                  {isCodingAgentMission
                    ? copy.chooseVideo
                    : copy.video}
                </h2>
              </div>
              <div className="space-y-6">
                {mission.videos.map((video) => (
                  <YouTubeEmbed
                    key={video.youtubeId}
                    youtubeId={video.youtubeId}
                    title={video.title}
                  />
                ))}
              </div>
            </section>

            {isCodingAgentMission && (
              <section className="mt-6 rounded-[8px] border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-3 flex items-center gap-3">
                  <Github className="size-5 text-zinc-200" aria-hidden="true" />
                  <h2 className="text-lg font-semibold text-white">{copy.github}</h2>
                </div>
                <p className="text-sm leading-6 text-zinc-400">
                  {copy.githubText}
                </p>
              </section>
            )}

            <section className="mt-6">
              <SubmissionForm
                slug={mission.slug}
                fields={mission.submissionFields}
                instructions={mission.homework}
                language={language}
              />
            </section>
          </div>

          <aside className="w-full lg:sticky lg:top-20 lg:self-start">
            <div className="mb-4 rounded-[8px] border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-300" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-white">{copy.artifact}</p>
                  <p className="mt-1 text-sm text-zinc-400">{mission.artifact}</p>
                </div>
              </div>
            </div>
            {data?.has_chatbot && (
              <ChatPanel
                slug={mission.slug}
                language={language}
                openingQuestion={language === "ru"
                  ? RUSSIAN_MENTOR_QUESTIONS[mission.slug.replace(/^ru-/, "")]
                  : MENTOR_QUESTIONS[mission.slug]}
              />
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

export default function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Protected>
      <ModuleInner slug={slug} />
    </Protected>
  );
}
