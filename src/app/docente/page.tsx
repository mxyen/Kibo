"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { mockClasses, mockTopicMastery } from "@/lib/mock-data";

const STATUS_CONFIG = {
  refuerzo: { label: "Necesita refuerzo", variant: "warning" as const, icon: AlertTriangle },
  progreso: { label: "En progreso", variant: "primary" as const, icon: TrendingUp },
  dominado: { label: "Dominado", variant: "success" as const, icon: CheckCircle2 },
};

export default function DocenteDashboard() {
  const clase = mockClasses[0];

  return (
    <main className="mx-auto max-w-5xl px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm font-medium text-black/45">Bienvenido de vuelta</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Dashboard</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-8"
      >
        <Card className="gradient-primary overflow-hidden text-white">
          <CardContent className="flex flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <Badge className="bg-white/15 text-white">{clase.subject}</Badge>
              <h2 className="mt-3 text-2xl font-bold">{clase.name}</h2>
              <div className="mt-3 flex items-center gap-2 text-sm text-white/85">
                <Users className="h-4 w-4" />
                {clase.students} alumnos
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ProgressRing
                value={clase.average}
                color="white"
                trackColor="rgba(255,255,255,0.25)"
                label={<span className="text-xl font-bold text-white">{clase.average}%</span>}
              />
              <div className="text-sm text-white/85">
                Promedio
                <br />
                general
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-10">
        <h3 className="mb-4 text-lg font-semibold">Temas de la clase</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {mockTopicMastery.slice(0, 3).map((topic, i) => {
            const config = STATUS_CONFIG[topic.status];
            const Icon = config.icon;
            return (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
              >
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{topic.topic}</span>
                    <Icon className="h-4 w-4 text-black/30" />
                  </div>
                  <Badge variant={config.variant} className="mt-2">
                    {config.label}
                  </Badge>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-surface-muted)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${topic.mastery}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="h-full gradient-brand"
                    />
                  </div>
                  <p className="mt-2 text-xs text-black/40">{topic.mastery}% de dominio</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
