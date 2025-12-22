// app/(dashboard)/layout.tsx
// ==========================================
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { TimerProvider } from '@/lib/contexts/TimerContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 overflow-auto p-8">
          <Topbar />
          {children}
        </div>
      </div>
    </TimerProvider>
  );
}
