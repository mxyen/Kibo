import { cn } from "@/lib/utils";
import { Mascot } from "./mascot";

export function ChatBubble({
  role,
  content,
  pending,
}: {
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
}) {
  const isAssistant = role === "assistant";
  return (
    <div className={cn("flex items-end gap-2", isAssistant ? "justify-start" : "justify-end")}>
      {isAssistant && <Mascot size={32} bounce={false} eyes="happy" />}
      <div
        className={cn(
          "max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isAssistant
            ? "rounded-bl-sm bg-[var(--color-surface-muted)] text-[var(--foreground)]"
            : "rounded-br-sm gradient-primary text-white",
        )}
      >
        {pending ? (
          <span className="inline-flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
