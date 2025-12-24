// components/landing/SocialProof.tsx
import { Users, Star, Shield, Zap } from 'lucide-react';

export default function SocialProof() {
  const stats = [
    {
      icon: Users,
      text: '1000+ Users',
    },
    {
      icon: Star,
      text: '4.9/5 Rating',
    },
    {
      icon: Shield,
      text: 'Bank-level Security',
    },
    {
      icon: Zap,
      text: '2 Min Setup',
    },
  ];

  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className={`w-5 h-5 text-yellow-500 ${stat.icon === Star ? 'fill-yellow-500' : ''}`} />
                <span className="text-gray-600 font-medium">{stat.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}