"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ListChecks, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XPCard } from "@/components/cards/xp-card";
import { Mascot } from "@/components/kibo/mascot";
import { useStudentProfile } from "@/lib/student-profile";
import { mockStudentProgress } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AlumnoDashboardPage() {
  const { profile, loaded } = useStudentProfile();
  if (!loaded) return null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6"
      >
        <Mascot size={80} color={profile.color} eyes={profile.eyes} hat={profile.hat} glasses={profile.glasses} backpack={profile.backpack} />
        <div className="relative rounded-2xl rounded-bl-sm bg-[var(--color-surface-muted)] px-5 py-3">
          <p className="font-medium">
            ¡Hola! Soy <span className="font-bold text-[var(--color-primary)]">{profile.name}</span>. Estoy aquí para ayudarte.
          </p>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <XPCard xp={mockStudentProgress.xp} xpToNextLevel={mockStudentProgress.xpToNextLevel} level={mockStudentProgress.level} streak={mockStudentProgress.streak} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full p-5">
            <div className="flex items-center gap-2 font-semibold">
              <ListChecks className="h-[18px] w-[18px] text-[var(--color-primary)]" />
              Misiones
            </div>
            <div className="mt-3 space-y-2">
              {mockStudentProgress.missions.map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 text-sm">
                  {m.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-black/25" />
                  )}
                  <span className={cn(m.done && "text-black/40 line-through")}>{m.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-8 flex flex-col items-center gap-4 rounded-[var(--radius-lg)] gradient-brand p-8 text-center text-white"
      >
        <Rocket className="h-8 w-8" />
        <div>
          <p className="text-lg font-semibold">¿Listo para tu próxima actividad?</p>
          <p className="mt-1 text-sm text-white/85">KIBO te acompañará paso a paso.</p>
        </div>
        <Link href="/alumno/actividad">
          <Button size="lg" variant="outline" className="border-white/40 bg-white text-[var(--color-primary)]">
            Comenzar actividad
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
