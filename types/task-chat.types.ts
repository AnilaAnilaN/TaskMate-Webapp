// types/task-chat.types.ts

/**
 * Task Chat Message Interface
 * Represents a single message in the task-specific chat
 */
export interface TaskChatMessage {
  id: string;
  taskId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    promptTokens?: number;
    completionTokens?: number;
    responseTime?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task Context Interface
 * Contains task information to provide context to the AI
 */
export interface TaskContext {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date | string;
  categoryName?: string;
  estimatedTime?: number;
  actualTime?: number;
  tags?: string[];
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

/**
 * Chat API Response Types
 */
export interface ChatHistoryResponse {
  success: boolean;
  messages: TaskChatMessage[];
  error?: string;
}

export interface SendMessageResponse {
  success: boolean;
  userMessage: TaskChatMessage;
  aiMessage: TaskChatMessage;
  error?: string;
}

export interface ClearChatResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Chat Statistics
 */
export interface ChatStats {
  messageCount: number;
  lastMessageAt?: Date;
  averageResponseTime?: number;
  totalTokensUsed?: number;
}