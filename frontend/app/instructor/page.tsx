"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { InstructorModule } from "@/lib/types";
import { InstructorOnly } from "@/components/instructor-only";
import { Topbar } from "@/components/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function InstructorDashboardInner() {
  const { data, isLoading, error } = useQuery<InstructorModule[]>({
    queryKey: ["instructor-modules"],
    queryFn: () => api<InstructorModule[]>("/instructor/modules"),
  });

  return (
    <div>
      <Topbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Instructor Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Select a module to review student submissions.</p>

        {isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="mt-10 text-sm text-destructive">Failed to load modules.</p>}

        {data && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {data.map((m) => (
              <Link key={m.slug} href={`/instructor/${m.slug}`}>
                <Card className="cursor-pointer transition-colors hover:border-foreground/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        Module {m.order_index}
                      </p>
                      <Badge variant={m.submission_count > 0 ? "default" : "outline"}>
                        {m.submission_count} submission{m.submission_count !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                    <CardTitle className="text-base">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function InstructorPage() {
  return (
    <InstructorOnly>
      <InstructorDashboardInner />
    </InstructorOnly>
  );
}
