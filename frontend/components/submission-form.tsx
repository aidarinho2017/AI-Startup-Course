"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Submission, SubmissionFieldSpec } from "@/lib/types";
import type { CourseId } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HomeworkRubric } from "@/components/homework-rubric";

function parseLinkListValue(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((link): link is string => typeof link === "string");
    }
  } catch {
    return [value];
  }
  return [];
}

function serializeLinkListValue(links: string[]): string {
  return JSON.stringify(links);
}

const COPY = {
  en: { loadFailed: "Failed to load", saveFailed: "Failed to save", title: "Homework", rubric: "Before submitting, check", submitted: "Submitted", loading: "Loading…", remove: "Remove", add: "Add account", saving: "Saving…", update: "Update submission", submit: "Submit", saved: "Last saved" },
  ru: { loadFailed: "Не удалось загрузить", saveFailed: "Не удалось сохранить", title: "Задание", rubric: "Перед отправкой проверьте", submitted: "Отправлено", loading: "Загрузка…", remove: "Удалить", add: "Добавить аккаунт", saving: "Сохранение…", update: "Обновить ответ", submit: "Отправить", saved: "Сохранено" },
} as const;

export function SubmissionForm({
  slug,
  fields,
  instructions,
  rubric,
  language = "en",
}: {
  slug: string;
  fields: SubmissionFieldSpec[];
  instructions: string;
  rubric: string[];
  language?: CourseId;
}) {
  const copy = COPY[language];
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
          setError(err instanceof ApiError ? err.message : copy.loadFailed);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, fields, copy.loadFailed]);

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
      setError(err instanceof ApiError ? err.message : copy.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  const updateLinkList = (key: string, links: string[]) => {
    setValues((current) => ({
      ...current,
      [key]: serializeLinkListValue(links),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription>
              {instructions}
            </CardDescription>
          </div>
          {savedAt && <Badge variant="success">{copy.submitted}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <HomeworkRubric title={copy.rubric} items={rubric} />
        {loading ? (
          <p className="text-sm text-muted-foreground">{copy.loading}</p>
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
                {f.type === "link_list" ? (
                  <div className="space-y-3">
                    {(() => {
                      const links = parseLinkListValue(values[f.key]);
                      const rows = links.length > 0 ? links : [""];
                      return (
                        <>
                          {rows.map((link, index) => (
                            <div key={`${f.key}-${index}`} className="flex gap-2">
                              <Input
                                id={index === 0 ? f.key : undefined}
                                type="url"
                                required={
                                  f.required &&
                                  index === 0 &&
                                  rows.every((row) => !row.trim())
                                }
                                placeholder={f.placeholder}
                                value={link}
                                onChange={(e) => {
                                  const next = [...rows];
                                  next[index] = e.target.value;
                                  updateLinkList(f.key, next);
                                }}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 shrink-0 px-0"
                                aria-label={`${copy.remove} ${f.label.toLowerCase()} ${index + 1}`}
                                onClick={() => {
                                  const next = rows.filter((_, rowIndex) => rowIndex !== index);
                                  updateLinkList(f.key, next.length > 0 ? next : [""]);
                                }}
                                disabled={rows.length === 1 && !link}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => updateLinkList(f.key, [...rows, ""])}
                          >
                            <Plus className="size-4" aria-hidden="true" />
                            {copy.add}
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                ) : f.type === "textarea" ? (
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
                {saving ? copy.saving : savedAt ? copy.update : copy.submit}
              </Button>
              {savedAt && (
                <p className="text-xs text-muted-foreground">
                  {copy.saved} {new Date(savedAt).toLocaleString(language === "ru" ? "ru-RU" : "en-US")}
                </p>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
