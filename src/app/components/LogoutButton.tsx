'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = '', 
  showText = true 
}) => {
  const { dispatch } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication state
    dispatch({ type: 'LOGOUT' });
    
    // Clear all authentication data
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Clear cookies
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    }
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 ${className}`}
      title="Logout"
    >
      <ArrowRightOnRectangleIcon className="h-5 w-5" />
      {showText && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
