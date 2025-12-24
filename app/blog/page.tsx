// app/blog/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';

export default function BlogPage() {
  const blogPosts = [
    {
      id: '1',
      title: '10 Productivity Hacks That Actually Work in 2024',
      excerpt: 'Discover science-backed strategies to boost your productivity and accomplish more in less time. These proven techniques will transform how you work.',
      category: 'Productivity',
      author: 'Sarah Chen',
      date: 'December 20, 2024',
      readTime: '8 min read',
      image: '/blog/productivity-hacks.jpg', // Replace with your actual image
      featured: true,
    },
    {
      id: '2',
      title: 'The Ultimate Guide to Task Priority Management',
      excerpt: 'Learn the frameworks and strategies used by top performers to prioritize tasks effectively and focus on what truly matters for success.',
      category: 'Strategy',
      author: 'Michael Rodriguez',
      date: 'December 15, 2024',
      readTime: '10 min read',
      image: '/blog/priority-management.jpg', // Replace with your actual image
      featured: false,
    },
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 py-16 md:py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                TaskMate Blog
              </h1>
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                Insights, tips, and strategies to help you master productivity and achieve your goals.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full text-sm font-medium text-yellow-800 mb-6">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Featured Article
              </div>

              <Link href={`/blog/${featuredPost.id}`}>
                <article className="bg-white rounded-3xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          {featuredPost.category}
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-yellow-600 transition-colors">
                        {featuredPost.title}
                      </h2>

                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {featuredPost.excerpt}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>

                      {/* Read More */}
                      <div className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold group-hover:gap-3 transition-all">
                        Read Full Article
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.id}`}>
                    <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-yellow-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-yellow-100 to-yellow-200">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 md:p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                          {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{post.date}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="mt-4 inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold group-hover:gap-3 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {blogPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Check back soon for new articles!</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export const metadata = {
  title: 'Blog - TaskMate',
  description: 'Productivity tips, strategies, and insights to help you accomplish more.',
};