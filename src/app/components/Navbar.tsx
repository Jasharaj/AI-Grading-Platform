'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, role, dispatch } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL LOGIC
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
    
    // Show success message
    toast.success('Logged out successfully!');
    
    // Redirect to home page
    router.push('/');
  };

  const handleLogoClick = () => {
    if (user && role) {
      // Redirect to appropriate dashboard based on user role
      if (role === 'Student') {
        router.push('/student');
      } else if (role === 'Faculty') {
        router.push('/faculty');
      } else if (role === 'TA') {
        router.push('/TA');
      }
    } else {
      router.push('/');
    }
  };

  // Hide navbar on student, faculty, and TA pages
  // This conditional return is now AFTER all hooks are called
  if (pathname?.startsWith('/student') || 
      pathname?.startsWith('/faculty') || 
      pathname?.startsWith('/TA')) {
    return null;
  }

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[99999] transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-white/98 backdrop-blur-xl shadow-xl border-b border-gray-100/50' 
          : 'bg-transparent backdrop-blur-sm'
      }`}
      style={{
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2 -ml-2 transition-all duration-300 hover:bg-gray-50"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.942 2.524z" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-600 group-hover:to-blue-600">
                GradePro
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide transition-all duration-300">
                AI-Powered
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 font-medium text-gray-700 hover:text-purple-600 transition-all duration-300 rounded-lg group"
              >
                <span className="relative z-10">{link.name}</span>
                <div className="absolute inset-0 bg-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:w-full transform -translate-x-1/2"></div>
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogoClick}
                  className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg px-2 py-1"
                >
                  Welcome, {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="px-6 py-2.5 font-medium text-gray-700 hover:text-purple-600 transition-all duration-300 rounded-xl hover:bg-purple-50 border border-transparent hover:border-purple-200"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup"
                  className="relative px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative p-3 rounded-xl text-gray-900 hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div 
                className={`w-full h-0.5 bg-current transition-all duration-500 ease-out transform origin-center ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5 bg-purple-600' : 'bg-gray-900'
                }`}
              />
              <div 
                className={`w-full h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 bg-gray-900'
                }`}
              />
              <div 
                className={`w-full h-0.5 bg-current transition-all duration-500 ease-out transform origin-center ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 bg-purple-600' : 'bg-gray-900'
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-500 ease-out overflow-hidden ${
            isMobileMenuOpen 
              ? 'max-h-[32rem] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 p-6 m-4 mt-2">
            <div className="space-y-6">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 text-gray-700 font-medium hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300 transform ${
                      isMobileMenuOpen 
                        ? 'translate-x-0 opacity-100' 
                        : 'translate-x-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              
              {/* Auth Section */}
              <div className="border-t border-gray-100 pt-6">
                {user ? (
                  <div className={`space-y-4 transform transition-all duration-500 ${
                    isMobileMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                  >
                    <button
                      onClick={() => {
                        handleLogoClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200/50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 w-full text-left"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-sm font-bold text-white">
                          {user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Welcome, {user.name}</p>
                        <p className="text-sm text-purple-600 font-medium">{role}</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className={`space-y-3 transform transition-all duration-500 ${
                    isMobileMenuOpen 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-4 opacity-0'
                  }`}
                  style={{ transitionDelay: '200ms' }}
                  >
                    <Link 
                      href="/login"
                      className="block w-full px-6 py-3 text-center text-gray-700 font-semibold hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/signup"
                      className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl text-center hover:shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
