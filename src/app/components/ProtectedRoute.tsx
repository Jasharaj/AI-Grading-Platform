'use client';

import { useAuthGuard } from '../hooks/useAuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isAuthorized } = useAuthGuard({
    requiredRole: allowedRoles,
    redirectTo
  });

  // Show loading spinner while checking authentication
  if (!isAuthenticated || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Render children if authorized
  return <>{children}</>;
};

export default ProtectedRoute;
