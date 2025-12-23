// components/landing/FinalCTA.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-400">
      <div className="container-responsive">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Ready to Get Organized?
            </h2>
            <p className="text-xl text-gray-800 leading-relaxed">
              Join TaskMate today and take control of your productivity. 
              Start accomplishing more with less stress.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-xl"
              >
                Start Free Now
              </Link>
              <div className="flex items-center gap-2 text-gray-800">
                <span className="text-yellow-800">✓</span>
                <span className="font-medium">No credit card • Free forever</span>
              </div>
            </div>

            {/* Trust Elements */}
            <div className="flex flex-wrap gap-6 pt-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                <div>
                  <div className="font-bold text-gray-900">Quick Setup</div>
                  <div className="text-sm text-gray-700">Start in 2 minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🔒</span>
                <div>
                  <div className="font-bold text-gray-900">Secure</div>
                  <div className="text-sm text-gray-700">Your data is safe</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">💯</span>
                <div>
                  <div className="font-bold text-gray-900">Loved</div>
                  <div className="text-sm text-gray-700">99% satisfaction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/success-rocket.svg"
                alt="Success illustration"
                width={500}
                height={400}
                className="w-full h-auto"
              />
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