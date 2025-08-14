'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '../config';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    role: '',
    id: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { dispatch, user, role, token } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && token && role) {
      const dashboardRoute = getDashboardRoute(role);
      router.push(dashboardRoute);
    }
  }, [user, token, role, router]);

  const getDashboardRoute = (userRole: string): string => {
    switch (userRole) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.role || !formData.id || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Signing you in...');

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Login failed');
      }

      console.log('DEBUG: Login successful, response:', result);

      // Validate that the user's actual role matches what they selected
      if (result.data.role !== formData.role) {
        throw new Error(`Access denied. You are registered as ${result.data.role}, not ${formData.role}.`);
      }

      // Update AuthContext with the server-provided role
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          role: result.data.role  // Use server role, not client-selected role
        }
      });

      console.log('DEBUG: AuthContext updated with user data');

      setLoading(false);

      // Dismiss loading toast and show success message
      toast.dismiss(loadingToast);
      toast.success(`Welcome back! Redirecting to your ${result.data.role.toLowerCase()} dashboard...`);

      // Role-based routing with a small delay to show the success message
      setTimeout(() => {
        switch (result.data.role) {  // Use server role for routing
          case 'Faculty':
            router.push('/faculty');
            break;
          case 'TA':
            router.push('/TA');
            break;
          case 'Student':
            router.push('/student');
            break;
          default:
            throw new Error('Invalid role');
        }
      }, 1000);
      
    } catch (err: any) {
      setLoading(false);
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const getRoleIcon = (role: string) => {
    // Use consistent purple person icon for all roles
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl transform rotate-6 opacity-10"></div>
                <div className="relative bg-white/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="text-center">
                    <div className="mx-auto w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-xl">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                        <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.942 2.524z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to GradePro</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Empowering education through intelligent grading solutions. 
                      Join thousands of educators streamlining their assessment process.
                    </p>
                    <div className="mt-8 flex justify-center space-x-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">10K+</div>
                        <div className="text-sm text-gray-500">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">500+</div>
                        <div className="text-sm text-gray-500">Faculty</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">100+</div>
                        <div className="text-sm text-gray-500">TAs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                  <p className="text-gray-600">Sign in to continue your educational journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Role
                    </label>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="appearance-none w-full pl-4 pr-10 py-4 text-gray-700 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        required
                      >
                        <option value="">Choose your role...</option>
                        <option value="Faculty">Faculty</option>
                        <option value="TA">Teaching Assistant</option>
                        <option value="Student">Student</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic ID Field */}
                  {formData.role && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {formData.role} ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <div className="text-indigo-500">
                            {getRoleIcon(formData.role)}
                          </div>
                        </div>
                        <input
                          type="text"
                          name="id"
                          value={formData.id}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 text-gray-700 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                          placeholder={`Enter your ${formData.role} ID`}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 text-gray-700 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center">
                    <p className="text-gray-600">
                      New to GradePro?{' '}
                      <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                        Create an account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
