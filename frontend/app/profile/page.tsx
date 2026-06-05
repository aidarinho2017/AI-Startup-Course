"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { Profile, StudyGroup } from "@/lib/types";
import { Protected } from "@/components/protected";
import { Topbar } from "@/components/topbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function ProfileInner() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: () => api<Profile>("/profile"),
  });
  const { data: groups } = useQuery<StudyGroup[]>({
    queryKey: ["study-groups"],
    queryFn: () => api<StudyGroup[]>("/study-groups"),
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dream, setDream] = useState("");
  const [studyGroupId, setStudyGroupId] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setDream(profile.dream ?? "");
    setStudyGroupId(profile.study_group ? String(profile.study_group.id) : "");
  }, [profile]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      api<Profile>("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          dream,
          study_group_id: studyGroupId ? Number(studyGroupId) : null,
        }),
      }),
    onSuccess: () => {
      setActionError(null);
      setMessage("Profile saved");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => {
      setMessage(null);
      setActionError(err instanceof ApiError ? err.message : "Failed to save profile");
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setActionError(null);
    mutate();
  };

  return (
    <div>
      <Topbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Account</p>
          <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        </div>

        {isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="mt-10 text-sm text-destructive">Failed to load profile.</p>}

        {profile && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Student details</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First name</Label>
                    <Input
                      id="first_name"
                      value={firstName}
                      onChange={(event) => setFirstName(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last name</Label>
                    <Input
                      id="last_name"
                      value={lastName}
                      onChange={(event) => setLastName(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dream">Dream</Label>
                  <Textarea
                    id="dream"
                    value={dream}
                    onChange={(event) => setDream(event.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="study_group">Study group</Label>
                  <select
                    id="study_group"
                    value={studyGroupId}
                    onChange={(event) => setStudyGroupId(event.target.value)}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                  >
                    <option value="">No group selected</option>
                    {(groups ?? []).map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {groups && groups.length === 0 && (
                    <p className="text-xs text-muted-foreground">No study groups yet.</p>
                  )}
                </div>

                {message && <p className="text-sm text-emerald-700">{message}</p>}
                {actionError && <p className="text-sm text-destructive">{actionError}</p>}

                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving…" : "Save profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Protected>
      <ProfileInner />
    </Protected>
  );
}
