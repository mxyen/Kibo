import { Flame, Star, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";

export function XPCard({
  xp,
  xpToNextLevel,
  level,
  streak,
}: {
  xp: number;
  xpToNextLevel: number;
  level: number;
  streak: number;
}) {
  const percent = (xp / xpToNextLevel) * 100;
  return (
    <Card className="flex items-center gap-5 p-5">
      <ProgressRing
        value={percent}
        label={
          <div className="flex flex-col items-center">
            <Trophy className="h-4 w-4 text-[var(--color-primary)]" />
            <span className="text-sm font-bold">Nv.{level}</span>
          </div>
        }
      />
      <div className="flex-1">
        <p className="text-sm text-black/50">Experiencia</p>
        <p className="text-lg font-semibold">
          {xp} <span className="text-black/40">/ {xpToNextLevel} XP</span>
        </p>
        <div className="mt-2 flex items-center gap-1 text-sm text-[var(--color-secondary)]">
          <Flame className="h-4 w-4" />
          <span className="font-medium">{streak} días de racha</span>
        </div>
      </div>
      <Star className="h-6 w-6 text-amber-400" fill="currentColor" />
    </Card>
  );
}
