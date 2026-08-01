"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AICard({
  title,
  description,
  icon,
  onClick,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", duration: 0.3 }}>
      <Card
        onClick={onClick}
        className={cn(
          "cursor-pointer overflow-hidden p-5 transition-shadow hover:shadow-[var(--shadow-soft-lg)]",
          className,
        )}
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white">
          {icon ?? <Sparkles className="h-5 w-5" />}
        </div>
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-black/50">{description}</p>
      </Card>
    </motion.div>
  );
}
