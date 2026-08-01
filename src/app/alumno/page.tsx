"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/kibo/mascot";
import { useStudentProfile } from "@/lib/student-profile";
import { useClassesStore } from "@/lib/classes-store";

export default function AlumnoJoinPage() {
  const router = useRouter();
  const { update } = useStudentProfile();
  const { loaded, findByCode } = useClassesStore();
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const clase = findByCode(code);
    if (!clase) {
      setError(`No encontramos ninguna clase con el código "${code.toUpperCase()}". Verifica con tu docente.`);
      return;
    }
    update({
      classCode: clase.code,
      classId: clase.id,
      className: clase.name,
      classSubject: clase.subject,
    });
    router.push("/alumno/personalizar");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.35 }}>
          <Mascot size={120} />
        </motion.div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">¡Únete a tu clase!</h1>
        <p className="mt-2 text-black/50">Ingresa el código que te compartió tu docente.</p>

        <Card className="mt-8 w-full p-6">
          <form
            onSubmit={handleJoin}
            className="flex flex-col gap-4"
          >
            <Input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder="ABC123"
              className="text-center text-lg font-mono font-bold tracking-[0.3em] uppercase"
              maxLength={6}
              required
            />
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 overflow-hidden rounded-xl bg-red-50 p-3 text-left text-sm text-red-600"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            <Button type="submit" size="lg" disabled={!loaded}>
              Unirme
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-xs text-black/35">
          ¿No tienes un código? Pídele a tu docente que cree una clase y comparta el código contigo.
        </p>
      </main>
    </div>
  );
}
