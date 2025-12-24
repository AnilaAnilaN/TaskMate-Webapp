// app/blog/[id]/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ShareButtons from '@/components/blog/ShareButtons';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

// This would typically come from a database or CMS
const blogPosts = {
  '1': {
    id: '1',
    title: '10 Productivity Hacks That Actually Work in 2024',
    excerpt: 'Discover science-backed strategies to boost your productivity and accomplish more in less time.',
    category: 'Productivity',
    author: 'Sarah Chen',
    date: 'December 20, 2024',
    readTime: '8 min read',
    image: '/blog/productivity-hacks.jpg',
    content: `
      <p><strong>Productivity isn't about doing more things—it's about doing the right things efficiently.</strong> After years of research and testing, we've compiled the most effective productivity hacks that actually deliver results.</p>

      <h2>1. The Two-Minute Rule</h2>
      <p>If a task takes less than two minutes to complete, do it immediately. This simple rule, popularized by David Allen in "Getting Things Done," prevents small tasks from piling up and cluttering your to-do list.</p>
      
      <p>The psychology behind this is powerful: completing quick tasks gives you momentum and reduces decision fatigue. Instead of constantly thinking "I should do that later," you simply get it done.</p>

      <h2>2. Time Blocking for Deep Work</h2>
      <p>Reserve specific blocks of time for focused, uninterrupted work. Studies show that it takes an average of 23 minutes to regain focus after a distraction. By blocking out time for deep work, you maximize your productivity during your peak mental hours.</p>

      <p>Start with 90-minute blocks. Turn off notifications, close unnecessary tabs, and work on a single high-priority task. The results will speak for themselves.</p>

      <h2>3. The Pomodoro Technique</h2>
      <p>Work in 25-minute focused intervals followed by 5-minute breaks. This technique leverages the psychological principle that the human brain works best in short bursts of concentrated effort.</p>

      <p>After four pomodoros, take a longer 15-30 minute break. This rhythm helps maintain high levels of focus throughout the day while preventing burnout.</p>

      <h2>4. Eat the Frog First</h2>
      <p>Mark Twain once said, "If it's your job to eat a frog, it's best to do it first thing in the morning." Tackle your most challenging or important task at the start of your day when your energy and willpower are highest.</p>

      <p>This approach eliminates procrastination and sets a productive tone for the rest of the day. Everything else feels easier after you've conquered your biggest challenge.</p>

      <h2>5. The 80/20 Rule (Pareto Principle)</h2>
      <p>Focus on the 20% of tasks that generate 80% of your results. Not all tasks are created equal. Identify which activities have the highest impact on your goals and prioritize them ruthlessly.</p>

      <p>Regularly audit your to-do list and eliminate or delegate tasks that don't significantly move the needle. This frees up time and mental energy for what truly matters.</p>

      <h2>6. Batch Similar Tasks Together</h2>
      <p>Group similar tasks and complete them in one focused session. Context switching drains mental energy and reduces efficiency. By batching emails, phone calls, or administrative work, you minimize the cognitive load of switching between different types of tasks.</p>

      <h2>7. Use the Five-Minute Rule for Procrastination</h2>
      <p>When you're avoiding a task, commit to working on it for just five minutes. Often, the hardest part is starting. Once you begin, momentum builds and you'll likely continue beyond the initial five minutes.</p>

      <p>This hack works because it lowers the psychological barrier to starting. Five minutes feels manageable, even for tasks you've been dreading.</p>

      <h2>8. Create a "Done" List</h2>
      <p>In addition to your to-do list, maintain a "done" list of completed tasks. This provides visual proof of your progress and boosts motivation. Our brains respond positively to seeing concrete evidence of accomplishment.</p>

      <h2>9. Implement a Weekly Review</h2>
      <p>Set aside time each week to review your progress, adjust priorities, and plan ahead. This bird's-eye view helps you stay aligned with your long-term goals and catch issues before they become problems.</p>

      <p>Use this time to celebrate wins, learn from challenges, and recalibrate your approach for the coming week.</p>

      <h2>10. Optimize Your Environment</h2>
      <p>Your physical and digital environment significantly impacts your productivity. Keep your workspace clean and organized. Use website blockers during focus time. Position your most important tools within easy reach.</p>

      <p>Small environmental tweaks compound over time. Make it easy to do the right thing and hard to get distracted.</p>

      <h2>Conclusion</h2>
      <p>These productivity hacks are backed by research and proven in practice. The key is to implement them one at a time, find what works for your unique situation, and build sustainable habits.</p>

      <p>Remember: productivity isn't about being busy—it's about being effective. Start with one or two of these hacks, master them, and then gradually incorporate others. Your future self will thank you.</p>
    `,
    tags: ['Productivity', 'Time Management', 'Work Efficiency', 'Personal Development'],
  },
  '2': {
    id: '2',
    title: 'The Ultimate Guide to Task Priority Management',
    excerpt: 'Learn the frameworks and strategies used by top performers to prioritize tasks effectively.',
    category: 'Strategy',
    author: 'Michael Rodriguez',
    date: 'December 15, 2024',
    readTime: '10 min read',
    image: '/blog/priority-management.jpg',
    content: `
      <p><strong>In today's fast-paced world, knowing what to work on is just as important as knowing how to work.</strong> Effective priority management is the difference between busy work and meaningful progress.</p>

      <h2>Understanding Priority vs. Urgency</h2>
      <p>The most common mistake in task management is confusing urgent tasks with important ones. Urgent tasks demand immediate attention but may not contribute to your long-term goals. Important tasks, on the other hand, align with your objectives and create lasting value.</p>

      <p>The Eisenhower Matrix helps distinguish between these categories by creating four quadrants: Urgent and Important, Not Urgent but Important, Urgent but Not Important, and Neither Urgent nor Important.</p>

      <h2>The Eisenhower Matrix in Practice</h2>
      <p><strong>Quadrant 1 (Urgent and Important):</strong> These are crises and deadlines that need immediate attention. While necessary, spending too much time here leads to stress and burnout. Examples include emergency meetings, pressing deadlines, and crisis management.</p>

      <p><strong>Quadrant 2 (Not Urgent but Important):</strong> This is where the magic happens. Strategic planning, skill development, relationship building, and preventive maintenance all live here. Successful people spend most of their time in this quadrant.</p>

      <p><strong>Quadrant 3 (Urgent but Not Important):</strong> These are distractions disguised as priorities. Many interruptions, some calls and emails, and other people's priorities fall here. Learn to delegate or minimize these tasks.</p>

      <p><strong>Quadrant 4 (Neither Urgent nor Important):</strong> Time wasters and trivial activities. Eliminate these ruthlessly.</p>

      <h2>The ABCDE Method</h2>
      <p>Brian Tracy's ABCDE method provides a simple prioritization framework:</p>

      <p><strong>A Tasks:</strong> Must do. Serious consequences if not completed. These are your non-negotiables.</p>

      <p><strong>B Tasks:</strong> Should do. Mild consequences if not completed. Important but not critical.</p>

      <p><strong>C Tasks:</strong> Nice to do. No consequences if not completed. These add value but aren't essential.</p>

      <p><strong>D Tasks:</strong> Delegate. Tasks others can do, freeing you for higher-value work.</p>

      <p><strong>E Tasks:</strong> Eliminate. Tasks that don't add value and waste time.</p>

      <h2>The MoSCoW Method</h2>
      <p>Particularly useful for project management, this method categorizes tasks as:</p>

      <p><strong>Must Have:</strong> Non-negotiable requirements. The project fails without these.</p>

      <p><strong>Should Have:</strong> Important but not vital. Can be deferred if necessary.</p>

      <p><strong>Could Have:</strong> Desirable but not necessary. Include if time and resources permit.</p>

      <p><strong>Won't Have:</strong> Agreed to be excluded from this phase. Park these for later consideration.</p>

      <h2>Value vs. Effort Matrix</h2>
      <p>Plot tasks on a grid with Value on one axis and Effort on the other. This creates four categories:</p>

      <p><strong>High Value, Low Effort (Quick Wins):</strong> Do these first. They deliver maximum impact with minimum investment.</p>

      <p><strong>High Value, High Effort (Major Projects):</strong> Schedule these strategically. They require significant resources but deliver substantial returns.</p>

      <p><strong>Low Value, Low Effort (Fill-ins):</strong> Use these to fill gaps between major tasks or when energy is low.</p>

      <p><strong>Low Value, High Effort (Time Wasters):</strong> Avoid or eliminate these tasks. They drain resources without meaningful return.</p>

      <h2>The 1-3-5 Rule</h2>
      <p>Each day, commit to completing: 1 big thing, 3 medium things, and 5 small things. This framework acknowledges that you can't do everything while ensuring you make meaningful progress.</p>

      <p>The structure prevents overwhelm while maintaining momentum across different types of tasks.</p>

      <h2>Priority Reassessment</h2>
      <p>Priorities aren't static. Conduct weekly reviews to reassess what matters most. Ask yourself:</p>

      <ul>
        <li>What must be done to move toward my goals?</li>
        <li>What can be delegated or eliminated?</li>
        <li>What new priorities have emerged?</li>
        <li>What old priorities are no longer relevant?</li>
      </ul>

      <h2>Common Pitfalls to Avoid</h2>
      <p><strong>The Urgency Trap:</strong> Letting urgent tasks crowd out important ones. Build buffer time for important work.</p>

      <p><strong>Priority Paralysis:</strong> Over-analyzing and never deciding. Use a simple framework and commit to action.</p>

      <p><strong>The Perfectionism Trap:</strong> Spending too much time on low-priority tasks. Done is better than perfect for non-critical items.</p>

      <p><strong>Saying Yes to Everything:</strong> Every yes to something is a no to something else. Protect your priorities by learning to decline.</p>

      <h2>Tools and Systems</h2>
      <p>While frameworks are important, the right tools help implement them effectively. TaskMate's priority management features let you:</p>

      <ul>
        <li>Tag tasks with priority levels</li>
        <li>Filter and sort by importance</li>
        <li>Set due dates to manage urgency</li>
        <li>Create categories aligned with your frameworks</li>
        <li>Review and adjust priorities easily</li>
      </ul>

      <h2>Making It Stick</h2>
      <p>Priority management is a skill that improves with practice. Start by:</p>

      <ol>
        <li>Choosing one framework that resonates with you</li>
        <li>Applying it consistently for 30 days</li>
        <li>Reviewing and adjusting based on results</li>
        <li>Gradually incorporating additional strategies</li>
      </ol>

      <p>Remember: the goal isn't to do more—it's to do what matters most. With effective priority management, you'll accomplish more meaningful work while feeling less overwhelmed.</p>

      <h2>Conclusion</h2>
      <p>Mastering priority management transforms how you work and live. It's not about cramming more into your day—it's about ensuring that what you do truly matters.</p>

      <p>Start implementing these frameworks today. Your productivity, peace of mind, and progress toward your goals will all benefit from this essential skill.</p>
    `,
    tags: ['Priority Management', 'Task Management', 'Strategy', 'Planning', 'Productivity'],
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts[id as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  const currentUrl = `https://taskmate.com/blog/${id}`;

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Featured Image */}
        <div className="relative h-[50vh] md:h-[60vh] mt-16">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10"></div>
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          
          {/* Title Overlay */}
          <div className="absolute inset-0 z-20 flex items-end">
            <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 pb-12 md:pb-16 w-full">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              
              <div className="mb-4">
                <span className="px-4 py-1.5 bg-yellow-400 text-gray-900 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          {/* Decorative frame around article */}
          <div className="relative">
            {/* Corner decorations */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-lg"></div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border-2 border-gray-100">
              {/* Article Body */}
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mt-12 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-yellow-600 prose-a:no-underline hover:prose-a:text-yellow-700
                  prose-strong:text-gray-900 prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:space-y-2
                  prose-ol:my-6 prose-ol:space-y-2
                  prose-li:text-gray-600
                  prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:pl-6 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-yellow-100 hover:text-yellow-800 transition-colors cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share Section - Client Component */}
              <ShareButtons title={post.title} url={currentUrl} />
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 bg-gradient-to-br from-yellow-50 to-white rounded-3xl p-8 md:p-10 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-gray-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">About {post.author}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {post.author} is a productivity expert and writer passionate about helping people accomplish more while maintaining balance. 
                  With years of experience in personal development and time management, they share practical strategies that make a real difference.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Blog CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Articles
            </Link>
          </div>
        </article>
      </div>
      
      <Footer />
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = blogPosts[id as keyof typeof blogPosts];
  
  if (!post) {
    return {
      title: 'Post Not Found - TaskMate Blog',
    };
  }

  return {
    title: `${post.title} - TaskMate Blog`,
    description: post.excerpt,
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((id) => ({
    id: id,
  }));
}