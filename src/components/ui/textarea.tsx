import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition-shadow placeholder:text-black/35 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
