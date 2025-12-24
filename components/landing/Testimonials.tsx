// components/landing/Testimonials.tsx
'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasAnimated(true);
          let startTime: number;
          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;

            if (progress < 1) {
              setCount(Math.floor(end * progress));
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return <span>{count}{suffix}</span>;
};

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: 'TaskMate transformed how I manage my daily work. The categories and priorities make everything so clear!',
      author: 'Sarah Chen',
      role: 'Product Manager',
    },
    {
      rating: 5,
      text: 'Finally, a task manager that does not overwhelm me. Simple, beautiful, and exactly what I needed.',
      author: 'Marcus Rodriguez',
      role: 'Freelance Designer',
    },
    {
      rating: 5,
      text: 'The daily reminders and live support keep me on track. Best productivity app I have used.',
      author: 'Emily Thompson',
      role: 'Graduate Student',
    },
  ];

  const stats = [
    { value: 1000, suffix: '+', label: 'Active Users' },
    { value: 5000, suffix: '+', label: 'Tasks Created' },
    { value: 10000, suffix: '+', label: 'Hours Saved' },
    { value: 99, suffix: '%', label: 'Satisfaction' },
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Productive People
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of happy users who have transformed their productivity.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 md:p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                {testimonial.text}
              </p>

              {/* Author */}
              <div>
                <div className="font-bold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Animated Stats Row */}
        <div id="stats-section" className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pt-12 md:pt-16 border-t border-gray-200">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-500 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}