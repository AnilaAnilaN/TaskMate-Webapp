// app/careers/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Briefcase, Bell, Heart, Users, Zap, Coffee } from 'lucide-react';

export default function CareersPage() {
  const values = [
    {
      icon: Heart,
      title: 'Work-Life Balance',
      description: 'We believe in sustainable productivity and taking care of our team.',
    },
    {
      icon: Users,
      title: 'Collaborative Culture',
      description: 'Work with talented, passionate people who care about making a difference.',
    },
    {
      icon: Zap,
      title: 'Growth Opportunities',
      description: 'Continuous learning and development to help you reach your potential.',
    },
    {
      icon: Coffee,
      title: 'Remote-First',
      description: 'Work from anywhere while staying connected with the team.',
    },
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 py-16 md:py-24 mt-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 mb-6">
              <Briefcase className="w-4 h-4" />
              Join Our Team
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Build the Future of Productivity
            </h1>
            <p className="text-lg md:text-xl text-gray-800 leading-relaxed max-w-2xl mx-auto">
              Join us in creating tools that help millions of people organize their lives and accomplish their goals.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          {/* No Openings Notice */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-lg p-8 md:p-12 text-center mb-12">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              No Open Positions Right Now
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
              We're not currently hiring, but we're always growing and looking for talented people to join our mission. 
              Check back soon or get notified when new positions open up.
            </p>

            {/* Notification Signup */}
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all hover:scale-105 whitespace-nowrap inline-flex items-center justify-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notify Me
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                We'll email you when new opportunities become available
              </p>
            </div>
          </div>

          {/* Why Work With Us */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Why Work With Us?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all"
                  >
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stay Connected */}
          <div className="bg-gradient-to-br from-yellow-50 to-white rounded-3xl border border-yellow-200 p-8 md:p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Connected
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Follow our journey and be the first to know about new opportunities, 
              company updates, and what we're building.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://twitter.com/taskmate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-all"
              >
                Follow on Twitter
              </a>
              <a
                href="https://linkedin.com/company/taskmate"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl border-2 border-gray-200 transition-all"
              >
                Follow on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export const metadata = {
  title: 'Careers - TaskMate',
  description: 'Join the TaskMate team and help build the future of productivity.',
};