import { ChatWidget } from "@/components/kibo/chat-widget";

export default function AlumnoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {children}
      <ChatWidget />
    </div>
  );
}
