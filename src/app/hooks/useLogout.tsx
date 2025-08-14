'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export const useLogout = () => {
  const { dispatch } = useAuth();
  const router = useRouter();

  const logout = () => {
    // Clear authentication state - AuthContext will handle localStorage and cookies
    dispatch({ type: 'LOGOUT' });
    
    // Redirect to login page
    router.push('/login');
  };

  return logout;
};

export default useLogout;
