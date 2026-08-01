import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-4 text-sm outline-none transition-shadow placeholder:text-black/35 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
