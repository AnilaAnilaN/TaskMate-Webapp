// components/landing/FAQ.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Is TaskMate really free?',
      answer: 'Yes! TaskMate is completely free to use with all core features included. No hidden costs, no trial periods - just sign up and start organizing.',
    },
    {
      question: 'Do I need a credit card to sign up?',
      answer: 'Absolutely not. We only need your email address to create an account. No payment information is ever required.',
    },
    {
      question: 'Can I access TaskMate on mobile?',
      answer: 'Yes! TaskMate is fully responsive and works beautifully on desktop, tablet, and mobile devices. Access your tasks anywhere.',
    },
    {
      question: 'How secure is my data?',
      answer: 'Very secure. We use industry-standard encryption, secure authentication, and follow best practices to keep your data safe and private.',
    },
    {
      question: 'Can I export my tasks?',
      answer: 'Task export functionality is coming soon! You\'ll be able to download your data in multiple formats.',
    },
    {
      question: 'Do you offer team or collaboration features?',
      answer: 'Not yet, but team features are planned for our Pro version. Stay tuned for updates!',
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Got questions? We've got answers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-yellow-400 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}