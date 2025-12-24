// components/landing/FAQ.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSVG = () => (
  <svg viewBox="0 0 400 300" className="w-full h-auto max-w-sm mx-auto mb-8 md:mb-0">
    <defs>
      <linearGradient id="faqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    
    {/* Person */}
    <circle cx="200" cy="100" r="40" fill="url(#faqGrad)" />
    <path d="M 200 140 Q 200 145 195 150 L 180 200 L 200 200 L 200 240 L 190 260 L 180 260 M 200 140 Q 200 145 205 150 L 220 200 L 200 200 L 200 240 L 210 260 L 220 260" 
          fill="#1F2937" stroke="#1F2937" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
    {/* Question marks floating */}
    <g opacity="0.8">
      <text x="120" y="80" fontSize="32" fill="#F59E0B" fontWeight="bold">?</text>
      <text x="270" y="90" fontSize="28" fill="#FCD34D" fontWeight="bold">?</text>
      <text x="250" y="160" fontSize="24" fill="#F59E0B" fontWeight="bold">?</text>
    </g>
    
    {/* Speech bubble */}
    <rect x="80" y="180" width="240" height="80" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
    <polygon points="200,260 210,270 190,260" fill="white" stroke="#E5E7EB" strokeWidth="2"/>
    
    {/* Text lines in bubble */}
    <line x1="100" y1="200" x2="300" y2="200" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <line x1="100" y1="220" x2="280" y2="220" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <line x1="100" y1="240" x2="250" y2="240" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

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
      question: 'How does the live chat support work?',
      answer: 'Click the chat icon anytime you need help and connect with our support team in real-time. Get instant answers to your questions.',
    },
    {
      question: 'How secure is my data?',
      answer: 'Very secure. We use industry-standard encryption, secure authentication, and follow best practices to keep your data safe and private.',
    },
    {
      question: 'Can I export my tasks?',
      answer: 'Task export functionality is coming soon! You will be able to download your data in multiple formats.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* SVG Illustration */}
          <div className="order-2 lg:order-1">
            <FAQSVG />
          </div>

          {/* FAQ Content */}
          <div className="order-1 lg:order-2">
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600">
                Got questions? We have got answers.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
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
        </div>
      </div>
    </section>
  );
}