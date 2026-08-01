import { Sidebar } from "@/components/layout/sidebar";

export default function DocenteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
