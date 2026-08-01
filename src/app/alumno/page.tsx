"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mascot } from "@/components/kibo/mascot";
import { useStudentProfile } from "@/lib/student-profile";

export default function AlumnoJoinPage() {
  const router = useRouter();
  const { update } = useStudentProfile();
  const [code, setCode] = React.useState("");

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    update({ classCode: code.toUpperCase() || "ABC123" });
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
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ABC123"
              className="text-center text-lg font-mono font-bold tracking-[0.3em] uppercase"
              maxLength={6}
              required
            />
            <Button type="submit" size="lg">
              Unirme
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
