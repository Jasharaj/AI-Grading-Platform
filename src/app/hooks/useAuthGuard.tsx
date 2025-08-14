'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface UseAuthGuardOptions {
  requiredRole?: string[];
  redirectTo?: string;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { requiredRole = [], redirectTo = '/login' } = options;
  const { user, role, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!user || !token || !role) {
      router.push(redirectTo);
      return;
    }

    // Check if user has required role
    if (requiredRole.length > 0 && !requiredRole.includes(role)) {
      // Redirect to appropriate dashboard
      const dashboardRoute = getDashboardRoute(role);
      router.push(dashboardRoute);
      return;
    }
  }, [user, role, token, requiredRole, redirectTo, router]);

  return {
    isAuthenticated: !!(user && token && role),
    isAuthorized: !requiredRole.length || requiredRole.includes(role || ''),
    user,
    role,
    token
  };
};

const getDashboardRoute = (role: string): string => {
  switch (role) {
    case 'Student':
      return '/student';
    case 'Faculty':
      return '/faculty';
    case 'TA':
      return '/TA';
    default:
      return '/login';
  }
};

// Higher-order component for page-level protection
export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: UseAuthGuardOptions = {}
) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isAuthorized } = useAuthGuard(options);
    
    if (!isAuthenticated || !isAuthorized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Checking authorization...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
