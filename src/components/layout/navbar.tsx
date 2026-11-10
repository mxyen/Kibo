import Link from "next/link";
import { Mascot } from "@/components/kibo/mascot";

export function Navbar({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)]/60 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Mascot size={32} bounce={false} />
          <span className="text-lg font-bold tracking-tight">
            KI<span className="text-gradient-brand">BO</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium text-black/55 sm:flex">
          <Link href="/productos" className="hover:text-[var(--color-primary)]">Productos</Link>
          <Link href="/docente" className="hover:text-[var(--color-primary)]">Servicios y planes</Link>
        </nav>
        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
