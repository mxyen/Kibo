import { NextResponse } from "next/server";

/**
 * Server-only Gemma 4 (Gemini API) proxy.
 *
 * GEMINI_API_KEY is read here, on the server, and never sent to the browser —
 * client code (services/gemma.ts) only ever talks to this same-origin route.
 */

export const runtime = "nodejs";

type GemmaMessage = { role: "user" | "assistant" | "system"; content: string };
type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

// "gemma-4" is the marketing name; the real model IDs on the Generative
// Language API are versioned (e.g. gemma-4-31b-it). Alias so either works.
const MODEL_ALIASES: Record<string, string> = {
  "gemma-4": "gemma-4-31b-it",
};
const requestedModel = process.env.GEMINI_MODEL ?? "gemma-4-31b-it";
const GEMINI_MODEL = MODEL_ALIASES[requestedModel] ?? requestedModel;

function toGeminiContents(messages: GemmaMessage[]): {
  contents: GeminiContent[];
  systemInstruction: string | null;
} {
  const systemMessages = messages.filter((m) => m.role === "system");
  const chatMessages = messages.filter((m) => m.role !== "system");
  const systemInstruction =
    systemMessages.length > 0 ? systemMessages.map((m) => m.content).join("\n") : null;
  const contents: GeminiContent[] = chatMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  return { contents, systemInstruction };
}

export async function POST(req: Request) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY no configurada en el servidor." },
      { status: 503 },
    );
  }

  const { messages, jsonMode } = (await req.json()) as {
    messages: GemmaMessage[];
    jsonMode?: boolean;
  };

  const { contents, systemInstruction } = toGeminiContents(messages);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body: Record<string, unknown> = {
    contents,
    generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 2048 },
  };
  if (systemInstruction) body.systemInstruction = { parts: [{ text: systemInstruction }] };
  if (jsonMode) (body.generationConfig as Record<string, unknown>).responseMimeType = "application/json";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[api/gemma] Gemini API error ${response.status}: ${errorText}`);
      return NextResponse.json(
        { error: `Gemini API error ${response.status}`, details: errorText },
        { status: 502 },
      );
    }

    const data = await response.json();
    // Gemma 4 emits its reasoning as separate parts marked `thought: true`
    // ahead of the real answer — only the non-thought parts are the reply.
    const parts: { text?: string; thought?: boolean }[] = data.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("")
      .trim();
    return NextResponse.json({ text });
  } catch (err) {
    console.error("[api/gemma] Request failed:", err);
    return NextResponse.json({ error: "No se pudo contactar a Gemini." }, { status: 502 });
  }
}
