import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { CourseId } from "@/lib/course";

function humanize(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (typeof value === "string") {
    return <p className="whitespace-pre-wrap text-sm">{value}</p>;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return <span className="text-sm font-medium">{String(value)}</span>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-sm text-muted-foreground">None</span>;
    }
    return (
      <ul className="ml-5 list-disc space-y-1 text-sm">
        {value.map((v, i) => (
          <li key={i}>
            {typeof v === "string" || typeof v === "number" || typeof v === "boolean"
              ? String(v)
              : renderValue(v)}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof value === "object") {
    return (
      <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {humanize(k)}
            </div>
            <div>{renderValue(v)}</div>
          </div>
        ))}
      </div>
    );
  }
  return <span className="text-sm">{String(value)}</span>;
}

export function SummaryPanel({
  summary,
  generatedAt,
  language = "en",
}: {
  summary: Record<string, unknown>;
  generatedAt: string;
  language?: CourseId;
}) {
  const entries = Object.entries(summary);
  const copy = {
    en: { title: "AI summary", generated: "Generated", empty: "Empty summary.", locale: "en-US" },
    ru: { title: "Сводка ИИ", generated: "Создано", empty: "Сводка пуста.", locale: "ru-RU" },
    kk: { title: "AI қорытындысы", generated: "Жасалды", empty: "Қорытынды бос.", locale: "kk-KZ" },
  }[language];
  return (
    <Card>
      <CardHeader>
        <CardTitle>{copy.title}</CardTitle>
        <CardDescription>
          {copy.generated} {new Date(generatedAt).toLocaleString(copy.locale)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground">{copy.empty}</p>
        )}
        {entries.map(([k, v]) => (
          <div key={k} className="space-y-1">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {humanize(k)}
            </div>
            <div>{renderValue(v)}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
