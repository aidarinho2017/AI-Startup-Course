"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ModuleDetail } from "@/lib/types";
import { Protected } from "@/components/protected";
import { Topbar } from "@/components/topbar";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { ChatPanel } from "@/components/chat-panel";
import { SubmissionForm } from "@/components/submission-form";
import { Badge } from "@/components/ui/badge";

const MENTOR_QUESTIONS: Record<string, string> = {
  "deciding-to-start":
    "Are you building this because you're genuinely passionate about the problem — or because it seems like a good opportunity?",
  "startup-ideas":
    "Tell me your startup idea in one sentence. Who has this problem, and how do you know?",
  "founding-team":
    "What's the one skill gap in yourself that your co-founder absolutely must cover?",
  "mvp-building":
    "What's the single assumption your MVP needs to prove? What would make you abandon the idea?",
  "growth-monetization":
    "How are users finding your product right now, and which channel has surprised you most?",
};

function ModuleInner({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery<ModuleDetail>({
    queryKey: ["module", slug],
    queryFn: () => api<ModuleDetail>(`/modules/${slug}`),
  });

  return (
    <div>
      <Topbar />
      <main className="px-4 sm:px-8 py-6 sm:py-10">
        <Link
          href="/dashboard"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Back to dashboard
        </Link>

        {isLoading && (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        )}
        {error && (
          <p className="mt-10 text-sm text-destructive">
            Failed to load this module.
          </p>
        )}

        {data && (
          <>
            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Module {data.order_index}
                </p>
                {data.is_completed && (
                  <Badge variant="success">Completed</Badge>
                )}
                {data.due_at ? (
                  <Badge variant="outline">
                    Due {new Date(data.due_at).toLocaleString()}
                  </Badge>
                ) : data.deadline_state === "not_set" ? (
                  <Badge variant="outline">Deadline not set yet</Badge>
                ) : null}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {data.title}
              </h1>
              <p className="text-muted-foreground">{data.description}</p>
            </div>

            <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
              {/* Left column: videos + homework */}
              <div className="flex-1 min-w-0 space-y-10">
                {data.videos.length > 0 && (
                  <section className="space-y-4">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      Videos
                    </h2>
                    <div className="space-y-6">
                      {data.videos
                        .slice()
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((v) => (
                          <YouTubeEmbed
                            key={v.youtube_id}
                            youtubeId={v.youtube_id}
                            title={v.title}
                          />
                        ))}
                    </div>
                  </section>
                )}

                {data.submission_fields.length > 0 && (
                  <section>
                    <SubmissionForm
                      slug={data.slug}
                      fields={data.submission_fields}
                    />
                  </section>
                )}
              </div>

              {/* Right column: AI mentor */}
              {data.has_chatbot && (
                <div className="w-full lg:w-[30rem] lg:shrink-0 lg:sticky lg:top-6 lg:self-start">
                  <ChatPanel
                    slug={data.slug}
                    openingQuestion={MENTOR_QUESTIONS[data.slug]}
                  />
                </div>
              )}
            </div>
          </>
        )}
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
