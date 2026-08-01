/**
 * services/gemma.ts
 *
 * Single point of contact with the Gemma 4 model. Every screen that needs
 * AI output (teacher resource analysis, student chat/tutoring) must go
 * through the functions exported here — never call an AI endpoint directly
 * from a component.
 *
 * The real request happens server-side, in src/app/api/gemma/route.ts, which
 * reads GEMINI_API_KEY from a git-ignored .env.local. That key never reaches
 * the browser — this file only ever calls our own same-origin /api/gemma.
 *
 * If the server route isn't configured (no key) or the call fails for any
 * reason, every function below falls back to a local simulated response so
 * the UI stays fully demoable.
 */

export type GemmaMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * Gemma tends to answer in markdown/LaTeX (**bold**, ### headers, $$formulas$$).
 * The UI renders plain text, so every prompt asks for plain text up front...
 */
const PLAIN_TEXT_INSTRUCTION =
  "Responde siempre en texto plano: sin markdown (nada de **, ##, guiones de lista con *), " +
  "sin LaTeX ni símbolos $ o $$. Para fórmulas usa notación simple de texto (ej: (-b ± √(b²-4ac)) / 2a). " +
  "Usa saltos de línea y numeración simple (1., 2., 3.) para organizar el contenido.";

const TUTOR_SYSTEM_PROMPT =
  "Eres KIBO, un tutor de IA paciente impulsado por Gemma 4. Nunca das solo la respuesta final: " +
  "explicas el procedimiento paso a paso, con un tono cálido y motivador, adaptado al nivel del estudiante. " +
  PLAIN_TEXT_INSTRUCTION;

/** ...and this strips whatever markdown/LaTeX slips through anyway, as a safety net. */
function cleanGemmaText(text: string): string {
  return text
    .replace(/```[a-z]*\n?/gi, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^-{3,}\s*$/gm, "")
    .replace(/\$\$([\s\S]+?)\$\$/g, "$1")
    .replace(/\$(.+?)\$/g, "$1")
    .replace(/\\frac\{(.+?)\}\{(.+?)\}/g, "($1)/($2)")
    .replace(/\\sqrt\{(.+?)\}/g, "√($1)")
    .replace(/\\pm/g, "±")
    .replace(/\\times/g, "×")
    .replace(/\\cdot/g, "·")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Calls our internal /api/gemma route (which talks to Gemma 4 server-side).
 * Throws on any failure — callers are expected to catch and fall back to a
 * simulated response, keeping the UI functional with or without a real key.
 */
async function callGemma(messages: GemmaMessage[], requestJson = false): Promise<string> {
  const response = await fetch("/api/gemma", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, jsonMode: requestJson }),
  });

  if (!response.ok) {
    throw new Error(`Gemma API error: ${response.status}`);
  }

  const data = await response.json();
  return data.text ?? "";
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
  try {
    const content = await callGemma([{ role: "system", content: TUTOR_SYSTEM_PROMPT }, ...history]);
    return cleanGemmaText(content);
  } catch {
    return simulateGemmaResponse(history);
  }
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
  try {
    const content = await callGemma([
      { role: "system", content: TUTOR_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ]);
    return cleanGemmaText(content);
  } catch {
    return simulateGemmaResponse([{ role: "user", content: prompt }]);
  }
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

function simulatedAnalysis(fileName: string): Promise<ResourceAnalysis> {
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

/** Analyzes an uploaded teaching resource (PDF, slides, video, etc).
 *  When connected to Gemma 4, the model returns structured JSON. */
export async function analyzeResource(fileName: string): Promise<ResourceAnalysis> {
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

  try {
    const content = await callGemma(
      [
        {
          role: "system",
          content:
            "Eres un analista de contenido educativo. Responde ÚNICAMENTE con un objeto JSON válido que siga este esquema:\n" +
            jsonSchema +
            "\n\nNo incluyas markdown, explicaciones ni texto fuera del JSON. " +
            "Dentro de los valores de texto del JSON tampoco uses markdown ni LaTeX (nada de **, ##, $, \\frac, etc), solo texto plano.",
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
    const cleaned = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned) as ResourceAnalysis;
    return {
      topics: parsed.topics.map(cleanGemmaText),
      level: cleanGemmaText(parsed.level),
      estimatedTime: cleanGemmaText(parsed.estimatedTime),
      summary: cleanGemmaText(parsed.summary),
      keyConcepts: parsed.keyConcepts.map(cleanGemmaText),
      suggestedQuestions: parsed.suggestedQuestions.map(cleanGemmaText),
      suggestedExercises: parsed.suggestedExercises.map(cleanGemmaText),
    };
  } catch {
    return simulatedAnalysis(fileName);
  }
}

export type GeneratedArtifact = { title: string; content: string };

function simulatedArtifact(
  kind: "quiz" | "resumen" | "clase" | "flashcards",
  context: ResourceAnalysis,
): GeneratedArtifact {
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
  return canned[kind];
}

const ARTIFACT_TITLES: Record<"quiz" | "resumen" | "clase" | "flashcards", string> = {
  quiz: "Quiz generado",
  resumen: "Resumen generado",
  clase: "Plan de clase generado",
  flashcards: "Flashcards generadas",
};

/** Generates a quiz / summary / lesson plan / flashcards from an analyzed resource. */
export async function generateFromResource(
  kind: "quiz" | "resumen" | "clase" | "flashcards",
  context: ResourceAnalysis,
): Promise<GeneratedArtifact> {
  try {
    const content = await callGemma([
      {
        role: "system",
        content:
          `Genera un(a) ${kind} a partir de este análisis de contenido educativo. Responde con el contenido formateado y listo para usar. ` +
          PLAIN_TEXT_INSTRUCTION,
      },
      { role: "user", content: JSON.stringify(context) },
    ]);
    return { title: ARTIFACT_TITLES[kind], content: cleanGemmaText(content) };
  } catch {
    return new Promise((resolve) => setTimeout(() => resolve(simulatedArtifact(kind, context)), 1100));
  }
}
