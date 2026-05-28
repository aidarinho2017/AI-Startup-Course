import { API_URL, getToken } from "@/lib/api";

export type SseEvent =
  | { type: "delta"; content: string }
  | { type: "done" }
  | { type: "error"; message: string };

export async function* streamChat(
  slug: string,
  message: string,
  signal?: AbortSignal
): AsyncGenerator<SseEvent> {
  const token = getToken();
  const res = await fetch(`${API_URL}/modules/${slug}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
    signal,
  });
  if (!res.ok || !res.body) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      /* ignore */
    }
    yield { type: "error", message: detail };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const dataLine = frame
        .split("\n")
        .find((l) => l.startsWith("data: "));
      if (!dataLine) continue;
      const payload = dataLine.slice("data: ".length);
      if (payload === "[DONE]") {
        yield { type: "done" };
        return;
      }
      try {
        const obj = JSON.parse(payload);
        if (obj.delta) yield { type: "delta", content: obj.delta };
        else if (obj.error) yield { type: "error", message: obj.error };
      } catch {
        /* ignore malformed frames */
      }
    }
  }
  yield { type: "done" };
}
