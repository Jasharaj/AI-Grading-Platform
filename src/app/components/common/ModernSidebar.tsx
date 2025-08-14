'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Icons from Heroicons
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  ShieldExclamationIcon as ShieldExclamationIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  SparklesIcon as SparklesIconSolid,
  EyeIcon as EyeIconSolid,
} from '@heroicons/react/24/solid';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
  iconSolid: React.ElementType;
  badge?: string;
}

interface ModernSidebarProps {
  role: 'faculty' | 'student' | 'ta';
}

// Navigation configurations for each role
const navigationConfigs = {
  faculty: [
    { name: 'Dashboard', href: '/faculty', icon: HomeIcon, iconSolid: HomeIconSolid },
    { name: 'Course Management', href: '/faculty/courses', icon: AcademicCapIcon, iconSolid: AcademicCapIconSolid },
    { name: 'Assignments', href: '/faculty/assignments', icon: BookOpenIcon, iconSolid: BookOpenIconSolid },
    { name: 'Students', href: '/faculty/students', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
    { name: 'Teaching Assistants', href: '/faculty/tas', icon: UserGroupIcon, iconSolid: UserGroupIconSolid },
    { name: 'Grading & Feedback', href: '/faculty/grading', icon: ClipboardDocumentCheckIcon, iconSolid: ClipboardDocumentCheckIconSolid },
    { name: 'Analytics', href: '/faculty/analytics', icon: ChartBarIcon, iconSolid: ChartBarIconSolid },
    { name: 'Profile', href: '/faculty/profile', icon: UserIcon, iconSolid: UserIconSolid },
  ],
  student: [
    { name: 'Dashboard', href: '/student', icon: HomeIcon, iconSolid: HomeIconSolid },
    { name: 'Assignments', href: '/student/assignments', icon: BookOpenIcon, iconSolid: BookOpenIconSolid },
    { name: 'Grades', href: '/student/grades', icon: AcademicCapIcon, iconSolid: AcademicCapIconSolid },
    { name: 'Revaluation', href: '/student/revaluation', icon: ClipboardDocumentListIcon, iconSolid: ClipboardDocumentListIconSolid },
    { name: 'Profile', href: '/student/profile', icon: UserIcon, iconSolid: UserIconSolid },
  ],
  ta: [
    { name: 'Dashboard', href: '/TA', icon: HomeIcon, iconSolid: HomeIconSolid },
    { name: 'Evaluate Students', href: '/TA/evaluate', icon: ClipboardDocumentCheckIcon, iconSolid: ClipboardDocumentCheckIconSolid },
    { name: 'View Submissions', href: '/TA/submissions', icon: EyeIcon, iconSolid: EyeIconSolid },
    { name: 'AI Plagiarism Check', href: '/TA/plagiarism-check', icon: ShieldExclamationIcon, iconSolid: ShieldExclamationIconSolid, badge: 'AI' },
    { name: 'Profile', href: '/TA/profile', icon: UserIcon, iconSolid: UserIconSolid },
  ],
};

// Role-specific colors - Purple theme
const roleConfigs = {
  faculty: {
    primary: '#8B5CF6', // Beautiful violet
    primaryLight: '#F3E8FF',
    primaryDark: '#5B21B6',
    accent: '#A855F7',
  },
  student: {
    primary: '#9333EA', // Rich purple
    primaryLight: '#FAF5FF',
    primaryDark: '#6B21A8',
    accent: '#C084FC',
  },
  ta: {
    primary: '#7C3AED', // Deep purple
    primaryLight: '#EDE9FE',
    primaryDark: '#5B21B6',
    accent: '#A78BFA',
  },
};

export default function ModernSidebar({ role }: ModernSidebarProps) {
  const { user, dispatch } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigation = navigationConfigs[role] || navigationConfigs.student;
  const config = roleConfigs[role] || roleConfigs.student;

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully!');
      router.push('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const toggleMobileSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActiveRoute = (href: string) => {
    if (href === `/${role}`) {
      // For dashboard route, only match exact path
      return pathname === href;
    }
    // For other routes, match if pathname starts with href
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMobileSidebar}
          className="fixed top-6 left-6 z-50 p-3 rounded-xl bg-white shadow-lg border border-gray-100 text-gray-700 hover:text-gray-900 transition-all duration-200"
          style={{
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <XMarkIcon className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Bars3Icon className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isMobile && !isOpen ? '-100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 0.4
        }}
        className="fixed left-0 top-0 h-full w-80 z-50 overflow-hidden"
        style={{
          background: `linear-gradient(145deg, 
            rgba(139, 92, 246, 0.05) 0%, 
            rgba(168, 85, 247, 0.03) 50%, 
            rgba(147, 51, 234, 0.02) 100%
          ), rgba(255, 255, 255, 0.95)`,
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(139, 92, 246, 0.1)',
          boxShadow: isMobile 
            ? '0 25px 50px -12px rgba(139, 92, 246, 0.25), 0 0 100px -20px rgba(139, 92, 246, 0.1)' 
            : '0 0 50px -10px rgba(139, 92, 246, 0.08)'
        }}
      >
        {/* Animated Purple Gradient Overlay */}
        <motion.div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(800px circle at 50% 200px, 
              rgba(139, 92, 246, 0.1), 
              transparent 50%
            )`
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear'
          }}
        />

        {/* Floating Purple Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, ${config.primary}40, transparent 70%)`,
                width: `${60 + i * 20}px`,
                height: `${60 + i * 20}px`,
                left: `${10 + i * 30}%`,
                top: `${20 + i * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i * 1.5,
                repeat: Infinity,
                delay: i * 1.2,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>

        <div className="h-full flex flex-col relative z-10">{}
          {/* Header with Profile */}
          <div className="p-6 border-b border-purple-100/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
              className="flex items-center space-x-4"
            >
              {/* Enhanced Avatar with Glow */}
              <motion.div 
                whileHover={{ 
                  scale: 1.05, 
                  rotate: [0, -5, 5, 0],
                  boxShadow: `0 20px 40px -10px ${config.primary}50`
                }}
                whileTap={{ scale: 0.95 }}
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-xl cursor-pointer"
                style={{ 
                  background: `linear-gradient(135deg, ${config.primary} 0%, ${config.primaryDark} 100%)`,
                  boxShadow: `0 10px 30px -5px ${config.primary}40`
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                {user?.name ? getUserInitials(user.name) : role.toUpperCase().slice(0, 2)}
                <motion.div 
                  className="absolute inset-0 rounded-2xl bg-white/10 opacity-0"
                  whileHover={{ opacity: 100 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Pulsing Glow Ring */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl opacity-75"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primary}30, ${config.accent}20)`
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </motion.div>

              {/* Enhanced User Info */}
              <div className="flex-1 min-w-0">
                <motion.h3 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="text-gray-900 font-bold text-lg truncate"
                >
                  {user?.name || `${role.charAt(0).toUpperCase() + role.slice(1)} User`}
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, x: -10, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                  className="flex items-center mt-2"
                >
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${config.primary} 0%, ${config.accent} 100%)`,
                      boxShadow: `0 4px 15px -3px ${config.primary}40`
                    }}
                  >
                    <motion.div
                      className="w-2 h-2 bg-white/70 rounded-full mr-2"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </motion.span>
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-600 text-sm truncate mt-2 font-medium"
                >
                  {user?.email || `${role}@university.edu`}
                </motion.p>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {navigation.map((item, index) => {
                const isActive = isActiveRoute(item.href);
                const Icon = isActive ? item.iconSolid : item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.1 + index * 0.05,
                      type: 'spring',
                      stiffness: 400,
                      damping: 25 
                    }}
                  >
                    <Link href={item.href} onClick={() => isMobile && setIsOpen(false)}>
                      <motion.div
                        whileHover={{ 
                          scale: 1.02,
                          x: 6,
                          boxShadow: isActive 
                            ? `0 8px 30px -8px ${config.primary}60` 
                            : `0 4px 20px -4px ${config.primary}30`
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          relative group flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-300 overflow-hidden
                          ${isActive 
                            ? 'text-white' 
                            : 'text-gray-700 hover:text-gray-900'
                          }
                        `}
                        style={{
                          background: isActive 
                            ? `linear-gradient(135deg, ${config.primary} 0%, ${config.accent} 100%)`
                            : 'transparent',
                          boxShadow: isActive 
                            ? `0 8px 25px -8px ${config.primary}50, inset 0 1px 0 rgba(255,255,255,0.2)` 
                            : 'none'
                        }}
                      >
                        {/* Animated Background */}
                        {!isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${config.primary}08, ${config.accent}05)`
                            }}
                          />
                        )}

                        {/* Active Indicator with Glow */}
                        {isActive && (
                          <>
                            <motion.div
                              layoutId={`activeIndicator-${role}`}
                              className="absolute left-1 w-1.5 h-10 rounded-r-full bg-white/30"
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                            <motion.div
                              className="absolute inset-0 rounded-2xl"
                              style={{
                                background: `linear-gradient(135deg, ${config.primary}15, ${config.accent}10)`,
                              }}
                              animate={{
                                boxShadow: [
                                  `inset 0 1px 20px rgba(255,255,255,0.1)`,
                                  `inset 0 1px 20px rgba(255,255,255,0.2)`,
                                  `inset 0 1px 20px rgba(255,255,255,0.1)`
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </>
                        )}

                        {/* Enhanced Icon with Animations */}
                        <motion.div
                          whileHover={{ 
                            scale: 1.15, 
                            rotate: isActive ? [0, -3, 3, 0] : 5 
                          }}
                          className="flex-shrink-0 w-5 h-5 mr-4 relative z-10"
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <Icon className="w-5 h-5" />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full"
                              style={{ 
                                background: `radial-gradient(circle, rgba(255,255,255,0.3), transparent 60%)`
                              }}
                              animate={{
                                scale: [0.8, 1.2, 0.8],
                                opacity: [0.5, 0.8, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }}
                            />
                          )}
                        </motion.div>

                        {/* Text and Badge */}
                        <span className="flex-1 truncate relative z-10 font-semibold">{item.name}</span>
                        
                        {'badge' in item && item.badge && (
                          <motion.span 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            className="ml-3 px-2.5 py-1 text-xs font-bold text-white rounded-xl shadow-lg relative z-10"
                            style={{ 
                              background: `linear-gradient(135deg, ${config.accent} 0%, ${config.primaryDark} 100%)`,
                              boxShadow: `0 4px 10px -2px ${config.accent}40`
                            }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <motion.div
                              animate={{ 
                                boxShadow: [
                                  `0 0 5px ${config.accent}60`,
                                  `0 0 15px ${config.accent}40`,
                                  `0 0 5px ${config.accent}60`
                                ]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-xl"
                            />
                            {item.badge}
                          </motion.span>
                        )}

                        {/* Hover Sparkle Effect */}
                        <motion.div
                          className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white/60 opacity-0 group-hover:opacity-100"
                          animate={{
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: Math.random() * 2
                          }}
                        />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </div>

          {/* Enhanced User Profile Section */}
          <div className="p-4 border-t border-purple-100/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
              className="p-4 rounded-2xl mb-4 relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${config.primaryLight} 0%, rgba(255,255,255,0.8) 100%)`,
                border: `1px solid ${config.primary}20`
              }}
            >
              {/* Subtle Pattern Background */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, ${config.primary}15 1px, transparent 0)`,
                  backgroundSize: '20px 20px'
                }}
              />
              
              <div className="flex items-center relative z-10">
                <motion.div 
                  whileHover={{ 
                    scale: 1.05, 
                    rotate: [0, -2, 2, 0],
                    boxShadow: `0 8px 25px -5px ${config.primary}50`
                  }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${config.primary} 0%, ${config.accent} 100%)`,
                    boxShadow: `0 5px 20px -5px ${config.primary}40`
                  }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {user?.name ? getUserInitials(user.name) : role.slice(0, 1).toUpperCase()}
                  
                  {/* Pulsing Status Dot */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(34, 197, 94, 0.4)',
                        '0 0 0 8px rgba(34, 197, 94, 0)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
                
                <div className="ml-4 flex-1 min-w-0">
                  <motion.p 
                    whileHover={{ x: 2 }}
                    className="text-sm font-bold text-gray-900 truncate"
                  >
                    {user?.name || 'User'}
                  </motion.p>
                  <motion.p 
                    whileHover={{ x: 2 }}
                    className="text-xs text-gray-600 truncate font-medium"
                  >
                    {user?.email || `${role}@university.edu`}
                  </motion.p>
                </div>
                
                {/* Online Status Badge */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="px-2 py-1 rounded-lg text-xs font-bold text-white shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, #10B981 0%, #059669 100%)`,
                  }}
                >
                  Online
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Logout Button */}
            <motion.button
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.25)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3.5 text-sm font-bold text-red-600 rounded-2xl transition-all duration-300 group relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(254, 242, 242, 0.8) 0%, rgba(255, 255, 255, 0.9) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}
            >
              {/* Hover Background Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-red-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              
              <motion.div
                whileHover={{ scale: 1.1, rotate: -10 }}
                className="flex-shrink-0 w-5 h-5 mr-3 relative z-10"
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              </motion.div>
              
              <span className="relative z-10 font-bold">Sign Out</span>
              
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
                className="ml-auto relative z-10"
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors shadow-sm"
                >
                  <motion.div 
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
