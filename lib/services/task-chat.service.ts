// lib/services/task-chat.service.ts
import mongoose from 'mongoose';
import TaskChatModel from '@/models/TaskChat.model';
import { groqService } from './groq.service';
import type { TaskChatMessage, TaskContext } from '@/types/task-chat.types';

class TaskChatService {
  /**
   * Save a chat message
   */
  async saveMessage(
    taskId: string,
    userId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
  ): Promise<TaskChatMessage> {
    const message = await TaskChatModel.create({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
      role,
      content,
      metadata,
      timestamp: new Date(),
    });

    return {
      id: message._id.toString(),
      taskId: message.taskId.toString(),
      userId: message.userId.toString(),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    };
  }

  /**
   * Get chat history for a specific task
   */
  async getTaskChatHistory(
    taskId: string,
    userId: string,
    limit: number = 50
  ): Promise<TaskChatMessage[]> {
    const messages = await TaskChatModel.find({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return messages.reverse().map((msg: any) => ({
      id: msg._id.toString(),
      taskId: msg.taskId.toString(),
      userId: msg.userId.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));
  }

  /**
   * Get recent context for AI (last N messages)
   */
  async getRecentContext(
    taskId: string,
    userId: string,
    limit: number = 10
  ): Promise<TaskChatMessage[]> {
    const messages = await TaskChatModel.find({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return messages.reverse().map((msg: any) => ({
      id: msg._id.toString(),
      taskId: msg.taskId.toString(),
      userId: msg.userId.toString(),
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      metadata: msg.metadata,
      createdAt: msg.createdAt,
      updatedAt: msg.updatedAt,
    }));
  }

  /**
   * Build context-aware system prompt
   */
  private buildTaskContextPrompt(taskContext: TaskContext): string {
    const { title, description, status, priority, dueDate, categoryName, estimatedTime, actualTime } = taskContext;

    // Strip HTML tags from description
    const plainDescription = description.replace(/<[^>]*>/g, ' ').trim();

    let prompt = `You are an AI assistant helping with a specific task in TaskMate. Here's the task information:

**Task Title:** ${title}
**Status:** ${status}
**Priority:** ${priority}`;

    if (categoryName) {
      prompt += `\n**Category:** ${categoryName}`;
    }

    if (dueDate) {
      const dueDateTime = new Date(dueDate);
      const now = new Date();
      const daysUntilDue = Math.ceil((dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      prompt += `\n**Due Date:** ${dueDateTime.toLocaleDateString()} (${daysUntilDue > 0 ? `in ${daysUntilDue} days` : daysUntilDue === 0 ? 'today' : `${Math.abs(daysUntilDue)} days overdue`})`;
    }

    if (estimatedTime) {
      prompt += `\n**Estimated Time:** ${estimatedTime} minutes`;
    }

    if (actualTime && actualTime > 0) {
      prompt += `\n**Time Spent:** ${actualTime} minutes`;
    }

    if (plainDescription && plainDescription.length > 0) {
      prompt += `\n**Description:** ${plainDescription.substring(0, 500)}${plainDescription.length > 500 ? '...' : ''}`;
    }

    prompt += `\n\nYour role is to:
- Provide specific help related to THIS task only
- Suggest actionable steps to complete this task
- Help break down the task if it's complex
- Answer questions about the task details
- Offer time management advice for this specific task
- Suggest improvements or alternatives for the task approach

Always be concise, actionable, and focused on helping complete THIS specific task. Reference the task details when relevant.`;

    return prompt;
  }

  /**
   * Send a message and get AI response with task context
   */
  async sendMessage(
    taskId: string,
    userId: string,
    message: string,
    taskContext: TaskContext
  ): Promise<{ userMessage: TaskChatMessage; aiMessage: TaskChatMessage }> {
    // Save user message
    const userMessage = await this.saveMessage(taskId, userId, 'user', message);

    // Get recent conversation context
    const conversationHistory = await this.getRecentContext(taskId, userId, 8);

    // Build task-aware system prompt
    const systemPrompt = this.buildTaskContextPrompt(taskContext);

    // Generate AI response with task context
    const startTime = Date.now();
    
    // Use custom system prompt for task context
    const { text, metadata } = await groqService.generateResponse(
      message,
      conversationHistory,
      systemPrompt // Pass custom system prompt
    );

    // Save AI response
    const aiMessage = await this.saveMessage(taskId, userId, 'assistant', text, {
      ...metadata,
      responseTime: Date.now() - startTime,
    });

    return { userMessage, aiMessage };
  }

  /**
   * Clear chat history for a task
   */
  async clearTaskChat(taskId: string, userId: string): Promise<void> {
    await TaskChatModel.deleteMany({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  /**
   * Get chat message count for a task
   */
  async getMessageCount(taskId: string, userId: string): Promise<number> {
    return await TaskChatModel.countDocuments({
      taskId: new mongoose.Types.ObjectId(taskId),
      userId: new mongoose.Types.ObjectId(userId),
    });
  }
}

export const taskChatService = new TaskChatService();