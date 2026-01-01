// app/privacy/page.tsx
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { Shield, Lock, Eye, UserCheck, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 24, 2024";

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-linear-to-br from-yellow-400 to-yellow-500 py-16 md:py-24 mt-16">
          <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-gray-900" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-gray-800">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-gray-700 mt-4">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          {/* Quick Overview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Overview</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">Secure</div>
                  <div className="text-sm text-gray-600">Bank-level encryption</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">Transparent</div>
                  <div className="text-sm text-gray-600">Clear data practices</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-gray-900">Your Control</div>
                  <div className="text-sm text-gray-600">You own your data</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Welcome to TaskMate ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, store, and protect your information when you use our task management application and services.
              </p>
              <p className="text-gray-600 leading-relaxed">
                TaskMate is a productivity application that helps users organize tasks, set priorities, and collaborate with others. This policy applies to all users of our web and mobile applications.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                We collect information that you voluntarily provide when using TaskMate:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
                <li><strong>Profile Information:</strong> Optional profile photo and display name</li>
                <li><strong>Task Data:</strong> Tasks, categories, notes, due dates, and priorities you create</li>
                <li><strong>Communication Data:</strong> Messages sent through our chat feature to other users</li>
                <li><strong>Support Communications:</strong> Information you provide when contacting customer support</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-600 leading-relaxed mb-3">
                When you use TaskMate, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Usage Data:</strong> Features used, time spent, actions performed</li>
                <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                <li><strong>Log Data:</strong> IP address, access times, pages viewed</li>
                <li><strong>Cookies:</strong> We use essential cookies for authentication and preferences</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Provide Services:</strong> Enable core functionality like task management and user collaboration</li>
                <li><strong>Account Management:</strong> Create and maintain your account, authenticate access</li>
                <li><strong>Improve Service:</strong> Analyze usage patterns to enhance features and user experience</li>
                <li><strong>Communication:</strong> Send notifications, updates, and respond to inquiries</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We do not sell your personal data. We may share your information only in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>With Other Users:</strong> When you use chat features, your messages are visible to recipients</li>
                <li><strong>Service Providers:</strong> Trusted third-party services (hosting, email, analytics) under strict confidentiality</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>End-to-end encryption for data transmission (HTTPS/TLS)</li>
                <li>Encrypted storage of passwords using bcrypt hashing</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure authentication with email verification</li>
                <li>Regular backups to prevent data loss</li>
                <li>Access controls and monitoring to prevent unauthorized access</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide services. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we must retain it for legal compliance, dispute resolution, or fraud prevention.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Object:</strong> Object to processing of your data in certain circumstances</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@taskmate.com
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                TaskMate is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately. If you believe a child has provided us with personal information, please contact us.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in compliance with this privacy policy and applicable data protection laws, including GDPR for European users.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of significant changes by email or through a prominent notice in the application. Your continued use of TaskMate after changes constitutes acceptance of the updated policy.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">privacy@taskmate.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <span className="text-gray-700">support@taskmate.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export const metadata = {
  title: 'Privacy Policy - TaskMate',
  description: 'Learn how TaskMate collects, uses, and protects your personal information.',
};