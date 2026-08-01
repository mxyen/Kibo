"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Glasses } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mascot, type MascotEyes, type MascotHat } from "@/components/kibo/mascot";
import { useStudentProfile } from "@/lib/student-profile";
import { cn } from "@/lib/utils";

const COLORS = ["#7A16CE", "#EB5436", "#16A34A", "#2563EB", "#F59E0B", "#DB2777"];
const EYES: { value: MascotEyes; label: string }[] = [
  { value: "happy", label: "Feliz" },
  { value: "normal", label: "Normal" },
  { value: "sleepy", label: "Somnoliento" },
  { value: "wink", label: "Guiño" },
];
const HATS: { value: MascotHat; label: string }[] = [
  { value: "none", label: "Sin sombrero" },
  { value: "cap", label: "Gorra" },
  { value: "wizard", label: "Mago" },
  { value: "crown", label: "Corona" },
];

export default function PersonalizarPage() {
  const router = useRouter();
  const { profile, update, loaded } = useStudentProfile();

  if (!loaded) return null;

  function handleContinue() {
    router.push("/alumno/dashboard");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Personaliza a tu KIBO</h1>
        <p className="mt-2 text-black/50">Hazlo tuyo antes de comenzar a aprender.</p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.2fr]">
        <Card className="flex flex-col items-center justify-center gap-4 p-8">
          <motion.div key={JSON.stringify(profile)} initial={{ scale: 0.9, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}>
            <Mascot size={160} color={profile.color} eyes={profile.eyes} hat={profile.hat} glasses={profile.glasses} backpack={profile.backpack} />
          </motion.div>
          <p className="text-lg font-semibold">{profile.name || "Kibo"}</p>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <label className="mb-2 block text-sm font-medium">Nombre</label>
            <Input value={profile.name} onChange={(e) => update({ name: e.target.value })} placeholder="Nombre de tu KIBO" maxLength={16} />
          </Card>

          <Card className="p-5">
            <p className="mb-3 text-sm font-medium">Color</p>
            <div className="flex gap-2.5">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => update({ color: c })}
                  className={cn(
                    "h-9 w-9 rounded-full transition-transform hover:scale-110",
                    profile.color === c && "ring-2 ring-offset-2",
                  )}
                  style={{ background: c, ...(profile.color === c ? ({ "--tw-ring-color": c } as React.CSSProperties) : {}) }}
                  aria-label={c}
                />
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-3 text-sm font-medium">Ojos</p>
            <div className="flex flex-wrap gap-2">
              {EYES.map((e) => (
                <button
                  key={e.value}
                  onClick={() => update({ eyes: e.value })}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    profile.eyes === e.value
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-black/55 hover:bg-[var(--color-surface-muted)]",
                  )}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="mb-3 text-sm font-medium">Sombrero</p>
            <div className="flex flex-wrap gap-2">
              {HATS.map((h) => (
                <button
                  key={h.value}
                  onClick={() => update({ hat: h.value })}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                    profile.hat === h.value
                      ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-black/55 hover:bg-[var(--color-surface-muted)]",
                  )}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="flex items-center justify-between p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Glasses className="h-4 w-4 text-black/40" />
              Accesorios
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => update({ glasses: !profile.glasses })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  profile.glasses
                    ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-black/55",
                )}
              >
                Lentes
              </button>
              <button
                onClick={() => update({ backpack: !profile.backpack })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  profile.backpack
                    ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-black/55",
                )}
              >
                Mochila
              </button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleContinue} className="w-64">
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </main>
  );
}
