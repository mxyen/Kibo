"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/kibo/mascot";
import { useStudentProfile } from "@/lib/student-profile";
import { mockActivity } from "@/lib/mock-data";
import { explainActivityAnswer } from "@/services/gemma";
import { cn } from "@/lib/utils";

export default function ActividadPage() {
  const { profile, loaded } = useStudentProfile();
  const [selected, setSelected] = React.useState<number | null>(null);
  const [explaining, setExplaining] = React.useState(false);
  const [explanation, setExplanation] = React.useState<string | null>(null);

  if (!loaded) return null;

  async function handleAnswer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    setExplaining(true);
    const text = await explainActivityAnswer({
      question: mockActivity.prompt,
      studentAnswer: mockActivity.choices[index],
      correctAnswer: mockActivity.choices[mockActivity.answerIndex],
    });
    setExplanation(text);
    setExplaining(false);
  }

  const isCorrect = selected === mockActivity.answerIndex;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Badge variant="primary">{mockActivity.topic}</Badge>
      <h1 className="mt-3 text-2xl font-bold tracking-tight">Actividad</h1>

      <Card className="mt-6 p-6">
        <p className="text-lg font-medium">{mockActivity.prompt}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {mockActivity.choices.map((choice, i) => {
            const isSelected = selected === i;
            const revealCorrect = selected !== null && i === mockActivity.answerIndex;
            return (
              <motion.button
                key={choice}
                whileHover={selected === null ? { y: -2 } : undefined}
                whileTap={selected === null ? { scale: 0.98 } : undefined}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  isSelected && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                  isSelected && !isCorrect && "border-red-300 bg-red-50 text-red-600",
                  !isSelected && revealCorrect && "border-emerald-300 bg-emerald-50/60",
                  !isSelected && !revealCorrect && "border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]",
                )}
              >
                {choice}
                {isSelected && (isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />)}
                {!isSelected && revealCorrect && <Check className="h-4 w-4 text-emerald-500" />}
              </motion.button>
            );
          })}
        </div>
      </Card>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-start gap-3"
          >
            <Mascot size={56} bounce={false} color={profile.color} eyes={explaining ? "sleepy" : "happy"} hat={profile.hat} glasses={profile.glasses} />
            <div className="flex-1 rounded-2xl rounded-tl-sm bg-[var(--color-surface-muted)] p-4">
              {explaining ? (
                <span className="flex items-center gap-2 text-sm text-black/50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  KIBO está pensando la mejor explicación...
                </span>
              ) : (
                <p className="whitespace-pre-line break-words text-sm leading-relaxed">{explanation}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selected !== null && !explaining && (
        <div className="mt-6 flex justify-center">
          <Button onClick={() => (window.location.href = "/alumno/dashboard")}>Volver al dashboard</Button>
        </div>
      )}
    </main>
  );
}
