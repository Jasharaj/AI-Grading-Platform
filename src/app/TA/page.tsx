'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';
import { 
  BookOpenIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  AcademicCapIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface TADashboardData {
  stats: {
    totalAssigned: number;
    totalGraded: number;
    totalPending: number;
    completionRate: number;
  };
  recentGraded: {
    _id: string;
    student: {
      id: string;
      name: string;
    };
    assignment: {
      title: string;
      maxMarks: number;
    };
    grade: number;
    gradedAt: string;
  }[];
  upcomingDeadlines: {
    _id: string;
    student: {
      id: string;
      name: string;
    };
    assignment: {
      title: string;
      dueDate: string;
      maxMarks: number;
    };
  }[];
}

export default function TAPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'activity' | 'pending'>('activity');
  const [dashboardData, setDashboardData] = useState<TADashboardData | null>(null);
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
      
      // Debug: Log token and user info
      console.log('Token exists:', !!token);
      console.log('Current user:', user);
      console.log('Token length:', token.length);
      
      console.log('Fetching TA dashboard data...');
      
      const response = await fetch(`${BASE_URL}/ta/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        
        if (response.status === 401) {
          setError('Session expired. Please login again.');
          setLoading(false);
          return;
        } else if (response.status === 403) {
          setError('Access denied. You may not have TA permissions.');
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
    const timer = setTimeout(() => {
      fetchDashboard();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
            <div className="text-red-600 mb-2">⚠️ Error Loading Dashboard</div>
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={() => {
                setError('');
                setLoading(true);
                fetchDashboard();
              }}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for sections not yet connected to backend
  const pendingTasks = [
    {
      id: '1',
      task: 'Grade Assignment 4',
      course: 'CS101',
      due: 'Tomorrow',
      priority: 'high'
    },
    {
      id: '2',
      task: 'Review Project Submissions',
      course: 'CS202',
      due: 'In 2 days',
      priority: 'medium'
    },
    {
      id: '3',
      task: 'Update Grading Rubric',
      course: 'CS303',
      due: 'Next week',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white mb-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-4xl font-bold">Welcome Back, {user?.name || 'TA'}!</h1>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active
                </div>
              </div>
              <p className="text-xl text-green-100 mb-6">Your teaching assistant dashboard - manage grading and student feedback</p>
              
              {/* Quick Stats Row */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span className="text-green-100">{dashboardData?.stats.totalPending || 0} Pending Grades</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-green-100">{dashboardData?.stats.totalGraded || 0} Graded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-green-100">{dashboardData?.stats.totalAssigned || 0} Total Submissions</span>
                </div>
              </div>
            </div>
            
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 px-6 py-3 rounded-xl flex items-center space-x-2 text-white hover:shadow-xl hover:scale-105 group">
              <ChartBarIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">View Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-purple-200 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-purple-600 transition-colors">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-purple-900 transition-colors">
                {dashboardData?.stats.completionRate || 0}%
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                <span>Grading progress</span>
              </div>
            </div>
            <div className="bg-purple-50 group-hover:bg-purple-100 transition-all duration-300 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6">
              <BookOpenIcon className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-blue-600 transition-colors">Total Graded</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                {dashboardData?.stats.totalGraded || 0}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                <span>Completed assignments</span>
              </div>
            </div>
            <div className="bg-blue-50 group-hover:bg-blue-100 transition-all duration-300 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6">
              <DocumentTextIcon className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-green-600 transition-colors">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-green-900 transition-colors">
                {dashboardData?.stats.totalAssigned || 0}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                <span>Assigned to you</span>
              </div>
            </div>
            <div className="bg-green-50 group-hover:bg-green-100 transition-all duration-300 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6">
              <ClipboardDocumentListIcon className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border border-gray-100 hover:border-orange-200 hover:-translate-y-2 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1 group-hover:text-orange-600 transition-colors">Pending Grades</p>
              <p className="text-3xl font-bold text-gray-900 group-hover:text-orange-900 transition-colors">
                {dashboardData?.stats.totalPending || 0}
              </p>
              <div className="flex items-center mt-2 text-xs text-orange-600">
                <ClockIcon className="h-3 w-3 mr-1" />
                <span>Awaiting grading</span>
              </div>
            </div>
            <div className="bg-orange-50 group-hover:bg-orange-100 transition-all duration-300 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6">
              <ClockIcon className="h-7 w-7 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Content Grid with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Recent Activity & Grades */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activity/Tasks Tabs */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`${
                    activeTab === 'activity'
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2`}
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Recent Activity</span>
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`${
                    activeTab === 'pending'
                      ? 'border-orange-500 text-orange-600 bg-orange-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-all duration-300 flex items-center space-x-2`}
                >
                  <ClockIcon className="h-4 w-4" />
                  <span>Pending Tasks</span>
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'activity' ? (
                <div className="space-y-4">
                  {dashboardData?.recentGraded && dashboardData.recentGraded.length > 0 ? (
                    dashboardData.recentGraded.map((graded, index) => (
                      <div 
                        key={graded._id} 
                        className="group flex items-center justify-between py-4 px-4 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] border border-transparent hover:border-green-100"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-full bg-green-100 text-green-600 transition-all duration-300 group-hover:scale-110">
                            <CheckCircleIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                              Graded {graded.assignment.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              Student: {graded.student.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-green-600">
                            {graded.grade}/{graded.assignment.maxMarks}
                          </span>
                          <p className="text-xs text-gray-500">
                            {new Date(graded.gradedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No recent grading activity</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {pendingTasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="group p-6 bg-gradient-to-br from-gray-50 via-white to-gray-50 border-2 border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${
                          task.priority === 'high' ? 'bg-red-100 text-red-600' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {task.priority === 'high' ? (
                            <ExclamationTriangleIcon className="h-5 w-5" />
                          ) : task.priority === 'medium' ? (
                            <ClockIcon className="h-5 w-5" />
                          ) : (
                            <CalendarIcon className="h-5 w-5" />
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          task.due === 'Tomorrow' ? 'bg-red-100 text-red-800 border border-red-200' :
                          task.due === 'In 2 days' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {task.due}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-orange-900 transition-colors text-lg">{task.task}</h4>
                      <p className="text-blue-600 font-medium">{task.course}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Recent Grades */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <span>Recent Grades</span>
          </h3>
          <div className="space-y-4">
            {dashboardData?.recentGraded && dashboardData.recentGraded.length > 0 ? (
              dashboardData.recentGraded.slice(0, 5).map((graded, index) => (
                <div 
                  key={graded._id} 
                  className="group flex items-center justify-between py-4 px-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] border border-transparent hover:border-blue-100"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                      <p className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                        {graded.student.name}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium border border-purple-200">
                        {graded.assignment.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {graded.grade}/{graded.assignment.maxMarks}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No recent grades</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:scale-105">
              <EyeIcon className="h-5 w-5" />
              <span>View All Grades</span>
            </button>
          </div>
        </div>
      </div>
      {/* Quick Actions Footer */}
      <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="group bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <ClipboardDocumentListIcon className="h-6 w-6" />
              </div>
              <span className="font-semibold">Grade Assignments</span>
            </div>
          </button>
          
          <button className="group bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <span className="font-semibold">View Submissions</span>
            </div>
          </button>
          
          <button className="group bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <ExclamationTriangleIcon className="h-6 w-6" />
              </div>
              <span className="font-semibold">Plagiarism Check</span>
            </div>
          </button>
          
          <button className="group bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform">
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white/20 p-3 rounded-full group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <span className="font-semibold">Analytics</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
