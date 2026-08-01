"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCard } from "@/components/cards/analytics-card";
import { GemmaInsight } from "@/components/cards/gemma-insight";
import { ProgressRing } from "@/components/ui/progress-ring";
import { mockAnalytics, mockGemmaInsights, mockTopicMastery } from "@/lib/mock-data";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function AnalyticsPage() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-[var(--color-primary)]" />
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      </div>
      <p className="mt-1 text-sm text-black/45">Métricas de aprendizaje del grupo, en tiempo real.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2">
          <AnalyticsCard title="Actividad semanal" data={mockAnalytics.weeklyActivity} />
          <div className="mt-2 grid grid-cols-7 text-center text-xs text-black/35">
            {DAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <ProgressRing value={mockAnalytics.engagementScore} />
            <div>
              <p className="flex items-center justify-center gap-1.5 font-semibold">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                Engagement
              </p>
              <p className="mt-1 text-xs text-black/40">Índice de participación del grupo</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dominio por tema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTopicMastery.map((t) => (
                <div key={t.topic}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{t.topic}</span>
                    <span className="text-black/40">{t.mastery}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.mastery}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full gradient-brand"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GemmaInsight title="Insights generados por Gemma" insights={mockGemmaInsights} />
        </motion.div>
      </div>
    </main>
  );
}
