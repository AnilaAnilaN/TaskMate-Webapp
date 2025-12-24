// app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import ChatSupport from '@/components/landing/ChatSupport';
import SocialProof from '@/components/landing/SocialProof';
import Footer from '@/components/landing/Footer';

export default async function HomePage() {
  // Check if user is already logged in
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');

  // If logged in, redirect to dashboard
  if (token) {
    redirect('/dashboard');
  }

  // If NOT logged in, show the landing page (removed the redirect to /auth)
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <ChatSupport />
        <HowItWorks />
        <Testimonials />
        <SocialProof />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export const metadata = {
  title: 'TaskMate - Organize Your Day, Accomplish Your Goals',
  description: 'TaskMate helps you stay on top of your tasks with smart categories, priority management, and gentle reminders—all in one beautiful app.',
};