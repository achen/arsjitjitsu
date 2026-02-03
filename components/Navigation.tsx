'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, User, BookOpen, Trophy, Menu, X, Settings, ChevronDown, Video, Medal } from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  name: string;
  belt: string;
  isAdmin: boolean;
}

export default function Navigation() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  // Close admin menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      white: 'bg-white border-gray-300',
      blue: 'bg-blue-600',
      purple: 'bg-purple-600',
      brown: 'bg-amber-700',
      black: 'bg-black',
    };
    return colors[belt] || 'bg-gray-400';
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🥋</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                arsjiujitsu
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/techniques"
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <BookOpen size={20} />
              <span>Techniques</span>
            </Link>

            <Link
              href="/leaderboard"
              className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              <Medal size={20} />
              <span>Leaderboard</span>
            </Link>

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <Trophy size={20} />
                      <span>My Progress</span>
                    </Link>
                    
                    {/* Admin Dropdown - only rendered if user is admin */}
                    {user.isAdmin && (
                      <div className="relative" ref={adminMenuRef}>
                        <button
                          onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                          className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400"
                        >
                          <Settings size={20} />
                          <span>Admin</span>
                          <ChevronDown size={16} className={`transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {adminMenuOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                            <Link
                              href="/admin/videos"
                              className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                              onClick={() => setAdminMenuOpen(false)}
                            >
                              <Video size={16} />
                              <span>Map Videos</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <Link
                      href="/profile?tab=edit"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      title="Edit Profile"
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${getBeltColor(user.belt)} border`}
                        title={`${user.belt} belt`}
                      />
                      <span className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                        {user.name}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center space-x-1 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <LogIn size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/techniques"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <BookOpen size={20} />
              <span>Techniques</span>
            </Link>
            <Link
              href="/leaderboard"
              className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              <Medal size={20} />
              <span>Leaderboard</span>
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <Trophy size={20} />
                  <span>My Progress</span>
                </Link>
                
                {/* Admin links for mobile - only rendered if user is admin */}
                {user.isAdmin && (
                  <Link
                    href="/admin/videos"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Video size={20} />
                    <span>Admin: Map Videos</span>
                  </Link>
                )}
                
                <Link
                  href="/profile?tab=edit"
                  className="flex items-center space-x-2 px-3 py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={20} />
                  <span className="hover:text-blue-600 dark:hover:text-blue-400">{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-600 text-white"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
