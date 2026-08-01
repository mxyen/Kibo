/**
 * services/gemma.ts
 *
 * Single point of contact with the Gemma 4 model. Every screen that needs
 * AI output (teacher resource analysis, student chat/tutoring) must go
 * through the functions exported here — never call an AI endpoint directly
 * from a component.
 *
 * Configure via env vars:
 *   GEMMA_API_URL   - base URL of the Gemma 4 inference endpoint
 *   GEMMA_API_KEY   - auth key/token for that endpoint
 *
 * Until those are set, every function below falls back to a local
 * simulated response so the UI stays fully demoable offline. Swap in the
 * real HTTP call inside `callGemma()` once the official API is wired up —
 * every public function in this file already routes through it.
 */

const GEMMA_API_URL = process.env.NEXT_PUBLIC_GEMMA_API_URL ?? process.env.GEMMA_API_URL ?? "";
const GEMMA_API_KEY = process.env.GEMMA_API_KEY ?? "";

export type GemmaMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const TUTOR_SYSTEM_PROMPT =
  "Eres KIBO, un tutor de IA paciente impulsado por Gemma 4. Nunca das solo la respuesta final: " +
  "explicas el procedimiento paso a paso, con un tono cálido y motivador, adaptado al nivel del estudiante.";

function isConfigured() {
  return Boolean(GEMMA_API_URL && GEMMA_API_KEY);
}

/**
 * Low-level call to the Gemma 4 endpoint. Replace the fetch below with the
 * official request/response shape once credentials are available — callers
 * never need to change, since they only see the typed helpers further down.
 */
async function callGemma(messages: GemmaMessage[]): Promise<string> {
  if (!isConfigured()) {
    return simulateGemmaResponse(messages);
  }

  const response = await fetch(`${GEMMA_API_URL}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GEMMA_API_KEY}`,
    },
    body: JSON.stringify({ model: "gemma-4", messages }),
  });

  if (!response.ok) {
    throw new Error(`Gemma API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

function simulateGemmaResponse(messages: GemmaMessage[]): Promise<string> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const canned =
    `Buena pregunta. Vamos paso a paso con "${lastUserMessage.slice(0, 60)}${lastUserMessage.length > 60 ? "…" : ""}":\n\n` +
    "1. Identifiquemos qué datos tenemos.\n" +
    "2. Pensemos qué operación conecta esos datos con lo que buscamos.\n" +
    "3. Resolvamos el paso a paso juntos.\n\n" +
    "¿Quieres que lo veamos con un ejemplo visual?";
  return new Promise((resolve) => setTimeout(() => resolve(canned), 900));
}

/** Student-facing tutor chat. Always teaches the process, never just the answer. */
export async function chatWithGemma(history: GemmaMessage[]): Promise<string> {
  return callGemma([{ role: "system", content: TUTOR_SYSTEM_PROMPT }, ...history]);
}

/** Explains a graded activity/exercise step by step once the student answers. */
export async function explainActivityAnswer(params: {
  question: string;
  studentAnswer: string;
  correctAnswer: string;
}): Promise<string> {
  const prompt =
    `Pregunta: ${params.question}\n` +
    `Respuesta del estudiante: ${params.studentAnswer}\n` +
    `Respuesta correcta: ${params.correctAnswer}\n` +
    "Explica el procedimiento paso a paso, sin importar si el estudiante acertó o no.";
  return callGemma([
    { role: "system", content: TUTOR_SYSTEM_PROMPT },
    { role: "user", content: prompt },
  ]);
}

export type ResourceAnalysis = {
  topics: string[];
  level: string;
  estimatedTime: string;
  summary: string;
  keyConcepts: string[];
  suggestedQuestions: string[];
  suggestedExercises: string[];
};

/** Analyzes an uploaded teaching resource (PDF, slides, video, etc). */
export async function analyzeResource(fileName: string): Promise<ResourceAnalysis> {
  if (!isConfigured()) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            topics: ["Fracciones", "Álgebra", "Vectores"],
            level: "Secundaria",
            estimatedTime: "3 horas",
            summary: `Resumen generado a partir de "${fileName}": el documento cubre operaciones con fracciones, introducción al álgebra y fundamentos de vectores, con énfasis en ejemplos visuales.`,
            keyConcepts: [
              "Suma y resta de fracciones",
              "Ecuaciones de primer grado",
              "Magnitud y dirección de un vector",
            ],
            suggestedQuestions: [
              "¿Cómo se suman fracciones con distinto denominador?",
              "¿Qué representa gráficamente un vector?",
              "¿Cómo se despeja una incógnita en una ecuación simple?",
            ],
            suggestedExercises: [
              "Resolver 5 sumas de fracciones con denominadores distintos",
              "Graficar 3 vectores en el plano cartesiano",
              "Despejar x en 3 ecuaciones lineales",
            ],
          }),
        1600,
      ),
    );
  }

  const content = await callGemma([
    {
      role: "system",
      content:
        "Analiza el contenido educativo entregado y responde en JSON con: topics, level, estimatedTime, summary, keyConcepts, suggestedQuestions, suggestedExercises.",
    },
    { role: "user", content: `Archivo: ${fileName}` },
  ]);

  return JSON.parse(content) as ResourceAnalysis;
}

export type GeneratedArtifact = { title: string; content: string };

/** Generates a quiz / summary / lesson plan / flashcards from an analyzed resource. */
export async function generateFromResource(
  kind: "quiz" | "resumen" | "clase" | "flashcards",
  context: ResourceAnalysis,
): Promise<GeneratedArtifact> {
  if (!isConfigured()) {
    const canned: Record<typeof kind, GeneratedArtifact> = {
      quiz: {
        title: "Quiz generado",
        content: context.suggestedQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n"),
      },
      resumen: { title: "Resumen generado", content: context.summary },
      clase: {
        title: "Plan de clase generado",
        content:
          `Objetivo: reforzar ${context.topics.join(", ")}.\n` +
          `Duración estimada: ${context.estimatedTime}.\n` +
          "Actividad de apertura, desarrollo con ejemplos visuales y cierre con quiz rápido.",
      },
      flashcards: {
        title: "Flashcards generadas",
        content: context.keyConcepts.map((c) => `• ${c}`).join("\n"),
      },
    };
    return new Promise((resolve) => setTimeout(() => resolve(canned[kind]), 1100));
  }

  const content = await callGemma([
    { role: "system", content: `Genera un(a) ${kind} a partir de este análisis de contenido.` },
    { role: "user", content: JSON.stringify(context) },
  ]);
  return { title: kind, content };
}
