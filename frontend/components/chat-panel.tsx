"use client";

import { useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { streamChat } from "@/lib/sse";
import { ChatHistory, ChatMessage, Summary } from "@/lib/types";
import type { CourseId } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SummaryPanel } from "@/components/summary-panel";

const COPY = {
  en: { loadFailed: "Failed to load chat", summaryFailed: "Failed to generate summary", title: "AI mentor", description: "Specialized for this mission. History is saved.", defaultQuestion: "How can I help you with this mission?", you: "You", mentor: "Mentor", placeholder: "Type a message… (Cmd/Ctrl+Enter to send)", sending: "Sending…", send: "Send", generating: "Generating summary…", regenerate: "Regenerate summary", generate: "Generate summary", summaryHelp: "Get a structured readout based on the conversation." },
  ru: { loadFailed: "Не удалось загрузить чат", summaryFailed: "Не удалось создать сводку", title: "AI-наставник", description: "Помогает с этой миссией. История сохраняется.", defaultQuestion: "Чем помочь с этой миссией?", you: "Вы", mentor: "Наставник", placeholder: "Введите сообщение… (Cmd/Ctrl+Enter для отправки)", sending: "Отправка…", send: "Отправить", generating: "Создание сводки…", regenerate: "Обновить сводку", generate: "Создать сводку", summaryHelp: "Получите структурированную сводку разговора." },
} as const;

export function ChatPanel({ slug, openingQuestion, language = "en" }: { slug: string; openingQuestion?: string; language?: CourseId }) {
  const copy = COPY[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryAvailable, setSummaryAvailable] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const history = await api<ChatHistory>(`/modules/${slug}/chat`);
        if (cancelled) return;
        setMessages(history.messages.filter((m) => m.role !== "system"));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : copy.loadFailed);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, copy.loadFailed]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await api<Summary>(`/modules/${slug}/chat/summary`);
        if (cancelled) return;
        setSummary(s);
        setSummaryAvailable(true);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setSummaryAvailable(true);
          } else {
            setSummaryAvailable(false);
          }
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setError(null);
    setInput("");
    setStreaming(true);
    const now = new Date().toISOString();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, created_at: now },
      { role: "assistant", content: "", created_at: now },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for await (const ev of streamChat(slug, text, controller.signal)) {
        if (ev.type === "delta") {
          setMessages((prev) => {
            const next = prev.slice();
            const last = next[next.length - 1];
            if (last && last.role === "assistant") {
              next[next.length - 1] = {
                ...last,
                content: last.content + ev.content,
              };
            }
            return next;
          });
        } else if (ev.type === "error") {
          setError(ev.message);
          break;
        } else if (ev.type === "done") {
          break;
        }
      }
    } catch {
      // aborted or network — ignore
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const generateSummary = async () => {
    setGeneratingSummary(true);
    setError(null);
    try {
      const s = await api<Summary>(`/modules/${slug}/chat/summary`, {
        method: "POST",
      });
      setSummary(s);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : copy.summaryFailed);
    } finally {
      setGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{copy.title}</CardTitle>
          <CardDescription>
            {copy.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            ref={scrollRef}
            className="h-[50vh] min-h-[16rem] max-h-[32rem] overflow-y-auto rounded-md border border-border bg-muted/30 p-4"
          >
            {messages.length === 0 && !streaming && (
              <p className="text-sm text-muted-foreground">
                {openingQuestion ?? copy.defaultQuestion}
              </p>
            )}
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-8 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "mr-8 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  }
                >
                  <div className="mb-1 text-xs uppercase tracking-wide opacity-60">
                    {m.role === "user" ? copy.you : copy.mentor}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {m.content}
                    {streaming && i === messages.length - 1 && m.role === "assistant" && (
                      <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-foreground/60 align-middle" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={copy.placeholder}
              className="min-h-[80px]"
              disabled={streaming}
            />
            <Button onClick={send} disabled={streaming || !input.trim()}>
              {streaming ? copy.sending : copy.send}
            </Button>
          </div>

          {summaryAvailable && (
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={generateSummary}
                disabled={generatingSummary || messages.length === 0}
              >
                {generatingSummary
                  ? copy.generating
                  : summary
                  ? copy.regenerate
                  : copy.generate}
              </Button>
              <p className="text-xs text-muted-foreground">
                {copy.summaryHelp}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {summary && (
        <SummaryPanel
          summary={summary.summary}
          generatedAt={summary.generated_at}
          language={language}
        />
      )}
    </div>
  );
}
