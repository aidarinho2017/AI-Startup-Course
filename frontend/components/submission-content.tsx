import { ExternalLink } from "lucide-react";

function parseSubmittedLinks(value: string): string[] | null {
  try {
    const parsed = JSON.parse(value);
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(
        (link) =>
          typeof link === "string" &&
          (link.startsWith("http://") || link.startsWith("https://"))
      )
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function SubmissionValue({ value }: { value: string }) {
  const links = parseSubmittedLinks(value);

  if (links) {
    return (
      <div className="mt-1 flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link}
            href={link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-9 items-center gap-2 break-all rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            {link}
            <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          </a>
        ))}
      </div>
    );
  }

  return (
    <p className="mt-0.5 whitespace-pre-wrap text-sm">
      {value || <span className="italic opacity-50">empty</span>}
    </p>
  );
}

export function SubmissionContent({
  content,
}: {
  content: Record<string, string>;
}) {
  return (
    <div className="space-y-2 rounded-md border border-border bg-muted/30 p-4">
      {Object.entries(content).map(([key, value]) => (
        <div key={key}>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {key}
          </p>
          <SubmissionValue value={value} />
        </div>
      ))}
    </div>
  );
}
