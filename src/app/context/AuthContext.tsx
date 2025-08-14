'use client';

import { createContext, useContext, useEffect, useReducer } from 'react';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  role: string | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  dispatch: React.Dispatch<AuthAction>;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; role: string; token: string } }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  role: null,
  token: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        role: null,
        token: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
      };
    case 'LOGOUT':
      return {
        user: null,
        role: null,
        token: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Initialize state from localStorage when component mounts (client-side only)
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    if (storedUser && storedToken && storedRole) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: JSON.parse(storedUser),
          token: storedToken,
          role: storedRole,
        },
      });
    }
  }, []);

  useEffect(() => {
    // Update localStorage and cookies when state changes (client-side only)
    if (typeof window !== 'undefined') {
      if (state.user) {
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token || '');
        localStorage.setItem('role', state.role || '');
        
        // Also set cookies for server-side access
        document.cookie = `user=${JSON.stringify(state.user)}; path=/; max-age=1296000`; // 15 days
        document.cookie = `token=${state.token}; path=/; max-age=1296000`; // 15 days
        document.cookie = `role=${state.role}; path=/; max-age=1296000`; // 15 days
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        
        // Clear cookies
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
    }
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return context;
};

export default AuthContext;