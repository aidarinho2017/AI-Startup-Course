"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { Submission, SubmissionFieldSpec } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SubmissionForm({
  slug,
  fields,
}: {
  slug: string;
  fields: SubmissionFieldSpec[];
}) {
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, ""]))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sub = await api<Submission>(`/modules/${slug}/submission`);
        if (cancelled) return;
        setValues((prev) => {
          const next = { ...prev };
          for (const f of fields) {
            const v = sub.content?.[f.key];
            if (typeof v === "string") next[f.key] = v;
          }
          return next;
        });
        setSavedAt(sub.updated_at);
      } catch (err) {
        if (cancelled) return;
        if (!(err instanceof ApiError && err.status === 404)) {
          setError(err instanceof ApiError ? err.message : "Failed to load");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, fields]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const sub = await api<Submission>(`/modules/${slug}/submission`, {
        method: "PUT",
        body: JSON.stringify({ content: values }),
      });
      setSavedAt(sub.updated_at);
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      qc.invalidateQueries({ queryKey: ["module", slug] });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>Homework</CardTitle>
            <CardDescription>
              Submit your artifacts to complete this module.
            </CardDescription>
          </div>
          {savedAt && <Badge variant="success">Submitted</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            {fields.map((f) => (
              <div key={f.key} className="space-y-2">
                <Label htmlFor={f.key}>
                  {f.label}
                  {f.required && (
                    <span className="ml-1 text-destructive">*</span>
                  )}
                </Label>
                {f.type === "textarea" ? (
                  <Textarea
                    id={f.key}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    }
                  />
                ) : (
                  <Input
                    id={f.key}
                    type={f.type === "url" ? "url" : "text"}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={values[f.key] ?? ""}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, [f.key]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : savedAt ? "Update submission" : "Submit"}
              </Button>
              {savedAt && (
                <p className="text-xs text-muted-foreground">
                  Last saved {new Date(savedAt).toLocaleString()}
                </p>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
