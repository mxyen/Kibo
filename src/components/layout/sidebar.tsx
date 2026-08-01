"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FolderOpen, Sparkles, LogOut, BarChart3 } from "lucide-react";
import { Mascot } from "@/components/kibo/mascot";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/docente", label: "Dashboard", icon: LayoutDashboard },
  { href: "/docente/clases", label: "Mis Clases", icon: Users },
  { href: "/docente/recursos", label: "Recursos", icon: FolderOpen },
  { href: "/docente/insights", label: "Gemma Insights", icon: Sparkles },
  { href: "/docente/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white/70 p-5 backdrop-blur-xl">
      <Link href="/" className="mb-8 flex items-center gap-2 px-2">
        <Mascot size={36} bounce={false} />
        <span className="text-lg font-bold tracking-tight">
          KI<span className="text-gradient-brand">BO</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative">
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
                <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/45 hover:bg-[var(--color-surface-muted)] hover:text-black/70"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Salir
      </Link>
    </aside>
  );
}
