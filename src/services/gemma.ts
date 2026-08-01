/**
 * services/gemma.ts
 *
 * Single point of contact with the Gemma 4 model via Google AI Studio (Gemini API).
 * Every screen that needs AI output (teacher resource analysis, student chat/tutoring)
 * must go through the functions exported here — never call an AI endpoint directly
 * from a component.
 *
 * Configure via env vars:
 *   GEMINI_API_KEY  - API key from Google AI Studio (https://aistudio.google.com/apikey)
 *   GEMINI_MODEL    - Model name (default: "gemma-4")
 *
 * Until GEMINI_API_KEY is set, every function falls back to a local simulated
 * response so the UI stays fully demoable offline.
 */

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? process.env.GEMINI_API_KEY ?? "";
const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL ?? process.env.GEMINI_MODEL ?? "gemma-4";

export type GemmaMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const TUTOR_SYSTEM_PROMPT =
  "Eres KIBO, un tutor de IA paciente impulsado por Gemma 4. Nunca das solo la respuesta final: " +
  "explicas el procedimiento paso a paso, con un tono cálido y motivador, adaptado al nivel del estudiante.";

function isConfigured() {
  return Boolean(GEMINI_API_KEY);
}

// ---------------------------------------------------------------------------
// Gemini API helpers
// ---------------------------------------------------------------------------

type GeminiContent = {
  role: "user" | "model";
  parts: { text: string }[];
};

/** Converts our internal GemmaMessage[] to Gemini's contents[] format.
 *  System messages are extracted — Gemini handles them separately as systemInstruction. */
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

/**
 * Low-level call to the Gemma 4 model through Google AI Studio (Gemini API).
 * Replace the fetch below if the endpoint/auth shape changes — callers never
 * need to change, since they only see the typed helpers further down.
 */
async function callGemma(messages: GemmaMessage[], requestJson = false): Promise<string> {
  if (!isConfigured()) {
    return simulateGemmaResponse(messages);
  }

  const { contents, systemInstruction } = toGeminiContents(messages);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  if (requestJson) {
    (body.generationConfig as Record<string, unknown>).responseMimeType = "application/json";
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// ---------------------------------------------------------------------------
// Simulated fallback (no API key configured)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Public API — consumed by all UI components
// ---------------------------------------------------------------------------

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

/** Analyzes an uploaded teaching resource (PDF, slides, video, etc).
 *  When connected to Gemma 4, the model returns structured JSON. */
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

  const jsonSchema = JSON.stringify({
    type: "object",
    properties: {
      topics: { type: "array", items: { type: "string" }, description: "Temas principales del documento" },
      level: { type: "string", description: "Nivel educativo: Primaria, Secundaria, Preparatoria, Universidad" },
      estimatedTime: { type: "string", description: "Tiempo estimado para cubrir el contenido, ej: '3 horas'" },
      summary: { type: "string", description: "Resumen del contenido en 2-3 oraciones" },
      keyConcepts: { type: "array", items: { type: "string" }, description: "Conceptos clave encontrados" },
      suggestedQuestions: { type: "array", items: { type: "string" }, description: "Preguntas sugeridas para evaluar comprensión" },
      suggestedExercises: { type: "array", items: { type: "string" }, description: "Ejercicios sugeridos" },
    },
    required: ["topics", "level", "estimatedTime", "summary", "keyConcepts", "suggestedQuestions", "suggestedExercises"],
  });

  const content = await callGemma(
    [
      {
        role: "system",
        content:
          "Eres un analista de contenido educativo. Responde ÚNICAMENTE con un objeto JSON válido que siga este esquema:\n" +
          jsonSchema +
          "\n\nNo incluyas markdown, explicaciones ni texto fuera del JSON.",
      },
      {
        role: "user",
        content:
          `Analiza el siguiente documento educativo: "${fileName}". ` +
          "Devuelve un JSON con los temas, nivel, tiempo estimado, resumen, conceptos clave, preguntas sugeridas y ejercicios sugeridos.",
      },
    ],
    true, // requestJson
  );

  try {
    // Clean up potential markdown fences
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleaned) as ResourceAnalysis;
  } catch {
    throw new Error("Gemma 4 no devolvió un JSON válido para el análisis del recurso.");
  }
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
    { role: "system", content: `Genera un(a) ${kind} a partir de este análisis de contenido educativo. Responde con el contenido formateado y listo para usar.` },
    { role: "user", content: JSON.stringify(context) },
  ]);
  return { title: kind, content };
}