// components/landing/Features.tsx
import { 
  CheckSquare, 
  FolderOpen, 
  Target, 
  Calendar, 
  FileText, 
  Bell, 
  BarChart3, 
  Lock, 
  MessageCircle 
} from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Task Organization',
      description: 'Create, edit, and organize tasks effortlessly with drag-and-drop. Never lose track of what matters.',
    },
    {
      icon: FolderOpen,
      title: 'Custom Categories',
      description: 'Color-coded categories with visual icons. Work, Personal, Health—organize your way with clarity.',
    },
    {
      icon: Target,
      title: 'Priority Management',
      description: 'Urgent, High, Medium, Low priorities. Focus on what needs attention now with smart indicators.',
    },
    {
      icon: Calendar,
      title: 'Due Date Tracking',
      description: 'Set deadlines and get reminded. Calendar view of all your tasks. Never miss an important date.',
    },
    {
      icon: FileText,
      title: 'Rich Text Notes',
      description: 'Add detailed descriptions with full formatting. Links, lists, headings—keep all context in one place.',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Real-time in-app notifications and daily email reminders. Stay informed without being overwhelmed.',
    },
    {
      icon: BarChart3,
      title: 'Progress Insights',
      description: 'Track completed vs pending tasks. Visualize your productivity and celebrate your wins.',
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and safe. Email verification and secure password management built-in.',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat Support',
      description: 'Get instant help with real-time 1:1 chat support. We are here whenever you need us.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need to Stay Productive
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed to help you organize, prioritize, and accomplish your goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-400 transition-colors">
                  <Icon className="w-6 h-6 text-yellow-600 group-hover:text-gray-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}