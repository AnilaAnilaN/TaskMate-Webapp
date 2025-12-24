// components/landing/FinalCTA.tsx
import { Zap, Lock, Heart, ArrowRight, CheckCircle } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-400">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Ready to Get Organized?
            </h2>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
              Join TaskMate today and take control of your productivity. 
              Start accomplishing more with less stress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/auth"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl"
              >
                Start Free Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <div className="flex items-center gap-2 text-gray-800 justify-center lg:justify-start">
                <CheckCircle className="w-5 h-5 text-yellow-800" />
                <span className="font-medium">No credit card • Free forever</span>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap gap-6 pt-6 justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Quick Setup</div>
                  <div className="text-sm text-gray-700">Start in 2 minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Secure</div>
                  <div className="text-sm text-gray-700">Your data is safe</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Loved</div>
                  <div className="text-sm text-gray-700">99% satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="relative">
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-white/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-500">1000+</div>
                  <div className="text-sm text-gray-600 mt-1">Happy Users</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-500">99%</div>
                  <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-500">5000+</div>
                  <div className="text-sm text-gray-600 mt-1">Tasks Done</div>
                </div>
                <div className="bg-white rounded-xl p-4 md:p-6 text-center hover:scale-105 transition-transform">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-500">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">Available</div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full blur-3xl opacity-30 -z-10"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-600 rounded-full blur-3xl opacity-20 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}