// components/assistant/AssistantClient.tsx - IMPROVED VERSION
'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Trash2, Loader2, Sparkles, Bot } from 'lucide-react';
import type { AssistantMessage } from '@/types/assistant.types';

// Helper function to format text with bold, italic, and lists
const formatMessage = (text: string) => {
  // Split by code blocks first to preserve them
  const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
  
  return parts.map((part, i) => {
    // If it's a code block, render it specially
    if (part.startsWith('```')) {
      const code = part.slice(3, -3).trim();
      const lines = code.split('\n');
      const language = lines[0];
      const codeContent = lines.slice(1).join('\n') || code;
      
      return (
        <div key={i} className="my-3 rounded-lg bg-gray-900 text-gray-100 overflow-x-auto">
          {language && (
            <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
              {language}
            </div>
          )}
          <pre className="p-4 text-sm">
            <code>{codeContent}</code>
          </pre>
        </div>
      );
    }
    
    // Inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 bg-gray-200 rounded text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    
    // Process regular text for bold, italic, lists
    const lines = part.split('\n');
    return lines.map((line, j) => {
      // Bullet points (- or * at start)
      if (line.trim().match(/^[-*]\s/)) {
        const content = line.trim().slice(2);
        return (
          <div key={`${i}-${j}`} className="flex gap-2 my-1">
            <span className="text-yellow-500 mt-1">•</span>
            <span>{processInlineFormatting(content)}</span>
          </div>
        );
      }
      
      // Numbered lists
      if (line.trim().match(/^\d+\.\s/)) {
        const match = line.trim().match(/^(\d+)\.\s(.*)$/);
        if (match) {
          return (
            <div key={`${i}-${j}`} className="flex gap-2 my-1">
              <span className="text-yellow-600 font-semibold">{match[1]}.</span>
              <span>{processInlineFormatting(match[2])}</span>
            </div>
          );
        }
      }
      
      // Headers (## or ###)
      if (line.trim().startsWith('###')) {
        return (
          <h4 key={`${i}-${j}`} className="font-semibold text-base mt-3 mb-1">
            {line.trim().slice(3).trim()}
          </h4>
        );
      }
      if (line.trim().startsWith('##')) {
        return (
          <h3 key={`${i}-${j}`} className="font-bold text-lg mt-4 mb-2">
            {line.trim().slice(2).trim()}
          </h3>
        );
      }
      
      // Regular line
      return (
        <span key={`${i}-${j}`}>
          {processInlineFormatting(line)}
          {j < lines.length - 1 && <br />}
        </span>
      );
    });
  });
};

// Process bold (**text**) and italic (*text*)
const processInlineFormatting = (text: string) => {
  const parts = [];
  let currentIndex = 0;
  
  // Regex to match **bold** or *italic*
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      parts.push(text.slice(currentIndex, match.index));
    }
    
    const matched = match[0];
    if (matched.startsWith('**') && matched.endsWith('**')) {
      // Bold text
      parts.push(
        <strong key={match.index} className="font-bold text-gray-900">
          {matched.slice(2, -2)}
        </strong>
      );
    } else if (matched.startsWith('*') && matched.endsWith('*')) {
      // Italic text
      parts.push(
        <em key={match.index} className="italic">
          {matched.slice(1, -1)}
        </em>
      );
    }
    
    currentIndex = match.index + matched.length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

export default function AssistantClient() {
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/assistant?limit=100');
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const tempUserMsg: AssistantMessage = {
      id: `temp-${Date.now()}`,
      userId: 'current-user',
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempUserMsg.id),
          data.userMessage,
          data.aiMessage,
        ]);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMsg: AssistantMessage = {
        id: `error-${Date.now()}`,
        userId: 'system',
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all conversation history?')) return;

    try {
      const response = await fetch('/api/assistant', { method: 'DELETE' });
      const data = await response.json();

      if (data.success) {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">AI Assistant</h1>
            <p className="text-xs text-gray-500">Powered by Groq (Llama 3.3)</p>
          </div>
        </div>
        
        <button
          onClick={clearHistory}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Clear conversation history"
        >
          <Trash2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Start a conversation
            </h2>
            <p className="text-gray-500 max-w-md mb-6">
              Ask me anything about task management, productivity, or how to organize your work better.
            </p>
            <div className="space-y-2 w-full max-w-md">
              <button
                onClick={() => setInput('Help me prioritize my tasks for this week')}
                className="block w-full px-4 py-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                💡 Help me prioritize my tasks
              </button>
              <button
                onClick={() => setInput('How can I be more productive with my time?')}
                className="block w-full px-4 py-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🚀 How can I be more productive?
              </button>
              <button
                onClick={() => setInput('Break down a complex project into manageable tasks')}
                className="block w-full px-4 py-3 text-sm text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                📋 Break down a complex project
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm leading-relaxed">
                  {formatMessage(msg.content)}
                </div>
                <p className="text-xs mt-2 opacity-60">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-xs font-semibold text-gray-600">You</span>
                </div>
              )}
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 md:p-6 flex-shrink-0 bg-gray-50">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about task management..."
            disabled={loading}
            rows={1}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none disabled:opacity-50 text-sm shadow-sm"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all flex items-center justify-center shadow-sm hover:shadow-md"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">Shift + Enter</kbd> for new line
          </p>
          <p className="text-xs text-gray-400">
            {messages.length} messages
          </p>
        </div>
      </div>
    </div>
  );
}