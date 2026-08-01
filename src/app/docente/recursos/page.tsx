"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileQuestion,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Loader2,
  FileCheck2,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { UploadZone } from "@/components/upload/upload-zone";
import { Mascot } from "@/components/kibo/mascot";
import {
  analyzeResource,
  generateFromResource,
  type ResourceAnalysis,
  type GeneratedArtifact,
} from "@/services/gemma";

type Stage = "idle" | "analyzing" | "done";

const GENERATORS: { key: "quiz" | "resumen" | "clase" | "flashcards"; label: string; icon: React.ElementType }[] = [
  { key: "quiz", label: "Generar Quiz", icon: FileQuestion },
  { key: "resumen", label: "Generar Resumen", icon: BookOpen },
  { key: "clase", label: "Generar Clase", icon: GraduationCap },
  { key: "flashcards", label: "Generar Flashcards", icon: Layers },
];

export default function RecursosPage() {
  const [stage, setStage] = React.useState<Stage>("idle");
  const [fileName, setFileName] = React.useState("");
  const [analysis, setAnalysis] = React.useState<ResourceAnalysis | null>(null);
  const [artifact, setArtifact] = React.useState<GeneratedArtifact | null>(null);
  const [generating, setGenerating] = React.useState<string | null>(null);

  async function handleFile(name: string) {
    setFileName(name);
    setStage("analyzing");
    const result = await analyzeResource(name);
    setAnalysis(result);
    setStage("done");
  }

  async function handleGenerate(kind: (typeof GENERATORS)[number]["key"]) {
    if (!analysis) return;
    setGenerating(kind);
    const result = await generateFromResource(kind, analysis);
    setArtifact(result);
    setGenerating(null);
  }

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Recursos</h1>
      <p className="mt-1 text-sm text-black/45">
        Sube material educativo y deja que Gemma 4 lo analice para ti.
      </p>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div key="idle" exit={{ opacity: 0 }}>
              <UploadZone onFile={handleFile} />
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white py-20"
            >
              <Mascot size={90} eyes="sleepy" />
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
                Analizando contenido con Gemma 4...
              </div>
              <p className="text-sm text-black/40">{fileName}</p>
            </motion.div>
          )}

          {stage === "done" && analysis && (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <FileCheck2 className="h-5 w-5" />
                  <span className="font-semibold">Documento analizado</span>
                </div>
                <p className="mt-1 text-sm text-black/40">{fileName}</p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-black/35">Temas encontrados</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {analysis.topics.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-black/35">Nivel educativo</p>
                      <p className="mt-1.5 font-semibold">{analysis.level}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-black/35">Tiempo estimado</p>
                      <p className="mt-1.5 flex items-center gap-1.5 font-semibold">
                        <Clock className="h-4 w-4 text-black/30" />
                        {analysis.estimatedTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-black/35">Resumen generado</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-black/70">{analysis.summary}</p>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-black/35">Conceptos clave</p>
                    <ul className="mt-1.5 space-y-1 text-sm text-black/70">
                      {analysis.keyConcepts.map((c) => (
                        <li key={c}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-black/35">Preguntas sugeridas</p>
                    <ul className="mt-1.5 space-y-1 text-sm text-black/70">
                      {analysis.suggestedQuestions.map((q) => (
                        <li key={q}>• {q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="grid gap-3 sm:grid-cols-4">
                {GENERATORS.map((g) => (
                  <motion.button
                    key={g.key}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleGenerate(g.key)}
                    disabled={generating !== null}
                    className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] bg-white p-4 text-sm font-medium shadow-[var(--shadow-soft)] disabled:opacity-60"
                  >
                    {generating === g.key ? (
                      <Loader2 className="h-5 w-5 animate-spin text-[var(--color-primary)]" />
                    ) : (
                      <g.icon className="h-5 w-5 text-[var(--color-primary)]" />
                    )}
                    {g.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={!!artifact} onClose={() => setArtifact(null)} title={artifact?.title}>
        <div className="flex items-start gap-2 rounded-xl bg-[var(--color-surface-muted)] p-4 text-sm">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
          <p className="whitespace-pre-line leading-relaxed">{artifact?.content}</p>
        </div>
      </Modal>
    </main>
  );
}
