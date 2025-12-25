// app/assistant/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt from 'jsonwebtoken';
import AssistantClient from '@/components/assistant/AssistantClient';

export const metadata = {
  title: 'AI Assistant | TaskMate',
  description: 'Chat with your AI assistant for task management help',
};

async function getUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

export default async function AssistantPage() {
  const userId = await getUserId();
  
  if (!userId) {
    redirect('/auth');
  }

  return <AssistantClient />;
}