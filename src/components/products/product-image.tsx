"use client";

import * as React from "react";
import Image from "next/image";

export function ProductImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f3eefc] via-white to-[#ead8ff] ${className}`}>
      {!failed ? (
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <div className="p-6 text-center">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-white">K</div>
          <p className="text-sm font-semibold text-[var(--color-primary)]">Imagen de producto</p>
          <p className="mt-1 text-xs text-black/45">Espacio reservado para fotografía KIBO</p>
        </div>
      )}
    </div>
  );
}
