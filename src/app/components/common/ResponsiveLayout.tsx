'use client';

import { useState, useEffect } from 'react';
import ModernSidebar from './ModernSidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  role: 'faculty' | 'student' | 'ta';
}

const backgroundGradients = {
  faculty: 'bg-gray-50',
  student: 'bg-gray-50', 
  ta: 'bg-gray-50',
};

export default function ResponsiveLayout({ children, role }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`min-h-screen ${backgroundGradients[role]}`}>
      <ModernSidebar role={role} />
      <main 
        className={`transition-all duration-300 ease-in-out ${
          isMobile ? 'ml-0' : 'ml-80'
        }`}
      >
        <div className="min-h-screen p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
