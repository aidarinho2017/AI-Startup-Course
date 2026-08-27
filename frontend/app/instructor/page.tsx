"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import {
  InstructorModule,
  InstructorStudentSubmissions,
  InstructorStudentSummary,
  InstructorStudyGroup,
  InstructorSubmission,
} from "@/lib/types";
import { InstructorOnly } from "@/components/instructor-only";
import { SubmissionContent } from "@/components/submission-content";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type View = "modules" | "students" | "groups";
const COURSE_LABEL = { en: "English Course", ru: "Russian Course" } as const;
const courseIdForSlug = (slug: string) => slug.startsWith("ru-") ? "ru" : "en";

function InstructorDashboardInner() {
  const [view, setView] = useState<View>("modules");

  return (
    <div>
      <Topbar />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Instructor</p>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={view === "modules" ? "default" : "outline"}
              onClick={() => setView("modules")}
            >
              Missions
            </Button>
            <Button
              type="button"
              variant={view === "students" ? "default" : "outline"}
              onClick={() => setView("students")}
            >
              Students
            </Button>
            <Button
              type="button"
              variant={view === "groups" ? "default" : "outline"}
              onClick={() => setView("groups")}
            >
              Groups
            </Button>
          </div>
        </div>

        {view === "modules" && <ModulesTab />}
        {view === "students" && <StudentsTab />}
        {view === "groups" && <GroupsTab />}
      </main>
    </div>
  );
}

function ModulesTab() {
  const { data, isLoading, error } = useQuery<InstructorModule[]>({
    queryKey: ["instructor-modules"],
    queryFn: () => api<InstructorModule[]>("/instructor/modules"),
  });

  return (
    <section className="mt-8">
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-destructive">Failed to load missions.</p>}

      {data && (
        <div className="space-y-8">
          {(["en", "ru"] as const).map((courseId) => (
            <div key={courseId}>
              <h2 className="mb-3 text-lg font-semibold">{COURSE_LABEL[courseId]}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.filter((module) => courseIdForSlug(module.slug) === courseId).map((m) => (
                  <Link key={m.slug} href={`/instructor/${m.slug}`}>
                    <Card className="h-full cursor-pointer transition-colors hover:border-foreground/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">Mission {m.order_index}</p>
                          <Badge variant={m.submission_count > 0 ? "default" : "outline"}>{m.submission_count} submission{m.submission_count !== 1 ? "s" : ""}</Badge>
                        </div>
                        <CardTitle className="text-base">{m.title}</CardTitle>
                      </CardHeader>
                      <CardContent />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function StudentsTab() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const { data, isLoading, error } = useQuery<InstructorStudentSummary[]>({
    queryKey: ["instructor-students"],
    queryFn: () => api<InstructorStudentSummary[]>("/instructor/students"),
  });
  const activeStudentId = selectedStudentId ?? data?.[0]?.id ?? null;

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
      <div className="space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-destructive">Failed to load students.</p>}
        {data?.length === 0 && <p className="text-sm text-muted-foreground">No students yet.</p>}
        {data?.map((student) => (
          <button
            key={student.id}
            type="button"
            onClick={() => setSelectedStudentId(student.id)}
            className="w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-foreground/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
              {activeStudentId === student.id && <Badge>Open</Badge>}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {student.course_progress.map((progress) => (
                <span key={progress.course_id}>{progress.course_id.toUpperCase()}: {progress.completed_count} / {progress.total_modules}</span>
              ))}
              <span>{student.unreviewed_count} unreviewed</span>
              {student.study_group && <span>{student.study_group.name}</span>}
            </div>
          </button>
        ))}
      </div>

      <StudentDetail studentId={activeStudentId} />
    </section>
  );
}

function StudentDetail({ studentId }: { studentId: string | null }) {
  const { data, isLoading, error } = useQuery<InstructorStudentSubmissions>({
    queryKey: ["instructor-student-submissions", studentId],
    queryFn: () => api<InstructorStudentSubmissions>(`/instructor/students/${studentId}/submissions`),
    enabled: Boolean(studentId),
  });

  if (!studentId) {
    return <p className="text-sm text-muted-foreground">Select a student.</p>;
  }
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading submissions…</p>;
  }
  if (error) {
    return <p className="text-sm text-destructive">Failed to load student submissions.</p>;
  }
  if (!data) return null;

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-border p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{data.student.name}</h2>
            <p className="text-sm text-muted-foreground">{data.student.email}</p>
            {data.student.study_group && (
              <p className="mt-1 text-sm text-muted-foreground">{data.student.study_group.name}</p>
            )}
          </div>
          <Badge variant={data.student.unreviewed_count > 0 ? "outline" : "success"}>
            {data.student.unreviewed_count} unreviewed
          </Badge>
        </div>
        {data.student.dream && (
          <p className="mt-4 whitespace-pre-wrap text-sm">{data.student.dream}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {data.student.course_progress.map((progress) => (
            <Badge key={progress.course_id} variant="outline">{COURSE_LABEL[progress.course_id]}: {progress.completed_count} / {progress.total_modules}</Badge>
          ))}
        </div>
      </div>

      {data.submissions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No submissions yet.</p>
      ) : (
        data.submissions.map((submission) => (
          <InstructorSubmissionCard key={submission.id} submission={submission} />
        ))
      )}
    </div>
  );
}

function InstructorSubmissionCard({ submission }: { submission: InstructorSubmission }) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(submission.instructor_feedback ?? "");
  const [reviewed, setReviewed] = useState(submission.is_reviewed);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFeedback(submission.instructor_feedback ?? "");
    setReviewed(submission.is_reviewed);
  }, [submission.id, submission.instructor_feedback, submission.is_reviewed]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api<InstructorSubmission>(`/instructor/submissions/${submission.id}`, {
        method: "PATCH",
        body: JSON.stringify({ instructor_feedback: feedback || null, is_reviewed: reviewed }),
      }),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["instructor-students"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-student-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["instructor-submissions"] });
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Failed to save feedback");
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">
              {submission.module
                ? `Mission ${submission.module.order_index}: ${submission.module.title}`
                : "Submission"}
            </CardTitle>
            {submission.module && <Badge variant="outline">{COURSE_LABEL[courseIdForSlug(submission.module.slug)]}</Badge>}
            <CardDescription>
              Submitted {new Date(submission.submitted_at).toLocaleString()}
            </CardDescription>
          </div>
          {submission.is_reviewed && <Badge variant="success">Reviewed</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SubmissionContent content={submission.content} />

        <div className="space-y-2">
          <Label htmlFor={`feedback-${submission.id}`}>Feedback</Label>
          <Textarea
            id={`feedback-${submission.id}`}
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reviewed}
              onChange={(event) => setReviewed(event.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Mark as reviewed
          </label>
          <Button size="sm" onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

function GroupsTab() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery<InstructorStudyGroup[]>({
    queryKey: ["instructor-groups"],
    queryFn: () => api<InstructorStudyGroup[]>("/instructor/groups"),
  });
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api<InstructorStudyGroup>("/instructor/groups", {
        method: "POST",
        body: JSON.stringify({ name: newName, description: newDescription || null }),
      }),
    onSuccess: () => {
      setNewName("");
      setNewDescription("");
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["instructor-groups"] });
      queryClient.invalidateQueries({ queryKey: ["study-groups"] });
    },
    onError: (err) => {
      setActionError(err instanceof ApiError ? err.message : "Failed to create group");
    },
  });

  return (
    <section className="mt-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create study group</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              mutate();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="new_group_name">Name</Label>
              <Input
                id="new_group_name"
                required
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_group_description">Description</Label>
              <Input
                id="new_group_description"
                value={newDescription}
                onChange={(event) => setNewDescription(event.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </form>
          {actionError && <p className="mt-3 text-sm text-destructive">{actionError}</p>}
        </CardContent>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">Loading groups…</p>}
      {error && <p className="text-sm text-destructive">Failed to load groups.</p>}
      {data?.length === 0 && <p className="text-sm text-muted-foreground">No groups yet.</p>}
      {data?.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </section>
  );
}

function GroupCard({ group }: { group: InstructorStudyGroup }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description ?? "");
  const [deadlineValues, setDeadlineValues] = useState<Record<string, string>>(
    () => Object.fromEntries(group.deadlines.map((item) => [item.module_slug, toDatetimeLocal(item.due_at)]))
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(group.name);
    setDescription(group.description ?? "");
    setDeadlineValues(
      Object.fromEntries(group.deadlines.map((item) => [item.module_slug, toDatetimeLocal(item.due_at)]))
    );
  }, [group]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await api<InstructorStudyGroup>(`/instructor/groups/${group.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, description: description || null }),
      });
      return api<InstructorStudyGroup>(`/instructor/groups/${group.id}/deadlines`, {
        method: "PUT",
        body: JSON.stringify({
          deadlines: group.deadlines.map((item) => ({
            module_slug: item.module_slug,
            due_at: fromDatetimeLocal(deadlineValues[item.module_slug] ?? ""),
          })),
        }),
      });
    },
    onSuccess: () => {
      setError(null);
      setMessage("Group saved");
      queryClient.invalidateQueries({ queryKey: ["instructor-groups"] });
      queryClient.invalidateQueries({ queryKey: ["study-groups"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      setMessage(null);
      setError(err instanceof ApiError ? err.message : "Failed to save group");
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{group.name}</CardTitle>
        <CardDescription>{group.deadlines.length} missions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`group-name-${group.id}`}>Name</Label>
            <Input
              id={`group-name-${group.id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`group-description-${group.id}`}>Description</Label>
            <Input
              id={`group-description-${group.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3">
          {group.deadlines.map((deadline) => (
            <div
              key={deadline.module_slug}
              className="grid gap-2 rounded-md border border-border p-3 sm:grid-cols-[1fr_15rem]"
            >
              <div>
                <Badge variant="outline" className="mb-2">{COURSE_LABEL[courseIdForSlug(deadline.module_slug)]}</Badge>
                <p className="text-sm font-medium">
                  Mission {deadline.module_order_index}: {deadline.module_title}
                </p>
                <p className="text-xs text-muted-foreground">{deadline.module_slug}</p>
              </div>
              <Input
                type="datetime-local"
                value={deadlineValues[deadline.module_slug] ?? ""}
                onChange={(event) =>
                  setDeadlineValues((values) => ({
                    ...values,
                    [deadline.module_slug]: event.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" onClick={() => mutate()} disabled={isPending}>
            {isPending ? "Saving…" : "Save group"}
          </Button>
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function toDatetimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function InstructorPage() {
  return (
    <InstructorOnly>
      <InstructorDashboardInner />
    </InstructorOnly>
  );
}
