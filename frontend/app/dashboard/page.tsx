"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
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
import {
  COURSE_MISSIONS,
  COURSE_SECTIONS,
  CourseSectionId,
  getSectionMissions,
} from "@/lib/course";
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

function DashboardInner() {
  const [openSections, setOpenSections] = useState<Record<CourseSectionId, boolean>>({
    build: false,
    discover: false,
    launch: false,
    scale: false,
  });
  const { data, isLoading, error } = useQuery<DashboardOut>({
    queryKey: ["dashboard"],
    queryFn: () => api<DashboardOut>("/dashboard"),
  });

  const runtimeBySlug = new Map<string, ModuleListItem>(
    (data?.modules ?? []).map((module) => [module.slug, module])
  );
  const completedMissions = COURSE_MISSIONS.filter(
    (mission) => runtimeBySlug.get(mission.slug)?.is_completed
  ).length;
  const totalMissions = COURSE_MISSIONS.length;
  const progressPct = totalMissions
    ? Math.round((completedMissions / totalMissions) * 100)
    : 0;
  const toggleSection = (sectionId: CourseSectionId) => {
    setOpenSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  };

  return (
    <div className="dark min-h-screen bg-[#050505] text-white">
      <Topbar />
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 py-10 md:px-8">
        <section className="w-full max-w-3xl text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-[8px] border border-emerald-300/25 bg-emerald-300/10 text-emerald-200">
            <Rocket className="size-5" aria-hidden="true" />
          </div>
          <p className="mt-5 text-sm font-medium text-emerald-300">
            AI Product Builder
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            Build. Discover. Launch. Scale.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 md:text-lg">
            Move through Build, Discover, and Launch one mission at a time, then submit real artifacts for review.
          </p>

          <div className="mt-8 rounded-[8px] border border-white/10 bg-white/[0.04] p-5 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-zinc-400">Course progress</p>
                <p className="mt-1 text-2xl font-semibold text-white">
                  {completedMissions} of {totalMissions} missions complete
                </p>
              </div>
              <p className="text-3xl font-semibold tabular-nums text-white">
                {progressPct}%
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#34d399,#22d3ee,#fbbf24)] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            {isLoading && (
              <p className="mt-3 text-sm text-zinc-500">Loading progress...</p>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-300">
                Failed to load progress.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 flex w-full max-w-3xl flex-col items-center gap-4">
          {COURSE_SECTIONS.map((section, sectionIndex) => {
            const Icon = sectionIcons[section.id];
            const isActive = section.status === "active";
            const sectionMissions = getSectionMissions(section);
            const isSectionOpen = openSections[section.id];

            return (
              <div
                key={section.id}
                className="w-full rounded-[8px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-widest text-zinc-500">
                        Section {sectionIndex + 1}
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold text-white">
                        {section.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={isActive ? "success" : "outline"}
                    className={
                      isActive
                        ? "shrink-0 rounded-[8px]"
                        : "shrink-0 rounded-[8px] border-white/15 text-zinc-300"
                    }
                  >
                    {isActive ? "Active" : "Coming soon"}
                  </Badge>
                </div>

                {isActive && sectionMissions.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="mt-6 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/10 sm:w-auto"
                      aria-expanded={isSectionOpen}
                    >
                      {isSectionOpen ? (
                        <>
                          <ChevronUp className="size-4" aria-hidden="true" />
                          Hide {section.title} missions
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-4" aria-hidden="true" />
                          Open {section.title} missions
                        </>
                      )}
                    </button>

                    {isSectionOpen && (
                      <div className="mt-6 space-y-3">
                        {sectionMissions.map((mission) => {
                          const runtime = runtimeBySlug.get(mission.slug);
                          const isCompleted = Boolean(runtime?.is_completed);
                          const missionNumber =
                            COURSE_MISSIONS.findIndex((item) => item.slug === mission.slug) + 1;

                          return (
                            <Link
                              key={mission.slug}
                              href={`/modules/${mission.slug}`}
                              className="group flex min-h-[96px] w-full flex-col justify-between gap-4 rounded-[8px] border border-white/10 bg-black/30 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:bg-white/[0.06] sm:flex-row sm:items-center"
                            >
                              <div className="flex min-w-0 gap-4">
                                <div
                                  className={`flex size-9 shrink-0 items-center justify-center rounded-[8px] border text-sm font-semibold ${
                                    isCompleted
                                      ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-200"
                                      : "border-white/15 bg-white/[0.04] text-zinc-300"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="size-4" aria-hidden="true" />
                                  ) : (
                                    missionNumber
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs uppercase tracking-widest text-zinc-500">
                                    Mission {missionNumber}
                                  </p>
                                  <h3 className="mt-1 text-lg font-semibold leading-6 text-white">
                                    {mission.shortTitle}
                                  </h3>
                                  <p className="mt-1 text-sm leading-6 text-zinc-400">
                                    {mission.artifact}
                                  </p>
                                  {runtime?.due_at ? (
                                    <p className="mt-1 text-xs text-zinc-500">
                                      Due {new Date(runtime.due_at).toLocaleString()}
                                    </p>
                                  ) : runtime?.deadline_state === "not_set" ? (
                                    <p className="mt-1 text-xs text-zinc-500">
                                      Deadline not set yet
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-start text-sm font-medium text-emerald-200 sm:self-center">
                                {isCompleted ? "Review" : "Open"}
                                <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {!isActive && (
                  <div className="mt-6 flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/25 p-4 text-sm text-zinc-400">
                    <Lock className="size-4 shrink-0 text-zinc-500" aria-hidden="true" />
                    This section will open after Build missions are ready.
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <Link
          href="/toolkit"
          className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Startup Toolkit
        </Link>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Protected>
      <DashboardInner />
    </Protected>
  );
}
