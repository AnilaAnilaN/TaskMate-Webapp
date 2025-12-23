// app/(dashboard)/chat/[userId]/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import ChatWindow from '@/components/chat/ChatWindow';

export default async function ChatUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  // Get current user
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/auth');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: string;
  };

  const { userId } = await params;

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <ChatWindow recipientId={userId} currentUserId={decoded.userId} />
    </div>
  );
}

export const metadata = {
  title: 'Chat - TaskMate',
  description: 'Chat conversation',
};