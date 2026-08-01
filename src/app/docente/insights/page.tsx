"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { GemmaInsight } from "@/components/cards/gemma-insight";
import { mockGemmaInsights, mockRecommendations, mockTopicMastery } from "@/lib/mock-data";
import { generateFromResource, type GeneratedArtifact } from "@/services/gemma";

export default function GemmaInsightsPage() {
  const [loading, setLoading] = React.useState(false);
  const [plan, setPlan] = React.useState<GeneratedArtifact | null>(null);

  async function handleGeneratePlan() {
    setLoading(true);
    const result = await generateFromResource("clase", {
      topics: mockTopicMastery.filter((t) => t.status !== "dominado").map((t) => t.topic),
      level: "Secundaria",
      estimatedTime: "1 hora",
      summary: "Plan enfocado en los temas con menor dominio del grupo.",
      keyConcepts: mockTopicMastery.map((t) => t.topic),
      suggestedQuestions: [],
      suggestedExercises: [],
    });
    setPlan(result);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-4xl px-8 py-10">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-[var(--color-primary)]" />
        <h1 className="text-3xl font-bold tracking-tight">Gemma Insights</h1>
      </div>
      <p className="mt-1 text-sm text-black/45">Dashboard de inteligencia pedagógica en tiempo real.</p>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        <GemmaInsight insights={mockGemmaInsights} />
      </motion.div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecommendations.map((r, i) => (
              <motion.div
                key={r}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl bg-[var(--color-surface-muted)] p-3.5 text-sm"
              >
                <Wand2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                {r}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Button size="lg" onClick={handleGeneratePlan} disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
          Generar Plan de Clase
        </Button>
      </div>

      <Modal open={!!plan} onClose={() => setPlan(null)} title={plan?.title}>
        <div className="whitespace-pre-line rounded-xl bg-[var(--color-surface-muted)] p-4 text-sm leading-relaxed">
          {plan?.content}
        </div>
      </Modal>
    </main>
  );
}
