// components/landing/Footer.tsx
import Link from 'next/link';
import { Github, XIcon, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/' },
      { label: 'How It Works', href: '/' },
      { label: 'Pricing', href: '/' },
      { label: 'Updates', href: '/' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security', href: '/privacy' },
      { label: 'Cookies', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: XIcon, href: '#', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/AnilaAnilaN', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/anila-nawaz-dev/', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:anilanawaz531@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-responsive py-12 md:py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
                <span className="text-xl">😊</span>
              </div>
              <span className="font-bold text-xl text-white">TaskMate</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Your productivity companion. Organize your day, accomplish your goals.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 hover:bg-yellow-400 rounded-lg flex items-center justify-center transition-colors group"
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-yellow-400 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} TaskMate. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Developed by Anila Nawaz (anilanawaz531@gmail.com)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}