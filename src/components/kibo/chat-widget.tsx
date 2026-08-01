"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { chatWithGemma, type GemmaMessage } from "@/services/gemma";
import { ChatBubble } from "./chat-bubble";
import { Mascot } from "./mascot";

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [messages, setMessages] = React.useState<GemmaMessage[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy KIBO 👋 ¿En qué tema quieres que te ayude hoy?",
    },
  ]);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function handleSend() {
    const text = input.trim();
    if (!text || pending) return;
    const next: GemmaMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const reply = await chatWithGemma(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.05 }}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full gradient-brand text-white shadow-[var(--shadow-soft-lg)]"
        aria-label="Chat con KIBO"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            className="fixed inset-x-4 z-40 flex h-[min(32rem,70dvh)] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white shadow-[var(--shadow-soft-lg)] sm:inset-x-auto sm:right-6 sm:w-[22rem]"
            style={{ bottom: "6.5rem" }}
          >
            <div className="flex items-center gap-3 gradient-brand p-4 text-white">
              <Mascot size={36} bounce={false} />
              <div>
                <p className="text-sm font-semibold">KIBO Tutor</p>
                <p className="text-xs text-white/80">Impulsado por Gemma 4</p>
              </div>
            </div>

            <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role === "assistant" ? "assistant" : "user"} content={m.content} />
              ))}
              {pending && <ChatBubble role="assistant" content="" pending />}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 border-t border-[var(--color-border)] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntale algo a KIBO..."
                className="h-10 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 text-sm outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="submit"
                disabled={pending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-white disabled:opacity-50"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
