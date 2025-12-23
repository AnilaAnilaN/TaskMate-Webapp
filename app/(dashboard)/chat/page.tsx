// app/(dashboard)/chat/page.tsx
import ChatList from '@/components/chat/ChatList';

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <ChatList />
    </div>
  );
}

export const metadata = {
  title: 'Messages - TaskMate',
  description: 'Chat with other TaskMate users',
};