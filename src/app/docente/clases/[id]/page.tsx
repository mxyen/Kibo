"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Users, Copy, Check, FolderOpen, Sparkles, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useClassesStore } from "@/lib/classes-store";

const STATUS_CONFIG = {
  refuerzo: { label: "Necesita refuerzo", variant: "warning" as const, icon: AlertTriangle },
  progreso: { label: "En progreso", variant: "primary" as const, icon: TrendingUp },
  dominado: { label: "Dominado", variant: "success" as const, icon: CheckCircle2 },
};

export default function ClassDetailPage() {
  const params = useParams<{ id: string }>();
  const { findById, loaded } = useClassesStore();
  const [copied, setCopied] = React.useState(false);

  if (!loaded) return null;

  const clase = findById(params.id);

  if (!clase) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8">
        <p className="text-lg font-semibold">No encontramos esa clase.</p>
        <p className="mt-1 text-sm text-black/45">Puede que el enlace sea incorrecto o la clase ya no exista.</p>
        <Link href="/docente/clases" className="mt-6 inline-block">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Volver a Mis Clases
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <Link href="/docente/clases" className="inline-flex items-center gap-1.5 text-sm font-medium text-black/45 hover:text-black/70">
        <ArrowLeft className="h-4 w-4" />
        Mis Clases
      </Link>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
        <Card className="overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${clase.color}, color-mix(in srgb, ${clase.color} 60%, black))` }}>
          <CardContent className="flex flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <Badge className="bg-white/15 text-white">{clase.subject}</Badge>
              <h1 className="mt-3 text-2xl font-bold">{clase.name}</h1>
              {clase.description && <p className="mt-2 max-w-md text-sm text-white/85">{clase.description}</p>}
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

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5">
        <Card className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="text-sm text-black/50">Código para que tus alumnos se unan</div>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(clase.code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-muted)] px-4 py-2 font-mono text-base font-bold tracking-widest text-[var(--color-primary)]"
          >
            {clase.code}
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </Card>
      </motion.div>

      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Temas de la clase</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {clase.topics.map((topic, i) => {
            const config = STATUS_CONFIG[topic.status];
            const Icon = config.icon;
            return (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
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
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: "easeOut" }}
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/docente/recursos">
          <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary text-white">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Recursos</p>
              <p className="text-sm text-black/45">Sube material para esta clase</p>
            </div>
          </Card>
        </Link>
        <Link href="/docente/insights">
          <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-[var(--shadow-soft-lg)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Gemma Insights</p>
              <p className="text-sm text-black/45">Ver recomendaciones para el grupo</p>
            </div>
          </Card>
        </Link>
      </div>
    </main>
  );
}
