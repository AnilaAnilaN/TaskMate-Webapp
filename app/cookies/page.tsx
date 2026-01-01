// app/cookies/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Cookie, CheckCircle, XCircle, Settings } from 'lucide-react';

export default function CookiesPolicyPage() {
  const lastUpdated = "December 24, 2024";

  const cookieTypes = [
    {
      name: 'Essential Cookies',
      icon: CheckCircle,
      required: true,
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as logging in or filling in forms.',
      examples: ['Authentication tokens', 'Session management', 'Security tokens'],
    },
    {
      name: 'Performance Cookies',
      icon: Settings,
      required: false,
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.',
      examples: ['Analytics data', 'Page load times', 'Error tracking'],
    },
    {
      name: 'Functional Cookies',
      icon: Settings,
      required: false,
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
      examples: ['Language preferences', 'Theme settings', 'User preferences'],
    },
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Header */}
        <div className="bg-linear-to-br from-yellow-400 to-yellow-500 py-16 md:py-24 mt-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="w-10 h-10 text-gray-900" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Cookie Policy
              </h1>
            </div>
            <p className="text-lg text-gray-800">
              Learn about how we use cookies and similar technologies on TaskMate.
            </p>
            <p className="text-sm text-gray-700 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-600 leading-relaxed">
              TaskMate uses cookies and similar technologies to provide, protect, and improve our services. This policy explains how and why we use these technologies and the choices you have.
            </p>
          </div>

          {/* Cookie Types */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
            <div className="space-y-6">
              {cookieTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <div
                    className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${type.required ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                        <Icon className={`w-6 h-6 ${type.required ? 'text-green-600' : 'text-blue-600'
                          }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {type.name}
                          </h3>
                          {type.required && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {type.description}
                        </p>
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Examples:</p>
                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            {type.examples.map((example, i) => (
                              <li key={i}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How We Use Cookies */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">Authentication:</strong> We use cookies to keep you logged in and verify your identity when you access TaskMate.
              </p>
              <p>
                <strong className="text-gray-900">Preferences:</strong> Cookies help us remember your settings and preferences, such as your preferred language or theme.
              </p>
              <p>
                <strong className="text-gray-900">Security:</strong> We use cookies to detect and prevent security threats and protect your account.
              </p>
              <p>
                <strong className="text-gray-900">Analytics:</strong> We use cookies to understand how visitors interact with our website, which helps us improve our services.
              </p>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We may use third-party service providers who are authorized to place cookies on your device in connection with the services they provide to us. These providers include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Analytics providers:</strong> To help us understand how users interact with our service</li>
              <li><strong>Email service providers:</strong> To track email delivery and engagement</li>
              <li><strong>Hosting providers:</strong> To ensure our service runs smoothly</li>
            </ul>
          </div>

          {/* Managing Cookies */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong className="text-gray-900">Browser Settings:</strong> You can manage cookies through your browser settings. Here are links to cookie settings for major browsers:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700">Mozilla Firefox</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700">Safari</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-700">Microsoft Edge</a></li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              Please note that if you choose to block or delete cookies, some features of TaskMate may not function properly.
            </p>
          </div>

          {/* Updates to Policy */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-linear-to-br from-yellow-50 to-white rounded-2xl border border-yellow-200 p-6 md:p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <a
              href="mailto:privacy@taskmate.com"
              className="btn-primary px-6 py-3 font-bold"
            >
              privacy@taskmate.com
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export const metadata = {
  title: 'Cookie Policy - TaskMate',
  description: 'Learn about how TaskMate uses cookies and similar technologies.',
};