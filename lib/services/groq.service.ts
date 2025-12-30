// lib/services/groq.service.ts
import Groq from 'groq-sdk';
import type { AssistantMessage } from '@/types/assistant.types';

class GroqService {
  private groq: Groq;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not defined in environment variables');
    }
    
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Generate a response from Groq AI
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: AssistantMessage[] = [],
    customSystemPrompt?: string
  ): Promise<{ text: string; metadata: any }> {
    try {
      const startTime = Date.now();

      // Build conversation history for context
      const messages = [
        {
          role: 'system' as const,
          content: customSystemPrompt || this.getSystemPrompt(),
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      // Send request to Groq
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile', // Fast and powerful
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95,
      });

      const text = completion.choices[0]?.message?.content || 'No response generated';
      const responseTime = Date.now() - startTime;

      return {
        text,
        metadata: {
          model: 'llama-3.3-70b-versatile',
          responseTime,
          tokens: completion.usage?.total_tokens || 0,
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('❌ Groq API Error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        type: error.type,
      });
      
      // Re-throw with more specific error message
      if (error.status === 401 || error.code === 'invalid_api_key') {
        throw new Error('Invalid Groq API key. Please check your GROQ_API_KEY in .env.local');
      }
      
      throw new Error(
        error.message || 'Failed to generate response from AI'
      );
    }
  }

  /**
   * Generate streaming response from Groq AI
   */
  async *generateStreamingResponse(
    userMessage: string,
    conversationHistory: AssistantMessage[] = []
  ): AsyncGenerator<string, void, unknown> {
    try {
      const messages = [
        {
          role: 'system' as const,
          content: this.getSystemPrompt(),
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      const stream = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error: any) {
      console.error('Groq Streaming Error:', error);
      throw new Error(
        error.message || 'Failed to generate streaming response'
      );
    }
  }

  /**
   * Get system prompt for TaskMate context
   */
  private getSystemPrompt(): string {
    return `You are an AI assistant for TaskMate, a task management application. 
You help users with:
- Task planning and organization
- Time management strategies
- Productivity tips
- Breaking down complex tasks
- Setting priorities
- Creating task schedules
- General task-related advice

Always be helpful, concise, and actionable in your responses. Focus on practical advice related to task management.

When users ask about tasks, provide specific, actionable suggestions. Use bullet points when listing multiple items. Keep your responses clear and easy to follow.`;
  }

  /**
   * Analyze a task and provide suggestions
   */
  async analyzeTask(taskTitle: string, taskDescription?: string): Promise<string> {
    const prompt = `Analyze this task and provide brief, actionable suggestions:
    
Task: ${taskTitle}
${taskDescription ? `Description: ${taskDescription}` : ''}

Provide:
1. Suggested subtasks (if applicable)
2. Estimated time needed
3. Priority level recommendation
4. One key tip for completion

Keep response concise and practical.`;

    const result = await this.generateResponse(prompt, []);
    return result.text;
  }

  /**
   * Generate task suggestions based on user input
   */
  async suggestTasks(userInput: string): Promise<string> {
    const prompt = `Based on this input, suggest 3-5 specific, actionable tasks:

Input: ${userInput}

Format each task as a bullet point. Be specific and practical.`;

    const result = await this.generateResponse(prompt, []);
    return result.text;
  }
}

export const groqService = new GroqService();