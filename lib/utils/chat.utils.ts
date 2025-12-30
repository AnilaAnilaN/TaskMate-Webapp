// lib/utils/chat.utils.ts

import type { TaskChatMessage } from '@/types/task-chat.types';

/**
 * Format timestamp for display
 */
export function formatChatTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  // If today, show time
  if (diffInHours < 24 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // If yesterday
  if (diffInHours < 48 && d.getDate() === now.getDate() - 1) {
    return `Yesterday ${d.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }

  // Otherwise, show date
  return d.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Calculate average response time from messages
 */
export function calculateAverageResponseTime(
  messages: TaskChatMessage[]
): number {
  const aiMessages = messages.filter(
    msg => msg.role === 'assistant' && msg.metadata?.responseTime
  );

  if (aiMessages.length === 0) return 0;

  const total = aiMessages.reduce(
    (sum, msg) => sum + (msg.metadata?.responseTime || 0),
    0
  );

  return Math.round(total / aiMessages.length);
}

/**
 * Calculate total tokens used
 */
export function calculateTotalTokens(
  messages: TaskChatMessage[]
): number {
  return messages.reduce(
    (sum, msg) => sum + (msg.metadata?.tokens || 0),
    0
  );
}

/**
 * Group messages by date
 */
export function groupMessagesByDate(
  messages: TaskChatMessage[]
): Record<string, TaskChatMessage[]> {
  const groups: Record<string, TaskChatMessage[]> = {};

  messages.forEach(msg => {
    const date = new Date(msg.timestamp);
    const key = date.toLocaleDateString([], { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(msg);
  });

  return groups;
}

/**
 * Get suggested prompts based on task context
 */
export function getSuggestedPrompts(taskContext: {
  status: string;
  priority: string;
  dueDate?: Date | string;
  description?: string;
}): string[] {
  const prompts: string[] = [];

  // Status-based prompts
  if (taskContext.status === 'todo') {
    prompts.push('How should I get started with this task?');
    prompts.push('What are the first steps I should take?');
  } else if (taskContext.status === 'in-progress') {
    prompts.push('Any tips to complete this faster?');
    prompts.push('Am I on the right track?');
  }

  // Priority-based prompts
  if (taskContext.priority === 'high') {
    prompts.push('What should I prioritize first?');
    prompts.push('How can I complete this efficiently?');
  }

  // Due date-based prompts
  if (taskContext.dueDate) {
    const dueDate = new Date(taskContext.dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilDue <= 3 && daysUntilDue >= 0) {
      prompts.push('How can I meet my deadline?');
    }
  }

  // General prompts
  prompts.push('Break this down into subtasks');
  prompts.push('Any tips for completing this efficiently?');
  prompts.push('What could go wrong and how to prevent it?');

  // Return up to 6 unique prompts
  return [...new Set(prompts)].slice(0, 6);
}

/**
 * Sanitize message content for display
 */
export function sanitizeMessage(content: string): string {
  // Remove excessive newlines
  let sanitized = content.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > 5000) {
    sanitized = sanitized.substring(0, 5000) + '...';
  }

  return sanitized;
}

/**
 * Extract action items from AI response
 */
export function extractActionItems(content: string): string[] {
  const actionItems: string[] = [];
  
  // Match numbered lists (1., 2., etc.)
  const numberedMatches = content.match(/^\d+\.\s+(.+)$/gm);
  if (numberedMatches) {
    actionItems.push(...numberedMatches.map(m => m.replace(/^\d+\.\s+/, '')));
  }

  // Match bullet points (-, *, •)
  const bulletMatches = content.match(/^[-*•]\s+(.+)$/gm);
  if (bulletMatches) {
    actionItems.push(...bulletMatches.map(m => m.replace(/^[-*•]\s+/, '')));
  }

  return actionItems;
}

/**
 * Format response time for display
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Check if message is a question
 */
export function isQuestion(content: string): boolean {
  const trimmed = content.trim();
  return (
    trimmed.endsWith('?') ||
    trimmed.toLowerCase().startsWith('how') ||
    trimmed.toLowerCase().startsWith('what') ||
    trimmed.toLowerCase().startsWith('when') ||
    trimmed.toLowerCase().startsWith('where') ||
    trimmed.toLowerCase().startsWith('why') ||
    trimmed.toLowerCase().startsWith('can') ||
    trimmed.toLowerCase().startsWith('should')
  );
}

/**
 * Generate chat summary
 */
export function generateChatSummary(
  messages: TaskChatMessage[]
): {
  totalMessages: number;
  userMessages: number;
  aiMessages: number;
  averageResponseTime: number;
  totalTokens: number;
  lastMessageAt?: Date;
} {
  const userMessages = messages.filter(m => m.role === 'user');
  const aiMessages = messages.filter(m => m.role === 'assistant');

  return {
    totalMessages: messages.length,
    userMessages: userMessages.length,
    aiMessages: aiMessages.length,
    averageResponseTime: calculateAverageResponseTime(messages),
    totalTokens: calculateTotalTokens(messages),
    lastMessageAt: messages.length > 0 
      ? new Date(messages[messages.length - 1].timestamp)
      : undefined,
  };
}

/**
 * Validate message content
 */
export function validateMessage(content: string): {
  valid: boolean;
  error?: string;
} {
  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Message cannot be empty' };
  }

  if (content.length > 2000) {
    return { 
      valid: false, 
      error: 'Message too long (max 2000 characters)' 
    };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      return { 
        valid: false, 
        error: 'Message contains invalid content' 
      };
    }
  }

  return { valid: true };
}

/**
 * Format markdown-like text for display
 */
export function formatMessageContent(content: string): string {
  let formatted = content;

  // Bold: **text** or __text__
  formatted = formatted.replace(
    /\*\*(.+?)\*\*|__(.+?)__/g,
    '<strong>$1$2</strong>'
  );

  // Italic: *text* or _text_
  formatted = formatted.replace(
    /\*(.+?)\*|_(.+?)_/g,
    '<em>$1$2</em>'
  );

  // Code: `code`
  formatted = formatted.replace(
    /`(.+?)`/g,
    '<code>$1</code>'
  );

  return formatted;
}

/**
 * Export chat history as text
 */
export function exportChatAsText(
  messages: TaskChatMessage[],
  taskTitle: string
): string {
  let text = `Chat History: ${taskTitle}\n`;
  text += `Exported: ${new Date().toLocaleString()}\n`;
  text += `${'='.repeat(50)}\n\n`;

  const grouped = groupMessagesByDate(messages);

  Object.entries(grouped).forEach(([date, msgs]) => {
    text += `${date}\n${'-'.repeat(date.length)}\n\n`;

    msgs.forEach(msg => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      const role = msg.role === 'user' ? 'You' : 'Assistant';
      text += `[${time}] ${role}:\n${msg.content}\n\n`;
    });
  });

  return text;
}

/**
 * Export chat history as JSON
 */
export function exportChatAsJSON(
  messages: TaskChatMessage[],
  taskTitle: string
): string {
  const exportData = {
    taskTitle,
    exportedAt: new Date().toISOString(),
    messageCount: messages.length,
    summary: generateChatSummary(messages),
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: msg.metadata,
    })),
  };

  return JSON.stringify(exportData, null, 2);
}