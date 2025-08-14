'use client';

import React, { useState, useEffect } from 'react';
import { DashboardStats } from '@/app/components/faculty/DashboardStats';
import { QuickLinks } from '@/app/components/faculty/QuickLinks';
import { Card } from '@/app/components/common/Card';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface FacultyDashboardData {
  stats: {
    totalAssignments: number;
    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;
  };
  recentAssignments: {
    _id: string;
    title: string;
    course: {
      name: string;
      code: string;
    };
    dueDate: string;
    maxMarks: number;
    createdAt: string;
  }[];
  pendingSubmissions: {
    _id: string;
    student: {
      id: string;
      name: string;
    };
    assignment: {
      title: string;
    };
    createdAt: string;
  }[];
}

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'assignments' | 'pending'>('assignments');
  const [dashboardData, setDashboardData] = useState<FacultyDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('Fetching Faculty dashboard data...');
      
      const response = await fetch(`${BASE_URL}/faculty/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        } else if (response.status === 403) {
          setError('Access denied. You may not have Faculty permissions.');
          setLoading(false);
          return;
        }
        throw new Error(`Failed to fetch dashboard: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Dashboard data received:', data);
      
      if (!data.success || !data.data) {
        throw new Error('Invalid dashboard data received');
      }
      
      setDashboardData(data.data);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Add a small delay to ensure authentication is properly set up
      const timer = setTimeout(() => {
        fetchDashboard();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboard}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white mb-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-4xl font-bold">Welcome back, {user?.name || 'Professor'}!</h1>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Online
                </div>
              </div>
              <p className="text-xl text-purple-100 mb-6">Here's what's happening with your courses today.</p>
              
              {/* Quick Stats Row */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-purple-100">{dashboardData?.stats.totalAssignments || 0} Total Assignments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-purple-100">{dashboardData?.stats.pendingSubmissions || 0} Pending Reviews</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-purple-100">{dashboardData?.stats.totalSubmissions || 0} Total Submissions</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div className="text-purple-200 text-sm">Current Time</div>
              </div>
              <div className="w-px h-16 bg-purple-300/30"></div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-bold">{dashboardData?.stats.pendingSubmissions || 0}</div>
                <div className="text-purple-200 text-sm">Pending Reviews</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Wave Effect */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-6 text-slate-50 fill-current">
            <path d="M0,120 C300,0 900,120 1200,0 L1200,120 Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Dashboard Statistics */}
      <div className="mb-8">
        <DashboardStats stats={dashboardData?.stats} />
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Quick Actions and Analytics */}
        <div className="xl:col-span-4 space-y-6">
          <QuickLinks />
          
          {/* Quick Analytics Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Analytics</h3>
              <ChartBarIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Graded This Week</span>
                </div>
                <span className="text-lg font-bold text-green-600">42</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-lg border border-blue-200/50">
                <div className="flex items-center space-x-3">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Avg Grade</span>
                </div>
                <span className="text-lg font-bold text-blue-600">87.3%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Activity Feed */}
        <div className="xl:col-span-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Activity Dashboard</h3>
                <EyeIcon className="h-5 w-5 text-purple-600" />
              </div>
              
              {/* Enhanced Tab System */}
              <div className="mb-6">
                <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl">
                  <button
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === 'assignments'
                        ? 'bg-white text-purple-600 shadow-sm border border-purple-200/50'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                    }`}
                    onClick={() => setActiveTab('assignments')}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <DocumentTextIcon className="h-4 w-4" />
                      <span>Recent Assignments</span>
                    </div>
                  </button>
                  <button
                    className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === 'pending'
                        ? 'bg-white text-purple-600 shadow-sm border border-purple-200/50'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
                    }`}
                    onClick={() => setActiveTab('pending')}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      <span>Pending Tasks</span>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Enhanced Activity List */}
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {activeTab === 'assignments' ? (
                  dashboardData?.recentAssignments && dashboardData.recentAssignments.length > 0 ? (
                    dashboardData.recentAssignments.map((assignment, index) => (
                      <div 
                        key={assignment._id} 
                        className="group p-4 border border-gray-200/50 rounded-xl hover:border-purple-200 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                              <DocumentTextIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium group-hover:text-purple-900 transition-colors">
                                {assignment.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {assignment.course ? `${assignment.course.code} - ${assignment.course.name}` : 'Course not found'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Max Marks: {assignment.maxMarks} | Due: {new Date(assignment.dueDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all duration-200">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent assignments</p>
                    </div>
                  )
                ) : (
                  dashboardData?.pendingSubmissions && dashboardData.pendingSubmissions.length > 0 ? (
                    dashboardData.pendingSubmissions.map((submission, index) => (
                      <div 
                        key={submission._id} 
                        className="group p-4 border border-gray-200/50 rounded-xl hover:border-purple-200 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                              <ClockIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-gray-900 font-medium group-hover:text-purple-900 transition-colors">
                                {submission.student.name} submitted {submission.assignment.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Student ID: {submission.student.id} | {new Date(submission.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-all duration-200">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending submissions</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
