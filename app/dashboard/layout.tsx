// dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies(); // no await
  const token = cookieStore.get('token');

  if (!token) {
    redirect('/auth');
  }

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
