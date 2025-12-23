// components/landing/Hero.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-b from-yellow-50 to-white">
      <div className="container-responsive">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              Your productivity companion
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Organize Your Day,
              <span className="text-yellow-500"> Accomplish</span> Your Goals
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              TaskMate helps you stay on top of your tasks with smart categories, 
              priority management, and gentle reminders—all in one beautiful app.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started Free
              </Link>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-all"
              >
                See How It Works
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">✓</span>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">✓</span>
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">✓</span>
                1000+ happy users
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/hero-tasks.svg"
                alt="Task management illustration"
                width={600}
                height={500}
                className="w-full h-auto"
                priority
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-200 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}