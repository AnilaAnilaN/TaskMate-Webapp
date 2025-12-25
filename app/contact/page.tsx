// app/contact/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import ContactForm from '@/components/contact/ContactForm';
import { Mail, MessageCircle, Clock } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@taskmate.com',
      description: 'We typically respond within 24 hours',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      content: 'Available in-app',
      description: 'Real-time support for logged-in users',
    },
    {
      icon: Clock,
      title: 'Support Hours',
      content: 'Monday - Friday',
      description: '9:00 AM - 5:00 PM PST',
    },
  ];

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 py-16 md:py-20 mt-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto">
              Have questions, feedback, or need help? We're here to assist you. 
              Send us a message and we'll get back to you soon.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-yellow-400 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                            <p className="text-yellow-600 font-semibold mb-1">{info.content}</p>
                            <p className="text-sm text-gray-500">{info.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-br from-yellow-50 to-white rounded-2xl border border-yellow-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Quick Support</h3>
                <p className="text-gray-600 text-sm mb-4">
                  For immediate assistance, check out our Help Center or use the live chat feature inside the app.
                </p>
                <a
                  href="/#faq"
                  className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm"
                >
                  Visit FAQ Section →
                </a>
              </div>
            </div>

            {/* Contact Form - Client Component */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>

          {/* FAQ Link Section */}
          <div className="mt-12 bg-white rounded-3xl border border-gray-200 p-8 md:p-10 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for Answers?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Many common questions are answered in our FAQ section. 
              Check there first for quick solutions to common issues.
            </p>
            <a
              href="/#faq"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-yellow-100 text-gray-900 font-semibold rounded-xl transition-all"
            >
              View FAQ
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export const metadata = {
  title: 'Contact Us - TaskMate',
  description: 'Get in touch with TaskMate. We\'re here to help with questions, feedback, or support.',
};