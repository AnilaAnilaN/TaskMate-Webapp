// components/chat/ChatWidgetProvider.tsx
'use client';

import dynamic from 'next/dynamic';

// Dynamically import the chat widget to avoid SSR issues
const SupportChatWidget = dynamic(() => import('./SupportChatWidget'), {
  ssr: false,
});

export default function ChatWidgetProvider() {
  return <SupportChatWidget />;
}