// components/landing/Pricing.tsx
import { Check, Sparkles } from 'lucide-react';

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
    'Live chat with users',
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to stay productive. No hidden fees, no surprises.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="relative p-6 md:p-8 bg-white rounded-2xl border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all">
            {/* Popular Badge */}
            <div className="absolute -top-3 left-6 px-4 py-1 bg-yellow-400 rounded-full text-xs font-bold text-gray-900">
              MOST POPULAR
            </div>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Forever</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-600">Perfect for personal use</p>
            </div>

            {/* Features List - Compact */}
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="/auth"
              className="block w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-center rounded-xl transition-all hover:scale-105"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro Plan - Coming Soon */}
          <div className="relative p-6 md:p-8 bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            {/* Coming Soon Badge */}
            <div className="absolute -top-3 left-6 px-4 py-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
              COMING SOON
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-white">TaskMate Pro</h3>
                <Sparkles className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-sm text-gray-400">For teams and power users</p>
            </div>

            {/* Pro Features */}
            <div className="space-y-3 mb-6">
              {[
                'Everything in Free',
                'Advanced analytics & insights',
                'Team collaboration features',
                'Unlimited file attachments',
                'Priority email support',
                'Custom integrations',
                'Export to multiple formats',
                'Ad-free experience',
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Notify Button */}
            <button
              disabled
              className="w-full py-3 px-6 bg-white/10 text-white font-bold text-center rounded-xl cursor-not-allowed backdrop-blur-sm border border-white/20"
            >
              Notify Me When Available
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <p className="text-center text-sm text-gray-500 mt-8">
          All plans include bank-level security and data encryption
        </p>
      </div>
    </section>
  );
}