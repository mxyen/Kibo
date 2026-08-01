"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, School, Sparkles, BrainCircuit, LineChart, MessageCircleHeart } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mascot } from "@/components/kibo/mascot";

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Motor cognitivo Gemma 4",
    description: "Analiza documentos, comprende contenido educativo y genera material a medida.",
  },
  {
    icon: MessageCircleHeart,
    title: "Tutoría paso a paso",
    description: "KIBO nunca da solo la respuesta: enseña el procedimiento como un tutor paciente.",
  },
  {
    icon: LineChart,
    title: "Inteligencia pedagógica",
    description: "Detecta patrones de aprendizaje y recomienda acciones concretas para cada grupo.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.7, bounce: 0.35 }}
        >
          <Mascot size={168} eyes="happy" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            Impulsado por Gemma 4
          </span>

          <h1 className="mt-5 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
            Aprendizaje personalizado con <span className="text-gradient-brand">KIBO</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg text-black/55 text-balance">
            KIBO utiliza Gemma 4 para personalizar el aprendizaje y brindar inteligencia pedagógica
            a docentes y estudiantes.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/docente">
              <Button size="lg" variant="primary" className="w-56">
                <School className="h-5 w-5" />
                Entrar como Docente
              </Button>
            </Link>
            <Link href="/alumno">
              <Button size="lg" variant="secondary" className="w-56">
                <GraduationCap className="h-5 w-5" />
                Entrar como Alumno
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="mt-24 grid w-full gap-5 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <Card className="glass h-full p-6 text-left">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-white">
                  <f.icon className="h-[22px] w-[22px]" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-black/50">{f.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-[var(--color-border)] py-6 text-center text-sm text-black/35">
        KIBO — Ecosistema de aprendizaje personalizado impulsado por IA
      </footer>
    </div>
  );
}
