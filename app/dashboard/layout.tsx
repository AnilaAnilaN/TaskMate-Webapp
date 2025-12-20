// app/dashboard/layout.tsx
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // NO redirect here - middleware handles it
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <Topbar />
        {children}
      </div>
    </div>
  );
}