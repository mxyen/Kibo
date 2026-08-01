import { Card } from "@/components/ui/card";
import { Mascot, type MascotProps } from "@/components/kibo/mascot";

export function PetCard({
  name,
  level,
  mascotProps,
}: {
  name: string;
  level: number;
  mascotProps?: MascotProps;
}) {
  return (
    <Card className="flex items-center gap-4 bg-[var(--color-surface-muted)]/60 p-5">
      <Mascot size={64} {...mascotProps} />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-black/50">Nivel {level}</p>
      </div>
    </Card>
  );
}
