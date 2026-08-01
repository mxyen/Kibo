"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCw, Sparkles } from "lucide-react";
import type { Flashcard } from "@/services/gemma";
import { cn } from "@/lib/utils";

export function FlashcardDeck({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [direction, setDirection] = React.useState(1);

  if (cards.length === 0) return null;

  const card = cards[index];

  function go(delta: number) {
    setDirection(delta);
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-64 w-full max-w-sm" style={{ perspective: 1200 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <button
              onClick={() => setFlipped((f) => !f)}
              className="relative h-full w-full text-left"
              style={{ perspective: 1200 }}
              aria-label="Voltear tarjeta"
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] p-6 text-center text-white shadow-[var(--shadow-soft-lg)] gradient-primary"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Sparkles className="h-5 w-5 text-white/70" />
                  <p className="break-words text-lg font-semibold leading-snug">{card.front}</p>
                  <span className="absolute bottom-4 flex items-center gap-1 text-xs text-white/70">
                    <RotateCw className="h-3 w-3" />
                    Toca para voltear
                  </span>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 text-center shadow-[var(--shadow-soft-lg)]"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">Respuesta</span>
                  <p className="break-words text-base leading-relaxed text-[var(--foreground)]">{card.back}</p>
                </div>
              </motion.div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => go(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-black/50 hover:bg-[var(--color-surface-muted)]"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {cards.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-[var(--color-primary)]" : "w-1.5 bg-[var(--color-border)]",
              )}
            />
          ))}
        </div>

        <button
          onClick={() => go(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-black/50 hover:bg-[var(--color-surface-muted)]"
          aria-label="Siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs text-black/40">
        Tarjeta {index + 1} de {cards.length}
      </p>
    </div>
  );
}
