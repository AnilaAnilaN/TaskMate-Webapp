// components/landing/ChatSupport.tsx
import { MessageCircle, Users, Search, Zap } from 'lucide-react';

const ChatSupportSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto max-w-md mx-auto">
    <defs>
      <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    
    {/* Chat window */}
    <rect x="50" y="40" width="300" height="220" rx="15" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
    
    {/* Header */}
    <rect x="50" y="40" width="300" height="50" rx="15" fill="url(#chatGrad)"/>
    <circle cx="80" cy="65" r="15" fill="white" opacity="0.9"/>
    <text x="110" y="72" fontSize="18" fill="white" fontWeight="bold">Chat with Sarah</text>
    <circle cx="320" cy="65" r="5" fill="#34D399"/>
    
    {/* Messages */}
    <rect x="70" y="110" width="180" height="35" rx="8" fill="#F3F4F6"/>
    <rect x="150" y="160" width="180" height="35" rx="8" fill="#FCD34D"/>
    <rect x="70" y="210" width="160" height="35" rx="8" fill="#F3F4F6"/>
    
    {/* Typing indicator */}
    <circle cx="180" cy="235" r="3" fill="#9CA3AF">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="195" cy="235" r="3" fill="#9CA3AF">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="210" cy="235" r="3" fill="#9CA3AF">
      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" begin="0.4s" repeatCount="indefinite"/>
    </circle>
    
    {/* User avatar icon */}
    <circle cx="330" cy="240" r="25" fill="url(#chatGrad)"/>
    <circle cx="330" cy="235" r="8" fill="white"/>
    <path d="M 315 255 Q 330 248 345 255" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

export default function ChatSupport() {
  const features = [
    {
      icon: Search,
      text: 'Find users by name or email instantly',
    },
    {
      icon: MessageCircle,
      text: 'Real-time 1:1 conversations',
    },
    {
      icon: Zap,
      text: 'Collaborate on tasks and projects',
    },
  ];

  return (
    <section id="chat" className="py-16 md:py-24 bg-gradient-to-br from-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* SVG Illustration */}
          <div className="order-2 lg:order-1">
            <ChatSupportSVG />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800">
              <MessageCircle className="w-4 h-4" />
              Built-in Chat
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              Connect & Collaborate with Others
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed">
              Chat directly with other TaskMate users in real-time. Search for friends or colleagues 
              by name or email, and start conversations instantly. Perfect for coordinating tasks and staying in sync.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              Start Chatting Now
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}