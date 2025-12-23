// components/landing/Testimonials.tsx
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: 'TaskMate transformed how I manage my daily work. The categories and priorities make everything so clear!',
      author: 'Sarah Chen',
      role: 'Product Manager',
      avatar: '👩‍💼',
    },
    {
      rating: 5,
      text: 'Finally, a task manager that doesn\'t overwhelm me. Simple, beautiful, and exactly what I needed.',
      author: 'Marcus Rodriguez',
      role: 'Freelance Designer',
      avatar: '👨‍🎨',
    },
    {
      rating: 5,
      text: 'The daily reminders keep me on track without being annoying. Best productivity app I\'ve used.',
      author: 'Emily Thompson',
      role: 'Graduate Student',
      avatar: '👩‍🎓',
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-32 bg-white">
      <div className="container-responsive">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 text-gray-900 mb-4">
            Loved by Productive People
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of happy users who've transformed their productivity.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50 rounded-2xl border border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">1,000+</div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">5,000+</div>
            <div className="text-gray-600">Tasks Created</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">10,000+</div>
            <div className="text-gray-600">Hours Saved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-500 mb-2">99%</div>
            <div className="text-gray-600">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
}