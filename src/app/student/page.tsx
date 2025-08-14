'use client';

import { AcademicCapIcon, BookOpenIcon, ClockIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalAssignments: number;
  submittedAssignments: number;
  gradedAssignments: number;
  pendingAssignments: number;
}

interface RecentGrade {
  _id: string;
  grade: number;
  assignment: {
    _id: string;
    title: string;
    maxMarks: number;
  };
  gradedAt: string;
}

interface UpcomingAssignment {
  _id: string;
  title: string;
  dueDate: string;
  course?: {
    name: string;
    code: string;
  };
}

interface DashboardData {
  stats: DashboardStats;
  recentGrades: RecentGrade[];
  upcomingAssignments: UpcomingAssignment[];
}

export default function StudentDashboard() {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'recent' | 'upcoming'>('recent');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = BASE_URL;

  // Debug logging
  useEffect(() => {
    console.log('Student Dashboard - Auth State:', { 
      hasToken: !!token, 
      hasUser: !!user, 
      tokenLength: token?.length,
      user: user 
    });
  }, [token, user]);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        console.log('No token available for authentication');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching dashboard data from:', `${API_BASE_URL}/students/dashboard`);
        console.log('Using token:', token?.substring(0, 20) + '...');
        
        const response = await fetch(`${API_BASE_URL}/students/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch dashboard data: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Dashboard data received:', data);
        
        if (data.success && data.data) {
          setDashboardData(data.data);
        } else {
          throw new Error(data.message || 'Failed to load dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(`Failed to load dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Set fallback data for development
        setDashboardData({
          stats: {
            totalAssignments: 0,
            submittedAssignments: 0,
            gradedAssignments: 0,
            pendingAssignments: 0
          },
          recentGrades: [],
          upcomingAssignments: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, API_BASE_URL]);

  // Calculate completion percentage
  const getCompletionRate = () => {
    if (!dashboardData?.stats.totalAssignments) return 0;
    return Math.round((dashboardData.stats.submittedAssignments / dashboardData.stats.totalAssignments) * 100);
  };

  // Calculate average grade
  const getAverageGrade = () => {
    if (!dashboardData?.recentGrades.length) return 0;
    const total = dashboardData.recentGrades.reduce((sum, grade) => sum + grade.grade, 0);
    return Math.round(total / dashboardData.recentGrades.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <AcademicCapIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your student dashboard.</p>
          <Link
            href="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic stats based on real data
  const stats = [
    { 
      name: 'Average Grade', 
      value: `${getAverageGrade()}%`, 
      description: 'Overall Performance',
      icon: ChartBarIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      trend: `${dashboardData?.stats.gradedAssignments || 0} graded`
    },
    { 
      name: 'Total Assignments', 
      value: dashboardData?.stats.totalAssignments?.toString() || '0', 
      description: 'Available',
      icon: BookOpenIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      trend: `${dashboardData?.stats.submittedAssignments || 0} submitted`
    },
    { 
      name: 'Completion Rate', 
      value: `${getCompletionRate()}%`, 
      description: 'Assignments Done',
      icon: ClockIcon,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      trend: `${dashboardData?.stats.pendingAssignments || 0} pending`
    },
    { 
      name: 'Graded Work', 
      value: dashboardData?.stats.gradedAssignments?.toString() || '0', 
      description: 'Completed',
      icon: AcademicCapIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      trend: `${dashboardData?.upcomingAssignments?.length || 0} upcoming`
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <AcademicCapIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome Back, {user?.name || 'Student'}!</h1>
                <p className="text-blue-100">Track your academic progress, manage assignments, and stay on top of your educational journey</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/student/assignments"
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 border border-white/30 hover:border-white/50"
              >
                <BookOpenIcon className="w-4 h-4" />
                <span>Assignments</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors">
                    {stat.name}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {stat.value}
                    </span>
                    <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      {stat.description}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors">
                    {stat.trend}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Activity Overview</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'recent'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Recent Activity
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'upcoming'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Upcoming Tasks
              </button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {activeTab === 'recent' ? (
            // Show recent grades
            dashboardData?.recentGrades?.length ? (
              dashboardData.recentGrades.map((grade, index) => (
                <div 
                  key={grade._id} 
                  className="group p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
                        <ChartBarIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {grade.assignment.title}
                        </h4>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          Assignment Graded
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                        {new Date(grade.gradedAt).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        {grade.grade}/{grade.assignment.maxMarks}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">No recent grades available</p>
              </div>
            )
          ) : (
            // Show upcoming assignments
            dashboardData?.upcomingAssignments?.length ? (
              dashboardData.upcomingAssignments.map((assignment, index) => (
                <div 
                  key={assignment._id} 
                  className="group p-6 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-100 text-orange-600">
                        <ClockIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                          {assignment.title}
                        </h4>
                        <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                          {assignment.course?.name || 'Assignment Due'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <span className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500">No upcoming assignments</p>
              </div>
            )
          )}
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <Link 
            href="/student/grades"
            className="group flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>View All Activity</span>
            <ArrowTrendingUpIcon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
