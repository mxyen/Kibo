"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Users, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { mockClasses } from "@/lib/mock-data";

function generateCode() {
  const letters = Array.from({ length: 3 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)],
  ).join("");
  const numbers = Math.floor(100 + Math.random() * 900);
  return `${letters}${numbers}`;
}

export default function MisClasesPage() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [code, setCode] = React.useState(generateCode());
  const [copied, setCopied] = React.useState(false);
  const [createdName, setCreatedName] = React.useState<string | null>(null);

  function openModal() {
    setName("");
    setSubject("");
    setDescription("");
    setCode(generateCode());
    setCreatedName(null);
    setOpen(true);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreatedName(name || "Nueva clase");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mis Clases</h1>
          <p className="mt-1 text-sm text-black/45">Gestiona tus grupos y su progreso.</p>
        </div>
        <Button onClick={openModal}>
          <Plus className="h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {mockClasses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3 }}
          >
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-black/40">{c.subject}</p>
                  <h3 className="mt-1 text-xl font-semibold">{c.name}</h3>
                </div>
                <span
                  className="rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: `color-mix(in srgb, ${c.color} 12%, white)`, color: c.color }}
                >
                  {c.code}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-black/50">
                  <Users className="h-4 w-4" />
                  {c.students} alumnos
                </div>
                <div className="font-semibold" style={{ color: c.color }}>
                  Promedio {c.average}%
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Nueva Clase" description="Crea un nuevo grupo para tus alumnos.">
        {createdName ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Check className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold">¡{createdName} creada!</p>
              <p className="mt-1 text-sm text-black/45">Comparte este código con tus alumnos:</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-muted)] px-5 py-2.5 font-mono text-lg font-bold tracking-widest text-[var(--color-primary)]"
            >
              {code}
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <Button onClick={() => setOpen(false)} className="mt-2 w-full">
              Listo
            </Button>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nombre</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Matemáticas A3" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Materia</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Matemáticas" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Descripción</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descripción de la clase..."
                rows={3}
              />
            </div>
            <div className="rounded-xl bg-[var(--color-surface-muted)] px-4 py-3 text-sm">
              Código generado automáticamente: <span className="font-mono font-bold text-[var(--color-primary)]">{code}</span>
            </div>
            <Button type="submit" className="mt-1">
              Crear Clase
            </Button>
          </form>
        )}
      </Modal>
    </main>
  );
}
