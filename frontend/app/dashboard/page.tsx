"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardOut } from "@/lib/types";
import { Protected } from "@/components/protected";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function DashboardInner() {
  const { data, isLoading, error } = useQuery<DashboardOut>({
    queryKey: ["dashboard"],
    queryFn: () => api<DashboardOut>("/dashboard"),
  });

  return (
    <div>
      <Topbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Your course
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Six modules. Build, submit, ship.
          </p>
        </div>

        {isLoading && (
          <p className="mt-10 text-sm text-muted-foreground">Loading…</p>
        )}
        {error && (
          <p className="mt-10 text-sm text-destructive">
            Failed to load dashboard.
          </p>
        )}

        {data && (
          <>
            <div className="mt-8 rounded-lg border border-border p-5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="text-xl font-semibold">
                    {data.completed} of {data.total} modules complete
                  </div>
                </div>
                <div className="text-2xl font-semibold tabular-nums">
                  {data.progress_pct}%
                </div>
              </div>
              <Progress value={data.progress_pct} />
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.modules
                .slice()
                .sort((a, b) => a.order_index - b.order_index)
                .map((m) => (
                  <Link key={m.slug} href={`/modules/${m.slug}`}>
                    <Card className="h-full transition-colors hover:bg-accent">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Module {m.order_index}
                            </div>
                            <CardTitle className="mt-1">{m.title}</CardTitle>
                          </div>
                          {m.is_completed && (
                            <Badge variant="success">Completed</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-2">
                          {m.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">
                          {m.has_chatbot ? "AI mentor • Homework" : "Homework"}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </>
        )}
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
