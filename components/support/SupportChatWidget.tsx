// components/support/SupportChatWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Knowledge base for the AI chatbot
const knowledgeBase = {
  greetings: [
    "Hello! I'm TaskMate AI Assistant. How can I help you today?",
    "Hi there! I'm here to answer your questions about TaskMate. What would you like to know?",
  ],
  keywords: {
    pricing: {
      keywords: ['price', 'cost', 'free', 'paid', 'subscription', 'plan', 'pricing'],
      response: "TaskMate is completely free to use! All core features including unlimited tasks, custom categories, priority management, and real-time chat are included at no cost. We're planning a Pro version with advanced features like team collaboration and analytics, but the free version will always remain available with full functionality.",
    },
    features: {
      keywords: ['feature', 'can it', 'does it', 'what can', 'capabilities', 'functions'],
      response: "TaskMate offers powerful features including:\n\n• Smart task organization with drag-and-drop\n• Custom color-coded categories\n• Priority levels (Urgent, High, Medium, Low)\n• Due date tracking with calendar view\n• Rich text notes with formatting\n• Real-time user-to-user chat\n• Email notifications and reminders\n• Progress insights and analytics\n• Mobile responsive design\n\nWhat specific feature would you like to know more about?",
    },
    signup: {
      keywords: ['sign up', 'register', 'create account', 'join', 'get started', 'account'],
      response: "Getting started is easy! Just click the 'Get Started' button and sign up with your email. You'll receive a verification email, and once verified, you can start organizing your tasks immediately. No credit card required!",
    },
    mobile: {
      keywords: ['mobile', 'phone', 'app', 'ios', 'android', 'tablet'],
      response: "TaskMate is fully responsive and works beautifully on all devices including desktop, tablet, and mobile phones. Simply access it through your browser - no app download needed! The interface automatically adapts to your screen size for the best experience.",
    },
    security: {
      keywords: ['secure', 'security', 'safe', 'privacy', 'data', 'encryption', 'protected'],
      response: "Your security is our top priority! TaskMate uses:\n\n• End-to-end encryption (HTTPS/TLS)\n• Bcrypt password hashing\n• Email verification\n• Regular security audits\n• Secure authentication tokens\n• GDPR-compliant data practices\n\nYour data is encrypted both in transit and at rest.",
    },
    chat: {
      keywords: ['chat', 'message', 'talk', 'communicate', 'conversation'],
      response: "TaskMate includes real-time 1:1 chat! You can search for other users by name or email and start conversations instantly. It's perfect for coordinating tasks, sharing updates, or collaborating with friends and colleagues. The chat feature uses our signature yellow theme and delivers messages in real-time.",
    },
    categories: {
      keywords: ['category', 'categories', 'organize', 'folder', 'group'],
      response: "Categories help you organize tasks your way! Create custom categories like Work, Personal, Health, or anything else. Each category can have its own color and icon for easy visual identification. You can filter tasks by category and see everything organized at a glance.",
    },
    priority: {
      keywords: ['priority', 'urgent', 'important', 'prioritize'],
      response: "TaskMate offers 4 priority levels:\n\n• Urgent (Red) - Needs immediate attention\n• High (Orange) - Important and time-sensitive\n• Medium (Blue) - Standard priority\n• Low (Gray) - Can wait if needed\n\nYou can filter and sort tasks by priority to focus on what matters most.",
    },
    export: {
      keywords: ['export', 'download', 'backup', 'save'],
      response: "Task export functionality is coming soon! You'll be able to download your tasks in multiple formats including CSV, JSON, and PDF. For now, your data is securely backed up on our servers with daily backups.",
    },
    team: {
      keywords: ['team', 'collaborate', 'share', 'collaboration', 'together'],
      response: "Team collaboration features are planned for TaskMate Pro! This will include shared task lists, team workspaces, role-based permissions, and more. Currently, you can use the real-time chat feature to coordinate with other users.",
    },
    notifications: {
      keywords: ['notification', 'reminder', 'alert', 'notify', 'email'],
      response: "TaskMate keeps you informed with:\n\n• Real-time in-app notifications\n• Daily email summaries\n• Due date reminders\n• Task completion confirmations\n\nYou can customize notification preferences in your settings to avoid being overwhelmed.",
    },
    support: {
      keywords: ['help', 'support', 'contact', 'problem', 'issue', 'bug'],
      response: "I'm here to help! For additional support:\n\n• Email: support@taskmate.com (24-hour response)\n• Check our FAQ section for common questions\n• Report bugs through the contact form\n• Browse our Help Center for guides\n\nWhat specific issue can I help you with?",
    },
  },
  fallback: "I'm not sure I understand that question. Could you rephrase it? I can help you with information about TaskMate's features, pricing, security, getting started, and more. What would you like to know?",
};

export default function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm TaskMate AI Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
    }

    // Check knowledge base
    for (const [key, data] of Object.entries(knowledgeBase.keywords)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }

    return knowledgeBase.fallback;
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What features does TaskMate offer?",
    "Is TaskMate free?",
    "How do I get started?",
    "Is my data secure?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative">
            <Bot className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>

          {/* Pulse animation */}
          <span className="absolute inset-0 rounded-2xl bg-yellow-400 animate-ping opacity-20"></span>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
            <div className="font-semibold">Need Help?</div>
            <div className="text-xs text-gray-300">Chat with AI Assistant</div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border-2 border-yellow-400 z-50 transition-all ${isMinimized ? 'h-16' : 'h-[600px]'
          } flex flex-col`}>
          {/* Header */}
          <div className="bg-linear-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="font-bold">TaskMate Assistant</div>
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Minimize"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'bot' ? 'bg-yellow-100' : 'bg-gray-200'
                        }`}>
                        {message.sender === 'bot' ? (
                          <Bot className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <div
                          className={`px-4 py-3 rounded-2xl ${message.sender === 'user'
                              ? 'bg-yellow-400 text-gray-900'
                              : 'bg-white text-gray-800 border border-gray-200'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 px-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[80%]">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-yellow-100 text-gray-700 rounded-full transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}