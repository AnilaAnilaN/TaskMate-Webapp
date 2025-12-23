// components/landing/Pricing.tsx
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  const features = [
    'Unlimited tasks',
    'Custom categories',
    'Priority management',
    'Email notifications',
    'Rich text notes',
    'Due date tracking',
    'Progress insights',
    'Mobile responsive',
    'Secure & encrypted',
  ];

  return (
    <section id="pricing" className="py-20 md:py-32 bg-gray-50">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            Start Free, Upgrade Anytime
          </h2>
          <p className="text-lg text-gray-600">
            Get started with all core features—no credit card required.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative p-8 md:p-10 bg-white rounded-3xl border-2 border-yellow-400 shadow-xl">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-yellow-400 rounded-full text-sm font-bold text-gray-900">
              MOST POPULAR
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Free Forever</h3>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Everything you need to stay productive</p>
            </div>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/auth"
              className="block w-full py-4 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-center rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              Get Started Free →
            </Link>

            <p className="text-center text-sm text-gray-500 mt-4">
              No credit card required • Cancel anytime
            </p>
          </div>

          {/* Future Pro Badge */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl text-center">
            <p className="text-gray-300 mb-2">🚀 Coming Soon</p>
            <p className="text-white font-bold text-lg mb-1">TaskMate Pro</p>
            <p className="text-gray-400 text-sm">
              Advanced analytics, team collaboration, and more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}