"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Copy, ExternalLink, RefreshCw, Send, Unlink } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { TelegramLinkCode, TelegramStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TelegramLinkPanel() {
  const { data, isLoading, error, refetch } = useQuery<TelegramStatus>({
    queryKey: ["telegram-status"],
    queryFn: () => api<TelegramStatus>("/telegram/status"),
  });
  const [linkCode, setLinkCode] = useState<TelegramLinkCode | null>(null);
  const [generating, setGenerating] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const [actionError, setActionError] = useState<string | null>(null);

  const generateCode = async () => {
    setGenerating(true);
    setActionError(null);
    try {
      const result = await api<TelegramLinkCode>("/telegram/link-code", {
        method: "POST",
      });
      setLinkCode(result);
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to generate code");
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = async () => {
    if (!linkCode) return;
    try {
      await navigator.clipboard.writeText(linkCode.code);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy"), 1500);
    } catch {
      setActionError("Could not copy code");
    }
  };

  const openBot = () => {
    if (linkCode?.start_url) {
      window.open(linkCode.start_url, "_blank", "noopener,noreferrer");
    }
  };

  const unlinkTelegram = async () => {
    setUnlinking(true);
    setActionError(null);
    try {
      await api<TelegramStatus>("/telegram/unlink", { method: "POST" });
      setLinkCode(null);
      await refetch();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Failed to unlink Telegram");
    } finally {
      setUnlinking(false);
    }
  };

  const expiresAt = linkCode
    ? new Date(linkCode.expires_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Telegram reminders</CardTitle>
            <CardDescription>
              {data?.is_linked
                ? "Linked for this course account."
                : "Connect your Telegram chat for course notifications."}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {data?.is_linked ? (
              <Badge variant="success">Linked</Badge>
            ) : data?.is_configured ? (
              <Badge variant="outline">Not linked</Badge>
            ) : (
              <Badge variant="outline">Unavailable</Badge>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0"
              onClick={() => refetch()}
              title="Refresh Telegram status"
              aria-label="Refresh Telegram status"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && (
          <p className="text-sm text-destructive">Failed to load Telegram status.</p>
        )}

        {data && !data.is_configured && (
          <p className="text-sm text-muted-foreground">Telegram bot settings are not configured.</p>
        )}

        {data?.is_linked && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {data.linked_at
                ? `Linked ${new Date(data.linked_at).toLocaleString()}`
                : "Linked"}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={unlinkTelegram}
              disabled={unlinking}
            >
              <Unlink className="h-4 w-4" />
              {unlinking ? "Unlinking…" : "Unlink"}
            </Button>
          </div>
        )}

        {data?.is_configured && !data.is_linked && (
          <div className="space-y-4">
            <Button type="button" onClick={generateCode} disabled={generating}>
              <Send className="h-4 w-4" />
              {generating ? "Generating…" : "Generate code"}
            </Button>

            {linkCode && (
              <div className="rounded-md border border-border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">
                      Link code
                    </div>
                    <div className="mt-1 font-mono text-2xl font-semibold tracking-normal">
                      {linkCode.code}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={copyCode}>
                      <Copy className="h-4 w-4" />
                      {copyLabel}
                    </Button>
                    {linkCode.start_url && (
                      <Button type="button" variant="outline" size="sm" onClick={openBot}>
                        <ExternalLink className="h-4 w-4" />
                        Open bot
                      </Button>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Send this code to the Telegram bot{expiresAt ? ` before ${expiresAt}.` : "."}
                </p>
              </div>
            )}
          </div>
        )}

        {actionError && <p className="text-sm text-destructive">{actionError}</p>}
      </CardContent>
    </Card>
  );
}
