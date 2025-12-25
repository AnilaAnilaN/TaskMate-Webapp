// components/dashboard/Sidebar.tsx (UPDATED)
'use client';

import { Calendar, Bell, FolderOpen, Settings, LogOut, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved !== null) {
      setIsDesktopCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save state to localStorage
  const toggleDesktopSidebar = () => {
    const newState = !isDesktopCollapsed;
    setIsDesktopCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
    }
  };

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: '/dashboard', icon: Calendar, label: 'Dashboard' },
    { href: '/dashboard/categories', icon: FolderOpen, label: 'Categories' },
    { href: '/tasks', icon: null, label: 'My tasks' },
    { href: '/chat', icon: MessageCircle, label: 'Messages' },        // Your Ably chat
    { href: '/assistant', icon: Sparkles, label: 'AI Assistant' },    // 🆕 NEW - Gemini AI
    { href: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">😊</span>
          </div>
          {!isDesktopCollapsed && (
            <span className="font-semibold text-xl text-gray-900 whitespace-nowrap">
              TaskMate
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/tasks' 
              ? isActive('/tasks') || pathname.startsWith('/tasks/')
              : item.href === '/chat'
              ? isActive('/chat') || pathname.startsWith('/chat/')
              : item.href === '/assistant'
              ? isActive('/assistant') || pathname.startsWith('/assistant/')
              : isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  active
                    ? 'bg-gray-100 text-gray-900 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                title={isDesktopCollapsed ? item.label : undefined}
              >
                {Icon ? (
                  <Icon className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-400 rounded flex-shrink-0"></div>
                )}
                {!isDesktopCollapsed && (
                  <span className="text-sm whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1"></div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-200 space-y-1">
        <Link
          href="/settings"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
            isActive('/settings')
              ? 'bg-gray-100 text-gray-900 font-medium'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
          title={isDesktopCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isDesktopCollapsed && <span className="text-sm">Settings</span>}
        </Link>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl cursor-pointer disabled:opacity-50 transition-colors"
          title={isDesktopCollapsed ? 'Log out' : undefined}
        >
          <LogOut className="w-5 h-5 text-gray-600 flex-shrink-0" />
          {!isDesktopCollapsed && (
            <span className="text-gray-600 text-sm">
              {loggingOut ? 'Logging out...' : 'Log out'}
            </span>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button - Fixed to top */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Mobile (slide-in) & Desktop (static) */}
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col z-50
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isDesktopCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Desktop Toggle Button - Positioned relative to sidebar */}
        <button
          onClick={toggleDesktopSidebar}
          className="hidden lg:block absolute top-6 -right-3 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all z-10"
          aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isDesktopCollapsed ? (
            <Menu className="w-4 h-4 text-gray-600" />
          ) : (
            <X className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <NavContent />
      </aside>
    </>
  );
}