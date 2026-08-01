import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GemmaInsight({
  title = "Gemma detectó",
  insights,
  footer,
}: {
  title?: string;
  insights: string[];
  footer?: React.ReactNode;
}) {
  return (
    <Card className="gradient-brand text-white">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Sparkles className="h-5 w-5" />
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-white/90">
          {insights.map((insight, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
              {insight}
            </li>
          ))}
        </ul>
        {footer && <div className="mt-4">{footer}</div>}
      </CardContent>
    </Card>
  );
}
