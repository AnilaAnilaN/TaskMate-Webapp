// app/(dashboard)/layout.tsx
'use client';

import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import { TimerProvider } from '@/lib/contexts/TimerContext';
import { AblyProvider } from '@/components/chat/AblyProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      <AblyProvider>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="lg:pt-0 pt-12">
                  <Topbar />
                </div>
                <main>{children}</main>
              </div>
            </div>
          </div>
        </div>
      </AblyProvider>
    </TimerProvider>
  );
}