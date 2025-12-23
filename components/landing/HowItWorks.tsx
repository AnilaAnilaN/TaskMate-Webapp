// components/landing/HowItWorks.tsx
import { Mail, Target, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Mail,
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account in seconds. Verify your email and you\'re ready to go.',
    },
    {
      icon: Target,
      number: '02',
      title: 'Organize',
      description: 'Add your tasks, create custom categories, and set priorities and due dates.',
    },
    {
      icon: Sparkles,
      number: '03',
      title: 'Accomplish',
      description: 'Track your progress, complete tasks, and get reminded. Stay productive effortlessly.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gray-50">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-gray-600">
            Start organizing your life in minutes, not hours.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 -z-10"></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Number Circle */}
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 mb-6 mx-auto shadow-lg">
                  {step.number}
                </div>

                {/* Icon Badge */}
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 mx-auto border-2 border-yellow-400 shadow-md">
                  <Icon className="w-7 h-7 text-yellow-600" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Connector */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-8 bg-yellow-400 mx-auto my-6"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}