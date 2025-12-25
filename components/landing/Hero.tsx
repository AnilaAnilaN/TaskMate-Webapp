// components/landing/Hero.tsx
'use client';

import { CheckSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              Your productivity companion
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Organize Your Day,
              <span className="text-yellow-500"> Accomplish</span> Your Goals
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              TaskMate helps you stay on top of your tasks with smart categories, 
              priority management, and gentle reminders—all in one beautiful app.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/auth"
                className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-all"
              >
                See Features
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-600 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                Free forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
                1000+ happy users
              </div>
            </div>
          </div>

          {/* Right Screenshot - Browser Window Style */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-2xl">
              {/* Browser chrome mockup */}
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-2xl shadow-black/20 transition-transform duration-500 hover:scale-[1.02]">
                {/* Top bar */}
                <div className="flex items-center gap-2 border-b border-gray-200 bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-3">
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto flex items-center gap-2 rounded-lg bg-white px-6 md:px-10 py-1.5 text-xs text-gray-500 shadow-inner">
                    <div className="w-3 h-3 text-gray-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15l-3-3h6l-3 3z"/>
                      </svg>
                    </div>
                    <span className="font-medium">taskmate.app/dashboard</span>
                  </div>
                  <div className="w-16"></div>
                </div>
                
                {/* Screenshot */}
                <div className="relative bg-white">
                  <Image
                    src="/hero-right.PNG"
                    alt="TaskMate Dashboard Interface"
                    width={1200}
                    height={800}
                    className="w-full rounded-b-2xl"
                    priority
                  />
                </div>
              </div>
              
              {/* Decorative gradient blobs */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-200 rounded-full blur-3xl opacity-40 -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}