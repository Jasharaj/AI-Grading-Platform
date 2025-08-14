'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface LoginCredentials {
  id: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const useLogin = () => {
  const { dispatch } = useAuth();
  const router = useRouter();

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result: LoginResponse = await response.json();

      if (response.ok && result.success) {
        // Update authentication context
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: {
              id: result.data.id,
              name: result.data.name,
              email: result.data.email,
            },
            role: result.data.role,
            token: result.token,
          },
        });

        // Redirect to appropriate dashboard
        const dashboardRoute = getDashboardRoute(result.data.role);
        router.push(dashboardRoute);

        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  };

  return login;
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
