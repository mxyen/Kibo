"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function UploadZone({
  onFile,
  className,
}: {
  onFile: (fileName: string) => void;
  className?: string;
}) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFile(file.name);
  }

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      animate={{ scale: dragging ? 1.015 : 1 }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed p-12 text-center transition-colors",
        dragging
          ? "border-[var(--color-primary)] bg-[var(--color-surface-muted)]"
          : "border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-muted)]/40",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,image/*,video/*,audio/*"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-white">
        <UploadCloud className="h-7 w-7" />
      </div>
      <p className="font-semibold">Arrastra un archivo o haz clic para subir</p>
      <p className="max-w-sm text-sm text-black/45">
        PDF, Word, PowerPoint, imágenes, videos o audio. Gemma 4 analizará el contenido automáticamente.
      </p>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-black/35">
        <FileText className="h-3.5 w-3.5" />
        Máx. 50MB por archivo
      </div>
    </motion.div>
  );
}
