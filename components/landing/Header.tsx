// components/landing/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/privacy', label: 'Privacy Policy' },
    
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="container-responsive py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-xl">😊</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:block">TaskMate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-yellow-500 font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href="/auth"
            className="hidden md:inline-flex items-center px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-all hover:scale-105 shadow-md"
          >
            Try TaskMate
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 animate-in slide-in-from-top">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-600 hover:text-yellow-500 font-medium transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-xl transition-all"
              >
                Try TaskMate
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}