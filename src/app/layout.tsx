import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIBO — Aprendizaje personalizado con IA",
  description:
    "KIBO utiliza Gemma 4 para personalizar el aprendizaje y brindar inteligencia pedagógica a docentes y estudiantes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
