"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { InstructorSubmission } from "@/lib/types";
import { InstructorOnly } from "@/components/instructor-only";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function SubmissionCard({ sub, moduleSlug }: { sub: InstructorSubmission; moduleSlug: string }) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(sub.instructor_feedback ?? "");
  const [reviewed, setReviewed] = useState(sub.is_reviewed);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api<InstructorSubmission>(`/instructor/submissions/${sub.id}`, {
        method: "PATCH",
        body: JSON.stringify({ instructor_feedback: feedback || null, is_reviewed: reviewed }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["instructor-submissions", moduleSlug] });
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{sub.student.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{sub.student.email}</p>
          </div>
          {sub.is_reviewed && <Badge variant="success">Reviewed</Badge>}
        </div>
        <p className="text-xs text-muted-foreground">
          Submitted {new Date(sub.submitted_at).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-md border border-border bg-muted/30 p-4">
          {Object.entries(sub.content).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{key}</p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm">{value || <span className="italic opacity-50">empty</span>}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Feedback
          </label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Leave feedback for this student…"
            className="min-h-[80px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(e) => setReviewed(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Mark as reviewed
          </label>
          <Button size="sm" onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleSubmissionsInner({ slug }: { slug: string }) {
  const { data, isLoading, error } = useQuery<InstructorSubmission[]>({
    queryKey: ["instructor-submissions", slug],
    queryFn: () => api<InstructorSubmission[]>(`/instructor/modules/${slug}/submissions`),
  });

  return (
    <div>
      <Topbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/instructor"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          ← Back to modules
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight capitalize">
          {slug.replace(/-/g, " ")} — Submissions
        </h1>

        {isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="mt-10 text-sm text-destructive">Failed to load submissions.</p>}

        {data && data.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">No submissions yet for this module.</p>
        )}

        {data && data.length > 0 && (
          <div className="mt-8 space-y-6">
            <p className="text-sm text-muted-foreground">{data.length} submission{data.length !== 1 ? "s" : ""}</p>
            {data.map((sub) => (
              <SubmissionCard key={sub.id} sub={sub} moduleSlug={slug} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ModuleSubmissionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <InstructorOnly>
      <ModuleSubmissionsInner slug={slug} />
    </InstructorOnly>
  );
}
