// app/about/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Target, Users, Heart, Zap, CheckSquare, TrendingUp, Shield, MessageCircle } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'Every feature is designed with our users in mind, focusing on simplicity and effectiveness.',
    },
    {
      icon: Heart,
      title: 'Passion-Driven',
      description: 'We are passionate about productivity and committed to helping people accomplish their goals.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data security and privacy are our top priorities. We use industry-leading encryption.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve and add features based on user feedback and emerging needs.',
    },
  ];

  const milestones = [
    { year: '2024', event: 'TaskMate launched to the public' },
    { year: '2024', event: 'Reached 1,000+ active users' },
    { year: '2024', event: 'Introduced real-time chat feature' },
    { year: '2025', event: 'Planning team collaboration features' },
  ];

  const team = [
    {
      name: 'Development Team',
      description: 'Building robust, scalable features',
      icon: CheckSquare,
    },
    {
      name: 'Design Team',
      description: 'Crafting beautiful user experiences',
      icon: Heart,
    },
    {
      name: 'Support Team',
      description: 'Helping users succeed every day',
      icon: MessageCircle,
    },
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 py-16 md:py-24 mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                About TaskMate
              </h1>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                We're on a mission to help people organize their lives, accomplish their goals, 
                and spend less time managing tasks so they have more time for what truly matters.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800 mb-6">
                  <Target className="w-4 h-4" />
                  Our Story
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Built for Real People, Real Productivity
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    TaskMate was born from a simple frustration: existing task managers were either 
                    too complex or too simple. We wanted something that was powerful yet intuitive, 
                    feature-rich yet uncluttered.
                  </p>
                  <p>
                    What started as a side project quickly grew into something bigger. We realized 
                    that thousands of people were struggling with the same challenge—staying organized 
                    without feeling overwhelmed.
                  </p>
                  <p>
                    Today, TaskMate helps over 1,000 users organize their days, prioritize what matters, 
                    and collaborate with others. And we're just getting started.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-8 md:p-12">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">1,000+</div>
                      <div className="text-gray-700">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">5,000+</div>
                      <div className="text-gray-700">Tasks Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">99%</div>
                      <div className="text-gray-700">Satisfaction Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                      <div className="text-gray-700">Support Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600">
                To empower individuals and teams to achieve more by providing simple, 
                effective tools for task management and collaboration.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all">
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
        </section>

        {/* Timeline */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600">
                Key milestones in the TaskMate story
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-yellow-400"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative pl-20">
                    <div className="absolute left-6 w-5 h-5 bg-yellow-400 rounded-full border-4 border-white"></div>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="text-sm font-bold text-yellow-600 mb-1">{milestone.year}</div>
                      <div className="text-gray-900 font-medium">{milestone.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600">
                Dedicated professionals working to make TaskMate better every day
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => {
                const Icon = member.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                    </h3>
                    <p className="text-gray-600">
                      {member.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-yellow-400 to-yellow-500">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-gray-800 mb-8">
              Start organizing your tasks and achieving your goals with TaskMate today.
            </p>
            <a
              href="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              Get Started Free
              <TrendingUp className="w-5 h-5" />
            </a>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}

export const metadata = {
  title: 'About Us - TaskMate',
  description: 'Learn about TaskMate\'s mission to help people organize their lives and accomplish their goals.',
};