// types/assistant.types.ts
export interface AssistantMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    responseTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessagePayload {
  message: string;
  conversationContext?: AssistantMessage[];
}

export interface AssistantResponse {
  success: boolean;
  message?: AssistantMessage;
  error?: string;
}

export interface AssistantHistoryResponse {
  success: boolean;
  messages: AssistantMessage[];
  error?: string;
}

export interface StreamResponse {
  text: string;
  done: boolean;
  error?: string;
}