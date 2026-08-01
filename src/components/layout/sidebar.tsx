"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Users, FolderOpen, Sparkles, LogOut, BarChart3, Menu, X } from "lucide-react";
import { Mascot } from "@/components/kibo/mascot";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/docente", label: "Dashboard", icon: LayoutDashboard },
  { href: "/docente/clases", label: "Mis Clases", icon: Users },
  { href: "/docente/recursos", label: "Recursos", icon: FolderOpen },
  { href: "/docente/insights", label: "Gemma Insights", icon: Sparkles },
  { href: "/docente/analytics", label: "Analytics", icon: BarChart3 },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href} className="relative" onClick={onNavigate}>
            {active && (
              <motion.span
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-xl bg-[var(--color-surface-muted)]"
                transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-[var(--color-primary)]" : "text-black/55 hover:text-black/80",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.2} />
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white/70 p-5 backdrop-blur-xl md:flex">
        <Link href="/" className="mb-8 flex items-center gap-2 px-2">
          <Mascot size={36} bounce={false} />
          <span className="text-lg font-bold tracking-tight">
            KI<span className="text-gradient-brand">BO</span>
          </span>
        </Link>

        <NavLinks pathname={pathname} />

        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/45 hover:bg-[var(--color-surface-muted)] hover:text-black/70"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Salir
        </Link>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-white/80 px-4 py-3 backdrop-blur-xl md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Mascot size={30} bounce={false} />
          <span className="text-base font-bold tracking-tight">
            KI<span className="text-gradient-brand">BO</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-black/60 hover:bg-[var(--color-surface-muted)]"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80vw] flex-col bg-white p-5 shadow-[var(--shadow-soft-lg)] md:hidden"
            >
              <div className="mb-8 flex items-center justify-between px-2">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <Mascot size={32} bounce={false} />
                  <span className="text-lg font-bold tracking-tight">
                    KI<span className="text-gradient-brand">BO</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-black/50 hover:bg-[var(--color-surface-muted)]"
                  aria-label="Cerrar menú"
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>

              <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />

              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/45 hover:bg-[var(--color-surface-muted)] hover:text-black/70"
              >
                <LogOut className="h-[18px] w-[18px]" />
                Salir
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
