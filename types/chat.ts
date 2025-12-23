// types/chat.ts
// ============================================
export interface Message {
  id?: string;
  _id?: string;
  text: string;
  senderId: string | {
    id?: string;
    _id?: string;
    name: string;
    profileImage?: string | null;
  };
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    name: string;
    email: string;
    profileImage?: string | null;
  };
  lastMessage?: {
    text: string;
    timestamp: Date;
  };
  unreadCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  bio?: string;
}
